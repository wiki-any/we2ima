const EXTENSION_VERSION = chrome.runtime.getManifest().version;
const HEARTBEAT_INTERVAL_MS = 30000;
const USER_ACTIVITY_RETRY_DEBOUNCE_MS = 1000;
const TITLE_KEY_LENGTH = 20;
const METADATA_WAIT_TIMEOUT_MS = 5000;
const METADATA_WAIT_INTERVAL_MS = 250;
const PROVENANCE_STORAGE_KEY = 'ima.readMarker.automationProvenance';
const ACTIVE_SESSION_STORAGE_KEY = 'ima.readMarker.activeSession';
const PROVENANCE_DOM_META_NAME = 'ima-read-marker-provenance';
const PROVENANCE_DOM_META_SELECTOR = 'meta[name="ima-read-marker-provenance"]';
const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const WEAK_PUBLISHERS = new Set(['', '微信公众平台']);

let sessionId = null;
let sessionEnded = false;
let startSuppressed = false;
let userActivityRetryTimer = null;
let startInFlight = false;
let activeStartedAt = Date.now();
let accumulatedActiveMs = 0;
let heartbeatTimer = null;
let maxScrollPercent = 0;
let lastQualityHeartbeatThreshold = 0;
let STORAGE_UNAVAILABLE = false;
let provenanceMarker = null;
let activeSessionRecord = null;
let pendingUserActivity = false;

function titleKeyFor(title) {
  return String(title || '').slice(0, TITLE_KEY_LENGTH);
}

function cleanText(value) {
  return (value || '').replace(/\s+/g, ' ').trim();
}

function textFromSelector(selector) {
  const el = document.querySelector(selector);
  return el ? cleanText(el.textContent) : '';
}

function metaContent(selector) {
  const el = document.querySelector(selector);
  return el ? cleanText(el.content) : '';
}

function firstTextCandidate(candidates) {
  for (const candidate of candidates) {
    const value = cleanText(candidate.value);
    if (value) return { value, source: candidate.source };
  }
  return { value: '', source: 'missing' };
}

function isStrongPublisher(publisher, source) {
  const value = cleanText(publisher);
  return Boolean(value) && !WEAK_PUBLISHERS.has(value) && source !== 'og:site_name';
}

function extractArticleMetadata() {
  const title = firstTextCandidate([
    { source: '#activity-name', value: textFromSelector('#activity-name') },
    { source: '.rich_media_title', value: textFromSelector('.rich_media_title') },
    { source: 'og:title', value: metaContent('meta[property="og:title"]') },
    { source: 'twitter:title', value: metaContent('meta[name="twitter:title"]') },
    { source: 'document.title', value: document.title },
  ]);
  const publisher = firstTextCandidate([
    { source: '#js_name', value: textFromSelector('#js_name') },
    { source: '#profileBt a', value: textFromSelector('#profileBt a') },
    { source: '.profile_nickname', value: textFromSelector('.profile_nickname') },
    { source: '.rich_media_meta_nickname', value: textFromSelector('.rich_media_meta_nickname') },
    { source: 'og:site_name', value: metaContent('meta[property="og:site_name"]') },
  ]);
  return {
    title_key: titleKeyFor(title.value),
    publisher: publisher.value,
    title_source: title.source,
    publisher_source: publisher.source,
    diagnostics: {
      title_len: title.value.length,
      publisher_len: publisher.value.length,
      title_source: title.source,
      publisher_source: publisher.source,
      has_activity_name: Boolean(document.querySelector('#activity-name')),
      has_js_name: Boolean(document.querySelector('#js_name')),
      has_content_container: Boolean(document.getElementById('js_content')),
      has_js_image_content: Boolean(document.querySelector('#js_image_content')),
      has_js_image_desc: Boolean(document.querySelector('#js_image_desc')),
    },
  };
}

function waitForArticleMetadata() {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    let best = extractArticleMetadata();
    function poll() {
      const current = extractArticleMetadata();
      if (current.title_key.length >= best.title_key.length || isStrongPublisher(current.publisher, current.publisher_source) || (!best.publisher && current.publisher)) best = current;
      if (current.title_key && isStrongPublisher(current.publisher, current.publisher_source)) return resolve(current);
      if (Date.now() - startedAt >= METADATA_WAIT_TIMEOUT_MS) return resolve(best);
      window.setTimeout(poll, METADATA_WAIT_INTERVAL_MS);
    }
    poll();
  });
}

function normalizeUrl(value) {
  const normalized = new URL(value); // bootstrap uses new URL(location.href) through this helper.
  normalized.hash = '';
  return normalized.href;
}

function isCanonicalUuidV4(value) {
  return typeof value === 'string' && UUID_V4_PATTERN.test(value);
}

function newProvenanceId() {
  const value = String(crypto.randomUUID()).toLowerCase();
  if (!isCanonicalUuidV4(value)) throw new Error('randomUUID did not return canonical UUID v4');
  return value;
}

function markerIsValid(marker, url) {
  return marker && marker.version === 1 && marker.url === url && isCanonicalUuidV4(marker.provenance_id) && ['pending', 'suppressed'].includes(marker.state);
}

function newProvenanceMarker(state = 'pending', provenanceId = newProvenanceId()) {
  return { version: 1, state, url: normalizeUrl(location.href), provenance_id: provenanceId, title_key: extractArticleMetadata().title_key, created_at: Date.now() };
}

function activeIsValid(active, url) {
  return active && active.version === 1 && active.url === url && isCanonicalUuidV4(active.provenance_id) && ['active', 'ending'].includes(active.state) && Number.isInteger(active.session_id);
}

function readDomSentinel() {
  const el = document.querySelector(PROVENANCE_DOM_META_SELECTOR);
  const provenanceId = el?.content?.trim();
  return isCanonicalUuidV4(provenanceId) ? provenanceId : null;
}

function writeDomSentinel(marker) {
  let el = document.querySelector(PROVENANCE_DOM_META_SELECTOR);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', PROVENANCE_DOM_META_NAME);
    document.head.appendChild(el);
  }
  el.content = marker.provenance_id;
}

function readStorageJson(key) {
  const raw = sessionStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

function writeStorageJson(key, value) {
  if (key === PROVENANCE_STORAGE_KEY) writeDomSentinel(value);
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (_error) {
    STORAGE_UNAVAILABLE = true;
    return false;
  }
}

function removeStorage(key) {
  try { sessionStorage.removeItem(key); } catch (_error) { STORAGE_UNAVAILABLE = true; }
}

// This function is intentionally called at script evaluation time: the pending marker
// must exist before any metadata wait or network await can yield control.
function bootstrapProvenance() {
  const url = normalizeUrl(location.href);
  try {
    let marker = readStorageJson(PROVENANCE_STORAGE_KEY);
    let active = readStorageJson(ACTIVE_SESSION_STORAGE_KEY);
    let markerCreated = false;
    if (active && !activeIsValid(active, url)) { removeStorage(ACTIVE_SESSION_STORAGE_KEY); active = null; }
    if (marker && !markerIsValid(marker, url)) { removeStorage(PROVENANCE_STORAGE_KEY); marker = null; }
    if (!marker) {
      marker = newProvenanceMarker('pending');
      markerCreated = true;
      if (!writeStorageJson(PROVENANCE_STORAGE_KEY, marker)) return { url, marker, active: null, initial: false };
    }
    if (active) {
      removeStorage(PROVENANCE_STORAGE_KEY);
      writeDomSentinel(active);
      return { url, marker: null, active, initial: false };
    }
    writeDomSentinel(marker);
    return { url, marker, active: null, initial: markerCreated };
  } catch (_error) {
    STORAGE_UNAVAILABLE = true;
    const provenanceId = readDomSentinel();
    const marker = newProvenanceMarker('pending', provenanceId || newProvenanceId());
    writeDomSentinel(marker);
    return { url, marker, active: null, initial: false };
  }
}

const BOOTSTRAP = bootstrapProvenance();
const CURRENT_URL = BOOTSTRAP.url;
provenanceMarker = BOOTSTRAP.marker;
activeSessionRecord = BOOTSTRAP.active;
let initialStartAllowed = BOOTSTRAP.initial;
if (activeSessionRecord && activeSessionRecord.state === 'active') sessionId = activeSessionRecord.session_id;
if (provenanceMarker?.state === 'suppressed') startSuppressed = true;

function isWeChatArticlePage() {
  return location.pathname.startsWith('/s') || Boolean(extractArticleMetadata().title_key);
}

function getScrollPercent() {
  const doc = document.documentElement;
  const scrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
  const percent = Math.round((window.scrollY / scrollable) * 100);
  maxScrollPercent = Math.max(maxScrollPercent, Math.min(100, Math.max(0, percent)));
  return maxScrollPercent;
}

function qualityHeartbeatThresholdFor(scrollPercent) {
  if (scrollPercent >= 80) {
    return 80;
  }
  if (scrollPercent >= 30) {
    return 30;
  }
  return 0;
}

function sendQualityThresholdHeartbeatIfNeeded() {
  if (!sessionId) return;
  if (document.hidden) return;
  const threshold = qualityHeartbeatThresholdFor(maxScrollPercent);
  if (threshold <= lastQualityHeartbeatThreshold) return;
  lastQualityHeartbeatThreshold = threshold;
  sendHeartbeat('reading').catch(() => {});
}

function currentActiveMs() {
  if (activeStartedAt === null) return accumulatedActiveMs;
  return accumulatedActiveMs + Math.max(0, Date.now() - activeStartedAt);
}
function pauseActiveTimer() {
  if (activeStartedAt !== null) { accumulatedActiveMs = currentActiveMs(); activeStartedAt = null; }
}
function resumeActiveTimer() { if (activeStartedAt === null) activeStartedAt = Date.now(); }
function resetActiveTimer() { accumulatedActiveMs = 0; activeStartedAt = Date.now(); }
function activeDurationSec() { return Math.max(0, Math.round(currentActiveMs() / 1000)); }

function post(endpoint, payload) {
  return chrome.runtime.sendMessage({ type: 'read-marker-api', endpoint, payload });
}
async function pingExtension() { await post('/extension/ping', { version: EXTENSION_VERSION }); }

function persistActiveSession(state, id) {
  const record = { version: 1, state, url: CURRENT_URL, provenance_id: provenanceMarker?.provenance_id || activeSessionRecord?.provenance_id, session_id: id };
  activeSessionRecord = record;
  return writeStorageJson(ACTIVE_SESSION_STORAGE_KEY, record);
}

function clearProvenanceMarker() {
  provenanceMarker = null;
  removeStorage(PROVENANCE_STORAGE_KEY);
}

function rotateProvenanceMarker(state = 'suppressed', staleProvenanceId = null) {
  let sharedProvenanceId = null;
  if (staleProvenanceId) {
    try {
      const sharedMarker = readStorageJson(PROVENANCE_STORAGE_KEY);
      if (markerIsValid(sharedMarker, CURRENT_URL) && sharedMarker.provenance_id !== staleProvenanceId) sharedProvenanceId = sharedMarker.provenance_id;
    } catch (_error) {
      STORAGE_UNAVAILABLE = true;
    }
    const domProvenanceId = readDomSentinel();
    if (!sharedProvenanceId && domProvenanceId && domProvenanceId !== staleProvenanceId) sharedProvenanceId = domProvenanceId;
  }
  provenanceMarker = newProvenanceMarker(state, sharedProvenanceId || newProvenanceId());
  startSuppressed = state === 'suppressed';
  writeStorageJson(PROVENANCE_STORAGE_KEY, provenanceMarker);
}

async function startReading(trigger = 'initial') {
  if ((trigger === 'initial' && STORAGE_UNAVAILABLE) || !isWeChatArticlePage() || sessionId || sessionEnded || startInFlight || !provenanceMarker) return;
  startInFlight = true;
  try {
    let canRetryEndedProvenance = trigger === 'user_activity';
    while (provenanceMarker) {
      await pingExtension();
      const metadata = await waitForArticleMetadata();
      if (!metadata.title_key) {
        console.warn('Read marker skipped start: missing title metadata');
        return;
      }
      const attemptedProvenanceId = provenanceMarker.provenance_id;
      const response = await post('/reading/start', {
        url: CURRENT_URL,
        title_key: metadata.title_key,
        publisher: metadata.publisher,
        trigger,
        extension_version: EXTENSION_VERSION,
        provenance_id: attemptedProvenanceId,
      });
      const reason = response?.data?.reason || response?.reason;
      if (response?.ok && response.data?.status === 'suppressed') {
        provenanceMarker.state = 'suppressed';
        startSuppressed = true;
        writeStorageJson(PROVENANCE_STORAGE_KEY, provenanceMarker);
        return;
      }
      if (!response?.ok || reason) {
        if (reason === 'provenance_url_conflict' || reason === 'provenance_session_ended') rotateProvenanceMarker('suppressed', attemptedProvenanceId);
        if (reason === 'provenance_session_ended' && canRetryEndedProvenance) {
          canRetryEndedProvenance = false;
          continue;
        }
        return;
      }
      if (response.data?.session_id) {
        const id = response.data.session_id;
        const persisted = persistActiveSession('active', id);
        sessionId = id;
        sessionEnded = false;
        startSuppressed = false;
        if (persisted) clearProvenanceMarker();
        resetActiveTimer();
        lastQualityHeartbeatThreshold = 0;
        if (document.hidden) pauseActiveTimer(); else resumeActiveTimer();
      }
      return;
    }
  } finally {
    startInFlight = false;
    if (pendingUserActivity && !sessionId && !sessionEnded) {
      pendingUserActivity = false;
      startReading('user_activity').catch(() => {});
    }
  }
}

function noteUserActivity() {
  if (!provenanceMarker || sessionId || sessionEnded) return;
  if (startInFlight) {
    pendingUserActivity = true;
    return;
  }
  if (userActivityRetryTimer) window.clearTimeout(userActivityRetryTimer);
  userActivityRetryTimer = window.setTimeout(() => {
    userActivityRetryTimer = null;
    startReading('user_activity').catch(() => {});
  }, USER_ACTIVITY_RETRY_DEBOUNCE_MS);
}

async function sendHeartbeat(tabStatus = 'reading') {
  if (!sessionId) return;
  await pingExtension();
  await post('/reading/heartbeat', { session_id: sessionId, scroll_percent: getScrollPercent(), active_duration_sec: activeDurationSec(), tab_status: tabStatus });
}

async function recoverEndingSession() {
  if (!activeSessionRecord || activeSessionRecord.state !== 'ending' || activeSessionRecord.url !== CURRENT_URL) return;
  try {
    await pingExtension();
    const statusResponse = await post('/reading/session-status', { session_id: activeSessionRecord.session_id });
    if (!statusResponse?.ok) return;
    const status = statusResponse.data?.status;
    if (status === 'ended' || status === 'deleted') {
      removeStorage(ACTIVE_SESSION_STORAGE_KEY);
      activeSessionRecord = null;
      rotateProvenanceMarker('suppressed');
      return;
    }
    if (status !== 'active') return;
    await pingExtension();
    const endResponse = await post('/reading/end', { session_id: activeSessionRecord.session_id, scroll_percent: 0, active_duration_sec: 0 });
    if (endResponse?.ok) {
      removeStorage(ACTIVE_SESSION_STORAGE_KEY);
      activeSessionRecord = null;
      rotateProvenanceMarker('suppressed');
    }
  } catch (_error) {
    // Preserve ending state so the next injection can retry safely.
  }
}

async function initializeLifecycle() {
  if (STORAGE_UNAVAILABLE) return;
  if (activeSessionRecord?.state === 'ending') return recoverEndingSession();
  if (activeSessionRecord?.state === 'active') return;
  if (initialStartAllowed) {
    initialStartAllowed = false;
    await startReading('initial');
  }
}

async function endReading() {
  if (!sessionId || sessionEnded) return;
  pauseActiveTimer();
  const finishedSessionId = sessionId;
  sessionEnded = true;
  persistActiveSession('ending', finishedSessionId);
  sessionId = null;
  try {
    const response = await post('/reading/end', { session_id: finishedSessionId, scroll_percent: getScrollPercent(), active_duration_sec: activeDurationSec() });
    if (response?.ok) {
      removeStorage(ACTIVE_SESSION_STORAGE_KEY);
      activeSessionRecord = null;
      rotateProvenanceMarker('suppressed');
    }
  } catch (_error) {
    // Keep the ending record for recovery.
  }
}

if (location.hostname === 'mp.weixin.qq.com' && isWeChatArticlePage()) {
  initializeLifecycle().catch(() => {});
  heartbeatTimer = window.setInterval(() => {
    if (!document.hidden) sendHeartbeat('reading').catch(() => {});
  }, HEARTBEAT_INTERVAL_MS);
  window.addEventListener('scroll', () => {
    getScrollPercent();
    sendQualityThresholdHeartbeatIfNeeded();
  }, { passive: true });
  window.addEventListener('pointerdown', noteUserActivity, { passive: true });
  window.addEventListener('wheel', noteUserActivity, { passive: true });
  window.addEventListener('keydown', noteUserActivity);
  window.addEventListener('beforeunload', () => {
    if (heartbeatTimer) window.clearInterval(heartbeatTimer);
    endReading().catch(() => {});
  });
  window.addEventListener('pagehide', () => {
    if (heartbeatTimer) window.clearInterval(heartbeatTimer);
    endReading().catch(() => {});
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pauseActiveTimer();
      sendHeartbeat('background').catch(() => {});
    } else {
      resumeActiveTimer();
    }
  });
}
