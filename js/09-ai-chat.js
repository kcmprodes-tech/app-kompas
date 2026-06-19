// =============================================================================
//  KOMPAS App — Asisten AI 'Karin' (chat, jawaban, feedback)
//  Pecahan dari app.js (per-fitur). Dimuat sebagai classic <script> berurutan
//  di index.html; semua file berbagi satu global scope.
// =============================================================================

function openAiView(event, options = {}) {
  event?.preventDefault();
  if (!phoneApp || !aiView) return;

  const { updateHash = true } = options;

  aiView.hidden = false;
  aiView.classList.remove("is-leaving");
  resetKarinChatIndex();
  phoneApp.classList.add("is-scrolled");
  setAppStatusColor(pageStatusColors.default);
  if (updateHash && window.location.hash !== "#ai-chat") {
    window.history.pushState(null, "", "#ai-chat");
  }
  playSkeleton(aiView);
  window.requestAnimationFrame(() => aiView.classList.add("is-open"));
  window.setTimeout(() => aiInput?.focus(), 280);
  syncAiComposer();
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
    setAppStatusColor(pageStatusColors.home);
    syncHeaderState();
    playSkeleton(phoneApp);
  }, 260);
}

function resetKarinChatIndex() {
  if (!aiView) return;

  aiView.classList.remove("is-answering", "is-answer-loading", "is-answer-ready", "is-word-animating", "is-answer-active", "is-answer-leaving");
  if (aiInput) aiInput.value = "";
  syncAiComposer();
  aiView.scrollTo({ top: 0 });
}

function prepareKarinAnswerWords() {
  if (karinWordsPrepared) return;

  let wordIndex = 0;
  document.querySelectorAll(".karin-answer-copy p").forEach((paragraph) => {
    const words = paragraph.textContent.trim().split(/\s+/);
    paragraph.textContent = "";
    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.style.setProperty("--word-delay", `${wordIndex * 34}ms`);
      paragraph.appendChild(span);
      if (index < words.length - 1) paragraph.append(" ");
      wordIndex += 1;
    });
  });
  karinWordsPrepared = true;
}

function syncAiComposer() {
  if (!aiComposer || !aiInput) return;

  aiComposer.classList.toggle("has-text", aiInput.value.trim().length > 0);
  if (aiInput.tagName === "TEXTAREA") {
    aiInput.style.height = "auto";
    aiInput.style.height = `${Math.min(132, aiInput.scrollHeight)}px`;
  }
}

function openKarinAnswer(question) {
  if (!aiView) return;

  const normalized = question.trim() || "Apa informasi penting hari ini?";
  if (karinQuestionBubble) karinQuestionBubble.textContent = normalized;
  if (aiInput) aiInput.value = "";
  syncAiComposer();
  aiView.classList.add("is-answering", "is-answer-loading");
  aiView.classList.remove("is-answer-ready", "is-word-animating", "is-answer-active", "is-answer-leaving");
  aiView.scrollTo({ top: 0, behavior: "smooth" });
  window.requestAnimationFrame(() => aiView.classList.add("is-answer-active"));
  window.setTimeout(() => {
    if (!aiView.classList.contains("is-answering")) return;
    prepareKarinAnswerWords();
    aiView.classList.remove("is-answer-loading");
    aiView.classList.add("is-answer-ready", "is-word-animating");
  }, 3000);
}

function closeKarinAnswerToIndex(event) {
  event?.preventDefault();
  if (!aiView || !aiView.classList.contains("is-answering")) return;

  aiView.classList.add("is-answer-leaving");
  aiView.classList.remove("is-answer-active");
  window.setTimeout(() => {
    resetKarinChatIndex();
  }, 260);
}

function openKarinFeedback(event) {
  event?.preventDefault();
  if (!karinFeedbackModal || !karinFeedbackImage) return;

  karinFeedbackImage.src = "assets/feedback-mobile.svg";
  karinFeedbackTrigger?.classList.remove("is-active");
  karinFeedbackModal.hidden = false;
}

function closeKarinFeedback(event) {
  event?.preventDefault();
  if (!karinFeedbackModal) return;

  karinFeedbackModal.hidden = true;
}

function activateKarinFeedback(event) {
  event?.preventDefault();
  if (!karinFeedbackImage) return;

  karinFeedbackImage.src = "assets/feedback-mobile-aktif.svg";
  karinFeedbackTrigger?.classList.add("is-active");
}

