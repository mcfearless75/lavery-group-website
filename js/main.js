/* ===================================================
   THE LAVERY GROUP — Main JS
   Scroll reveals | Parallax | Counters | Nav | Filters
=================================================== */

(() => {
  'use strict';

  /* ---- Scroll: nav background ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile nav ---- */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Scroll reveal (IntersectionObserver) ---- */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  /* ---- Hero parallax ---- */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg && !prefersReduced) {
    const onParallax = () => {
      const scrollY = window.scrollY;
      const limit = window.innerHeight;
      if (scrollY < limit) {
        heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
      }
    };
    window.addEventListener('scroll', onParallax, { passive: true });
  }

  /* ---- Animated counters ---- */
  const counters = document.querySelectorAll('.stat__number[data-target]');
  if (counters.length && !prefersReduced) {
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 1800;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = easeOut(progress) * target;
        const display = target % 1 === 0 ? Math.round(value) : value.toFixed(1);
        el.textContent = prefix + display + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(el => counterObserver.observe(el));
  }

  /* ---- Property card filter ---- */
  const filterSelects = document.querySelectorAll('.filter-group select');
  const propertyCards = document.querySelectorAll('.property-card[data-beds]');

  if (filterSelects.length && propertyCards.length) {
    const applyFilters = () => {
      const filterValues = {};
      filterSelects.forEach(sel => {
        filterValues[sel.dataset.filter] = sel.value;
      });

      propertyCards.forEach(card => {
        const matchBeds = !filterValues.beds || filterValues.beds === 'any'
          || card.dataset.beds === filterValues.beds;
        const matchBaths = !filterValues.baths || filterValues.baths === 'any'
          || card.dataset.baths === filterValues.baths;
        const matchStatus = !filterValues.status || filterValues.status === 'all'
          || card.dataset.status === filterValues.status;

        const show = matchBeds && matchBaths && matchStatus;
        card.style.display = show ? '' : 'none';
      });
    };

    filterSelects.forEach(sel => sel.addEventListener('change', applyFilters));
  }

  /* ---- Gallery thumbnails ---- */
  const thumbs = document.querySelectorAll('.gallery__thumb');
  const mainImg = document.querySelector('.gallery__main img');
  if (thumbs.length && mainImg) {
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        mainImg.src = thumb.querySelector('img').src;
        mainImg.style.opacity = '0';
        mainImg.addEventListener('load', () => {
          mainImg.style.transition = 'opacity 0.3s ease';
          mainImg.style.opacity = '1';
        }, { once: true });
      });
    });
    thumbs[0]?.classList.add('active');
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h'), 10) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Contact form handler ---- */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type=submit]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = 'Message Sent';
        btn.style.background = '#16a34a';
        btn.style.color = '#fff';
        setTimeout(() => {
          contactForm.reset();
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.color = '';
        }, 3000);
      }, 1200);
    });
  }

  /* ---- Booking form handler ---- */
  const bookingForm = document.querySelector('.booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = bookingForm.querySelector('[type=submit]');
      btn.textContent = 'Request Sent';
      btn.disabled = true;
      btn.style.background = '#16a34a';
      btn.style.color = '#fff';
    });
  }

})();
