/* ========================================================
   CHOUDHRY SONS EXPORTS — app.js v3.0 (Performance Optimised)
   ======================================================== */

'use strict';

/* ── Scroll-end detection (shared) ─────────────────── */
let _scrollEndTimer = null;
let _isScrolling   = false;

function onScrollStart() {
  if (!_isScrolling) {
    _isScrolling = true;
    document.documentElement.classList.add('is-scrolling');
  }
}

function onScrollEnd() {
  _isScrolling = false;
  document.documentElement.classList.remove('is-scrolling');
}

// Single shared passive scroll listener; dispatches RAF work per module
const _scrollCbs = [];
window.addEventListener('scroll', () => {
  onScrollStart();
  clearTimeout(_scrollEndTimer);
  _scrollEndTimer = setTimeout(onScrollEnd, 120);

  if (!_rafScheduled) {
    _rafScheduled = true;
    requestAnimationFrame(_flushScroll);
  }
}, { passive: true });

let _rafScheduled = false;
function _flushScroll() {
  _rafScheduled = false;
  const y = window.scrollY;
  _scrollCbs.forEach(cb => cb(y));
}

/* ── DOMContentLoaded ──────────────────────────────── */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

/* ── Testimonial Slider ─────────────────────────────── */
function initTestimonialSlider() {
  const track = document.getElementById('testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const slideCount = slides.length;

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slideCount;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  // Auto swipe every 5 seconds
  setInterval(nextSlide, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
  // Prevent jumping to section on refresh
  if (window.location.hash) {
    window.scrollTo(0, 0);
    history.replaceState(null, null, window.location.pathname);
  }

  initImages();
  initHeader();
  initMobileMenu();
  initAnnouncementBar();
  initScrollReveal();
  initCounters();
  initCarousel();
  initTestimonialSlider();
});

/* ── Async image decoding ──────────────────────────── */
function initImages() {
  document.querySelectorAll('img').forEach(img => {
    img.decoding = 'async';
    // Prevent layout shift: if no explicit size, set loading=lazy for below-fold
    if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
      // Hero image should be eager; others lazy
      if (!img.closest('.hero')) {
        img.loading = 'lazy';
      }
    }
  });
  // Hero image: prioritise fetch
  const heroImg = document.querySelector('.hero-bg img');
  if (heroImg) {
    heroImg.fetchPriority = 'high';
    heroImg.loading = 'eager';
  }
}

/* ── Header Scroll ─────────────────────────────────── */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ── Mobile Menu ───────────────────────────────────── */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav    = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Announcement Bar ──────────────────────────────── */
function initAnnouncementBar() {
  const bar   = document.getElementById('announcement-bar');
  const close = document.getElementById('announcement-close');
  if (!bar || !close) return;

  close.addEventListener('click', () => {
    // Force a known height first so transition works
    bar.style.maxHeight = bar.scrollHeight + 'px';
    requestAnimationFrame(() => {
      bar.style.transition = 'max-height 0.4s ease, opacity 0.4s ease, padding 0.4s ease';
      bar.style.maxHeight  = '0';
      bar.style.opacity    = '0';
      bar.style.padding    = '0';
      bar.style.overflow   = 'hidden';
    });
    setTimeout(() => bar.remove(), 420);
  });
}

/* ── Scroll Reveal (IntersectionObserver) ──────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  // Pre-compute siblings per parent to avoid DOM reads inside callback
  const siblingMap = new WeakMap();
  els.forEach(el => {
    const parent = el.parentElement;
    if (!siblingMap.has(parent)) {
      siblingMap.set(parent, Array.from(parent.querySelectorAll('.reveal')));
    }
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = siblingMap.get(entry.target.parentElement) || [];
        const idx = siblings.indexOf(entry.target);
        // Write in one batch — no read in between
        requestAnimationFrame(() => {
          entry.target.style.transitionDelay = (idx * 0.08) + 's';
          entry.target.classList.add('visible');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ── Stat Counters ─────────────────────────────────── */
function initCounters() {
  const stats = document.querySelectorAll('.stat-number[data-target]');
  if (!stats.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animate = el => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 2200;
    const start    = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      // Only write — no DOM reads inside tick
      el.textContent = Math.round(easeOut(p) * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

/* ── Collections Carousel ──────────────────────────── */
function initCarousel() {
  const carousel = document.getElementById('collections-carousel');
  const prevBtn  = document.getElementById('carousel-prev');
  const nextBtn  = document.getElementById('carousel-next');
  if (!carousel) return;

  // Cache tile width once; recalculate only on resize (not per click)
  let cachedTileWidth = 0;
  const getTileWidth = () => {
    if (cachedTileWidth) return cachedTileWidth;
    const tile = carousel.querySelector('.collection-tile');
    if (!tile) return 300;
    const gap = parseInt(getComputedStyle(carousel).gap) || 32;
    cachedTileWidth = tile.offsetWidth + gap;
    return cachedTileWidth;
  };

  const ro = new ResizeObserver(() => { cachedTileWidth = 0; });
  ro.observe(carousel);

  if (prevBtn) prevBtn.addEventListener('click', () =>
    carousel.scrollBy({ left: -getTileWidth(), behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () =>
    carousel.scrollBy({ left: getTileWidth(),  behavior: 'smooth' }));

  // Throttle button-state updates via RAF to avoid layout thrash
  let btnRaf = false;
  const updateBtns = () => {
    if (btnRaf) return;
    btnRaf = true;
    requestAnimationFrame(() => {
      btnRaf = false;
      if (!prevBtn || !nextBtn) return;
      // Batch all DOM reads
      const sl  = carousel.scrollLeft;
      const cw  = carousel.clientWidth;
      const sw  = carousel.scrollWidth;
      // Batch all DOM writes
      const atStart = sl < 10;
      const atEnd   = sl + cw >= sw - 10;
      prevBtn.style.opacity       = atStart ? '0.3' : '1';
      prevBtn.style.pointerEvents = atStart ? 'none' : 'auto';
      nextBtn.style.opacity       = atEnd   ? '0.3' : '1';
      nextBtn.style.pointerEvents = atEnd   ? 'none' : 'auto';
    });
  };

  carousel.addEventListener('scroll', updateBtns, { passive: true });
  updateBtns();
}
