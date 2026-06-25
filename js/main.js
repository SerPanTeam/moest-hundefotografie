/* main.js — header scroll state, mobile drawer, FAQ accordion, contact form.
   Vanilla, no dependencies. Hooks via data-* attributes. */
(function () {
  "use strict";

  /* sticky header background + mobile quick-contact bar */
  var header = document.querySelector("[data-site-header]");
  var mobileCta = document.querySelector("[data-mobile-cta]");
  var ctaSection = document.querySelector("#contact"); /* in-page primary contact CTA section */
  if (header || mobileCta) {
    var onScroll = function () {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 40);
      if (mobileCta) {
        /* hide the sticky bar while the in-section contact CTA is on screen -> avoids stacked duplicate CTAs */
        var inContact = false;
        if (ctaSection) { var r = ctaSection.getBoundingClientRect(); inContact = r.top < window.innerHeight && r.bottom > 0; }
        mobileCta.classList.toggle("is-visible", window.scrollY > 560 && !inContact);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* mobile drawer */
  var toggle = document.querySelector("[data-nav-toggle]");
  var drawer = document.querySelector("[data-nav-drawer]");
  if (toggle && drawer) {
    var lastFocus = null;
    var setOpen = function (open) {
      if (open) lastFocus = document.activeElement;
      drawer.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
      document.body.style.overflow = open ? "hidden" : "";
      if (open) {
        var firstLink = drawer.querySelector("a");
        if (firstLink) firstLink.focus();
      } else if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus();
      }
    };
    toggle.addEventListener("click", function () { setOpen(!drawer.classList.contains("is-open")); });
    drawer.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) setOpen(false);
      if (e.key !== "Tab" || !drawer.classList.contains("is-open")) return;
      var focusable = drawer.querySelectorAll("a, button");
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* FAQ accordion */
  document.querySelectorAll("[data-faq-item]").forEach(function (item, index) {
    var btn = item.querySelector("[data-faq-q]");
    var panel = item.querySelector("[data-faq-a]");
    if (!btn || !panel) return;
    var panelId = panel.id || "faq-panel-" + (index + 1);
    panel.id = panelId;
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", panelId);
    btn.addEventListener("click", function () {
      var open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
    });
  });

  /* contact form */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var hp = form.querySelector("[data-hp]");
      if (hp && hp.value) { return; } // Honeypot: Bot erkannt -> still verwerfen
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var submit = form.querySelector("[data-form-submit]");
      if (submit) {
        submit.disabled = true;
        submit.innerHTML = 'Anfrage gesendet <span class="button__arrow" aria-hidden="true">→</span>';
      }
      var note = form.querySelector("[data-form-success]");
      if (note) {
        var rm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        note.hidden = false;
        note.setAttribute("tabindex", "-1");
        note.scrollIntoView({ behavior: rm ? "auto" : "smooth", block: "center" });
        note.focus();
      }
      if (submit) {
        setTimeout(function () {
          submit.disabled = false;
          submit.innerHTML = 'Anfrage senden <span class="button__arrow" aria-hidden="true">&#8594;</span>';
        }, 6000);
      }
    });
  }

  /* reveal animations */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (revealItems.length) {
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach(function (item) { item.classList.add("is-visible"); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

      revealItems.forEach(function (item) { revealObserver.observe(item); });

      window.addEventListener("load", function () {
        revealItems.forEach(function (item) {
          var rect = item.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) item.classList.add("is-visible");
        });
      });
    }
  }

  /* portfolio gallery filters */
  var gallery = document.querySelector("[data-gallery]");
  var filters = document.querySelectorAll("[data-gallery-filter]");
  if (gallery && filters.length) {
    var filterItems = Array.prototype.slice.call(gallery.querySelectorAll("[data-gallery-item]"));
    var liveStatus = document.createElement("p");
    liveStatus.setAttribute("aria-live", "polite");
    liveStatus.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap";
    gallery.parentNode.insertBefore(liveStatus, gallery);
    filters.forEach(function (filter) {
      filter.addEventListener("click", function () {
        var value = filter.getAttribute("data-gallery-filter");
        filters.forEach(function (btn) {
          var active = btn === filter;
          btn.classList.toggle("is-active", active);
          btn.setAttribute("aria-pressed", active ? "true" : "false");
        });
        var shown = 0;
        filterItems.forEach(function (item) {
          var cats = (item.getAttribute("data-category") || "").split(/\s+/);
          var show = value === "all" || cats.indexOf(value) !== -1;
          item.classList.toggle("is-hidden", !show);
          if (show) shown++;
        });
        liveStatus.textContent = shown + " Bilder";
      });
    });
  }

  /* portfolio lightbox */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll("[data-gallery-item]"));
  if (galleryItems.length) {
    var lightbox = document.createElement("div");
    lightbox.className = "gallery-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Portfolio Bildansicht");
    lightbox.innerHTML =
      '<button class="gallery-lightbox__close" type="button" aria-label="Ansicht schließen">×</button>' +
      '<button class="gallery-lightbox__nav gallery-lightbox__nav--prev" type="button" aria-label="Vorheriges Bild">‹</button>' +
      '<figure class="gallery-lightbox__figure"><img class="gallery-lightbox__img" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" alt="" /></figure>' +
      '<button class="gallery-lightbox__nav gallery-lightbox__nav--next" type="button" aria-label="Nächstes Bild">›</button>' +
      '<div class="gallery-lightbox__caption"></div>';
    document.body.appendChild(lightbox);

    var lbImg = lightbox.querySelector(".gallery-lightbox__img");
    var lbCaption = lightbox.querySelector(".gallery-lightbox__caption");
    var lbClose = lightbox.querySelector(".gallery-lightbox__close");
    var lbPrev = lightbox.querySelector(".gallery-lightbox__nav--prev");
    var lbNext = lightbox.querySelector(".gallery-lightbox__nav--next");
    var activeIndex = 0;
    var lastFocus = null;
    var updateLightboxControls = function () {
      if (!lightbox.classList.contains("is-open")) return;
      var rect = lbImg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var gap = window.innerWidth < 720 ? 10 : 18;
      var buttonSize = window.innerWidth < 720 ? 48 : 56;
      var minPad = window.innerWidth < 720 ? 14 : 24;
      var maxLeft = window.innerWidth - buttonSize - minPad;
      var prevLeft = Math.max(minPad, rect.left - buttonSize - gap);
      var nextLeft = Math.min(maxLeft, rect.right + gap);
      var navTop = rect.top + rect.height / 2;
      lightbox.style.setProperty("--lb-prev-left", Math.round(prevLeft) + "px");
      lightbox.style.setProperty("--lb-next-left", Math.round(nextLeft) + "px");
      lightbox.style.setProperty("--lb-nav-top", Math.round(navTop) + "px");
    };

    var visibleGalleryItems = function () {
      return galleryItems.filter(function (item) { return !item.classList.contains("is-hidden"); });
    };
    var showItem = function (index) {
      var visible = visibleGalleryItems();
      if (!visible.length) return;
      activeIndex = (index + visible.length) % visible.length;
      var item = visible[activeIndex];
      var img = item.querySelector("img");
      lbImg.src = item.getAttribute("href");
      lbImg.alt = img ? img.alt : "";
      lightbox.setAttribute("aria-label", (img && img.alt) ? img.alt : "Portfolio Bildansicht");
      lbCaption.textContent = item.getAttribute("data-gallery-title") || "";
      if (lbImg.complete) window.requestAnimationFrame(updateLightboxControls);
    };
    var openLightbox = function (item) {
      var visible = visibleGalleryItems();
      activeIndex = Math.max(0, visible.indexOf(item));
      showItem(activeIndex);
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      lastFocus = item;
      window.requestAnimationFrame(updateLightboxControls);
      setTimeout(function () { lbClose.focus(); }, 60);
    };
    var closeLightbox = function () {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    galleryItems.forEach(function (item) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        openLightbox(item);
      });
    });
    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", function () { showItem(activeIndex - 1); });
    lbNext.addEventListener("click", function () { showItem(activeIndex + 1); });
    lbImg.addEventListener("load", updateLightboxControls);
    window.addEventListener("resize", updateLightboxControls);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showItem(activeIndex - 1);
      if (e.key === "ArrowRight") showItem(activeIndex + 1);
      if (e.key === "Tab") {
        var f = [lbClose, lbPrev, lbNext];
        var idx = f.indexOf(document.activeElement);
        e.preventDefault();
        var ni = e.shiftKey ? (idx <= 0 ? f.length - 1 : idx - 1) : (idx + 1) % f.length;
        f[ni].focus();
      }
    });
  }
})();
