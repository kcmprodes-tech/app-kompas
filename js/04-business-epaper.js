// =============================================================================
//  KOMPAS App — View Business Insight & e-Paper
//  Pecahan dari app.js (per-fitur). Dimuat sebagai classic <script> berurutan
//  di index.html; semua file berbagi satu global scope.
// =============================================================================

function openBusinessView(event, options = {}) {
  event?.preventDefault();
  if (!phoneApp || !businessView) return;

  const { updateHash = true } = options;

  if (epaperView && !epaperView.hidden) closeEpaperView({ updateHash: false });
  if (originalFrameView && !originalFrameView.hidden) closeOriginalView({ updateHash: false });
  businessView.hidden = false;
  businessView.classList.remove("is-leaving");
  phoneApp.classList.add("business-active", "is-scrolled");
  setAppStatusColor(pageStatusColors.default);
  businessScroll?.scrollTo({ top: 0 });
  if (updateHash && window.location.hash !== "#business-insight") {
    window.history.pushState(null, "", "#business-insight");
  }
  playSkeleton(businessView);
  window.requestAnimationFrame(() => businessView.classList.add("is-open"));
}

function closeBusinessView(options = {}) {
  if (!phoneApp || !businessView) return;

  const { updateHash = true } = options;

  businessView.classList.add("is-leaving");
  businessView.classList.remove("is-open");
  window.setTimeout(() => {
    phoneApp.classList.remove("business-active");
    businessView.hidden = true;
    businessView.classList.remove("is-leaving");
    if (updateHash && window.location.hash === "#business-insight") {
      window.history.pushState(null, "", window.location.pathname);
    }
    setAppStatusColor(pageStatusColors.home);
    syncHeaderState();
    playSkeleton(phoneApp);
  }, 260);
}

function openEpaperView(event, options = {}) {
  event?.preventDefault();
  if (!phoneApp || !epaperView) return;

  const { updateHash = true } = options;

  if (businessView && !businessView.hidden) closeBusinessView({ updateHash: false });
  if (originalFrameView && !originalFrameView.hidden) closeOriginalView({ updateHash: false });
  if (podcastPlayerView && !podcastPlayerView.hidden) closePodcastPlayerView({ updateHash: false });
  if (podcastView && !podcastView.hidden) closePodcastView({ updateHash: false });
  if (articleView && !articleView.hidden) closeArticleView({ updateHash: false });
  if (aiView && !aiView.hidden) closeAiView({ updateHash: false });
  if (eventView && !eventView.hidden) closeEventView({ updateHash: false });
  if (accountView && !accountView.hidden) closeAccountView({ updateHash: false });
  epaperView.hidden = false;
  epaperView.classList.remove("is-leaving");
  phoneApp.classList.add("is-scrolled");
  setAppStatusColor(pageStatusColors.default);
  epaperScroll?.scrollTo({ top: 0 });
  if (updateHash && window.location.hash !== "#epaper") {
    window.history.pushState(null, "", "#epaper");
  }
  playSkeleton(epaperView);
  window.requestAnimationFrame(() => epaperView.classList.add("is-open"));
}

function closeEpaperView(options = {}) {
  if (!epaperView) return;

  const { updateHash = true } = options;

  epaperView.classList.add("is-leaving");
  epaperView.classList.remove("is-open");
  window.setTimeout(() => {
    epaperView.hidden = true;
    epaperView.classList.remove("is-leaving");
    if (updateHash && window.location.hash === "#epaper") {
      window.history.pushState(null, "", window.location.pathname);
    }
    setAppStatusColor(pageStatusColors.home);
    syncHeaderState();
    playSkeleton(phoneApp);
  }, 260);
}

