// =============================================================================
//  KOMPAS App — Akun, Event, pilih tiket, detail order, login
//  Pecahan dari app.js (per-fitur). Dimuat sebagai classic <script> berurutan
//  di index.html; semua file berbagi satu global scope.
// =============================================================================

function openAccountView(event, options = {}) {
  event?.preventDefault();
  if (!phoneApp || !accountView) return;

  const { updateHash = true } = options;

  if (businessView && !businessView.hidden) closeBusinessView({ updateHash: false });
  if (epaperView && !epaperView.hidden) closeEpaperView({ updateHash: false });
  if (originalFrameView && !originalFrameView.hidden) closeOriginalView({ updateHash: false });
  if (podcastPlayerView && !podcastPlayerView.hidden) closePodcastPlayerView({ updateHash: false });
  if (podcastView && !podcastView.hidden) closePodcastView({ updateHash: false });
  if (articleView && !articleView.hidden) closeArticleView({ updateHash: false });
  if (aiView && !aiView.hidden) closeAiView({ updateHash: false });
  if (eventView && !eventView.hidden) closeEventView({ updateHash: false });
  if (accountDetailView && !accountDetailView.hidden) closeAccountDetail({ updateHash: false });
  accountView.hidden = false;
  phoneApp.classList.add("is-scrolled");
  accountScroll?.scrollTo({ top: 0 });
  if (updateHash && window.location.hash !== "#account") {
    window.history.pushState(null, "", "#account");
  }
  navItems.forEach((item) => item.classList.toggle("active", item === accountLink));
  setAppStatusColor(pageStatusColors.account);
  playSkeleton(accountView);
}

function closeAccountView(options = {}) {
  if (!accountView || accountView.hidden) return;

  const { updateHash = true } = options;

  closeLoginDrawer();
  if (accountDetailView && !accountDetailView.hidden) closeAccountDetail({ updateHash: false });
  accountView.hidden = true;
  if (updateHash && window.location.hash === "#account") {
    window.history.pushState(null, "", window.location.pathname);
  }
  navItems.forEach((item) => item.classList.toggle("active", item === homeLink));
  setAppStatusColor(pageStatusColors.home);
  syncHeaderState();
}

function openEventView(event, options = {}) {
  event?.preventDefault();
  if (!phoneApp || !eventView) return;

  const { updateHash = true } = options;

  if (businessView && !businessView.hidden) closeBusinessView({ updateHash: false });
  if (epaperView && !epaperView.hidden) closeEpaperView({ updateHash: false });
  if (originalFrameView && !originalFrameView.hidden) closeOriginalView({ updateHash: false });
  if (podcastPlayerView && !podcastPlayerView.hidden) closePodcastPlayerView({ updateHash: false });
  if (podcastView && !podcastView.hidden) closePodcastView({ updateHash: false });
  if (articleView && !articleView.hidden) closeArticleView({ updateHash: false });
  if (aiView && !aiView.hidden) closeAiView({ updateHash: false });
  if (accountView && !accountView.hidden) closeAccountView({ updateHash: false });
  eventView.hidden = false;
  phoneApp.classList.add("is-scrolled");
  eventScroll?.scrollTo({ top: 0 });
  if (updateHash && window.location.hash !== "#event") {
    window.history.pushState(null, "", "#event");
  }
  navItems.forEach((item) => item.classList.toggle("active", item === eventLink));
  setAppStatusColor(pageStatusColors.event);
  playSkeleton(eventView);
}

function closeEventView(options = {}) {
  if (!eventView || eventView.hidden) return;

  const { updateHash = true } = options;

  if (orderDetailView && !orderDetailView.hidden) closeOrderDetailView({ updateHash: false });
  if (ticketSelectView && !ticketSelectView.hidden) closeTicketSelectView({ updateHash: false });
  if (eventDetailView && !eventDetailView.hidden) closeEventDetailView({ updateHash: false });
  eventView.hidden = true;
  if (updateHash && window.location.hash === "#event") {
    window.history.pushState(null, "", window.location.pathname);
  }
  navItems.forEach((item) => item.classList.toggle("active", item === homeLink));
  setAppStatusColor(pageStatusColors.home);
  syncHeaderState();
}

function syncEventHeaderState() {
  if (!eventView || !eventScroll) return;

  eventView.classList.toggle("is-scrolled", eventScroll.scrollTop > 2);
}

function syncEventDetailCtaState() {
  if (!eventDetailView || !eventDetailScroll || !eventDetailMainCta) return;

  const scrollTop = eventDetailScroll.scrollTop;
  const ctaBottom = eventDetailMainCta.offsetTop + eventDetailMainCta.offsetHeight;
  eventDetailView.classList.toggle("show-bottom-bar", scrollTop > ctaBottom - 72);
}

function openEventDetailView(event, options = {}) {
  event?.preventDefault();
  if (!eventDetailView) return;

  const { updateHash = true } = options;

  eventDetailView.hidden = false;
  eventDetailView.classList.remove("is-leaving");
  eventDetailView.classList.remove("show-bottom-bar");
  eventDetailScroll?.scrollTo({ top: 0 });
  if (updateHash && window.location.hash !== "#event-detail") {
    window.history.pushState(null, "", "#event-detail");
  }
  setAppStatusColor("#1d168d");
  playSkeleton(eventDetailView);
  window.requestAnimationFrame(() => {
    eventDetailView.classList.add("is-open");
    syncEventDetailCtaState();
  });
}

function closeEventDetailView(options = {}) {
  if (!eventDetailView || eventDetailView.hidden) return;

  const { updateHash = true } = options;

  eventDetailView.classList.add("is-leaving");
  eventDetailView.classList.remove("is-open");
  window.setTimeout(() => {
    eventDetailView.hidden = true;
    eventDetailView.classList.remove("is-leaving");
    if (updateHash && window.location.hash === "#event-detail") {
      window.history.pushState(null, "", "#event");
    }
    if (!eventView?.hidden) setAppStatusColor(pageStatusColors.event);
  }, 260);
}

function openTicketSelectView(event, options = {}) {
  event?.preventDefault();
  if (!ticketSelectView) return;

  const { updateHash = true } = options;

  ticketSelectView.hidden = false;
  ticketSelectView.classList.remove("is-leaving");
  if (updateHash && window.location.hash !== "#ticket-select") {
    window.history.pushState(null, "", "#ticket-select");
  }
  setAppStatusColor(pageStatusColors.default);
  updateTicketSummary();
  window.requestAnimationFrame(() => ticketSelectView.classList.add("is-open"));
}

function closeTicketSelectView(options = {}) {
  if (!ticketSelectView || ticketSelectView.hidden) return;

  const { updateHash = true } = options;

  ticketSelectView.classList.add("is-leaving");
  ticketSelectView.classList.remove("is-open");
  window.setTimeout(() => {
    ticketSelectView.hidden = true;
    ticketSelectView.classList.remove("is-leaving");
    if (updateHash && window.location.hash === "#ticket-select") {
      window.history.pushState(null, "", "#event-detail");
    }
    if (!eventDetailView?.hidden) setAppStatusColor("#1d168d");
  }, 260);
}

function openOrderDetailView(event, options = {}) {
  event?.preventDefault();
  if (!orderDetailView || !getTicketCount()) return;

  const { updateHash = true } = options;

  orderDetailView.hidden = false;
  orderDetailView.classList.remove("is-leaving");
  if (updateHash && window.location.hash !== "#order-detail") {
    window.history.pushState(null, "", "#order-detail");
  }
  setAppStatusColor(pageStatusColors.default);
  updateTicketSummary();
  window.requestAnimationFrame(() => orderDetailView.classList.add("is-open"));
}

function closeOrderDetailView(options = {}) {
  if (!orderDetailView || orderDetailView.hidden) return;

  const { updateHash = true } = options;

  orderDetailView.classList.add("is-leaving");
  orderDetailView.classList.remove("is-open");
  window.setTimeout(() => {
    orderDetailView.hidden = true;
    orderDetailView.classList.remove("is-leaving");
    if (updateHash && window.location.hash === "#order-detail") {
      window.history.pushState(null, "", "#ticket-select");
    }
    if (!ticketSelectView?.hidden) setAppStatusColor(pageStatusColors.default);
  }, 260);
}

function formatRupiah(value) {
  return `Rp${value.toLocaleString("id-ID")}`;
}

function getTicketCount() {
  return ticketCounts.regular + ticketCounts.vip;
}

function getTicketTotal() {
  return ticketCounts.regular * ticketPrices.regular + ticketCounts.vip * ticketPrices.vip;
}

function updateTicketSummary() {
  document.querySelectorAll("[data-ticket-count]").forEach((node) => {
    const type = node.dataset.ticketCount;
    node.textContent = ticketCounts[type] || 0;
  });

  ticketMinusButtons.forEach((button) => {
    const type = button.dataset.ticketMinus;
    button.disabled = !ticketCounts[type];
  });

  const count = getTicketCount();
  const total = getTicketTotal() || ticketPrices.vip;
  if (ticketSummaryLabel) ticketSummaryLabel.textContent = count ? `Jumlah (${count} tiket)` : "Harga mulai dari";
  if (ticketTotal) ticketTotal.textContent = formatRupiah(total);
  if (orderTotal) orderTotal.textContent = formatRupiah(total);
  if (orderOpenButton) orderOpenButton.disabled = count === 0;
  if (orderRegular) orderRegular.textContent = `${ticketCounts.regular} Pax`;
  if (orderVip) orderVip.textContent = `${ticketCounts.vip} Pax`;
}

function changeTicketCount(type, delta) {
  if (!Object.prototype.hasOwnProperty.call(ticketCounts, type)) return;

  ticketCounts[type] = Math.max(0, ticketCounts[type] + delta);
  updateTicketSummary();
}

function openLoginDrawer(event) {
  event?.preventDefault();
  if (accountLoggedIn) return;
  if (!loginDrawer) return;

  accountView?.classList.add("has-login-drawer");
  loginDrawer.setAttribute("aria-hidden", "false");
  loginDrawer.classList.add("is-open");
}

function closeLoginDrawer(event) {
  event?.preventDefault();
  if (!loginDrawer) return;

  loginDrawer.classList.remove("is-open");
  loginDrawer.setAttribute("aria-hidden", "true");
  accountView?.classList.remove("has-login-drawer");
}

function applyAccountState() {
  if (!accountView) return;

  accountView.classList.toggle("is-logged-in", accountLoggedIn);
  if (accountLoggedIn) {
    if (accountAvatar) accountAvatar.textContent = "DM";
    if (accountName) accountName.textContent = "Dian meidina";
    if (accountEmail) accountEmail.hidden = false;
    if (accountProfile) accountProfile.hidden = false;
    if (accountLoginCaret) accountLoginCaret.hidden = true;
    if (accountReward) accountReward.textContent = "Rp25.000";
    if (accountVoucher) accountVoucher.textContent = "2 Voucher";
  } else {
    if (accountAvatar) accountAvatar.innerHTML = '<i class="ph ph-user" aria-hidden="true"></i>';
    if (accountName) accountName.textContent = "Login";
    if (accountEmail) accountEmail.hidden = true;
    if (accountProfile) accountProfile.hidden = true;
    if (accountLoginCaret) accountLoginCaret.hidden = false;
    if (accountReward) accountReward.textContent = "Lihat reward";
    if (accountVoucher) accountVoucher.textContent = "Lihat voucher";
  }
}

function loginWithGoogle(event) {
  event?.preventDefault();
  accountLoggedIn = true;
  window.localStorage?.setItem("kompasAccountLoggedIn", "true");
  applyAccountState();
  closeLoginDrawer();
}

