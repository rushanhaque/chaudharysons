/* ========================================================
   CHOUDHRY SONS EXPORTS — app.js v7.0 (Simple Image Lightbox)
   ======================================================== */

'use strict';

/* ── Shared State ───────────────────────────────────── */
let _scrollEndTimer = null;
let _isScrolling   = false;
let _rafScheduled = false;
const _scrollCbs = [];

/* ── Scroll handling ────────────────────────────────── */
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

window.addEventListener('scroll', () => {
  onScrollStart();
  clearTimeout(_scrollEndTimer);
  _scrollEndTimer = setTimeout(onScrollEnd, 120);

  if (!_rafScheduled) {
    _rafScheduled = true;
    requestAnimationFrame(_flushScroll);
  }
}, { passive: true });

function _flushScroll() {
  _rafScheduled = false;
  const y = window.scrollY;
  _scrollCbs.forEach(cb => cb(y));
}

/* ── DOMContentLoaded ──────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

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
  initSimpleProductModal();
  initEnquiryCart();
});

/* ── Async image decoding ──────────────────────────── */
function initImages() {
  document.querySelectorAll('img').forEach(img => {
    img.decoding = 'async';
    if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
      if (!img.closest('.hero')) {
        img.loading = 'lazy';
      }
    }
  });
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

  const updateHeader = (y) => {
    if (y > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  _scrollCbs.push(updateHeader);
  updateHeader(window.scrollY);
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

/* ── Scroll Reveal ─────────────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

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

  let btnRaf = false;
  const updateBtns = () => {
    if (btnRaf) return;
    btnRaf = true;
    requestAnimationFrame(() => {
      btnRaf = false;
      if (!prevBtn || !nextBtn) return;
      const sl  = carousel.scrollLeft;
      const cw  = carousel.clientWidth;
      const sw  = carousel.scrollWidth;
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

  setInterval(nextSlide, 5000);
}

/* ── Simple Image Lightbox (No Zoom) ────────────────── */
function initSimpleProductModal() {
  const modal = document.getElementById('product-modal');
  const modalImg = document.getElementById('modal-img');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const triggers = document.querySelectorAll('.product-trigger');

  if (!modal || !modalImg) return;

  const openModal = (imgSrc) => {
    modalImg.src = imgSrc;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = trigger.dataset.image || trigger.querySelector('img').src;
      openModal(imgSrc);
    });
  });

  if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ── Enquiry Cart System ─────────────────────────────────── */
function initEnquiryCart() {
  const isCartPage = window.location.pathname.endsWith('cart.html');

  // Load state
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('cs_enquiry_cart')) || [];
  } catch (e) {
    cart = [];
  }

  // Construct message helpers
  function constructMessage(userName, userMsg) {
    let msg = `Hello Choudhry Sons Exports,\n\nI would like to enquire about the following handcrafted products:\n\n`;
    cart.forEach((item, index) => {
      msg += `- ${item.name} (${item.id})\n`;
    });
    msg += `\nMy Details:\n`;
    msg += `Name: ${userName}\n`;
    if (userMsg.trim()) {
      msg += `Message: ${userMsg.trim()}\n`;
    }
    msg += `\nPlease share availability and export details. Thank you!`;
    return msg;
  }

  if (isCartPage) {
    const itemsList = document.getElementById('cart-page-items-list');
    const layoutGrid = document.getElementById('cart-layout-grid');
    const emptyState = document.getElementById('cart-empty-state');

    function renderCartPage() {
      if (cart.length === 0) {
        if (layoutGrid) layoutGrid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
      } else {
        if (layoutGrid) layoutGrid.style.display = 'grid';
        if (emptyState) emptyState.style.display = 'none';

        if (itemsList) {
          itemsList.innerHTML = cart.map(item => `
            <div class="cart-page-item" data-id="${item.id}">
              <img src="${item.img}" alt="${item.name}" class="cart-page-item-img" />
              <div class="cart-page-item-details">
                <h4 class="cart-page-item-name">${item.name}</h4>
                <span class="cart-page-item-code">${item.id}</span>
              </div>
              <button class="cart-page-item-remove" data-id="${item.id}">Remove</button>
            </div>
          `).join('');

          // Bind remove buttons
          itemsList.querySelectorAll('.cart-page-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
              const itemId = btn.dataset.id;
              cart = cart.filter(item => item.id !== itemId);
              localStorage.setItem('cs_enquiry_cart', JSON.stringify(cart));
              renderCartPage();
            });
          });
        }
      }
    }

    // Submit actions
    const submitWhatsapp = document.getElementById('cart-submit-whatsapp');
    const submitEmail = document.getElementById('cart-submit-email');

    if (submitWhatsapp) {
      submitWhatsapp.addEventListener('click', () => {
        const name = document.getElementById('cart-user-name').value.trim();
        const msg = document.getElementById('cart-user-msg').value.trim();

        if (!name) {
          alert('Please fill out your Name to proceed.');
          return;
        }

        const text = constructMessage(name, msg);
        const whatsappUrl = `https://wa.me/918954940821?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
      });
    }

    if (submitEmail) {
      submitEmail.addEventListener('click', () => {
        const name = document.getElementById('cart-user-name').value.trim();
        const msg = document.getElementById('cart-user-msg').value.trim();

        if (!name) {
          alert('Please fill out your Name to proceed.');
          return;
        }

        const text = constructMessage(name, msg);
        const mailtoUrl = `mailto:moobaid605@gmail.com?subject=${encodeURIComponent('Product Enquiry — Choudhry Sons Exports')}&body=${encodeURIComponent(text)}`;
        window.location.href = mailtoUrl;
      });
    }

    renderCartPage();

  } else {
    // We are on a normal product/collection page
    // Create & Inject Floating Cart Badge
    const badgeHtml = `
      <div class="floating-cart-badge" id="floating-cart-badge">
        <span class="floating-cart-icon">🛒</span>
        <span class="floating-cart-text">Enquiry Cart</span>
        <span class="floating-cart-count" id="floating-cart-count">0</span>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', badgeHtml);

    const badge = document.getElementById('floating-cart-badge');
    const countSpan = document.getElementById('floating-cart-count');
    const productCards = document.querySelectorAll('.product-card');

    function updateCartBadge() {
      localStorage.setItem('cs_enquiry_cart', JSON.stringify(cart));
      if (countSpan) countSpan.textContent = cart.length;

      if (cart.length > 0) {
        badge.classList.add('active');
      } else {
        badge.classList.remove('active');
      }
    }

    // Inject select overlays on normal pages
    productCards.forEach(card => {
      const codeEl = card.querySelector('.item-number');
      const titleEl = card.querySelector('.tile-title');
      const imgEl = card.querySelector('.tile-image');

      if (!titleEl || !imgEl) return;

      const id = codeEl ? codeEl.textContent.trim() : titleEl.textContent.trim().toLowerCase().replace(/\s+/g, '-');
      const name = titleEl.textContent.trim();
      const img = imgEl.src;

      const isSelected = cart.some(item => item.id === id);
      if (isSelected) {
        card.classList.add('is-selected');
      }

      const selectOverlayHtml = `
        <div class="product-select-overlay">
          <input type="checkbox" class="product-select-checkbox" data-id="${id}" data-name="${name}" data-img="${img}" ${isSelected ? 'checked' : ''} />
          <span class="checkmark-indicator"></span>
        </div>
      `;
      card.insertAdjacentHTML('afterbegin', selectOverlayHtml);

      // Stop modal click propagation on checkbox clicks
      const overlay = card.querySelector('.product-select-overlay');
      overlay.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      const checkbox = overlay.querySelector('.product-select-checkbox');
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          if (!cart.some(item => item.id === id)) {
            cart.push({ id, name, img });
          }
          card.classList.add('is-selected');
        } else {
          cart = cart.filter(item => item.id !== id);
          card.classList.remove('is-selected');
        }
        updateCartBadge();
      });
    });

    // Go to cart page on badge click
    badge.addEventListener('click', () => {
      window.location.href = 'cart.html';
    });

    updateCartBadge();
  }
}
