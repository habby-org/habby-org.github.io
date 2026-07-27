const downloadSection = document.querySelector("#download");
const downloadTriggers = document.querySelectorAll("[data-scroll-download]");
const sectionLinks = [...document.querySelectorAll("[data-section-link]")];
const sections = [...document.querySelectorAll("[data-section]")];
const storeStatus = document.querySelector("#store-status");

downloadTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    downloadSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const activeSectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

    if (!visibleEntry) return;

    sectionLinks.forEach((link) => {
      const isActive = link.hash === `#${visibleEntry.target.id}`;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  },
  { threshold: [0.45, 0.6, 0.75] },
);

sections.forEach((section) => activeSectionObserver.observe(section));

document.querySelectorAll("[data-coming-soon]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!storeStatus) return;

    storeStatus.classList.remove("is-highlighted");
    requestAnimationFrame(() => storeStatus.classList.add("is-highlighted"));
  });
});
