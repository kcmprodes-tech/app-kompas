// =============================================================================
//  KOMPAS App — Apresiasi/donasi: drawer login & pembayaran, transaksi, like
//  Pecahan dari app.js (per-fitur). Dimuat sebagai classic <script> berurutan
//  di index.html; semua file berbagi satu global scope.
// =============================================================================

function openAppreciationView(event, options = {}) {
  event?.preventDefault();
  if (!appreciationView) return;

  const { updateHash = true } = options;

  appreciationView.hidden = false;
  appreciationView.classList.remove("is-leaving");
  setAppStatusColor(pageStatusColors.default);
  if (updateHash && window.location.hash !== "#appreciation") {
    window.history.pushState(null, "", "#appreciation");
  }
  window.requestAnimationFrame(() => appreciationView.classList.add("is-open"));
}

function closeAppreciationView(options = {}) {
  if (!appreciationView || appreciationView.hidden) return;

  const { updateHash = true } = options;

  closeAppreciationLoginDrawer();
  closeAppreciationPaymentDrawer();
  appreciationView.classList.add("is-leaving");
  appreciationView.classList.remove("is-open");
  window.setTimeout(() => {
    appreciationView.hidden = true;
    appreciationView.classList.remove("is-leaving");
    if (updateHash && window.location.hash === "#appreciation") {
      window.history.pushState(null, "", "#article");
    }
  }, 260);
}

function setAppreciationTab(tabName) {
  appreciationTabs.forEach((tab) => {
    const active = tab.dataset.appreciationTab === tabName;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", active ? "true" : "false");
  });
  appreciationPanels.forEach((panel) => {
    const active = panel.dataset.appreciationPanel === tabName;
    panel.hidden = !active;
    panel.classList.toggle("active", active);
  });
  updateAppreciationSelection();
}

function selectedAppreciationInput() {
  const activePanel = Array.from(appreciationPanels).find((panel) => !panel.hidden);
  return activePanel?.querySelector("input[type='radio']:checked") || null;
}

function selectedAppreciationCtaText() {
  const input = selectedAppreciationInput();
  const panel = input?.closest("[data-appreciation-panel]");
  if (!input || !panel) return "Kirim apresiasi";

  if (panel.dataset.appreciationPanel === "yearly") return `Gabung dengan ${input.value}/tahun`;
  if (panel.dataset.appreciationPanel === "monthly") return `Gabung dengan ${input.value}`;
  return `Kirim apresiasi ${input.parentElement?.textContent?.trim() || input.value}`;
}

function renderAppreciationBenefits(input) {
  const panel = input?.closest("[data-appreciation-panel]");
  const list = panel?.querySelector("[data-appreciation-benefits]");
  if (!list || !input?.dataset.benefitLevel) return;

  list.innerHTML = appreciationBenefitItems[input.dataset.benefitLevel]
    .map((item) => {
      const text = item.strong ? `<strong>${item.text}</strong>` : item.text;
      return `<li class="${item.active ? "" : "is-muted"}">${text}</li>`;
    })
    .join("");
  list.hidden = false;
}

function updateAppreciationSelection() {
  const activePanel = Array.from(appreciationPanels).find((panel) => !panel.hidden);
  const selectedInput = selectedAppreciationInput();
  const isMembership = activePanel?.dataset.appreciationPanel === "monthly" || activePanel?.dataset.appreciationPanel === "yearly";

  document.querySelectorAll("[data-appreciation-benefits]").forEach((list) => {
    list.hidden = true;
    list.innerHTML = "";
  });

  if (selectedInput && isMembership) {
    renderAppreciationBenefits(selectedInput);
  }

  if (!appreciationSubmit) return;

  appreciationSubmit.disabled = !selectedInput;
  appreciationSubmit.classList.toggle("is-active", Boolean(selectedInput));
  if (!selectedInput) {
    appreciationSubmit.textContent = "Kirim apresiasi";
  } else {
    appreciationSubmit.textContent = selectedAppreciationCtaText();
  }
}

function openAppreciationLoginDrawer(event) {
  event?.preventDefault();
  if (!appreciationLoginDrawer) return;

  appreciationLoginDrawer.setAttribute("aria-hidden", "false");
  appreciationLoginDrawer.classList.add("is-open");
}

function closeAppreciationLoginDrawer(event) {
  event?.preventDefault();
  if (!appreciationLoginDrawer) return;

  appreciationLoginDrawer.classList.remove("is-open");
  appreciationLoginDrawer.setAttribute("aria-hidden", "true");
}

function openAppreciationPaymentDrawer(event) {
  event?.preventDefault();
  if (!appreciationPaymentDrawer) return;

  if (appreciationPaymentTotal) {
    appreciationPaymentTotal.textContent = selectedAppreciationCtaText().replace("Gabung dengan ", "");
  }
  appreciationPaymentDrawer.setAttribute("aria-hidden", "false");
  appreciationPaymentDrawer.classList.add("is-open");
}

function closeAppreciationPaymentDrawer(event) {
  event?.preventDefault();
  if (!appreciationPaymentDrawer) return;

  appreciationPaymentDrawer.classList.remove("is-open");
  appreciationPaymentDrawer.setAttribute("aria-hidden", "true");
}

function closeDrawerFromHandle(handle) {
  const drawer = handle.closest(".login-drawer, .appreciation-drawer");
  if (!drawer) return;

  if (drawer.matches("[data-login-drawer]")) closeLoginDrawer();
  if (drawer.matches("[data-appreciation-login-drawer]")) closeAppreciationLoginDrawer();
  if (drawer.matches("[data-appreciation-payment-drawer]")) closeAppreciationPaymentDrawer();
}

function attachDrawerHandleGestures() {
  document.querySelectorAll(".login-drawer-handle").forEach((handle) => {
    let startY = 0;

    handle.addEventListener("pointerdown", (event) => {
      startY = event.clientY;
      handle.setPointerCapture?.(event.pointerId);
    });

    handle.addEventListener("pointerup", (event) => {
      if (event.clientY - startY > 32) {
        closeDrawerFromHandle(handle);
      }
    });
  });
}

function submitAppreciation(event) {
  event?.preventDefault();
  if (!selectedAppreciationInput()) return;

  openAppreciationLoginDrawer();
}

function loginAppreciationWithGoogle(event) {
  event?.preventDefault();
  accountLoggedIn = true;
  window.localStorage?.setItem("kompasAccountLoggedIn", "true");
  applyAccountState();
  closeAppreciationLoginDrawer();
  window.setTimeout(() => openAppreciationPaymentDrawer(), 180);
}

function openTransactionSuccess(event) {
  event?.preventDefault();
  if (!transactionSuccessView) return;

  closeAppreciationPaymentDrawer();
  transactionSuccessView.hidden = false;
  transactionSuccessView.classList.remove("is-leaving");
  if (window.location.hash !== "#transaction-success") {
    window.history.pushState(null, "", "#transaction-success");
  }
  window.requestAnimationFrame(() => transactionSuccessView.classList.add("is-open"));
}

function closeTransactionSuccessToArticle(event) {
  event?.preventDefault();
  if (!transactionSuccessView) return;

  transactionSuccessView.classList.add("is-leaving");
  transactionSuccessView.classList.remove("is-open");
  closeAppreciationView({ updateHash: false });
  window.setTimeout(() => {
    transactionSuccessView.hidden = true;
    transactionSuccessView.classList.remove("is-leaving");
    window.history.pushState(null, "", "#article");
  }, 300);
}

function toggleArticleLike(event) {
  event?.preventDefault();
  if (!articleLike) return;

  const icon = articleLike.querySelector("i");
  const willLike = !articleLike.classList.contains("is-liked");

  articleLike.classList.toggle("is-liked", willLike);
  icon?.classList.toggle("ph", !willLike);
  icon?.classList.toggle("ph-fill", willLike);
  icon?.classList.toggle("ph-thumbs-up", true);
  articleLike.setAttribute("aria-label", willLike ? "Batal suka" : "Suka");

  if (willLike) {
    articleLike.classList.remove("is-animating");
    void articleLike.offsetWidth;
    articleLike.classList.add("is-animating");
    window.setTimeout(() => articleLike.classList.remove("is-animating"), 540);
  }
}

function returnHomeFromArticle(event) {
  event?.preventDefault();
  closeArticleView();
  if (businessView && !businessView.hidden) closeBusinessView({ updateHash: false });
  if (podcastView && !podcastView.hidden) closePodcastView({ updateHash: false });
  if (podcastPlayerView && !podcastPlayerView.hidden) closePodcastPlayerView({ updateHash: false });
  if (aiView && !aiView.hidden) closeAiView({ updateHash: false });
}

