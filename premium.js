/* ============================================================
   CHOUDHRY SONS EXPORTS — PREMIUM LAYER (premium.js)
   Unified header/footer injection + luxury interactions.
   Loads BEFORE app.js so the injected #site-header/#main-nav
   exist for app.js's header/mobile-menu/active-nav init.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Config ---------- */
  var CATEGORIES = [
    { label: 'Decor',          href: 'decor.html' },
    { label: 'Furniture',      href: 'furniture.html' },
    { label: 'Mirrors & Art',  href: 'mirror-and-art.html' },
    { label: 'Bath',           href: 'bath.html' },
    { label: 'Atelier',        href: 'atelier.html' },
    { label: 'Lighting',       href: 'lighting.html' }
  ];

  var PHONE = '+91 89549 40821';
  var PHONE_RAW = '918954940821';
  var EMAIL = 'moobaid605@gmail.com';

  function currentFile() {
    var p = window.location.pathname.split('/').pop();
    return p && p.length ? p : 'index.html';
  }
  var PAGE = currentFile();
  var IS_HOME = (PAGE === 'index.html' || PAGE === '' ||
                 (document.body && document.body.getAttribute('data-page') === 'home'));

  var ICON = {
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-2 4h12"/><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>',
    arrow: '<svg class="cs-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 7l9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5h1.65V4.6c-.29-.04-1.27-.12-2.4-.12-2.38 0-4 1.45-4 4.12v2.3H7.8V14h2.55v8h3.15Z"/></svg>',
    pt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.6 19.3c-.08-.8-.15-2 .03-2.9l1.17-4.95s-.3-.6-.3-1.48c0-1.38.8-2.42 1.8-2.42.85 0 1.26.64 1.26 1.4 0 .85-.55 2.13-.83 3.31-.24.99.5 1.8 1.47 1.8 1.77 0 3.13-1.87 3.13-4.56 0-2.38-1.71-4.05-4.16-4.05-2.83 0-4.5 2.13-4.5 4.32 0 .86.33 1.78.74 2.27.08.1.09.18.07.28l-.27 1.13c-.04.18-.14.22-.33.13-1.23-.57-2-2.37-2-3.81 0-3.1 2.25-5.95 6.5-5.95 3.41 0 6.06 2.43 6.06 5.68 0 3.39-2.13 6.12-5.1 6.12-1 0-1.93-.52-2.25-1.13l-.61 2.34c-.22.85-.82 1.92-1.22 2.57A10 10 0 1 0 12 2Z"/></svg>',
    li: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 7.5a1.94 1.94 0 1 1 0-3.88 1.94 1.94 0 0 1 0 3.88ZM5.3 9h3.27v11H5.3V9Zm5.6 0h3.13v1.5h.04c.44-.83 1.5-1.7 3.1-1.7 3.3 0 3.9 2.17 3.9 5v6.2h-3.26v-5.5c0-1.3-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V20h-3.26V9Z"/></svg>'
  };

  /* ---------- Build Header ---------- */
  function buildHeader() {
    var navItems = CATEGORIES.map(function (c) {
      var active = (c.href === PAGE) ? ' active' : '';
      return '<a href="' + c.href + '" class="nav-link' + active + '">' + c.label + '</a>';
    }).join('');
    navItems += '<a href="collections.html" class="nav-link' + (PAGE === 'collections.html' || PAGE === 'products.html' ? ' active' : '') + '">Collections</a>';

    var transparent = IS_HOME ? ' header-transparent' : '';
    var scrolled = IS_HOME ? '' : ' scrolled';

    return '' +
      '<header class="site-header' + transparent + scrolled + '" id="site-header">' +
        '<div class="header-top">' +
          '<a href="index.html" class="brand" id="brand-logo">' +
            '<span class="brand-name">Choudhry Sons Exports</span>' +
          '</a>' +
          '<button class="menu-toggle" id="menu-toggle" aria-label="Toggle navigation menu"><span></span><span></span><span></span></button>' +
        '</div>' +
        '<div class="header-bottom">' +
          '<nav class="main-nav" id="main-nav">' + navItems + '</nav>' +
        '</div>' +
        '<div class="cs-header-actions">' +
          '<a href="cart.html" class="cs-icon-link" id="cs-cart-link" aria-label="Enquiry cart">' +
            ICON.cart +
            '<span class="cs-cart-count" id="cs-cart-count">0</span>' +
          '</a>' +
        '</div>' +
      '</header>';
  }

  /* ---------- Build Footer ---------- */
  function buildFooter() {
    var catLinks = CATEGORIES.map(function (c) {
      return '<a href="' + c.href + '">' + c.label + '</a>';
    }).join('');

    return '' +
      '<footer class="cs-footer" id="contact-section">' +
        '<div class="cs-footer-top">' +
          '<div class="cs-footer-brand">' +
            '<div class="cs-footer-name">Choudhry Sons<br><span class="cs-footer-est">Exports · Est. 1974</span></div>' +
            '<p>A maison of handcrafted metal artistry from Moradabad — the brass city of India. Five decades of heirloom craftsmanship, exported to over 30 countries.</p>' +
            '<div class="cs-footer-social">' +
              '<a href="#" aria-label="Instagram">' + ICON.ig + '</a>' +
              '<a href="#" aria-label="Pinterest">' + ICON.pt + '</a>' +
              '<a href="#" aria-label="Facebook">' + ICON.fb + '</a>' +
              '<a href="#" aria-label="LinkedIn">' + ICON.li + '</a>' +
            '</div>' +
          '</div>' +
          '<div class="cs-footer-col">' +
            '<h4>Collections</h4>' + catLinks +
            '<a href="collections.html">View All</a>' +
          '</div>' +
          '<div class="cs-footer-col">' +
            '<h4>Maison</h4>' +
            '<a href="about.html">Our Story</a>' +
            '<a href="gallery.html">Lookbook</a>' +
            '<a href="quote.html">Trade Enquiry</a>' +
          '</div>' +
          '<div class="cs-footer-col">' +
            '<h4>Contact</h4>' +
            '<a href="mailto:' + EMAIL + '">' + EMAIL + '</a>' +
            '<a href="tel:+' + PHONE_RAW + '">' + PHONE + '</a>' +
            '<p>Moradabad, Uttar Pradesh,<br>India — 244001</p>' +
            '<a href="cart.html">Enquiry Cart</a>' +
          '</div>' +
        '</div>' +
        '<div class="cs-footer-bottom">' +
          '<p>© 2026 Choudhry Sons Exports. All rights reserved.</p>' +
          '<div class="cs-foot-links">' +
            '<a href="contact.html">Contact</a>' +
            '<a href="quote.html">Trade</a>' +
            '<a href="about.html">About</a>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  /* ---------- Inject chrome immediately (mounts already in DOM) ---------- */
  function injectChrome() {
    var h = document.getElementById('cs-header');
    if (h) h.outerHTML = buildHeader();
    var f = document.getElementById('cs-footer');
    if (f) f.outerHTML = buildFooter();
  }
  injectChrome();

  /* ---------- Cart count in header ---------- */
  function readCart() {
    try { return JSON.parse(localStorage.getItem('cs_enquiry_cart')) || []; }
    catch (e) { return []; }
  }
  function syncCartCount() {
    var el = document.getElementById('cs-cart-count');
    if (!el) return;
    var n = readCart().length;
    el.textContent = n;
    el.classList.toggle('cs-has', n > 0);
  }

  /* ============================================================
     The rest runs after DOM is ready
     ============================================================ */
  function init() {
    syncCartCount();
    buildPreloader();
    buildProgress();
    buildBackToTop();
    initHeaderScroll();
    initParallax();
    initPageHero();
    initCategoryToolbar();
    initGallery();
    initNewsletter();
    initRevealFallback();

    // keep header cart count fresh after user adds/removes via app.js.
    // Use capture phase: app.js's add-button handler calls stopPropagation(),
    // which would block a bubble-phase listener. The 60ms delay lets app.js
    // write localStorage first.
    document.addEventListener('click', function (e) {
      if (e.target.closest('.product-add-btn') || e.target.closest('.cart-page-item-remove')) {
        setTimeout(syncCartCount, 60);
      }
    }, true);
    window.addEventListener('storage', syncCartCount);
    window.addEventListener('focus', syncCartCount);
  }

  /* ---------- Preloader (once per session) ---------- */
  function buildPreloader() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var seen = false;
    try { seen = sessionStorage.getItem('cs_seen') === '1'; } catch (e) {}
    if (seen || reduce) return;

    var pre = document.createElement('div');
    pre.id = 'cs-preloader';
    pre.innerHTML =
      '<div class="cs-pre-mark">Choudhry Sons <span class="cs-pre-amp">&</span> Exports</div>' +
      '<div class="cs-pre-line"></div>' +
      '<div class="cs-pre-sub">Maison of Metal · Est. 1974</div>';
    document.body.appendChild(pre);
    document.body.style.overflow = 'hidden';

    var done = function () {
      pre.classList.add('cs-done');
      document.body.style.overflow = '';
      try { sessionStorage.setItem('cs_seen', '1'); } catch (e) {}
      setTimeout(function () { if (pre.parentNode) pre.parentNode.removeChild(pre); }, 1000);
    };
    var start = Date.now();
    window.addEventListener('load', function () {
      var wait = Math.max(0, 1700 - (Date.now() - start));
      setTimeout(done, wait);
    });
    // safety fallback
    setTimeout(done, 4200);
  }

  /* ---------- Scroll progress ---------- */
  function buildProgress() {
    var bar = document.createElement('div');
    bar.id = 'cs-progress';
    document.body.appendChild(bar);
    var ticking = false;
    function update() {
      ticking = false;
      var st = window.scrollY || document.documentElement.scrollTop;
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (st / h) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Back to top ---------- */
  function buildBackToTop() {
    var btn = document.createElement('button');
    btn.id = 'cs-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
    document.body.appendChild(btn);
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () {
          ticking = false;
          btn.classList.toggle('cs-show', (window.scrollY || 0) > 600);
        });
      }
    }, { passive: true });
  }

  /* ---------- Header: scrolled + hide on scroll down ---------- */
  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;
    var last = window.scrollY, ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY;
      if (y > 60) header.classList.add('scrolled');
      else if (IS_HOME) header.classList.remove('scrolled');
      if (y > 300 && y > last + 6) header.classList.add('header-hidden');
      else if (y < last - 6 || y < 200) header.classList.remove('header-hidden');
      last = y;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Subtle parallax ---------- */
  function initParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if (!els.length) return;
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      els.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
        var r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var offset = (r.top + r.height / 2 - vh / 2) * -speed;
        el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Internal page hero (upgrade .page-header) ---------- */
  function initPageHero() {
    var ph = document.querySelector('.page-header');
    if (!ph || ph.classList.contains('cs-pagehero')) return;
    var title = ph.querySelector('.page-title');
    var sub = ph.querySelector('.page-subtitle');
    var name = title ? title.textContent.trim() : (document.title.split('—')[0].trim() || 'Collection');

    ph.classList.remove('page-header');
    ph.classList.add('cs-pagehero');
    var inner = document.createElement('div');
    inner.className = 'cs-pagehero-inner';

    var bc = document.createElement('nav');
    bc.className = 'cs-breadcrumb';
    bc.innerHTML = '<a href="index.html">Home</a><span class="sep">/</span><span>' + name + '</span>';

    var eb = document.createElement('span');
    eb.className = 'cs-eyebrow cs-center';
    eb.textContent = 'Choudhry Sons · Est. 1974';

    inner.appendChild(bc);
    inner.appendChild(eb);
    while (ph.firstChild) { inner.appendChild(ph.firstChild); }
    ph.appendChild(inner);
    if (sub) sub.classList.add('cs-pagehero-sub');
  }

  /* ---------- Batch reveal (no cumulative delay down the page) ---------- */
  function batchReveal(items) {
    if (!items.length) return;
    items.forEach(function (el) { el.classList.add('cs-prod-reveal'); });
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      var shown = entries.filter(function (e) { return e.isIntersecting; });
      shown.forEach(function (e, i) {
        e.target.style.transitionDelay = Math.min(i, 6) * 70 + 'ms';
        e.target.classList.add('is-in');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- Category page toolbar + row-wave reveal ---------- */
  function initCategoryToolbar() {
    var grid = document.querySelector('main.products-grid');
    if (!grid) return;
    var cards = grid.querySelectorAll('.product-card');
    if (!cards.length) return;

    var bar = document.createElement('div');
    bar.className = 'cs-cat-toolbar';
    bar.innerHTML =
      '<div class="cs-cat-count"><b>' + cards.length + '</b> Handcrafted Pieces</div>' +
      '<div class="cs-cat-note"><span class="cs-star">◆</span> Tap any piece to enlarge · Add to your enquiry</div>';
    grid.parentNode.insertBefore(bar, grid);

    var items = [bar];
    cards.forEach(function (c) { items.push(c); });
    batchReveal(items);
  }

  /* ---------- Gallery reveal ---------- */
  function initGallery() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.cs-gallery-item'));
    batchReveal(items);
  }

  /* ---------- Reveal fallback ----------
     app.js reveals .reveal elements via IntersectionObserver. This is a
     scroll-event-based safety net so content is NEVER stuck hidden if the
     observer doesn't fire (older engines, programmatic scroll, etc.). */
  function initRevealFallback() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!els.length) return;
    var ticking = false;
    function check() {
      ticking = false;
      var vh = window.innerHeight;
      for (var i = els.length - 1; i >= 0; i--) {
        var r = els[i].getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) {
          els[i].classList.add('visible');
          els.splice(i, 1);
        }
      }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(check); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    // also catch input-driven scrolling in case the scroll event is retargeted
    window.addEventListener('wheel', onScroll, { passive: true });
    window.addEventListener('touchmove', onScroll, { passive: true });
    window.addEventListener('keydown', onScroll);
    window.addEventListener('resize', onScroll);
    setTimeout(check, 350);
    window.addEventListener('load', function () { setTimeout(check, 120); });

    // Bulletproof safety net: if reveals are in view but NONE have become
    // visible (observer not firing in this engine), reveal everything so
    // content is never stuck hidden. Doesn't fire in normal browsers where
    // the observer works, preserving the on-scroll animation.
    window.addEventListener('load', function () {
      setTimeout(function () {
        var anyInView = false, anyVisible = false, vh = window.innerHeight;
        document.querySelectorAll('.reveal').forEach(function (el) {
          if (el.classList.contains('visible')) anyVisible = true;
          var r = el.getBoundingClientRect();
          if (r.top < vh && r.bottom > 0) anyInView = true;
        });
        if (anyInView && !anyVisible) {
          document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
        }
      }, 2000);
    });
  }

  /* ---------- Newsletter (front-end only) ---------- */
  function initNewsletter() {
    document.querySelectorAll('.cs-newsletter-form, .footer-contact-form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (typeof showToast === 'function') {
          showToast('Thank you — our atelier will be in touch shortly.');
        }
        form.reset && form.reset();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
