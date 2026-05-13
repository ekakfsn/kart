const navLinks = [...document.querySelectorAll(".route-nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean)
  .sort((a, b) => a.offsetTop - b.offsetTop);
const toTopButton = document.querySelector(".to-top");
const mapStage = document.querySelector(".map-stage");
const mainMap = document.querySelector(".main-map");
const cursorGlow = document.querySelector(".cursor-glow");
const revealCards = document.querySelectorAll(".reveal-card");
const counters = document.querySelectorAll("[data-count]");

const setActiveLink = () => {
  let currentSection = null;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.36) {
      currentSection = section;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      "is-active",
      currentSection && link.getAttribute("href") === `#${currentSection.id}`,
    );
  });
};

const toggleTopButton = () => {
  toTopButton.classList.toggle("is-visible", window.scrollY > 520);
};

window.addEventListener("scroll", () => {
  setActiveLink();
  toggleTopButton();
});

window.addEventListener("pointermove", (event) => {
  cursorGlow.style.opacity = "1";
  cursorGlow.style.transform = `translate(${event.clientX - 140}px, ${event.clientY - 140}px)`;
});

window.addEventListener("pointerleave", () => {
  cursorGlow.style.opacity = "0";
});

toTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

mapStage.addEventListener("pointermove", (event) => {
  const rect = mapStage.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;

  mainMap.style.transform = `rotate(${2 + x * 2}deg) translate(${x * 10}px, ${y * 10}px)`;
});

mapStage.addEventListener("pointerleave", () => {
  mainMap.style.transform = "";
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 },
);

revealCards.forEach((card, index) => {
  card.style.transitionDelay = `${Math.min(index * 60, 360)}ms`;
  revealObserver.observe(card);
});

const animateCounter = (counter) => {
  const target = Number(counter.dataset.count);
  const duration = 1200;
  const start = performance.now();

  const tick = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    counter.textContent = Math.round(target * eased);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.8 },
);

counters.forEach((counter) => counterObserver.observe(counter));

setActiveLink();
toggleTopButton();
