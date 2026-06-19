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
cancelReply?.addEventListener("click", clearReplyTarget);
commentToolToggles.forEach((button) => {
  button.addEventListener("click", () => {
    if (commentTools) commentTools.hidden = !commentTools.hidden;
    commentSheet?.classList.add("is-full");
  });
});
commentTools?.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target.closest("button") : null;
  if (!target) return;
  if (target.dataset.commentEmoji) addCommentText(target.dataset.commentEmoji);
  if (target.dataset.commentSticker) addCommentText(target.dataset.commentSticker, { sticker: true });
});
commentList?.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const replyButton = target?.closest("[data-reply-comment]");
  const deleteButton = target?.closest("[data-delete-comment]");
  if (replyButton) setReplyTarget(replyButton.dataset.replyComment);
  if (deleteButton) deleteComment(deleteButton.dataset.deleteComment);
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
