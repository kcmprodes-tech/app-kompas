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
const podcastPlayerView = document.querySelector(".podcast-player-view");
const podcastPlayerClose = document.querySelector(".podcast-player-close");
const episodeLinks = document.querySelectorAll(".episode-card a");
const podcastAudio = document.querySelector("[data-podcast-audio]");
const podcastPlayButtons = document.querySelectorAll(".player-play, .podcast-pip-play");
const podcastRewind = document.querySelector(".player-rewind");
const podcastForward = document.querySelector(".player-forward");
const podcastProgress = document.querySelector(".player-progress");
const podcastFill = document.querySelector(".player-fill");
const podcastThumb = document.querySelector(".player-thumb");
const podcastCurrent = document.querySelector(".player-current");
const podcastRemaining = document.querySelector(".player-remaining");
const podcastPip = document.querySelector(".podcast-pip");
const podcastPipOpen = document.querySelector(".podcast-pip-open");
const podcastPipClose = document.querySelector(".podcast-pip-close");
const podcastPipTitle = document.querySelector(".podcast-pip-open span");
const playerTitle = document.querySelector(".podcast-player-info h1");
const playerMeta = document.querySelector(".podcast-player-info p");
const coverTitle = document.querySelector(".cover-title");
const coverDate = document.querySelector(".cover-date");
const articleView = document.querySelector(".article-view");
const articleBack = document.querySelector(".article-back");
const articleHome = document.querySelector("[data-article-home]");
const articleListen = document.querySelector(".listen-pill");
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
let audioMode = "podcast";
let articleUtterance = null;
let articleSpeechState = "idle";

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

function openPodcastPlayerView(event, options = {}) {
  event?.preventDefault();
  if (!phoneApp || !podcastPlayerView) return;

  const { updateHash = true, fromPip = false, mode = audioMode } = options;

  setAudioMode(mode);
  podcastPlayerView.hidden = false;
  podcastPlayerView.classList.remove("is-leaving", "is-minimizing", "is-from-pip");
  if (fromPip) podcastPlayerView.classList.add("is-from-pip");
  hidePodcastPip();
  phoneApp.classList.add("is-scrolled");
  if (updateHash && window.location.hash !== "#podcast-player") {
    window.history.pushState(null, "", "#podcast-player");
  }
  playSkeleton(podcastPlayerView);
  window.requestAnimationFrame(() => {
    podcastPlayerView.classList.add("is-open");
    window.setTimeout(() => podcastPlayerView.classList.remove("is-from-pip"), 280);
  });
}

function closePodcastPlayerView(options = {}) {
  if (!podcastPlayerView) return;

  const { updateHash = true, showPip = false } = options;

  podcastPlayerView.classList.toggle("is-minimizing", showPip);
  podcastPlayerView.classList.add("is-leaving");
  podcastPlayerView.classList.remove("is-open");
  window.setTimeout(() => {
    podcastPlayerView.hidden = true;
    podcastPlayerView.classList.remove("is-leaving", "is-minimizing", "is-from-pip");
    if (showPip) showPodcastPip();
    if (updateHash && window.location.hash === "#podcast-player") {
      window.history.pushState(null, "", "#podcast");
    }
    playSkeleton(podcastView);
  }, 260);
}

function openArticleAudioPlayer(event, options = {}) {
  event?.preventDefault();
  openPodcastPlayerView(null, { ...options, mode: "article" });
}

function minimizePodcastPlayer(event) {
  event?.preventDefault();
  closePodcastPlayerView({ showPip: true });
}

function formatPodcastTime(value = 0) {
  if (!Number.isFinite(value) || value < 0) return "00:00";

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updatePodcastPlayer() {
  if (!podcastAudio) return;

  const duration = Number.isFinite(podcastAudio.duration) ? podcastAudio.duration : 0;
  const current = Number.isFinite(podcastAudio.currentTime) ? podcastAudio.currentTime : 0;
  const progress = duration > 0 ? Math.min(100, Math.max(0, (current / duration) * 100)) : 0;
  const remaining = duration > 0 ? Math.max(0, duration - current) : 0;
  const isPlaying = !podcastAudio.paused;

  if (podcastFill) podcastFill.style.width = `${progress}%`;
  if (podcastThumb) podcastThumb.style.left = `${progress}%`;
  if (podcastCurrent) podcastCurrent.textContent = formatPodcastTime(current);
  if (podcastRemaining) podcastRemaining.textContent = `-${formatPodcastTime(remaining)}`;

  podcastPlayButtons.forEach((button) => {
    const icon = button.querySelector("i");
    button.setAttribute("aria-label", isPlaying ? "Jeda podcast" : "Putar podcast");
    icon?.classList.toggle("ph-play", !isPlaying);
    icon?.classList.toggle("ph-pause", isPlaying);
  });
}

function articleTextToRead() {
  if (!articleView) return "";

  const title = articleView.querySelector(".article-lead h1")?.textContent?.trim() || "";
  const paragraphs = Array.from(articleView.querySelectorAll(".article-body p"))
    .map((paragraph) => paragraph.textContent.trim())
    .filter(Boolean);
  return [title, ...paragraphs].join(". ");
}

function setAudioMode(mode) {
  audioMode = mode;
  const isArticle = mode === "article";
  const articleTitle = articleView?.querySelector(".article-lead h1")?.textContent?.trim() || "Dengarkan artikel";

  if (!isArticle && articleSpeechState !== "idle" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    articleSpeechState = "idle";
  }

  if (playerTitle) {
    playerTitle.textContent = isArticle ? articleTitle : "Skenario Terburuk jika Rupiah Terus Melemah";
  }
  if (playerMeta) {
    playerMeta.innerHTML = isArticle ? "Kompas.com <span>•</span> Artikel audio" : "Morning Brief <span>•</span> 4 Mei 2026";
  }
  if (coverTitle) {
    coverTitle.innerHTML = isArticle ? "Audio<br />Artikel" : "Morning<br />Brief";
  }
  if (coverDate) {
    coverDate.textContent = isArticle ? "Kompas.com" : "21 Agustus 2005";
  }
  if (podcastPipTitle) {
    podcastPipTitle.innerHTML = isArticle ? "Menkeu Purbaya:<br />Pegawai Pajak..." : "Menkeu Purbaya:<br />Pegawai Pajak...";
  }

  podcastPlayerView?.classList.toggle("is-article-audio", isArticle);
  updateArticleAudioUi();
  updatePodcastPlayer();
}

function updateArticleAudioUi() {
  const isPlaying = articleSpeechState === "playing";

  articleListen?.querySelector("i")?.classList.toggle("ph-play", !isPlaying);
  articleListen?.querySelector("i")?.classList.toggle("ph-pause", isPlaying);

  if (audioMode === "article") {
    podcastPlayButtons.forEach((button) => {
      const icon = button.querySelector("i");
      button.setAttribute("aria-label", isPlaying ? "Jeda artikel" : "Putar artikel");
      icon?.classList.toggle("ph-play", !isPlaying);
      icon?.classList.toggle("ph-pause", isPlaying);
    });
  }
}

function startArticleSpeech() {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  articleUtterance = new SpeechSynthesisUtterance(articleTextToRead());
  articleUtterance.lang = "id-ID";
  articleUtterance.rate = 0.96;
  articleUtterance.pitch = 1;
  articleUtterance.onstart = () => {
    articleSpeechState = "playing";
    setAudioMode("article");
    showPodcastPip();
    updateArticleAudioUi();
  };
  articleUtterance.onend = () => {
    articleSpeechState = "idle";
    hidePodcastPip();
    updateArticleAudioUi();
  };
  articleUtterance.onerror = () => {
    articleSpeechState = "idle";
    updateArticleAudioUi();
  };

  articleSpeechState = "playing";
  setAudioMode("article");
  showPodcastPip();
  updateArticleAudioUi();
  window.speechSynthesis.speak(articleUtterance);
}

function toggleArticleSpeech(event) {
  event?.preventDefault();
  if (!("speechSynthesis" in window)) return;

  setAudioMode("article");
  podcastAudio?.pause();

  if (articleSpeechState === "playing") {
    window.speechSynthesis.pause();
    articleSpeechState = "paused";
    showPodcastPip();
    updateArticleAudioUi();
    return;
  }

  if (articleSpeechState === "paused") {
    window.speechSynthesis.resume();
    articleSpeechState = "playing";
    showPodcastPip();
    updateArticleAudioUi();
    return;
  }

  startArticleSpeech();
}

function togglePodcastAudio(event) {
  event?.preventDefault();
  if (audioMode === "article") {
    toggleArticleSpeech(event);
    return;
  }
  if (!podcastAudio) return;

  if (podcastAudio.paused) {
    podcastAudio.play().catch(() => {});
  } else {
    podcastAudio.pause();
  }
}

function seekPodcastBy(seconds) {
  if (audioMode === "article") return;
  if (!podcastAudio) return;

  const duration = Number.isFinite(podcastAudio.duration) ? podcastAudio.duration : podcastAudio.currentTime + seconds;
  podcastAudio.currentTime = Math.min(Math.max(podcastAudio.currentTime + seconds, 0), duration);
  updatePodcastPlayer();
}

function seekPodcastFromProgress(event) {
  if (audioMode === "article") return;
  if (!podcastAudio || !podcastProgress || !Number.isFinite(podcastAudio.duration)) return;

  const rect = podcastProgress.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
  podcastAudio.currentTime = ratio * podcastAudio.duration;
  updatePodcastPlayer();
}

function showPodcastPip() {
  if (!podcastPip) return;

  podcastPip.hidden = false;
  if (audioMode === "article") {
    updateArticleAudioUi();
  } else {
    updatePodcastPlayer();
  }
}

function hidePodcastPip() {
  if (!podcastPip) return;

  podcastPip.hidden = true;
}

function stopPodcastPip(event) {
  event?.preventDefault();
  if (audioMode === "article" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    articleSpeechState = "idle";
    updateArticleAudioUi();
  } else {
    podcastAudio?.pause();
  }
  hidePodcastPip();
}

function restorePodcastPlayer(event) {
  event?.preventDefault();
  openPodcastPlayerView(null, { fromPip: true, mode: audioMode });
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

function returnHomeFromArticle(event) {
  event?.preventDefault();
  closeArticleView();
  if (businessView && !businessView.hidden) closeBusinessView({ updateHash: false });
  if (podcastView && !podcastView.hidden) closePodcastView({ updateHash: false });
  if (podcastPlayerView && !podcastPlayerView.hidden) closePodcastPlayerView({ updateHash: false });
  if (aiView && !aiView.hidden) closeAiView({ updateHash: false });
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
    if (podcastPlayerView && !podcastPlayerView.hidden) closePodcastPlayerView({ updateHash: false });
  } else if (window.location.hash === "#podcast-player") {
    openPodcastView(null, { updateHash: false });
    openPodcastPlayerView(null, { updateHash: false, mode: audioMode });
  } else if (window.location.hash === "#article") {
    openArticleView(null, { updateHash: false });
  } else if (window.location.hash === "#ai-chat") {
    openAiView(null, { updateHash: false });
  } else if (businessView && !businessView.hidden) {
    closeBusinessView({ updateHash: false });
  } else if (podcastPlayerView && !podcastPlayerView.hidden) {
    closePodcastPlayerView({ updateHash: false });
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
podcastPlayerClose?.addEventListener("click", minimizePodcastPlayer);
episodeLinks.forEach((link) => link.addEventListener("click", (event) => openPodcastPlayerView(event, { mode: "podcast" })));
podcastPlayButtons.forEach((button) => button.addEventListener("click", togglePodcastAudio));
podcastRewind?.addEventListener("click", () => seekPodcastBy(-15));
podcastForward?.addEventListener("click", () => seekPodcastBy(15));
podcastProgress?.addEventListener("click", seekPodcastFromProgress);
podcastAudio?.addEventListener("loadedmetadata", updatePodcastPlayer);
podcastAudio?.addEventListener("timeupdate", updatePodcastPlayer);
podcastAudio?.addEventListener("play", updatePodcastPlayer);
podcastAudio?.addEventListener("pause", updatePodcastPlayer);
podcastAudio?.addEventListener("ended", updatePodcastPlayer);
podcastPipOpen?.addEventListener("click", restorePodcastPlayer);
podcastPipClose?.addEventListener("click", stopPodcastPip);
articleListen?.addEventListener("click", toggleArticleSpeech);
articleBack?.addEventListener("click", closeArticleView);
articleHome?.addEventListener("click", returnHomeFromArticle);
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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
