// =============================================================================
//  KOMPAS App — Konten 'Original' — reader iframe (Tato Dayak)
//  Pecahan dari app.js (per-fitur). Dimuat sebagai classic <script> berurutan
//  di index.html; semua file berbagi satu global scope.
// =============================================================================

function openOriginalView(event, options = {}) {
  event?.preventDefault();
  if (!phoneApp || !originalFrameView || !originalFrame) return;

  const { updateHash = true, resetFrame = true } = options;

  if (businessView && !businessView.hidden) closeBusinessView({ updateHash: false });
  if (epaperView && !epaperView.hidden) closeEpaperView({ updateHash: false });
  if (originalFrameView && !originalFrameView.hidden) closeOriginalView({ updateHash: false });
  if (podcastPlayerView && !podcastPlayerView.hidden) closePodcastPlayerView({ updateHash: false });
  if (podcastView && !podcastView.hidden) closePodcastView({ updateHash: false });
  if (articleView && !articleView.hidden) closeArticleView({ updateHash: false });
  if (aiView && !aiView.hidden) closeAiView({ updateHash: false });
  if (eventView && !eventView.hidden) closeEventView({ updateHash: false });
  if (accountView && !accountView.hidden) closeAccountView({ updateHash: false });

  originalFrameView.hidden = false;
  originalFrameView.classList.remove("is-leaving");
  phoneApp.classList.add("is-scrolled");
  setAppStatusColor(pageStatusColors.default);
  if (resetFrame || originalFrame.getAttribute("src") === "about:blank") {
    originalFrameHistory = [];
    originalFrameIsGoingBack = false;
    originalFrame.src = "assets/original/original-index.html";
  }
  if (updateHash && window.location.hash !== "#original") {
    window.history.pushState(null, "", "#original");
  }
  window.requestAnimationFrame(() => originalFrameView.classList.add("is-open"));
}

function closeOriginalView(options = {}) {
  if (!originalFrameView) return;

  const { updateHash = true } = options;

  originalFrameView.classList.add("is-leaving");
  originalFrameView.classList.remove("is-open");
  window.setTimeout(() => {
    originalFrameView.hidden = true;
    originalFrameView.classList.remove("is-leaving");
    if (updateHash && window.location.hash === "#original") {
      window.history.pushState(null, "", window.location.pathname);
    }
    setAppStatusColor(pageStatusColors.home);
    syncHeaderState();
    playSkeleton(phoneApp);
  }, 260);
}

function getOriginalFrameUrl() {
  if (!originalFrame) return "";

  try {
    return originalFrame.contentWindow?.location?.href || "";
  } catch {
    return originalFrame.getAttribute("src") || "";
  }
}

function normalizeOriginalFrameUrl(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("closedReader");
    return parsed.href;
  } catch {
    return url.replace(/([?&])closedReader=1&?/, "$1").replace(/[?&]$/, "");
  }
}

function syncOriginalHeaderState() {
  if (!originalFrameView || !originalFrame) return;

  const frameUrl = getOriginalFrameUrl();
  const normalizedFrameUrl = normalizeOriginalFrameUrl(frameUrl);

  if (originalFrameIsGoingBack) {
    originalFrameHistory.pop();
    originalFrameIsGoingBack = false;
  }

  if (frameUrl.includes("closedReader=1") && originalFrameHistory.at(-1)?.includes("original-reader.html")) {
    originalFrameHistory.pop();
  }

  if (normalizedFrameUrl && normalizeOriginalFrameUrl(originalFrameHistory.at(-1) || "") !== normalizedFrameUrl) {
    originalFrameHistory.push(normalizedFrameUrl);
  }

  originalFrameView.classList.toggle("is-reader", frameUrl.includes("original-reader.html"));
}

function goBackOriginalView(event) {
  event?.preventDefault();
  if (!originalFrame || originalFrameHistory.length <= 1) {
    closeOriginalView(event);
    return;
  }

  originalFrameIsGoingBack = true;
  try {
    const frameUrl = getOriginalFrameUrl();
    originalFrame.contentDocument?.body?.classList.remove("original-route-enter", "original-route-enter-up", "original-route-exit-left", "original-route-exit-right", "original-route-exit-down");
    originalFrame.contentDocument?.body?.classList.add(frameUrl.includes("original-reader.html") ? "original-route-exit-down" : "original-route-exit-right");
  } catch {
    // Ignore cross-document timing while the iframe is navigating.
  }
  window.setTimeout(() => {
    originalFrame.contentWindow?.history.back();
  }, 220);
}

