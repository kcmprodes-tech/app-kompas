// =============================================================================
//  KOMPAS App — Infinite-scroll Business & helper pesan AI
//  Pecahan dari app.js (per-fitur). Dimuat sebagai classic <script> berurutan
//  di index.html; semua file berbagi satu global scope.
// =============================================================================

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

  openKarinAnswer(message);
}

