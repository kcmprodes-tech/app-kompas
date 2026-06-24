// =============================================================================
//  KOMPAS App — Sheet komentar (buka/tutup, render, balas, submit, hapus)
//  Pecahan dari app.js (per-fitur). Dimuat sebagai classic <script> berurutan
//  di index.html; semua file berbagi satu global scope.
// =============================================================================

function flattenCommentCount() {
  return articleComments.reduce((count, comment) => count + 1 + comment.replies.length, 0);
}

const COMMENT_AVATAR_COLORS = ["#e0512f", "#8a52d6", "#0d87d4", "#2aa775", "#d23f7d", "#e0a020"];

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
  const sticker = comment.sticker ? `<div class="comment-sticker">${comment.sticker}</div>` : "";
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
        <p>${comment.text}</p>
        ${sticker}
        <div class="comment-actions">
          <button type="button" class="comment-like" aria-label="Suka komentar"><i class="ph ph-thumbs-up" aria-hidden="true"></i><span>${likes}</span></button>
          ${isReply ? "" : `<button type="button" data-reply-comment="${comment.id}">Balas</button>`}
          ${comment.mine ? `<button type="button" data-delete-comment="${comment.id}">Hapus</button>` : ""}
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

function addCommentText(text, options = {}) {
  if (!commentInput) return;

  if (options.sticker) {
    const stickerComment = {
      id: commentIdCounter += 1,
      name: "Dian",
      text: "Mengirim stiker",
      sticker: text,
      time: "baru saja",
      mine: true,
      replies: [],
    };
    if (replyTargetId) {
      const parent = articleComments.find((item) => item.id === replyTargetId);
      parent?.replies.push(stickerComment);
      clearReplyTarget();
    } else {
      articleComments.unshift(stickerComment);
    }
    renderComments();
    showCommentToast();
    return;
  }

  commentForm?.classList.add("is-focused");
  commentInput.value = `${commentInput.value}${text}`;
  commentInput.focus();
  autoGrowComment();
  updateCommentSendState();
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

