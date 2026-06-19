// =============================================================================
//  KOMPAS App — Selektor DOM, state global & data konstanta (fondasi — dimuat PERTAMA)
//  Pecahan dari app.js (per-fitur). Dimuat sebagai classic <script> berurutan
//  di index.html; semua file berbagi satu global scope.
// =============================================================================

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
const epaperLink = document.querySelector("[data-open-epaper]");
const epaperView = document.querySelector(".epaper-view");
const epaperBack = document.querySelector(".epaper-back");
const epaperScroll = document.querySelector(".epaper-scroll");
const originalTriggers = document.querySelectorAll("[data-open-original]");
const originalFrameView = document.querySelector(".original-frame-view");
const originalFrame = document.querySelector(".original-frame");
const originalBack = document.querySelector("[data-original-back]");
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
const articleLinks = document.querySelectorAll(".headline a, .story-card > a, .popular-item > a, .popular-copy > a, .business-card a, .short-video-heading, .short-video-card");
const articleLike = document.querySelector("[data-article-like]");
const appreciationView = document.querySelector(".appreciation-view");
const appreciationOpen = document.querySelector("[data-open-appreciation]");
const appreciationClose = document.querySelector("[data-close-appreciation]");
const appreciationTabs = document.querySelectorAll("[data-appreciation-tab]");
const appreciationPanels = document.querySelectorAll("[data-appreciation-panel]");
const appreciationInputs = document.querySelectorAll(".appreciation-panel input[type='radio']");
const appreciationSubmit = document.querySelector("[data-appreciation-submit]");
const appreciationLoginDrawer = document.querySelector("[data-appreciation-login-drawer]");
const appreciationLoginClose = document.querySelector("[data-close-appreciation-login]");
const appreciationLoginGoogle = document.querySelector("[data-appreciation-login-google]");
const appreciationPaymentDrawer = document.querySelector("[data-appreciation-payment-drawer]");
const appreciationPaymentClose = document.querySelector("[data-close-appreciation-payment]");
const appreciationPaymentTotal = document.querySelector("[data-appreciation-payment-total]");
const googlePayButton = document.querySelector("[data-pay-google]");
const transactionSuccessView = document.querySelector(".transaction-success-view");
const successBackArticle = document.querySelector("[data-success-back-article]");
const homeLink = document.querySelector("[data-open-home]");
const eventLink = document.querySelector("[data-open-event]");
const eventView = document.querySelector(".event-view");
const eventScroll = document.querySelector(".event-scroll");
const eventCards = document.querySelectorAll("[data-open-event-detail]");
const eventDetailView = document.querySelector(".event-detail-view");
const eventDetailScroll = document.querySelector(".event-detail-scroll");
const eventDetailMainCta = document.querySelector(".event-detail-main [data-open-ticket-select]");
const eventDetailBack = document.querySelector("[data-event-detail-back]");
const ticketSelectView = document.querySelector(".ticket-select-view");
const ticketBack = document.querySelector("[data-ticket-back]");
const orderDetailView = document.querySelector(".order-detail-view");
const orderBack = document.querySelector("[data-order-back]");
const ticketOpenButtons = document.querySelectorAll("[data-open-ticket-select]");
const orderOpenButton = document.querySelector("[data-open-order-detail]");
const ticketPlusButtons = document.querySelectorAll("[data-ticket-plus]");
const ticketMinusButtons = document.querySelectorAll("[data-ticket-minus]");
const ticketTotal = document.querySelector("[data-ticket-total]");
const ticketSummaryLabel = document.querySelector("[data-ticket-summary-label]");
const orderTotal = document.querySelector("[data-order-total]");
const orderRegular = document.querySelector("[data-order-regular]");
const orderVip = document.querySelector("[data-order-vip]");
const accountLink = document.querySelector("[data-open-account]");
const accountView = document.querySelector(".account-view");
const accountScroll = document.querySelector(".account-scroll");
const loginDrawerOpen = document.querySelector("[data-open-login-drawer]");
const loginDrawer = document.querySelector("[data-login-drawer]");
const loginDrawerClose = document.querySelector("[data-close-login-drawer]");
const googleLoginButton = document.querySelector("[data-login-google]");
const accountAvatar = document.querySelector("[data-account-avatar]");
const accountName = document.querySelector("[data-account-name]");
const accountEmail = document.querySelector("[data-account-email]");
const accountProfile = document.querySelector("[data-account-profile]");
const accountLoginCaret = document.querySelector("[data-account-login-caret]");
const accountReward = document.querySelector("[data-account-reward]");
const accountVoucher = document.querySelector("[data-account-voucher]");
const accountDetailView = document.querySelector(".account-detail-view");
const accountDetailBack = document.querySelector("[data-account-detail-back]");
const accountDetailTitle = document.querySelector("[data-account-detail-title]");
const accountDetailOpeners = document.querySelectorAll("[data-open-account-detail]");
const accountDetailPanels = document.querySelectorAll("[data-account-detail-panel]");
const accountDetailFilter = document.querySelector("[data-account-detail-filter]");
const accountDetailHistory = document.querySelector("[data-account-detail-history]");
const commentOpen = document.querySelector("[data-open-comments]");
const commentSheet = document.querySelector("[data-comment-sheet]");
const commentCloseButtons = document.querySelectorAll("[data-close-comments]");
const commentHandle = document.querySelector("[data-comment-handle]");
const commentList = document.querySelector("[data-comment-list]");
const commentCount = document.querySelector("[data-comment-count]");
const commentForm = document.querySelector("[data-comment-form]");
const commentInput = document.querySelector("[data-comment-input]");
const commentTools = document.querySelector("[data-comment-tools]");
const commentToolToggles = document.querySelectorAll("[data-toggle-comment-tools]");
const commentReplying = document.querySelector("[data-comment-replying]");
const cancelReply = document.querySelector("[data-cancel-reply]");
const aiLink = document.querySelector("[data-open-ai]");
const aiView = document.querySelector(".ai-chat-view");
const aiBackButtons = document.querySelectorAll("[data-close-ai]");
const karinAnswerClose = document.querySelector("[data-close-karin-answer]");
const aiChatScroll = document.querySelector(".ai-chat-scroll");
const aiMessages = document.querySelector(".ai-messages");
const aiComposer = document.querySelector(".ai-composer");
const aiInput = document.querySelector('.ai-composer textarea[name="message"], .ai-composer input[name="message"]');
const aiSuggestions = document.querySelectorAll(".karin-chat-suggestions button, .ai-suggestions button");
const karinQuestionBubble = document.querySelector(".karin-answer-question");
const karinFeedbackTrigger = document.querySelector(".karin-feedback-trigger");
const karinFeedbackModal = document.querySelector("[data-karin-feedback-modal]");
const karinFeedbackImage = document.querySelector("[data-karin-feedback-image]");
const karinFeedbackCloseButtons = document.querySelectorAll("[data-karin-feedback-close], [data-karin-feedback-submit]");
const karinFeedbackOption = document.querySelector("[data-karin-feedback-option]");
const businessArticleSeed = Array.from(document.querySelectorAll(".business-card")).slice(0, 5);
let businessIsAppending = false;
let businessBatch = 0;
let audioMode = "podcast";
let articleUtterance = null;
let articleSpeechState = "idle";
let replyTargetId = null;
let commentIdCounter = 20;
let originalFrameHistory = [];
let originalFrameIsGoingBack = false;
let karinWordsPrepared = false;
const localArticleImages = [
  "assets/artikel/6721b39dbc909.jpg",
  "assets/artikel/6723b39a05e45.jpg",
  "assets/artikel/674f456bd4a46.jpg",
  "assets/artikel/69aa8b28a8d41.jpg",
  "assets/artikel/69e2ee654c9fe.jpg",
  "assets/artikel/69f07cf452b05.jpg",
  "assets/artikel/69f9df10ecc49.jpeg",
  "assets/artikel/69f9f62da8c5e.jpeg",
  "assets/artikel/69fd3040d1921.png",
  "assets/artikel/69fdc103851c9.jpeg",
  "assets/artikel/69fef674cd45a.jpg",
  "assets/artikel/69ff045686fdc.jpeg",
];
const ticketCounts = { regular: 0, vip: 0 };
const ticketPrices = { regular: 200000, vip: 400000 };
let accountLoggedIn = window.localStorage?.getItem("kompasAccountLoggedIn") === "true";
const accountDetailTitles = {
  history: "Konten disukai",
  liked: "Konten disukai",
  saved: "Konten disimpan",
  transactions: "Transaksi",
  tickets: "Tiketmu",
};
const contentHistoryItems = [
  { type: "Artikel", title: "Prabowo Hadiahkan Vas dan Miniatur Candi Borobudur untuk Putin", image: "assets/artikel/6721b39dbc909.jpg" },
  { type: "Video", title: "Trump Klaim Iran \"Telepon\" AS, Ingin Segera Capai Kesepakatan", image: "assets/artikel/69f07cf452b05.jpg", video: true },
  { type: "Artikel", title: "Imigrasi Tangkap 346 WNA, Paling Banyak dari China", image: "assets/artikel/69fdc103851c9.jpeg" },
  { type: "Audio", title: "Prabowo-Putin Bertemu Empat Mata Selama 3 Jam, Ini yang Dibahas!", image: "assets/podcast-cover-morning-brief.png", audio: true },
  { type: "Artikel", title: "Lulusan Kampus Bergengsi China Kini Lincar Kerjaan Pabrik, Ini Alasannya", image: "assets/artikel/69e2ee654c9fe.jpg" },
];
const podcastThumbnailImages = [
  "assets/podcast-thumb-1.png",
  "assets/podcast-thumb-2.png",
  "assets/podcast-thumb-3.png",
  "assets/podcast-thumb-4.png",
  "assets/podcast-thumb-5.png",
];
let articleComments = [
  {
    id: 1,
    name: "Rani Putri",
    text: "Pembahasan pajak seperti ini perlu dibuka lebih sering supaya publik paham konteksnya.",
    time: "2 menit",
    mine: false,
    replies: [{ id: 8, name: "Dian", text: "Setuju, apalagi kalau ada data pembandingnya.", time: "baru saja", mine: true }],
  },
  { id: 2, name: "Bima Arya", text: "Kalimat narasumbernya cukup kuat, menarik kalau ada respons resmi dari instansi terkait.", time: "6 menit", mine: false, replies: [] },
  { id: 3, name: "Dian", text: "Saya simpan dulu artikelnya.", time: "9 menit", mine: true, replies: [] },
];
const appreciationBenefitItems = {
  basic: [
    { text: "Mendukung tim redaksi KOMPAS.com", strong: true, active: true },
    { text: "Tanpa iklan dan artikel utuh", active: true },
    { text: "Akses konten Original tanpa batas", active: false },
    { text: "Akses Podcast eksklusif, Newsletter penuh insight dan game Croz/Word tanpa batas", active: false },
    { text: "Akses Kontan & harian kompas", active: false },
  ],
  plus: [
    { text: "Mendukung tim redaksi KOMPAS.com", strong: true, active: true },
    { text: "Tanpa iklan dan artikel utuh", active: true },
    { text: "Akses konten Original tanpa batas", active: true },
    { text: "Akses Podcast eksklusif, Newsletter penuh insight dan game Croz/Word tanpa batas", active: true },
    { text: "Akses Kontan & harian kompas", active: false },
  ],
  premium: [
    { text: "Mendukung tim redaksi KOMPAS.com", strong: true, active: true },
    { text: "Tanpa iklan dan artikel utuh", active: true },
    { text: "Akses konten Original tanpa batas", active: true },
    { text: "Akses Podcast eksklusif, Newsletter penuh insight dan game Croz/Word tanpa batas", active: true },
    { text: "Akses Kontan & harian kompas", active: true },
  ],
};

const pageStatusColors = {
  home: "#edf1ff",
  account: "#eef2ff",
  event: "#edf1ff",
  default: "#ffffff",
  dark: "#8f7789",
};

