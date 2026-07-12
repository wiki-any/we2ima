/**
 * ima-auto-locator.js
 * Content Script: auto-locate target directory menu item in ima panel
 *
 * Workflow (polling-based):
 * 1. setInterval polls for ima floating panel in Shadow DOM
 * 2. When panel found -> fetch target name from Python server
 * 3. Find target item in panel (with scroll-load for 50+ items)
 * 4. Calculate screen-absolute coordinates and report to server
 * 5. Cooldown 10s after successful report to avoid duplicates
 */

(function () {
  "use strict";

  // DOM selectors (from ima plugin's Shadow DOM)
  var SEL_PANEL = "._addableKnowledgeBaseList_1vpua_1";
  var SEL_KB_ITEM = "._knowledgeBase_3t7nn_1";
  var SEL_TITLE = "._title_3t7nn_21";

  var POLL_INTERVAL = 500;   // ms between polls
  var COOLDOWN_MS = 10000;   // ms to pause after successful report

  // Scroll-load constants for panels with 50+ items (IntersectionObserver pagination)
  var MAX_SCROLL_ATTEMPTS = 10;  // max scroll-to-bottom retries
  var SCROLL_WAIT_MS = 500;      // ms to wait after each scroll for DOM update

  var paused = false;

  // Debug: state tracking to avoid console spam
  // Values: "init" | "no-host" | "no-shadow" | "no-panel" | "panel-found"
  var lastState = "init";
  var LOG_PREFIX = "[AutoLocator]";

  /**
   * Fetch target directory name from Python server (via background proxy)
   * @returns {Promise<string|null>}
   */
  function getTarget() {
    console.log(LOG_PREFIX, "Fetching target from server via background proxy...");
    return new Promise(function (resolve) {
      chrome.runtime.sendMessage(
        { action: "autoLocatorFetch", url: "/get_target", method: "GET" },
        function (resp) {
          if (resp && resp.success && resp.data && resp.data.name) {
            console.log(LOG_PREFIX, "Target response:", resp.data.name);
            resolve(resp.data.name);
          } else {
            console.log(LOG_PREFIX, "Target fetch failed or empty:", resp);
            resolve(null);
          }
        }
      );
    });
  }

  /**
   * Report menu item position to Python server (via background proxy)
   * @param {Object} posData - position data
   */
  function reportPosition(posData) {
    chrome.runtime.sendMessage({
      action: "autoLocatorFetch",
      url: "/menu_position",
      method: "POST",
      body: posData
    });
  }

  /**
   * Helper: wait for specified milliseconds
   * @param {number} ms
   * @returns {Promise<void>}
   */
  function sleep(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  /**
   * Search for target item among current DOM items
   * @param {NodeList} items - current KB item elements
   * @param {string} targetName - target directory name
   * @returns {Element|null}
   */
  function findTargetInItems(items, targetName) {
    for (var i = 0; i < items.length; i++) {
      var titleEl = items[i].querySelector(SEL_TITLE);
      if (titleEl && titleEl.textContent.trim() === targetName) {
        return items[i];
      }
    }
    return null;
  }

  /**
   * Find target item in panel, scroll to load more if needed, then report coordinates.
   * Handles ima's IntersectionObserver-based pagination (default limit: 50 items per page).
   *
   * @param {Element} panel - the knowledge base list panel element
   * @param {string} targetName - target directory name
   */
  async function locateAndReport(panel, targetName) {
    // First attempt: search currently rendered items
    var items = panel.querySelectorAll(SEL_KB_ITEM);
    console.log(LOG_PREFIX, "locateAndReport: searching for '" + targetName + "', initial items count=" + items.length);

    var targetItem = findTargetInItems(items, targetName);

    // If not found, try scroll-loading more items (for 50+ directories)
    if (!targetItem) {
      console.log(LOG_PREFIX, "Target not in initial " + items.length + " items, attempting scroll-load...");

      // Find the scrollable container (panel itself or its parent)
      var scrollContainer = panel;

      for (var attempt = 0; attempt < MAX_SCROLL_ATTEMPTS; attempt++) {
        var prevCount = items.length;

        // Scroll to bottom to trigger IntersectionObserver loadNextPage
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        console.log(LOG_PREFIX, "Scroll attempt " + (attempt + 1) + "/" + MAX_SCROLL_ATTEMPTS
          + ", scrollTop=" + scrollContainer.scrollTop + ", scrollHeight=" + scrollContainer.scrollHeight);

        // Wait for new DOM elements to render
        await sleep(SCROLL_WAIT_MS);

        // Re-query items
        items = panel.querySelectorAll(SEL_KB_ITEM);
        console.log(LOG_PREFIX, "After scroll: items count=" + items.length + " (was " + prevCount + ")");

        // Check if new items loaded
        if (items.length > prevCount) {
          // New items loaded, search again
          targetItem = findTargetInItems(items, targetName);
          if (targetItem) {
            console.log(LOG_PREFIX, "Target found after " + (attempt + 1) + " scroll(s)!");
            break;
          }
          // Not found yet, continue scrolling
        } else {
          // No new items loaded - all pages exhausted
          console.log(LOG_PREFIX, "No new items after scroll, all pages loaded. Total=" + items.length);
          break;
        }
      }
    }

    // Report result
    if (!targetItem) {
      console.log(LOG_PREFIX, "locateAndReport: item NOT found for '" + targetName + "' after scroll-load (total items=" + items.length + ")");
      reportPosition({
        x: 0, y: 0, dpr: window.devicePixelRatio,
        name: targetName, found: false
      });
      // Fix: Reset paused flag with cooldown to allow retry
      paused = true;
      setTimeout(function () { paused = false; }, COOLDOWN_MS);
      return;
    }

    // Scroll target item into visible area
    targetItem.scrollIntoView({ block: "center", behavior: "instant" });

    // Wait a frame for scroll to settle, then calculate coordinates
    await new Promise(function (resolve) { requestAnimationFrame(resolve); });

    var rect = targetItem.getBoundingClientRect();
    var chromeHeight = window.outerHeight - window.innerHeight;
    var x = window.screenX + rect.left + rect.width / 2;
    var y = window.screenY + chromeHeight + rect.top + rect.height / 2;

    console.log(LOG_PREFIX, "Reporting position: (" + Math.round(x) + ", " + Math.round(y) + ") dpr=" + window.devicePixelRatio);

    reportPosition({
      x: Math.round(x),
      y: Math.round(y),
      dpr: window.devicePixelRatio,
      name: targetName,
      found: true,
      rect: {
        left: Math.round(rect.left),
        top: Math.round(rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      }
    });

    // Cooldown: pause polling to avoid duplicate reports
    paused = true;
    setTimeout(function () { paused = false; }, COOLDOWN_MS);
  }

  /**
   * Try to find panel in Shadow DOM and process it
   * Called on every poll tick
   */
  function pollForPanel() {
    if (paused) return;

    // Step 1: find shadow host
    var hostEl = document.getElementById("imaCollectShadowRoot");
    if (!hostEl) {
      if (lastState !== "no-host") {
        console.log(LOG_PREFIX, "Waiting: host element #imaCollectShadowRoot not found");
        lastState = "no-host";
      }
      return;
    }

    if (!hostEl.shadowRoot) {
      if (lastState !== "no-shadow") {
        console.log(LOG_PREFIX, "Host element found, but shadowRoot is null");
        lastState = "no-shadow";
      }
      return;
    }

    // Step 2: find panel inside shadow root
    var panel = hostEl.shadowRoot.querySelector(SEL_PANEL);
    if (!panel) {
      if (lastState !== "no-panel") {
        console.log(LOG_PREFIX, "Host + shadowRoot OK, but panel '" + SEL_PANEL + "' not found");
        lastState = "no-panel";
      }
      return;
    }

    // State changed to panel-found
    if (lastState !== "panel-found") {
      console.log(LOG_PREFIX, "Panel FOUND! Proceeding to fetch target...");
      lastState = "panel-found";
    }

    // Step 3: panel exists -> pause polling, fetch target and locate
    paused = true;

    getTarget().then(function (targetName) {
      if (!targetName) {
        console.log(LOG_PREFIX, "No target set on server, resume polling");
        // No target set on server, resume polling
        paused = false;
        return;
      }

      // Small delay to ensure panel content is fully rendered
      setTimeout(function () {
        locateAndReport(panel, targetName);
        // Note: locateAndReport sets its own cooldown via paused flag
      }, 300);
    });
  }

  // Start polling when DOM is ready
  function start() {
    console.log(LOG_PREFIX, "Polling started (interval=" + POLL_INTERVAL + "ms)");
    console.log(LOG_PREFIX, "Looking for host=#imaCollectShadowRoot, panel=" + SEL_PANEL);
    setInterval(pollForPanel, POLL_INTERVAL);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
