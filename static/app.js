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

/* ── Scroll-triggered reveals ────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

// project cards
galleryItems.forEach((item) => revealObserver.observe(item));

// cert cards
document.querySelectorAll(".cert-card").forEach((el, i) => {
  el.style.animationDelay = `${i * 0.08}s`;
  revealObserver.observe(el);
});

// blog featured + list items
document.querySelectorAll(".blog-featured, .blog-list-item").forEach((el, i) => {
  if (el.classList.contains("blog-list-item")) {
    el.style.transitionDelay = `${i * 0.07}s`;
  }
  revealObserver.observe(el);
});

/* ── Stat counters ───────────────────────────────────────── */
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      item.classList.add("revealed");
      const counter = item.querySelector(".counter");
      if (!counter) return;
      const target = parseInt(counter.dataset.target, 10);
      const duration = 1200;
      const start = performance.now();
      const animate = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(animate);
        else counter.textContent = target;
      };
      requestAnimationFrame(animate);
      statObserver.unobserve(item);
    });
  },
  { threshold: 0.3 }
);
document.querySelectorAll(".stat-item").forEach((el) => statObserver.observe(el));

/* ── Skill bar animations ────────────────────────────────── */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector(".skill-chip-level-fill");
        if (fill) {
          const w = fill.style.getPropertyValue("--w") || "0.7";
          fill.style.width = `${parseFloat(w) * 100}%`;
        }
        entry.target.classList.add("revealed");
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".skill-chip").forEach((chip, i) => {
  chip.style.transitionDelay = `${i * 0.04}s`;
  skillObserver.observe(chip);
});
