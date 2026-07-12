/**
 * auto-locator-proxy.js
 * Background proxy for ima-auto-locator.js fetch requests.
 * Must be imported BEFORE the main bundled code to ensure
 * this listener registers first and return true keeps the channel open.
 */
var AUTO_LOCATOR_SERVER = "http://127.0.0.1:18765";
var PROXY_LOG = "[AutoLocatorProxy]";

console.log(PROXY_LOG, "Registering message listener...");

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg && msg.action === "autoLocatorFetch") {
    console.log(PROXY_LOG, "Proxying:", msg.method || "GET", msg.url);
    var url = AUTO_LOCATOR_SERVER + msg.url;
    var opts = { method: msg.method || "GET" };
    if (msg.method === "POST" && msg.body) {
      opts.headers = { "Content-Type": "application/json" };
      opts.body = JSON.stringify(msg.body);
    }
    fetch(url, opts)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        console.log(PROXY_LOG, "Success:", msg.url, data);
        sendResponse({ success: true, data: data });
      })
      .catch(function (err) {
        console.log(PROXY_LOG, "Error:", msg.url, String(err));
        sendResponse({ success: false, error: String(err) });
      });
    return true; // keep channel open for async sendResponse
  }
});

console.log(PROXY_LOG, "Listener registered.");
