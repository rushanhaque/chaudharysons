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
  initBestSellersCarousel();
  initTestimonialSlider();
  initSimpleProductModal();
  initEnquiryCart();
  initActiveNav();
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

  const openModal = (imgSrc, title, code) => {
    modalImg.src = imgSrc;
    
    // Dynamically insert caption card text
    let caption = modal.querySelector('.modal-caption');
    if (!caption) {
      caption = document.createElement('div');
      caption.className = 'modal-caption';
      modalImg.parentNode.appendChild(caption);
    }
    
    if (title || code) {
      caption.style.display = 'block';
      caption.innerHTML = `
        <h3>${title || ''}</h3>
        <span>${code || ''}</span>
      `;
    } else {
      caption.style.display = 'none';
    }
    
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
      const title = trigger.querySelector('.tile-title')?.textContent.trim() || '';
      const code = trigger.querySelector('.item-number')?.textContent.trim() || '';
      openModal(imgSrc, title, code);
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
  function constructMessage() {
    let msg = `Hello Choudhry Sons Exports,\n\nI would like to enquire about the following handcrafted products:\n\n`;
    cart.forEach((item, index) => {
      msg += `- ${item.name} (${item.id})\n`;
    });
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
              const item = cart.find(i => i.id === itemId);
              cart = cart.filter(i => i.id !== itemId);
              localStorage.setItem('cs_enquiry_cart', JSON.stringify(cart));
              renderCartPage();
              if (item) {
                showToast(`Removed from Cart: ${item.name}`);
              }
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
        const text = constructMessage();
        const whatsappUrl = `https://wa.me/918954940821?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
      });
    }

    if (submitEmail) {
      submitEmail.addEventListener('click', () => {
        const text = constructMessage();
        const mailtoUrl = `mailto:moobaid605@gmail.com?subject=${encodeURIComponent('Product Enquiry — Choudhry Sons Exports')}&body=${encodeURIComponent(text)}`;
        window.location.href = mailtoUrl;
      });
    }

    renderCartPage();

  } else {
    // We are on a normal product/collection page
    // Create & Inject Floating Cart Container
    const badgeHtml = `
      <div class="floating-cart-container" id="floating-cart-container">
        <div class="floating-cart-badge" id="floating-cart-badge">
          <span class="floating-cart-icon">🛒</span>
          <span class="floating-cart-text">Enquiry Cart</span>
          <span class="floating-cart-count" id="floating-cart-count">0</span>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', badgeHtml);

    const container = document.getElementById('floating-cart-container');
    const badge = document.getElementById('floating-cart-badge');
    const countSpan = document.getElementById('floating-cart-count');
    const productCards = document.querySelectorAll('.product-card');

    function updateCartBadge() {
      localStorage.setItem('cs_enquiry_cart', JSON.stringify(cart));
      if (countSpan) countSpan.textContent = cart.length;

      if (cart.length > 0) {
        container.classList.add('active');
      } else {
        container.classList.remove('active');
      }
    }

    // Inject select buttons on normal pages
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

      const selectBtnHtml = `
        <span class="product-add-btn" role="button" data-id="${id}">
          ${isSelected ? 'Remove' : 'Add to Cart'}
        </span>
      `;
      card.insertAdjacentHTML('beforeend', selectBtnHtml);

      const addBtn = card.querySelector('.product-add-btn');
      
      // Stop modal click propagation on add button clicks
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();

        const currentlySelected = cart.some(item => item.id === id);
        if (!currentlySelected) {
          cart.push({ id, name, img });
          // Sync all duplicate cards using the data-id attribute on buttons
          document.querySelectorAll(`.product-add-btn[data-id="${id}"]`).forEach(btn => {
            btn.textContent = 'Remove';
            const parentCard = btn.closest('.product-card');
            if (parentCard) {
              parentCard.classList.add('is-selected');
            }
          });
          showToast(`Added to Cart: ${name}`);
        } else {
          cart = cart.filter(item => item.id !== id);
          // Sync all duplicate cards using the data-id attribute on buttons
          document.querySelectorAll(`.product-add-btn[data-id="${id}"]`).forEach(btn => {
            btn.textContent = 'Add to Cart';
            const parentCard = btn.closest('.product-card');
            if (parentCard) {
              parentCard.classList.remove('is-selected');
            }
          });
          showToast(`Removed from Cart: ${name}`);
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

/* ── Dynamic Navigation Highlighting ──────────────── */
function initActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.main-nav .nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ── Toast Notification System ─────────────────────── */
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;

  container.appendChild(toast);

  // Animate slide-in
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  // Fade out and garbage collect
  setTimeout(() => {
    toast.classList.remove('visible');
    toast.addEventListener('transitionend', () => {
      toast.remove();
      if (container.childNodes.length === 0) {
        container.remove();
      }
    });
  }, 2800);
}

/* ── Best Sellers Marquee Carousel ────────────────── */
function initBestSellersCarousel() {
  const carousel = document.getElementById('best-sellers-carousel');
  if (!carousel) return;

  // Clone items to create the infinite loop effect
  const originalItems = Array.from(carousel.children);
  if (originalItems.length === 0) return;

  originalItems.forEach(item => {
    const clone = item.cloneNode(true);
    carousel.appendChild(clone);
  });

  let isHovered = false;
  let scrollSpeed = 0.8; // Smooth, luxury pacing
  let animationId = null;

  // Hover detection
  carousel.addEventListener('mouseenter', () => {
    isHovered = true;
  });
  carousel.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  // Touch device support (touch ends pause, swipe resets speed)
  carousel.addEventListener('touchstart', () => {
    isHovered = true;
  }, { passive: true });
  carousel.addEventListener('touchend', () => {
    isHovered = false;
  }, { passive: true });

  // Function to calculate width of original items sequence + gap
  const getOriginalWidth = () => {
    const gap = parseFloat(getComputedStyle(carousel).gap) || 32;
    let width = 0;
    originalItems.forEach(item => {
      width += item.getBoundingClientRect().width + gap;
    });
    return width;
  };

  let originalWidth = getOriginalWidth();

  // Recalculate on load and resize to ensure fluid responsive layout
  window.addEventListener('load', () => {
    originalWidth = getOriginalWidth();
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      originalWidth = getOriginalWidth();
    }, 150);
  });

  let isVisible = true;
  let running = false;

  function animateScroll() {
    // Only keep the rAF alive while the marquee is on-screen and not paused —
    // lets the page go fully idle otherwise (no perpetual loop).
    if (isHovered || !isVisible) { running = false; return; }
    carousel.scrollLeft += scrollSpeed;
    if (carousel.scrollLeft >= originalWidth) {
      carousel.scrollLeft = carousel.scrollLeft % originalWidth;
    }
    animationId = requestAnimationFrame(animateScroll);
  }

  function startMarquee() {
    if (!running && !isHovered && isVisible) {
      running = true;
      animationId = requestAnimationFrame(animateScroll);
    }
  }

  // Resume when the mouse/touch leaves
  carousel.addEventListener('mouseleave', startMarquee);
  carousel.addEventListener('touchend', startMarquee, { passive: true });

  // Pause entirely when scrolled out of view
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      isVisible = entries[0].isIntersecting;
      if (isVisible) startMarquee();
    }, { threshold: 0 }).observe(carousel);
  }

  // Start marquee loop
  startMarquee();
}
