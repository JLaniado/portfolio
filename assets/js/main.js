(function () {
  const nav = document.querySelector(".site-nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Only one experience card open at a time — closing the others keeps the
  // "resume at a glance" collapsed state legible instead of the page growing unbounded.
  const roleCards = document.querySelectorAll(".role-card");
  roleCards.forEach((card) => {
    card.addEventListener("toggle", () => {
      if (card.open) {
        roleCards.forEach((other) => {
          if (other !== card) other.open = false;
        });
      }
    });
  });
})();
