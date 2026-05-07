const menuBtn = document.querySelector("#menuBtn");
const mobileMenu = document.querySelector("#mobileMenu");
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

function toggleMenu() {
  const isOpen = mobileMenu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
}

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", toggleMenu);

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

function filterGallery(filter) {
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filter);
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

filterButtons.forEach((button) => {
  button.addEventListener("click", () => filterGallery(button.dataset.filter));
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

galleryItems.forEach((item) => observer.observe(item));
