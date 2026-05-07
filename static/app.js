/* ── Nav scroll glassmorphism ─────────────────────────────── */
const mainNav = document.querySelector("#mainNav");
if (mainNav) {
  const onScroll = () => {
    mainNav.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ── Mobile menu ──────────────────────────────────────────── */
const menuBtn    = document.querySelector("#menuBtn");
const mobileMenu = document.querySelector("#mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

/* ── Project filter ───────────────────────────────────────── */
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems  = document.querySelectorAll(".gallery-item");

function filterGallery(filter) {
  filterButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });

  galleryItems.forEach((item, index) => {
    const shouldShow = filter === "all" || item.dataset.category === filter;
    item.classList.remove("visible");
    item.style.display = shouldShow ? "inline-block" : "none";

    if (shouldShow) {
      item.style.animationDelay = `${index * 0.08}s`;
      requestAnimationFrame(() => item.classList.add("visible"));
    }
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => filterGallery(btn.dataset.filter));
});

/* ── Scroll-triggered card reveal ────────────────────────── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

galleryItems.forEach((item) => observer.observe(item));
