const navItems = document.querySelectorAll(".bottom-nav a");
const optionButtons = document.querySelectorAll(".story-meta button");
const placeholderLinks = document.querySelectorAll('a[href="#"]');
const phoneApp = document.querySelector(".phone-app");
const feedScroll = document.querySelector(".feed-scroll");

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

placeholderLinks.forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});
navItems.forEach((item) => item.addEventListener("click", setActiveNav));
optionButtons.forEach((button) => button.addEventListener("click", pulseOption));
feedScroll?.addEventListener("scroll", syncHeaderState, { passive: true });
syncHeaderState();
