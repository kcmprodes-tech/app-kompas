// =============================================================================
//  KOMPAS App — Sheet komentar (buka/tutup, render, balas, submit, hapus)
//  Pecahan dari app.js (per-fitur). Dimuat sebagai classic <script> berurutan
//  di index.html; semua file berbagi satu global scope.
// =============================================================================

function flattenCommentCount() {
  return articleComments.reduce((count, comment) => count + 1 + comment.replies.length, 0);
}

const COMMENT_AVATAR_COLORS = ["#e0512f", "#8a52d6", "#0d87d4", "#2aa775", "#d23f7d", "#e0a020"];

let editingCommentId = null;
let commentSort = "new";

function commentAvatarColor(name) {
  let sum = 0;
  for (let i = 0; i < name.length; i += 1) sum += name.charCodeAt(i);
  return COMMENT_AVATAR_COLORS[sum % COMMENT_AVATAR_COLORS.length];
}

function renderComment(comment, isReply = false) {
  const initials = comment.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const color = commentAvatarColor(comment.name);
  const stickerHtml = comment.sticker ? `<img class="comment-sticker-img" src="${comment.sticker}" alt="Stiker" />` : "";
  const textHtml = comment.text ? `<p>${comment.text}</p>` : "";
  const likes = comment.likes || 0;
  const replyCount = comment.replies ? comment.replies.length : 0;
  const repliesToggle = !isReply && replyCount
    ? `<button type="button" class="comment-replies-toggle" data-toggle-replies="${comment.id}">${replyCount} balasan <i class="ph ph-caret-down" aria-hidden="true"></i></button>`
    : "";
  const repliesBlock = !isReply && replyCount
    ? `<div class="comment-replies" data-replies-for="${comment.id}" hidden>${comment.replies.map((reply) => renderComment(reply, true)).join("")}</div>`
    : "";

  return `
    <article class="comment-item" data-comment-id="${comment.id}" data-comment-reply="${isReply ? "true" : "false"}">
      <span class="comment-avatar" style="background:${color}">${initials}</span>
      <div class="comment-body">
        <div class="comment-top">
          <h3>${comment.name}</h3>
          <span class="comment-time">${comment.time}</span>
          <button type="button" class="comment-kebab" aria-label="Opsi komentar"><i class="ph ph-dots-three-vertical" aria-hidden="true"></i></button>
        </div>
        ${textHtml}
        ${stickerHtml}
        <div class="comment-actions">
          <button type="button" class="comment-like" aria-label="Suka komentar"><i class="ph ph-thumbs-up" aria-hidden="true"></i><span>${likes}</span></button>
          ${isReply ? "" : `<button type="button" data-reply-comment="${comment.id}">Balas</button>`}
        </div>
        ${repliesToggle}
        ${repliesBlock}
      </div>
    </article>
  `;
}

function renderComments() {
  if (!commentList) return;

  const count = flattenCommentCount();
  const title = document.getElementById("comment-title");
  if (title) title.textContent = count > 0 ? `${count} Komentar` : "Komentar";

  if (!articleComments.length) {
    commentList.innerHTML = `
      <div class="comment-empty">
        <div class="comment-empty-art"><i class="ph ph-chats-circle" aria-hidden="true"></i></div>
        <p>Belum ada komentar di artikel ini</p>
      </div>`;
    return;
  }

  commentList.innerHTML = articleComments.map((comment) => renderComment(comment)).join("");
}

function openCommentSheet(event) {
  event?.preventDefault();
  if (!commentSheet) return;

  renderComments();
  commentSheet.setAttribute("aria-hidden", "false");
  commentSheet.classList.add("is-open");
  commentSheet.classList.remove("is-full");
}

function closeCommentSheet(event) {
  event?.preventDefault();
  if (!commentSheet) return;

  commentSheet.classList.remove("is-open", "is-full");
  commentSheet.setAttribute("aria-hidden", "true");
  commentForm?.classList.remove("is-focused");
  closeCommentMenu();
  closeCommentPicker();
  clearReplyTarget();
}

function setReplyTarget(commentId) {
  const comment = articleComments.find((item) => item.id === Number(commentId));
  if (!comment || !commentReplying) return;

  replyTargetId = comment.id;
  const label = commentReplying.querySelector("span");
  if (label) label.textContent = `Membalas ${comment.name}`;
  commentReplying.hidden = false;
  commentInput?.focus();
}

function clearReplyTarget() {
  replyTargetId = null;
  editingCommentId = null;
  if (commentReplying) commentReplying.hidden = true;
}

function autoGrowComment() {
  if (!commentInput) return;
  commentInput.style.height = "auto";
  commentInput.style.height = `${Math.min(commentInput.scrollHeight, 116)}px`;
}

function updateCommentSendState() {
  const send = commentForm?.querySelector(".comment-send");
  if (send) send.disabled = !(commentInput && commentInput.value.trim());
}

let commentToastTimer = null;

function showCommentToast(message = "Komentar berhasil terkirim") {
  const toast = document.querySelector("[data-comment-toast]");
  if (!toast) return;
  const label = toast.lastChild;
  if (label && label.nodeType === Node.TEXT_NODE) label.textContent = ` ${message}`;
  toast.hidden = false;
  window.requestAnimationFrame(() => toast.classList.add("is-visible"));
  window.clearTimeout(commentToastTimer);
  commentToastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => { toast.hidden = true; }, 220);
  }, 2200);
}

function submitComment(event) {
  event.preventDefault();
  if (!commentInput) return;

  const text = commentInput.value.trim();
  if (!text) return;

  if (editingCommentId) {
    const target = findComment(editingCommentId);
    if (target) target.text = text;
    editingCommentId = null;
    commentInput.value = "";
    autoGrowComment();
    updateCommentSendState();
    if (commentReplying) commentReplying.hidden = true;
    renderComments();
    commentForm?.classList.remove("is-focused");
    showCommentToast("Komentar diperbarui");
    return;
  }

  const comment = {
    id: commentIdCounter += 1,
    name: "Dani Wahyudi",
    text,
    time: "baru saja",
    mine: true,
    likes: 0,
    replies: [],
  };

  if (replyTargetId) {
    const parent = articleComments.find((item) => item.id === replyTargetId);
    parent?.replies.push(comment);
  } else {
    articleComments.unshift(comment);
  }

  commentInput.value = "";
  autoGrowComment();
  updateCommentSendState();
  clearReplyTarget();
  renderComments();
  commentList?.scrollTo({ top: 0, behavior: "smooth" });
  commentForm?.classList.remove("is-focused");
  showCommentToast();
}

function deleteComment(commentId) {
  const id = Number(commentId);
  articleComments = articleComments
    .filter((comment) => comment.id !== id)
    .map((comment) => ({ ...comment, replies: comment.replies.filter((reply) => reply.id !== id) }));
  renderComments();
}

function addCommentText(text) {
  if (!commentInput) return;
  commentForm?.classList.add("is-focused");
  commentInput.value = `${commentInput.value}${text}`;
  commentInput.focus();
  autoGrowComment();
  updateCommentSendState();
}

function sendSticker(src) {
  const sticker = {
    id: commentIdCounter += 1,
    name: "Dani Wahyudi",
    text: "",
    sticker: src,
    time: "baru saja",
    mine: true,
    likes: 0,
    replies: [],
  };
  if (replyTargetId) {
    const parent = articleComments.find((item) => item.id === replyTargetId);
    parent?.replies.push(sticker);
    clearReplyTarget();
  } else {
    articleComments.unshift(sticker);
  }
  renderComments();
  commentList?.scrollTo({ top: 0, behavior: "smooth" });
  showCommentToast("Stiker terkirim");
}

const STICKER_SETS = {
  komi: { name: "Komi", items: Array.from({ length: 10 }, (_, i) => `assets/stickers/komi-${i + 1}.gif`) },
  kompas: { name: "Kompas", items: Array.from({ length: 10 }, (_, i) => `assets/stickers/setb-${i + 1}.gif`) },
  komistatis: { name: "Komi Statis", items: Array.from({ length: 16 }, (_, i) => `assets/stickers/komistatis-${i + 1}.png`) },
};

const EMOJI_CATEGORIES = [
  { name: "Wajah", emojis: "😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😋 😜 🤪 😎 🤩 🥳 😏 😴 😪 😭 😤 😠 😡 🥺 😳 🤔 🤗 🙄 😬".split(" ") },
  { name: "Gestur", emojis: "👍 👎 👌 ✌️ 🤞 🤟 🤘 🤙 👏 🙌 🙏 ✊ 👊 🤛 💪 👋 🤚 ✋ 👆 👉 ☝️ 🤝".split(" ") },
  { name: "Hewan & Alam", emojis: "🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🐔 🦄 🐝 🦋 🐢 🌸 🌹 🌻 🌈 ⭐ 🔥 ✨ ⚡ ☀️ 🌙".split(" ") },
  { name: "Makanan", emojis: "🍎 🍌 🍉 🍇 🍓 🍒 🥭 🍍 🥑 🍔 🍟 🍕 🌭 🍿 🍩 🍪 🎂 🍰 🍫 ☕ 🍵 🧋 🍺".split(" ") },
  { name: "Aktivitas", emojis: "⚽ 🏀 🏈 ⚾ 🎾 🎱 🎮 🎯 🎲 🎸 🎤 🎧 🎬 📷 🎉 🎊 🎈 🎁 🏆 🥇 💯 ❤️ 🧡 💛 💚 💙 💜 🖤".split(" ") },
];

const DEFAULT_RECENT_EMOJIS = ["🔥", "✨", "💖", "💯", "🙌", "🦋", "😂", "😍", "😌", "👍", "🙏", "🎉", "🌈"];

let recentEmojis = DEFAULT_RECENT_EMOJIS.slice();
let recentStickers = STICKER_SETS.komi.items.slice(0, 6);
let currentPickerTab = "recent";

function loadCommentRecents() {
  try {
    const e = JSON.parse(window.localStorage.getItem("kompasRecentEmojis") || "null");
    const s = JSON.parse(window.localStorage.getItem("kompasRecentStickers") || "null");
    if (Array.isArray(e) && e.length) recentEmojis = e;
    if (Array.isArray(s) && s.length) recentStickers = s;
  } catch (err) {
    /* abaikan */
  }
}

function persistCommentRecents() {
  try {
    window.localStorage.setItem("kompasRecentEmojis", JSON.stringify(recentEmojis));
    window.localStorage.setItem("kompasRecentStickers", JSON.stringify(recentStickers));
  } catch (err) {
    /* abaikan */
  }
}

function pushRecentEmoji(emoji) {
  recentEmojis = [emoji, ...recentEmojis.filter((item) => item !== emoji)].slice(0, 21);
  persistCommentRecents();
}

function pushRecentSticker(src) {
  recentStickers = [src, ...recentStickers.filter((item) => item !== src)].slice(0, 30);
  persistCommentRecents();
}

function pickerEmojiGrid(list) {
  return `<div class="picker-emoji-grid">${list.map((e) => `<button type="button" class="picker-emoji" data-pick-emoji="${e}">${e}</button>`).join("")}</div>`;
}

function pickerStickerGrid(list) {
  return `<div class="picker-sticker-grid">${list.map((s) => `<button type="button" class="picker-sticker" data-pick-sticker="${s}"><img src="${s}" alt="Stiker" loading="lazy" /></button>`).join("")}</div>`;
}

function renderAllStickers() {
  return Object.entries(STICKER_SETS)
    .map(([key, set]) => `<div class="picker-sticker-section" data-sticker-section="${key}"><span class="picker-label">${set.name} (${set.items.length})</span>${pickerStickerGrid(set.items)}</div>`)
    .join("");
}

function renderPickerBody(tab) {
  const body = document.querySelector("[data-picker-body]");
  if (!body) return;
  if (tab === "recent") {
    body.dataset.mode = "recent";
    body.innerHTML =
      `<span class="picker-label">Emoticon</span>${pickerEmojiGrid(recentEmojis.length ? recentEmojis : DEFAULT_RECENT_EMOJIS)}` +
      `<span class="picker-label">Stiker</span>${recentStickers.length ? pickerStickerGrid(recentStickers) : '<p class="picker-empty">Belum ada stiker dipakai</p>'}`;
    body.scrollTop = 0;
  } else if (tab === "emoji") {
    body.dataset.mode = "emoji";
    body.innerHTML = EMOJI_CATEGORIES.map((cat) => `<span class="picker-label">${cat.name}</span>${pickerEmojiGrid(cat.emojis)}`).join("");
    body.scrollTop = 0;
  } else if (tab === "stickersall" || STICKER_SETS[tab]) {
    if (body.dataset.mode !== "stickers") {
      body.dataset.mode = "stickers";
      body.innerHTML = renderAllStickers();
    }
    if (STICKER_SETS[tab]) {
      window.requestAnimationFrame(() => scrollToStickerSet(tab));
    } else {
      body.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
}

function scrollToStickerSet(key) {
  const body = document.querySelector("[data-picker-body]");
  const section = body && body.querySelector(`[data-sticker-section="${key}"]`);
  if (!body || !section) return;
  const target = section.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop - 4;
  body.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
}

function updateStickerActiveTab() {
  const body = document.querySelector("[data-picker-body]");
  if (!body || body.dataset.mode !== "stickers") return;
  const bodyTop = body.getBoundingClientRect().top;
  let active = null;
  body.querySelectorAll("[data-sticker-section]").forEach((section) => {
    if (section.getBoundingClientRect().top - bodyTop <= 12) active = section.dataset.stickerSection;
  });
  if (!active) return;
  currentPickerTab = active;
  document.querySelectorAll("[data-picker-tab]").forEach((b) => b.classList.toggle("is-active", b.dataset.pickerTab === active));
}

function switchPickerTab(tab) {
  currentPickerTab = tab;
  document.querySelectorAll("[data-picker-tab]").forEach((b) => b.classList.toggle("is-active", b.dataset.pickerTab === tab));
  renderPickerBody(tab);
}

function openCommentPicker(tab) {
  const picker = document.querySelector("[data-comment-picker]");
  if (!picker || !commentForm) return;
  commentForm.classList.add("is-focused", "is-picker");
  commentInput?.blur();
  picker.hidden = false;
  switchPickerTab(tab || currentPickerTab);
}

function closeCommentPicker(refocus = false) {
  const picker = document.querySelector("[data-comment-picker]");
  if (picker) picker.hidden = true;
  commentForm?.classList.remove("is-picker");
  if (refocus) commentInput?.focus();
}

function findComment(id) {
  const target = Number(id);
  for (const comment of articleComments) {
    if (comment.id === target) return comment;
    const reply = (comment.replies || []).find((item) => item.id === target);
    if (reply) return reply;
  }
  return null;
}

function commentAgeMinutes(time) {
  if (!time) return Number.MAX_SAFE_INTEGER;
  if (/baru saja/i.test(time)) return 0;
  const menit = time.match(/(\d+)\s*menit/);
  if (menit) return Number(menit[1]);
  const jam = time.match(/(\d+)\s*jam/);
  if (jam) return Number(jam[1]) * 60;
  const hari = time.match(/(\d+)\s*hari/);
  if (hari) return Number(hari[1]) * 1440;
  return Number.MAX_SAFE_INTEGER;
}

function sortComments(mode) {
  commentSort = mode;
  articleComments.sort((a, b) => {
    if (mode === "pop") return (b.likes || 0) - (a.likes || 0);
    const am = commentAgeMinutes(a.time);
    const bm = commentAgeMinutes(b.time);
    return mode === "old" ? bm - am : am - bm;
  });
  renderComments();
}

function startEditComment(id) {
  const comment = findComment(id);
  if (!comment || !commentInput) return;
  editingCommentId = comment.id;
  replyTargetId = null;
  if (commentReplying) {
    const label = commentReplying.querySelector("span");
    if (label) label.textContent = "Mengedit komentar";
    commentReplying.hidden = false;
  }
  commentForm?.classList.add("is-focused");
  commentInput.value = comment.text;
  commentInput.focus();
  autoGrowComment();
  updateCommentSendState();
}

function closeCommentMenu() {
  const menu = document.querySelector("[data-comment-menu]");
  if (menu) menu.hidden = true;
}

function openCommentMenu(items, anchor) {
  const menu = document.querySelector("[data-comment-menu]");
  const panel = commentSheet?.querySelector(".comment-panel");
  if (!menu || !panel || !anchor) return;
  menu.innerHTML = items
    .map((item) => {
      const cls = item.danger ? " class=\"is-danger\"" : item.active ? " class=\"is-active\"" : "";
      const icon = item.icon ? `<i class="ph ${item.icon}" aria-hidden="true"></i>` : "";
      return `<button type="button" role="menuitem" data-menu-action="${item.action}" data-menu-arg="${item.arg ?? ""}"${cls}>${icon}${item.label}</button>`;
    })
    .join("");
  menu.hidden = false;
  const pr = panel.getBoundingClientRect();
  const ar = anchor.getBoundingClientRect();
  let left = ar.right - pr.left - menu.offsetWidth;
  if (left < 8) left = 8;
  let top = ar.bottom - pr.top + 6;
  if (top + menu.offsetHeight > pr.height - 8) top = ar.top - pr.top - menu.offsetHeight - 6;
  if (top < 8) top = 8;
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
}

function attachCommentSheetGesture() {
  const panel = commentSheet?.querySelector(".comment-panel");
  const header = commentSheet?.querySelector(".comment-header");
  if (!commentHandle || !commentSheet || !panel) return;

  let startY = 0;
  let startH = 0;
  let minH = 0;
  let maxH = 0;
  let dragging = false;
  let activeEl = null;

  function onDown(event) {
    // jangan mulai drag bila menekan tombol (mis. ikon urutkan)
    if (event.target.closest("button")) return;
    startY = event.clientY;
    startH = panel.getBoundingClientRect().height;
    const sheetH = commentSheet.getBoundingClientRect().height;
    maxH = sheetH - 20;
    minH = Math.min(maxH, Math.max(430, sheetH * 0.54));
    dragging = true;
    activeEl = event.currentTarget;
    panel.style.transition = "none";
    activeEl.setPointerCapture?.(event.pointerId);
  }

  function onMove(event) {
    if (!dragging) return;
    const delta = event.clientY - startY;
    let h = startH - delta;
    if (h > maxH) h = maxH;
    if (h < minH - 140) h = minH - 140;
    panel.style.height = `${h}px`;
  }

  function onUp(event) {
    if (!dragging) return;
    dragging = false;
    const h = panel.getBoundingClientRect().height;
    const delta = event.clientY - startY;
    const wasFull = commentSheet.classList.contains("is-full");
    panel.style.transition = "";
    if (delta > 100 && !wasFull && h <= minH + 60) {
      panel.style.height = "";
      closeCommentSheet();
    } else if (h >= (minH + maxH) / 2) {
      commentSheet.classList.add("is-full");
      panel.style.height = "";
    } else {
      commentSheet.classList.remove("is-full");
      panel.style.height = "";
    }
    activeEl?.releasePointerCapture?.(event.pointerId);
    activeEl = null;
  }

  [commentHandle, header].forEach((el) => {
    if (!el) return;
    el.style.touchAction = "none";
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
  });
}

