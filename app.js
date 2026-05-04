const navItems = document.querySelectorAll(".bottom-nav a");
const optionButtons = document.querySelectorAll(".story-meta button");
const placeholderLinks = document.querySelectorAll('a[href="#"]');
const phoneApp = document.querySelector(".phone-app");
const feedScroll = document.querySelector(".feed-scroll");
const businessLink = document.querySelector("[data-open-business]");
const businessView = document.querySelector(".business-view");
const businessBack = document.querySelector(".business-back");
const businessScroll = document.querySelector(".business-scroll");
const businessLoader = document.querySelector(".business-loader");
const businessArticleSeed = Array.from(document.querySelectorAll(".business-card")).slice(0, 5);
let businessIsAppending = false;
let businessBatch = 0;

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

function openBusinessView(event, options = {}) {
  event?.preventDefault();
  if (!phoneApp || !businessView) return;

  const { updateHash = true } = options;

  businessView.hidden = false;
  businessView.classList.remove("is-leaving");
  phoneApp.classList.add("business-active", "is-scrolled");
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
    syncHeaderState();
    playSkeleton(phoneApp);
  }, 260);
}

function syncRoute() {
  if (window.location.hash === "#business-insight") {
    openBusinessView(null, { updateHash: false });
  } else if (businessView && !businessView.hidden) {
    closeBusinessView({ updateHash: false });
  }
}

function appendBusinessArticles() {
  if (!businessScroll || !businessLoader || businessIsAppending || businessArticleSeed.length === 0) return;

  businessIsAppending = true;
  window.setTimeout(() => {
    businessBatch += 1;
    businessArticleSeed.slice(0, 3).forEach((article, index) => {
      const clone = article.cloneNode(true);
      const title = clone.querySelector("h2");
      const meta = clone.querySelector("p");

      if (title && businessBatch % 2 === 1) {
        title.textContent = [
          "Saham Perbankan Mulai Bergerak, Investor Pantau Arah Bunga",
          "Rupiah Menguat Tipis, Pasar Tunggu Sinyal Bank Indonesia",
          "Ekspor Manufaktur Tertahan, Pelaku Usaha Tunggu Insentif",
        ][index];
      }

      if (meta) meta.innerHTML = "Business Insight <span>•</span> baru saja";
      businessScroll.insertBefore(clone, businessLoader);
    });

    businessIsAppending = false;
  }, 620);
}

function handleBusinessScroll() {
  if (!businessScroll) return;

  const distanceToBottom = businessScroll.scrollHeight - businessScroll.scrollTop - businessScroll.clientHeight;
  if (distanceToBottom < 240) appendBusinessArticles();
}

placeholderLinks.forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});
navItems.forEach((item) => item.addEventListener("click", setActiveNav));
optionButtons.forEach((button) => button.addEventListener("click", pulseOption));
businessLink?.addEventListener("click", openBusinessView);
businessBack?.addEventListener("click", closeBusinessView);
feedScroll?.addEventListener("scroll", syncHeaderState, { passive: true });
businessScroll?.addEventListener("scroll", handleBusinessScroll, { passive: true });
window.addEventListener("hashchange", syncRoute);
syncHeaderState();
playSkeleton(phoneApp);
syncRoute();
