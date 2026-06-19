// =============================================================================
//  KOMPAS App — View artikel (buka/tutup)
//  Pecahan dari app.js (per-fitur). Dimuat sebagai classic <script> berurutan
//  di index.html; semua file berbagi satu global scope.
// =============================================================================

function openArticleView(event, options = {}) {
  event?.preventDefault();
  if (!phoneApp || !articleView) return;

  const { updateHash = true } = options;

  articleView.hidden = false;
  articleView.classList.remove("is-leaving");
  phoneApp.classList.add("is-scrolled");
  setAppStatusColor(pageStatusColors.default);
  if (updateHash && window.location.hash !== "#article") {
    window.history.pushState(null, "", "#article");
  }
  playSkeleton(articleView);
  window.requestAnimationFrame(() => articleView.classList.add("is-open"));
}

function closeArticleView(options = {}) {
  if (!articleView) return;

  const { updateHash = true } = options;

  if (appreciationView && !appreciationView.hidden) closeAppreciationView({ updateHash: false });
  closeCommentSheet();
  articleView.classList.add("is-leaving");
  articleView.classList.remove("is-open");
  window.setTimeout(() => {
    articleView.hidden = true;
    articleView.classList.remove("is-leaving");
    if (updateHash && window.location.hash === "#article") {
      window.history.pushState(null, "", window.location.pathname);
    }
    setAppStatusColor(pageStatusColors.home);
    syncHeaderState();
    playSkeleton(phoneApp);
  }, 260);
}

