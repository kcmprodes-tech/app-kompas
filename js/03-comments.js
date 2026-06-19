// =============================================================================
//  KOMPAS App — Sheet komentar (buka/tutup, render, balas, submit, hapus)
//  Pecahan dari app.js (per-fitur). Dimuat sebagai classic <script> berurutan
//  di index.html; semua file berbagi satu global scope.
// =============================================================================

function flattenCommentCount() {
  return articleComments.reduce((count, comment) => count + 1 + comment.replies.length, 0);
}

function renderComment(comment, isReply = false) {
  const initials = comment.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const sticker = comment.sticker ? `<div class="comment-sticker">${comment.sticker}</div>` : "";
  const replies = !isReply && comment.replies.length
    ? `<div class="comment-replies">${comment.replies.map((reply) => renderComment(reply, true)).join("")}</div>`
    : "";

  return `
    <article class="comment-item" data-comment-id="${comment.id}" data-comment-reply="${isReply ? "true" : "false"}">
      <span class="comment-avatar">${initials}</span>
      <div class="comment-bubble">
        <h3>${comment.name}</h3>
        <p>${comment.text}</p>
        ${sticker}
        <div class="comment-meta">
          <span>${comment.time}</span>
          ${isReply ? "" : `<button type="button" data-reply-comment="${comment.id}">Balas</button>`}
          ${comment.mine ? `<button type="button" data-delete-comment="${comment.id}">Hapus</button>` : ""}
          <button type="button" aria-label="Suka komentar"><i class="ph ph-heart" aria-hidden="true"></i></button>
        </div>
      </div>
      ${replies}
    </article>
  `;
}

function renderComments() {
  if (!commentList) return;

  commentList.innerHTML = articleComments.map((comment) => renderComment(comment)).join("");
  if (commentCount) commentCount.textContent = flattenCommentCount();
}

function openCommentSheet(event) {
  event?.preventDefault();
  if (!commentSheet) return;

  renderComments();
  commentSheet.setAttribute("aria-hidden", "false");
  commentSheet.classList.add("is-open");
  commentSheet.classList.remove("is-full");
  window.setTimeout(() => commentInput?.focus(), 260);
}

function closeCommentSheet(event) {
  event?.preventDefault();
  if (!commentSheet) return;

  commentSheet.classList.remove("is-open", "is-full");
  commentSheet.setAttribute("aria-hidden", "true");
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

function submitComment(event) {
  event.preventDefault();
  if (!commentInput) return;

  const text = commentInput.value.trim();
  if (!text) return;

  const comment = {
    id: commentIdCounter += 1,
    name: "Dian",
    text,
    time: "baru saja",
    mine: true,
    replies: [],
  };

  if (replyTargetId) {
    const parent = articleComments.find((item) => item.id === replyTargetId);
    parent?.replies.push(comment);
  } else {
    articleComments.unshift(comment);
  }

  commentInput.value = "";
  clearReplyTarget();
  renderComments();
  commentList?.scrollTo({ top: 0, behavior: "smooth" });
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
    return;
  }

  commentInput.value = `${commentInput.value}${commentInput.value ? " " : ""}${text}`;
  commentInput.focus();
}

function attachCommentSheetGesture() {
  if (!commentHandle || !commentSheet) return;

  let startY = 0;

  commentHandle.addEventListener("pointerdown", (event) => {
    startY = event.clientY;
    commentHandle.setPointerCapture?.(event.pointerId);
  });

  commentHandle.addEventListener("pointerup", (event) => {
    const delta = event.clientY - startY;
    if (delta < -24) {
      commentSheet.classList.add("is-full");
    } else if (delta > 42 && commentSheet.classList.contains("is-full")) {
      commentSheet.classList.remove("is-full");
    } else if (delta > 42) {
      closeCommentSheet();
    }
  });
}

