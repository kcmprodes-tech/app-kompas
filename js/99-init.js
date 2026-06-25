// =============================================================================
//  KOMPAS App — Pemasangan event listener & bootstrap (dimuat TERAKHIR)
//  Pecahan dari app.js (per-fitur). Dimuat sebagai classic <script> berurutan
//  di index.html; semua file berbagi satu global scope.
// =============================================================================

placeholderLinks.forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});
navItems.forEach((item) => item.addEventListener("click", setActiveNav));
homeLink?.addEventListener("click", openHomeView);
eventLink?.addEventListener("click", openEventView);
eventCards.forEach((card) => card.addEventListener("click", openEventDetailView));
eventDetailBack?.addEventListener("click", closeEventDetailView);
ticketOpenButtons.forEach((button) => button.addEventListener("click", openTicketSelectView));
ticketBack?.addEventListener("click", closeTicketSelectView);
orderBack?.addEventListener("click", closeOrderDetailView);
orderOpenButton?.addEventListener("click", openOrderDetailView);
ticketPlusButtons.forEach((button) => {
  button.addEventListener("click", () => changeTicketCount(button.dataset.ticketPlus, 1));
});
ticketMinusButtons.forEach((button) => {
  button.addEventListener("click", () => changeTicketCount(button.dataset.ticketMinus, -1));
});
optionButtons.forEach((button) => button.addEventListener("click", pulseOption));
businessLink?.addEventListener("click", openBusinessView);
businessBack?.addEventListener("click", closeBusinessView);
epaperLink?.addEventListener("click", openEpaperView);
epaperBack?.addEventListener("click", closeEpaperView);
originalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", openOriginalView);
  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") openOriginalView(event);
  });
});
originalBack?.addEventListener("click", goBackOriginalView);
originalFrame?.addEventListener("load", syncOriginalHeaderState);
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
articleLinks.forEach((link) => {
  link.addEventListener("click", openArticleView);
  link.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") openArticleView(event);
  });
});
articleLike?.addEventListener("click", toggleArticleLike);
commentOpen?.addEventListener("click", openCommentSheet);
commentCloseButtons.forEach((button) => button.addEventListener("click", closeCommentSheet));
commentForm?.addEventListener("submit", submitComment);
cancelReply?.addEventListener("click", () => {
  const wasEditing = editingCommentId !== null;
  clearReplyTarget();
  if (wasEditing && commentInput) {
    commentInput.value = "";
    autoGrowComment();
    updateCommentSendState();
  }
});
commentInput?.addEventListener("focus", () => commentForm?.classList.add("is-focused"));
commentInput?.addEventListener("blur", () => {
  window.setTimeout(() => {
    if (commentForm && !commentInput.value.trim() && !commentForm.contains(document.activeElement) && !commentForm.classList.contains("is-picker")) {
      commentForm.classList.remove("is-focused");
    }
  }, 130);
});
commentInput?.addEventListener("input", () => {
  autoGrowComment();
  updateCommentSendState();
});
commentList?.addEventListener("scroll", closeCommentMenu, { passive: true });
commentToolToggles.forEach((button) => button.addEventListener("click", () => commentInput?.focus()));
loadCommentRecents();
document.querySelectorAll("[data-toggle-picker]").forEach((button) => {
  button.addEventListener("click", () => {
    const picker = document.querySelector("[data-comment-picker]");
    if (picker && !picker.hidden) closeCommentPicker(true);
    else openCommentPicker();
  });
});
document.querySelectorAll("[data-open-emoji]").forEach((button) => {
  button.addEventListener("click", () => openCommentPicker("emoji"));
});
document.querySelector("[data-picker-body]")?.addEventListener("scroll", () => window.requestAnimationFrame(updateStickerActiveTab), { passive: true });
document.querySelector("[data-picker-tabs]")?.addEventListener("click", (event) => {
  const tab = event.target instanceof Element ? event.target.closest("[data-picker-tab]") : null;
  if (tab) switchPickerTab(tab.dataset.pickerTab);
});
document.querySelector("[data-picker-body]")?.addEventListener("click", (event) => {
  const el = event.target instanceof Element ? event.target : null;
  const emojiBtn = el?.closest("[data-pick-emoji]");
  const stickerBtn = el?.closest("[data-pick-sticker]");
  if (emojiBtn) {
    addCommentText(emojiBtn.dataset.pickEmoji);
    pushRecentEmoji(emojiBtn.dataset.pickEmoji);
  } else if (stickerBtn) {
    sendSticker(stickerBtn.dataset.pickSticker);
    pushRecentSticker(stickerBtn.dataset.pickSticker);
    closeCommentPicker();
  }
});
commentForm?.addEventListener("click", (event) => {
  const emoji = event.target instanceof Element ? event.target.closest("[data-comment-emoji]") : null;
  if (emoji) addCommentText(emoji.dataset.commentEmoji);
});
commentList?.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const replyButton = target?.closest("[data-reply-comment]");
  const deleteButton = target?.closest("[data-delete-comment]");
  const repliesToggle = target?.closest("[data-toggle-replies]");
  const likeButton = target?.closest(".comment-like");
  const kebab = target?.closest(".comment-kebab");
  if (replyButton) setReplyTarget(replyButton.dataset.replyComment);
  if (deleteButton) deleteComment(deleteButton.dataset.deleteComment);
  if (repliesToggle) {
    const id = repliesToggle.dataset.toggleReplies;
    const block = commentList.querySelector(`.comment-replies[data-replies-for="${id}"]`);
    if (block) {
      const willOpen = block.hidden;
      block.hidden = !willOpen;
      repliesToggle.classList.toggle("is-open", willOpen);
    }
  }
  if (likeButton) {
    const span = likeButton.querySelector("span");
    const icon = likeButton.querySelector("i");
    const liked = likeButton.classList.toggle("is-liked");
    if (icon) {
      icon.classList.toggle("ph", !liked);
      icon.classList.toggle("ph-fill", liked);
    }
    if (span) span.textContent = String(Math.max(0, Number(span.textContent || 0) + (liked ? 1 : -1)));
  }
  if (kebab) {
    const item = kebab.closest(".comment-item");
    const id = item?.dataset.commentId;
    const comment = findComment(id);
    const items = comment && comment.mine
      ? [
          { label: "Edit", action: "edit", arg: id, icon: "ph-pencil-simple" },
          { label: "Hapus komentar", action: "delete", arg: id, icon: "ph-trash", danger: true },
        ]
      : [{ label: "Laporkan komentar", action: "report", arg: id, icon: "ph-flag" }];
    openCommentMenu(items, kebab);
  }
});

const commentSortBtn = document.querySelector("[data-sort-comments]");
const commentMenuEl = document.querySelector("[data-comment-menu]");
const COMMENT_SORT_ITEMS = [
  { label: "Terbaru", action: "sort", arg: "new", icon: "ph-clock" },
  { label: "Terlama", action: "sort", arg: "old", icon: "ph-clock-counter-clockwise" },
  { label: "Terpopuler", action: "sort", arg: "pop", icon: "ph-fire" },
];
commentSortBtn?.addEventListener("click", (event) => {
  const items = COMMENT_SORT_ITEMS.map((it) => ({ ...it, active: it.arg === commentSort }));
  openCommentMenu(items, event.currentTarget);
});
commentMenuEl?.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("[data-menu-action]") : null;
  if (!button) return;
  const { menuAction, menuArg } = button.dataset;
  closeCommentMenu();
  if (menuAction === "sort") sortComments(menuArg);
  else if (menuAction === "edit") startEditComment(menuArg);
  else if (menuAction === "delete") deleteComment(menuArg);
  else if (menuAction === "report") showCommentToast("Komentar dilaporkan");
});
document.addEventListener("click", (event) => {
  const t = event.target instanceof Element ? event.target : null;
  if (!t || !commentMenuEl || commentMenuEl.hidden) return;
  if (t.closest("[data-comment-menu]") || t.closest("[data-sort-comments]") || t.closest(".comment-kebab")) return;
  closeCommentMenu();
});
document.querySelectorAll('button[aria-label^="Bagikan"]').forEach((button) => {
  button.addEventListener("click", (event) => { event.preventDefault(); openShareSheet(); });
});
const shareSheetEl = document.querySelector("[data-share-sheet]");
shareSheetEl?.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;
  if (target.closest("[data-close-share]")) closeShareSheet();
  else if (target.closest("[data-copy-link]")) copyShareLink(target.closest("[data-copy-link]"));
  else if (target.closest("[data-native-share]")) nativeShare();
  else if (target.closest("[data-share-net]")) shareTo(target.closest("[data-share-net]").dataset.shareNet);
});
appreciationOpen?.addEventListener("click", openAppreciationView);
appreciationClose?.addEventListener("click", closeAppreciationView);
appreciationTabs.forEach((tab) => {
  tab.addEventListener("click", () => setAppreciationTab(tab.dataset.appreciationTab));
});
appreciationInputs.forEach((input) => {
  input.addEventListener("change", updateAppreciationSelection);
});
appreciationSubmit?.addEventListener("click", submitAppreciation);
appreciationLoginClose?.addEventListener("click", closeAppreciationLoginDrawer);
appreciationLoginGoogle?.addEventListener("click", loginAppreciationWithGoogle);
appreciationPaymentClose?.addEventListener("click", closeAppreciationPaymentDrawer);
googlePayButton?.addEventListener("click", openTransactionSuccess);
successBackArticle?.addEventListener("click", closeTransactionSuccessToArticle);
aiLink?.addEventListener("click", openAiView);
accountLink?.addEventListener("click", openAccountView);
accountDetailOpeners.forEach((link) => link.addEventListener("click", openAccountDetail));
accountDetailBack?.addEventListener("click", closeAccountDetail);
loginDrawerOpen?.addEventListener("click", openLoginDrawer);
loginDrawerClose?.addEventListener("click", closeLoginDrawer);
googleLoginButton?.addEventListener("click", loginWithGoogle);
aiBackButtons.forEach((button) => button.addEventListener("click", closeAiView));
karinAnswerClose?.addEventListener("click", closeKarinAnswerToIndex);
aiComposer?.addEventListener("submit", submitAiMessage);
aiInput?.addEventListener("input", syncAiComposer);
aiInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    submitAiMessage(event);
  }
});
aiSuggestions.forEach((button) => {
  button.addEventListener("click", () => {
    if (!aiInput) return;
    aiInput.value = button.textContent.trim();
    syncAiComposer();
    openKarinAnswer(button.textContent.trim());
  });
});
karinFeedbackTrigger?.addEventListener("click", openKarinFeedback);
karinFeedbackOption?.addEventListener("click", activateKarinFeedback);
karinFeedbackCloseButtons.forEach((button) => button.addEventListener("click", closeKarinFeedback));
karinFeedbackModal?.addEventListener("click", (event) => {
  if (event.target === karinFeedbackModal) closeKarinFeedback(event);
});
feedScroll?.addEventListener("scroll", syncHeaderState, { passive: true });
eventScroll?.addEventListener("scroll", syncEventHeaderState, { passive: true });
eventDetailScroll?.addEventListener("scroll", syncEventDetailCtaState, { passive: true });
businessScroll?.addEventListener("scroll", handleBusinessScroll, { passive: true });
window.addEventListener("hashchange", syncRoute);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && loginDrawer?.classList.contains("is-open")) {
    closeLoginDrawer(event);
  }
  if (event.key === "Escape" && commentSheet?.classList.contains("is-open")) {
    closeCommentSheet(event);
  }
});
syncHeaderState();
syncEventHeaderState();
syncEventDetailCtaState();
updateTicketSummary();
applyAccountState();
updateAppreciationSelection();
randomizeArticleImages();
randomizePodcastThumbnails();
renderContentHistoryLists();
renderComments();
attachDrawerHandleGestures();
attachCommentSheetGesture();
playSkeleton(phoneApp);
syncRoute();

// Fallback: pastikan mode native full-screen aktif (cadangan bila skrip di <head> terlewat).
if ("Capacitor" in window) {
  document.documentElement.classList.add("native");
  if (typeof window.Capacitor.getPlatform === "function") {
    document.documentElement.classList.add(`platform-${window.Capacitor.getPlatform()}`);
  }
}

if ("Capacitor" in window && "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
  if ("caches" in window) {
    caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
  }
} else if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
