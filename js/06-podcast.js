// =============================================================================
//  KOMPAS App — Podcast view, audio player, TTS artikel, mini-player (PIP)
//  Pecahan dari app.js (per-fitur). Dimuat sebagai classic <script> berurutan
//  di index.html; semua file berbagi satu global scope.
// =============================================================================

function openPodcastView(event, options = {}) {
  event?.preventDefault();
  if (!phoneApp || !podcastView) return;

  const { updateHash = true } = options;

  if (epaperView && !epaperView.hidden) closeEpaperView({ updateHash: false });
  if (originalFrameView && !originalFrameView.hidden) closeOriginalView({ updateHash: false });
  podcastView.hidden = false;
  podcastView.classList.remove("is-leaving");
  phoneApp.classList.add("is-scrolled");
  setAppStatusColor(pageStatusColors.default);
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
    setAppStatusColor(pageStatusColors.home);
    syncHeaderState();
    playSkeleton(phoneApp);
  }, 260);
}

function openPodcastPlayerView(event, options = {}) {
  event?.preventDefault();
  if (!phoneApp || !podcastPlayerView) return;

  const { updateHash = true, fromPip = false, mode = audioMode } = options;

  setAudioMode(mode);
  setAppStatusColor(pageStatusColors.dark);
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
    setAppStatusColor(pageStatusColors.default);
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

