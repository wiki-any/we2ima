/**
 * ima-auto-locator.js
 * Content Script: auto-locate target directory menu item in ima panel
 *
 * Workflow (polling-based):
 * 1. setInterval polls for ima floating panel in Shadow DOM
 * 2. When panel found -> fetch target name from Python server
 * 3. Find target item in panel (with scroll-load for 50+ items)
 * 4. Report raw DOM and browser-window geometry to the server
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
  var DOM_CLICK_DELAY_MS = 2000;

  // Scroll-load constants for panels with 50+ items (IntersectionObserver pagination)
  var MAX_SCROLL_ATTEMPTS = 10;  // max scroll-to-bottom retries
  var SCROLL_WAIT_MS = 500;      // ms to wait after each scroll for DOM update

  var paused = false;

  // Debug: state tracking to avoid console spam
  // Values: "init" | "no-host" | "no-shadow" | "no-panel" | "panel-found"
  var lastState = "init";
  var LOG_PREFIX = "[AutoLocator]";

  /**
   * Send a request through the background proxy and surface transport failures.
   * @param {string} path - local server path
   * @param {string} method - HTTP method
   * @param {Object|null} body - optional JSON body
   * @returns {Promise<Object>}
   */
  function proxyFetch(path, method, body) {
    return new Promise(function (resolve) {
      var message = {
        action: "autoLocatorFetch",
        url: path,
        method: method
      };
      if (body) message.body = body;
      chrome.runtime.sendMessage(message, function (resp) {
        if (chrome.runtime.lastError) {
          resolve({
            success: false,
            error: chrome.runtime.lastError.message || String(chrome.runtime.lastError)
          });
          return;
        }
        if (!resp || resp.success !== true) {
          resolve({
            success: false,
            error: resp && resp.error ? resp.error : "background proxy returned no success"
          });
          return;
        }
        resolve({ success: true, data: resp.data });
      });
    });
  }

  /**
   * Fetch target request from Python server (via background proxy)
   * @returns {Promise<Object|null>}
   */
  function getTarget() {
    console.log(LOG_PREFIX, "Fetching target from server via background proxy...");
    var extensionVersion = chrome.runtime.getManifest().version;
    return proxyFetch("/get_target?extension_version=" + encodeURIComponent(extensionVersion), "GET", null).then(function (resp) {
      if (resp.success === true && resp.data && resp.data.name) {
        if (resp.data.click_mode === "dom" && resp.data.state !== "pending") {
          console.log(LOG_PREFIX, "DOM target is not pending:", resp.data.state);
          return null;
        }
        console.log(LOG_PREFIX, "Target response:", resp.data.name, resp.data.request_id);
        return resp.data;
      }
      console.log(LOG_PREFIX, "Target fetch failed or empty:", resp.error || resp);
      return null;
    });
  }

  /**
   * Report menu item position to Python server (via background proxy)
   * @param {Object} posData - position data
   */
  function reportPosition(posData) {
    return proxyFetch("/menu_position", "POST", posData);
  }

  function claimTarget(target) {
    return proxyFetch("/claim_target", "POST", {
      protocol_version: 1,
      request_id: target.request_id,
      name: target.name
    });
  }

  /**
   * Report a DOM click dispatch result without initiating a click here.
   * @param {Object} target - correlated target request
   * @param {boolean} dispatched - whether element.click() was dispatched
   * @param {string|null} error - non-empty error when dispatch failed
   */
  function reportClickResult(target, dispatched, error) {
    return proxyFetch("/menu_click_result", "POST", {
        protocol_version: 1,
        request_id: target.request_id,
        name: target.name,
        dispatched: dispatched,
        error: error
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

  function getComposedParent(element) {
    if (element.parentElement) return element.parentElement;
    if (typeof element.getRootNode === "function") {
      var root = element.getRootNode();
      if (root && root.host) return root.host;
    }
    return null;
  }

  function validateClaimedTarget(targetItem, targetName) {
    try {
      if (!targetItem.isConnected) return "claimed_target_disconnected";
      var titleEl = targetItem.querySelector(SEL_TITLE);
      if (!titleEl || titleEl.textContent.trim() !== targetName) {
        return "claimed_target_title_mismatch";
      }

      var rect = targetItem.getBoundingClientRect();
      if (
        !Number.isFinite(rect.left) || !Number.isFinite(rect.top) ||
        !Number.isFinite(rect.right) || !Number.isFinite(rect.bottom) ||
        !Number.isFinite(rect.width) || !Number.isFinite(rect.height) ||
        rect.width <= 0 || rect.height <= 0
      ) {
        return "claimed_target_rect_invalid";
      }
      if (
        rect.right <= 0 || rect.bottom <= 0 ||
        rect.left >= window.innerWidth || rect.top >= window.innerHeight
      ) {
        return "claimed_target_outside_viewport";
      }

      var currentElement = targetItem;
      while (currentElement) {
        var style = window.getComputedStyle(currentElement);
        if (
          style.display === "none" || style.visibility === "hidden" ||
          style.visibility === "collapse" || Number(style.opacity) === 0
        ) {
          return "claimed_target_hidden";
        }
        currentElement = getComposedParent(currentElement);
      }
      return null;
    } catch (validationError) {
      return "claimed_target_revalidation_failed:" + (
        validationError && validationError.message
          ? validationError.message
          : String(validationError)
      );
    }
  }

  /**
   * Find target item in panel, scroll to load more if needed, then report coordinates.
   * Handles ima's IntersectionObserver-based pagination (default limit: 50 items per page).
   *
   * @param {Element} panel - the knowledge base list panel element
   * @param {Object} target - correlated target request
   */
  async function locateAndReport(panel, target) {
    var targetName = target.name;
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
      // Fix: Reset paused flag with cooldown to allow retry
      paused = true;
      setTimeout(function () { paused = false; }, COOLDOWN_MS);
      return;
    }

    // Scroll target item into visible area
    targetItem.scrollIntoView({ block: "center", behavior: "instant" });

    // Wait a frame for scroll to settle, then capture raw geometry
    await new Promise(function (resolve) { requestAnimationFrame(resolve); });

    if (target.click_mode === "dom") {
      await sleep(DOM_CLICK_DELAY_MS);
      var claimResult = await claimTarget(target);
      if (!claimResult.success || !claimResult.data || claimResult.data.claimed !== true) {
        console.log(LOG_PREFIX, "DOM target claim rejected:", claimResult.error || claimResult.data);
        paused = true;
        setTimeout(function () { paused = false; }, COOLDOWN_MS);
        return;
      }
      var claimedTargetError = validateClaimedTarget(targetItem, targetName);
      if (claimedTargetError) {
        var rejectedReport = await reportClickResult(target, false, claimedTargetError);
        if (!rejectedReport.success) {
          console.log(LOG_PREFIX, "DOM stale-target report failed:", rejectedReport.error);
        }
        paused = true;
        setTimeout(function () { paused = false; }, COOLDOWN_MS);
        return;
      }
      var dispatched = false;
      var error = null;
      try {
        targetItem.click();
        dispatched = true;
      } catch (clickError) {
        error = clickError && clickError.message ? clickError.message : String(clickError);
      }
      var clickReportResult = await reportClickResult(target, dispatched, error);
      if (!clickReportResult.success) {
        console.log(LOG_PREFIX, "DOM click result report failed:", clickReportResult.error);
      }
      paused = true;
      setTimeout(function () { paused = false; }, COOLDOWN_MS);
      return;
    }

    var rect = targetItem.getBoundingClientRect();
    console.log(LOG_PREFIX, "Reporting raw rect:", rect, "dpr=" + window.devicePixelRatio);

    var reportResult = await reportPosition({
      protocol_version: 2,
      request_id: target.request_id,
      reported_at: Date.now() / 1000,
      name: targetName,
      found: true,
      rect: {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      },
      screen: {
        x: window.screenX,
        y: window.screenY,
        outer_width: window.outerWidth,
        outer_height: window.outerHeight,
        inner_width: window.innerWidth,
        inner_height: window.innerHeight,
        device_pixel_ratio: window.devicePixelRatio
      },
      visual_viewport_scale: window.visualViewport ? window.visualViewport.scale : null,
      page_url: window.location.href
    });
    if (!reportResult.success) {
      console.log(LOG_PREFIX, "Position report failed:", reportResult.error);
    } else {
      console.log(LOG_PREFIX, "Position report accepted:", reportResult.data);
    }

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

    getTarget().then(function (target) {
      if (!target) {
        console.log(LOG_PREFIX, "No target set on server, resume polling");
        // No target set on server, resume polling
        paused = false;
        return;
      }

      // Small delay to ensure panel content is fully rendered
      setTimeout(function () {
        var completed = false;
        Promise.resolve(locateAndReport(panel, target))
          .then(function () { completed = true; })
          .catch(function (error) {
            console.log(LOG_PREFIX, "Locator execution failed:", error);
          })
          .finally(function () {
            if (!completed) paused = false;
          });
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
