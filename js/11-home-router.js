// =============================================================================
//  KOMPAS App — Home view & routing berbasis hash
//  Pecahan dari app.js (per-fitur). Dimuat sebagai classic <script> berurutan
//  di index.html; semua file berbagi satu global scope.
// =============================================================================

function openHomeView(event) {
  event?.preventDefault();
  if (transactionSuccessView && !transactionSuccessView.hidden) {
    transactionSuccessView.hidden = true;
    transactionSuccessView.classList.remove("is-open", "is-leaving");
  }
  if (appreciationView && !appreciationView.hidden) closeAppreciationView({ updateHash: false });
  if (orderDetailView && !orderDetailView.hidden) closeOrderDetailView({ updateHash: false });
  if (ticketSelectView && !ticketSelectView.hidden) closeTicketSelectView({ updateHash: false });
  if (eventDetailView && !eventDetailView.hidden) closeEventDetailView({ updateHash: false });
  if (accountDetailView && !accountDetailView.hidden) closeAccountDetail({ updateHash: false });
  closeAccountView();
  closeEventView();
  if (businessView && !businessView.hidden) closeBusinessView({ updateHash: false });
  if (epaperView && !epaperView.hidden) closeEpaperView({ updateHash: false });
  if (originalFrameView && !originalFrameView.hidden) closeOriginalView({ updateHash: false });
  if (podcastPlayerView && !podcastPlayerView.hidden) closePodcastPlayerView({ updateHash: false });
  if (podcastView && !podcastView.hidden) closePodcastView({ updateHash: false });
  if (articleView && !articleView.hidden) closeArticleView({ updateHash: false });
  if (aiView && !aiView.hidden) closeAiView({ updateHash: false });
  if (window.location.hash) window.history.pushState(null, "", window.location.pathname);
  navItems.forEach((item) => item.classList.toggle("active", item === homeLink));
  setAppStatusColor(pageStatusColors.home);
  playSkeleton(phoneApp);
}

function syncRoute() {
  if (window.location.hash === "#business-insight") {
    setAppStatusColor(pageStatusColors.default);
    openBusinessView(null, { updateHash: false });
  } else if (window.location.hash === "#epaper") {
    setAppStatusColor(pageStatusColors.default);
    openEpaperView(null, { updateHash: false });
  } else if (window.location.hash === "#original") {
    setAppStatusColor(pageStatusColors.default);
    openOriginalView(null, { updateHash: false, resetFrame: false });
  } else if (window.location.hash === "#podcast") {
    setAppStatusColor(pageStatusColors.default);
    openPodcastView(null, { updateHash: false });
    if (podcastPlayerView && !podcastPlayerView.hidden) closePodcastPlayerView({ updateHash: false });
  } else if (window.location.hash === "#podcast-player") {
    setAppStatusColor(pageStatusColors.dark);
    openPodcastView(null, { updateHash: false });
    openPodcastPlayerView(null, { updateHash: false, mode: audioMode });
  } else if (window.location.hash === "#article") {
    setAppStatusColor(pageStatusColors.default);
    openArticleView(null, { updateHash: false });
    if (appreciationView && !appreciationView.hidden) closeAppreciationView({ updateHash: false });
  } else if (window.location.hash === "#appreciation") {
    setAppStatusColor(pageStatusColors.default);
    openArticleView(null, { updateHash: false });
    openAppreciationView(null, { updateHash: false });
  } else if (window.location.hash === "#transaction-success") {
    setAppStatusColor(pageStatusColors.default);
    openArticleView(null, { updateHash: false });
    openAppreciationView(null, { updateHash: false });
    openTransactionSuccess(null);
  } else if (window.location.hash === "#ai-chat") {
    setAppStatusColor(pageStatusColors.default);
    openAiView(null, { updateHash: false });
  } else if (window.location.hash === "#account") {
    setAppStatusColor(pageStatusColors.account);
    openAccountView(null, { updateHash: false });
  } else if (window.location.hash.startsWith("#account-")) {
    const detail = window.location.hash.replace("#account-", "");
    setAppStatusColor(pageStatusColors.default);
    openAccountView(null, { updateHash: false });
    openAccountDetail(null, detail, { updateHash: false });
  } else if (window.location.hash === "#event") {
    openEventView(null, { updateHash: false });
  } else if (window.location.hash === "#event-detail") {
    openEventView(null, { updateHash: false });
    openEventDetailView(null, { updateHash: false });
  } else if (window.location.hash === "#ticket-select") {
    openEventView(null, { updateHash: false });
    openEventDetailView(null, { updateHash: false });
    openTicketSelectView(null, { updateHash: false });
  } else if (window.location.hash === "#order-detail") {
    openEventView(null, { updateHash: false });
    openEventDetailView(null, { updateHash: false });
    openTicketSelectView(null, { updateHash: false });
    openOrderDetailView(null, { updateHash: false });
  } else if (businessView && !businessView.hidden) {
    closeBusinessView({ updateHash: false });
  } else if (epaperView && !epaperView.hidden) {
    closeEpaperView({ updateHash: false });
  } else if (originalFrameView && !originalFrameView.hidden) {
    closeOriginalView({ updateHash: false });
  } else if (podcastPlayerView && !podcastPlayerView.hidden) {
    closePodcastPlayerView({ updateHash: false });
  } else if (podcastView && !podcastView.hidden) {
    closePodcastView({ updateHash: false });
  } else if (articleView && !articleView.hidden) {
    closeArticleView({ updateHash: false });
  } else if (appreciationView && !appreciationView.hidden) {
    closeAppreciationView({ updateHash: false });
  } else if (transactionSuccessView && !transactionSuccessView.hidden) {
    closeTransactionSuccessToArticle(null);
  } else if (aiView && !aiView.hidden) {
    closeAiView({ updateHash: false });
  } else if (accountView && !accountView.hidden) {
    closeAccountView({ updateHash: false });
  } else if (accountDetailView && !accountDetailView.hidden) {
    closeAccountDetail({ updateHash: false });
  } else if (orderDetailView && !orderDetailView.hidden) {
    closeOrderDetailView({ updateHash: false });
  } else if (ticketSelectView && !ticketSelectView.hidden) {
    closeTicketSelectView({ updateHash: false });
  } else if (eventDetailView && !eventDetailView.hidden) {
    closeEventDetailView({ updateHash: false });
  } else if (eventView && !eventView.hidden) {
    closeEventView({ updateHash: false });
  } else {
    setAppStatusColor(pageStatusColors.home);
  }
}

