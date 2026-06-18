/* reveal.js — fade-up on scroll (IntersectionObserver).
   Progressive enhancement: without JS everything stays visible. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  items.forEach(function (el) { io.observe(el); });

  /* fail-safe: never leave content hidden (print/export) */
  window.setTimeout(function () {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }, 2600);
})();
