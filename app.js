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
const podcastLink = document.querySelector("[data-open-podcast]");
const podcastView = document.querySelector(".podcast-view");
const podcastBack = document.querySelector(".podcast-back");
const podcastScroll = document.querySelector(".podcast-scroll");
const articleView = document.querySelector(".article-view");
const articleBack = document.querySelector(".article-back");
const articleLinks = document.querySelectorAll(".headline a, .story-card > a, .popular-item > a, .popular-copy > a, .business-card a");
const aiLink = document.querySelector("[data-open-ai]");
const aiView = document.querySelector(".ai-chat-view");
const aiBack = document.querySelector(".ai-back");
const aiChatScroll = document.querySelector(".ai-chat-scroll");
const aiMessages = document.querySelector(".ai-messages");
const aiComposer = document.querySelector(".ai-composer");
const aiInput = document.querySelector('.ai-composer input[name="message"]');
const aiSuggestions = document.querySelectorAll(".ai-suggestions button");
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

function openPodcastView(event, options = {}) {
  event?.preventDefault();
  if (!phoneApp || !podcastView) return;

  const { updateHash = true } = options;

  podcastView.hidden = false;
  podcastView.classList.remove("is-leaving");
  phoneApp.classList.add("is-scrolled");
  podcastScroll?.scrollTo({ top: 0 });
  if (updateHash && window.location.hash !== "#podcast") {
    window.history.pushState(null, "", "#podcast");
  }
  playSkeleton(podcastView);
  window.requestAnimationFrame(() => podcastView.classList.add("is-open"));
}

function closePodcastView(options = {}) {
  if (!podcastView) return;

  const { updateHash = true } = options;

  podcastView.classList.add("is-leaving");
  podcastView.classList.remove("is-open");
  window.setTimeout(() => {
    podcastView.hidden = true;
    podcastView.classList.remove("is-leaving");
    if (updateHash && window.location.hash === "#podcast") {
      window.history.pushState(null, "", window.location.pathname);
    }
    syncHeaderState();
    playSkeleton(phoneApp);
  }, 260);
}

function openArticleView(event, options = {}) {
  event?.preventDefault();
  if (!phoneApp || !articleView) return;

  const { updateHash = true } = options;

  articleView.hidden = false;
  articleView.classList.remove("is-leaving");
  phoneApp.classList.add("is-scrolled");
  if (updateHash && window.location.hash !== "#article") {
    window.history.pushState(null, "", "#article");
  }
  playSkeleton(articleView);
  window.requestAnimationFrame(() => articleView.classList.add("is-open"));
}

function closeArticleView(options = {}) {
  if (!articleView) return;

  const { updateHash = true } = options;

  articleView.classList.add("is-leaving");
  articleView.classList.remove("is-open");
  window.setTimeout(() => {
    articleView.hidden = true;
    articleView.classList.remove("is-leaving");
    if (updateHash && window.location.hash === "#article") {
      window.history.pushState(null, "", window.location.pathname);
    }
    syncHeaderState();
    playSkeleton(phoneApp);
  }, 260);
}

function openAiView(event, options = {}) {
  event?.preventDefault();
  if (!phoneApp || !aiView) return;

  const { updateHash = true } = options;

  aiView.hidden = false;
  aiView.classList.remove("is-leaving");
  phoneApp.classList.add("is-scrolled");
  if (updateHash && window.location.hash !== "#ai-chat") {
    window.history.pushState(null, "", "#ai-chat");
  }
  playSkeleton(aiView);
  window.requestAnimationFrame(() => aiView.classList.add("is-open"));
  window.setTimeout(() => aiInput?.focus(), 280);
}

function closeAiView(options = {}) {
  if (!aiView) return;

  const { updateHash = true } = options;

  aiView.classList.add("is-leaving");
  aiView.classList.remove("is-open");
  window.setTimeout(() => {
    aiView.hidden = true;
    aiView.classList.remove("is-leaving");
    if (updateHash && window.location.hash === "#ai-chat") {
      window.history.pushState(null, "", window.location.pathname);
    }
    syncHeaderState();
    playSkeleton(phoneApp);
  }, 260);
}

function syncRoute() {
  if (window.location.hash === "#business-insight") {
    openBusinessView(null, { updateHash: false });
  } else if (window.location.hash === "#podcast") {
    openPodcastView(null, { updateHash: false });
  } else if (window.location.hash === "#article") {
    openArticleView(null, { updateHash: false });
  } else if (window.location.hash === "#ai-chat") {
    openAiView(null, { updateHash: false });
  } else if (businessView && !businessView.hidden) {
    closeBusinessView({ updateHash: false });
  } else if (podcastView && !podcastView.hidden) {
    closePodcastView({ updateHash: false });
  } else if (articleView && !articleView.hidden) {
    closeArticleView({ updateHash: false });
  } else if (aiView && !aiView.hidden) {
    closeAiView({ updateHash: false });
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

function addAiMessage(role, text) {
  if (!aiMessages) return null;

  const article = document.createElement("article");
  article.className = `ai-message ${role}`;

  if (role === "assistant") {
    const avatar = document.createElement("div");
    avatar.className = "ai-avatar";
    avatar.textContent = "K";
    article.appendChild(avatar);
  }

  const bubble = document.createElement("p");
  bubble.textContent = text;
  article.appendChild(bubble);
  aiMessages.appendChild(article);
  aiChatScroll?.scrollTo({ top: aiChatScroll.scrollHeight, behavior: "smooth" });
  return article;
}

function addTypingMessage() {
  if (!aiMessages) return null;

  const article = document.createElement("article");
  article.className = "ai-message assistant";
  article.innerHTML = '<div class="ai-avatar">K</div><p class="ai-typing"><span></span><span></span><span></span></p>';
  aiMessages.appendChild(article);
  aiChatScroll?.scrollTo({ top: aiChatScroll.scrollHeight, behavior: "smooth" });
  return article;
}

function buildAiReply(message) {
  const normalized = message.toLowerCase();

  if (normalized.includes("ringkas") || normalized.includes("berita")) {
    return "Ringkasan cepat: isu utama hari ini bergerak di ekonomi, pendidikan, dan layanan publik. Saya bisa lanjutkan dengan poin penting, dampak, atau daftar bacaan terkait.";
  }

  if (normalized.includes("ekonomi") || normalized.includes("rupiah") || normalized.includes("saham")) {
    return "Untuk ekonomi, fokus pembaca biasanya ada pada nilai tukar, suku bunga, daya beli, dan sentimen pasar. Saya bisa bantu bedah dampaknya ke rumah tangga, bisnis, atau investasi.";
  }

  return "Saya tangkap pertanyaannya. Untuk jawaban yang lebih tajam, saya bisa bantu susun dalam tiga bagian: konteks, poin penting, dan apa yang perlu dipantau berikutnya.";
}

function submitAiMessage(event) {
  event.preventDefault();
  if (!aiInput) return;

  const message = aiInput.value.trim();
  if (!message) return;

  addAiMessage("user", message);
  aiInput.value = "";

  const typing = addTypingMessage();
  window.setTimeout(() => {
    typing?.remove();
    addAiMessage("assistant", buildAiReply(message));
  }, 720);
}

placeholderLinks.forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});
navItems.forEach((item) => item.addEventListener("click", setActiveNav));
optionButtons.forEach((button) => button.addEventListener("click", pulseOption));
businessLink?.addEventListener("click", openBusinessView);
businessBack?.addEventListener("click", closeBusinessView);
podcastLink?.addEventListener("click", openPodcastView);
podcastBack?.addEventListener("click", closePodcastView);
articleBack?.addEventListener("click", closeArticleView);
articleLinks.forEach((link) => link.addEventListener("click", openArticleView));
aiLink?.addEventListener("click", openAiView);
aiBack?.addEventListener("click", closeAiView);
aiComposer?.addEventListener("submit", submitAiMessage);
aiSuggestions.forEach((button) => {
  button.addEventListener("click", () => {
    if (!aiInput) return;
    aiInput.value = button.textContent.trim();
    aiInput.focus();
  });
});
feedScroll?.addEventListener("scroll", syncHeaderState, { passive: true });
businessScroll?.addEventListener("scroll", handleBusinessScroll, { passive: true });
window.addEventListener("hashchange", syncRoute);
syncHeaderState();
playSkeleton(phoneApp);
syncRoute();
