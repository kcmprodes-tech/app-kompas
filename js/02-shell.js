// =============================================================================
//  KOMPAS App — App shell: status bar, bottom-nav, skeleton, randomizer konten, detail akun
//  Pecahan dari app.js (per-fitur). Dimuat sebagai classic <script> berurutan
//  di index.html; semua file berbagi satu global scope.
// =============================================================================

function setAppStatusColor(color = pageStatusColors.default) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);

  const statusBar = window.Capacitor?.Plugins?.StatusBar;
  if (statusBar?.setBackgroundColor) {
    statusBar.setBackgroundColor({ color }).catch(() => {});
  }
  if (statusBar?.setStyle) {
    statusBar.setStyle({ style: color === pageStatusColors.dark ? "DARK" : "LIGHT" }).catch(() => {});
  }
}

function setActiveNav(event) {
  event.preventDefault();

  const target = event.currentTarget;

  navItems.forEach((item) => item.classList.toggle("active", item === target));
}

function pulseOption(event) {
  const button = event.currentTarget;
  button.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(0.88)" },
      { transform: "scale(1)" },
    ],
    {
      duration: 180,
      easing: "ease-out",
    },
  );
}

function syncHeaderState() {
  if (!phoneApp || !feedScroll) return;

  phoneApp.classList.toggle("is-scrolled", feedScroll.scrollTop > 2);
}

function playSkeleton(target = phoneApp) {
  if (!target) return;

  target.classList.add("is-skeleton");
  window.setTimeout(() => target.classList.remove("is-skeleton"), 760);
}

function randomizeArticleImages() {
  if (localArticleImages.length === 0) return;

  const targets = document.querySelectorAll(
    ".story-photo img, .popular-thumb img, .topic-choice-image img, .article-main-image img"
  );
  const offset = Math.floor(Math.random() * localArticleImages.length);

  targets.forEach((image, index) => {
    image.src = localArticleImages[(index + offset) % localArticleImages.length];
  });
}

function renderContentHistoryLists() {
  document.querySelectorAll("[data-content-list]").forEach((list) => {
    const mode = list.dataset.contentList;
    const actionIcon = mode === "saved" ? "ph-fill ph-bookmark-simple" : "ph-fill ph-thumbs-up";
    const meta = mode === "saved" ? "Disimpan 10 menit lalu" : "Disukai 10 menit lalu";

    list.innerHTML = Array.from({ length: 10 }, (_, index) => {
      const item = contentHistoryItems[index % contentHistoryItems.length];
      const mediaBadge = item.video || item.audio ? `<span><i class="ph ph-headphones" aria-hidden="true"></i> 01:56</span>` : "";
      return `
        <article class="content-history-item">
          <div class="content-history-thumb">
            <img src="${item.image}" alt="${item.title}" />
            ${mediaBadge}
          </div>
          <div class="content-history-copy">
            <small>${item.type}</small>
            <h2>${item.title}</h2>
            <p>${meta}</p>
          </div>
          <div class="content-history-actions">
            <i class="${actionIcon}" aria-hidden="true"></i>
            <i class="ph ph-dots-three" aria-hidden="true"></i>
          </div>
        </article>
      `;
    }).join("");
  });
}

function randomizePodcastThumbnails() {
  if (podcastThumbnailImages.length === 0) return;

  const covers = document.querySelectorAll(".podcast-scroll .episode-cover");
  const offset = Math.floor(Math.random() * podcastThumbnailImages.length);
  covers.forEach((cover, index) => {
    cover.style.backgroundImage = `url("${podcastThumbnailImages[(index + offset) % podcastThumbnailImages.length]}")`;
  });
}

function openAccountDetail(event, detail = event?.currentTarget?.dataset.openAccountDetail || "liked", options = {}) {
  event?.preventDefault();
  if (!accountDetailView) return;

  const normalized = detail === "history" ? "liked" : detail;
  const { updateHash = true } = options;

  accountDetailView.hidden = false;
  accountDetailView.classList.remove("is-leaving");
  if (accountDetailTitle) accountDetailTitle.textContent = accountDetailTitles[detail] || accountDetailTitles[normalized] || "Detail";
  accountDetailPanels.forEach((panel) => {
    const active = panel.dataset.accountDetailPanel === normalized;
    panel.hidden = !active;
  });
  if (accountDetailFilter) accountDetailFilter.hidden = normalized !== "transactions";
  if (accountDetailHistory) accountDetailHistory.hidden = normalized !== "tickets";
  setAppStatusColor(pageStatusColors.default);
  if (updateHash && window.location.hash !== `#account-${normalized}`) {
    window.history.pushState(null, "", `#account-${normalized}`);
  }
  window.requestAnimationFrame(() => accountDetailView.classList.add("is-open"));
}

function closeAccountDetail(options = {}) {
  if (!accountDetailView || accountDetailView.hidden) return;

  const { updateHash = true } = options;

  accountDetailView.classList.add("is-leaving");
  accountDetailView.classList.remove("is-open");
  window.setTimeout(() => {
    accountDetailView.hidden = true;
    accountDetailView.classList.remove("is-leaving");
    if (updateHash && window.location.hash.startsWith("#account-")) {
      window.history.pushState(null, "", "#account");
    }
    if (!accountView?.hidden) setAppStatusColor(pageStatusColors.account);
  }, 260);
}


// ---- Share bottom sheet (global) ----
const SHARE_URL = "https://nasional.kompas.com/read/2026/06/24/121241";
const SHARE_TITLE = "23.470 Pekerja Kena PHK Sepanjang Januari-Mei 2026, Jabar Terbanyak";

function openShareSheet() {
  const sheet = document.querySelector("[data-share-sheet]");
  if (!sheet) return;
  sheet.setAttribute("aria-hidden", "false");
  sheet.classList.add("is-open");
}

function closeShareSheet() {
  const sheet = document.querySelector("[data-share-sheet]");
  if (!sheet) return;
  sheet.classList.remove("is-open");
  sheet.setAttribute("aria-hidden", "true");
}

function nativeShare() {
  if (navigator.share) {
    navigator.share({ title: SHARE_TITLE, url: SHARE_URL }).catch(() => {});
  }
}

function shareTo(net) {
  const u = encodeURIComponent(SHARE_URL);
  const t = encodeURIComponent(SHARE_TITLE);
  const map = {
    wa: `https://wa.me/?text=${t}%20${u}`,
    fb: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    tg: `https://t.me/share/url?url=${u}&text=${t}`,
    x: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    th: `https://www.threads.net/intent/post?text=${t}%20${u}`,
  };
  if (map[net]) {
    window.open(map[net], "_system");
  } else {
    nativeShare();
  }
}

function copyShareLink(button) {
  if (navigator.clipboard) navigator.clipboard.writeText(SHARE_URL).catch(() => {});
  if (button) {
    const original = button.textContent;
    button.textContent = "Tersalin";
    window.setTimeout(() => { button.textContent = original; }, 1500);
  }
}
