/* ========================================================
   CHAUDHARY SONS & CO. — app.js v2.0
   ======================================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initAnnouncementBar();
  initScrollReveal();
  initCounters();
  initCarousel();
});

/* ── Header Scroll ─────────────────────────────── */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const cur = window.scrollY;
    header.classList.toggle('scrolled', cur > 80);
    if (cur > 350) {
      header.classList.toggle('header-hidden', cur > lastScroll);
    } else {
      header.classList.remove('header-hidden');
    }
    lastScroll = cur;
  }, { passive: true });
}

/* ── Mobile Menu ────────────────────────────────── */
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

/* ── Announcement Bar ───────────────────────────── */
function initAnnouncementBar() {
  const bar   = document.getElementById('announcement-bar');
  const close = document.getElementById('announcement-close');
  if (!bar || !close) return;

  close.addEventListener('click', () => {
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

/* ── Scroll Reveal ──────────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for sibling elements
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let idx = 0;
        siblings.forEach((s, j) => { if (s === entry.target) idx = j; });
        entry.target.style.transitionDelay = (idx * 0.08) + 's';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ── Stat Counters ──────────────────────────────── */
function initCounters() {
  const stats = document.querySelectorAll('.stat-number[data-target]');
  if (!stats.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animate = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 2200;
    const start    = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOut(p) * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

/* ── Collections Carousel ───────────────────────── */
function initCarousel() {
  const carousel = document.getElementById('collections-carousel');
  const prevBtn  = document.getElementById('carousel-prev');
  const nextBtn  = document.getElementById('carousel-next');
  if (!carousel) return;

  const getTileWidth = () => {
    const tile = carousel.querySelector('.collection-tile');
    if (!tile) return 300;
    const gap = parseInt(getComputedStyle(carousel).gap) || 32;
    return tile.offsetWidth + gap;
  };

  if (prevBtn) prevBtn.addEventListener('click', () =>
    carousel.scrollBy({ left: -getTileWidth(), behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () =>
    carousel.scrollBy({ left: getTileWidth(),  behavior: 'smooth' }));

  // Update button visibility
  const updateBtns = () => {
    if (!prevBtn || !nextBtn) return;
    prevBtn.style.opacity = carousel.scrollLeft < 10 ? '0.3' : '1';
    prevBtn.style.pointerEvents = carousel.scrollLeft < 10 ? 'none' : 'auto';
    const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10;
    nextBtn.style.opacity = atEnd ? '0.3' : '1';
    nextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
  };

  carousel.addEventListener('scroll', updateBtns, { passive: true });
  updateBtns();
}
