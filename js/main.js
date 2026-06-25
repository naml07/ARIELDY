/* ============================================================
   ARIELDY — main.js
   Global initialization, navigation, scroll reveals,
   counters, accordion, mobile menu
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Page Curtain Reveal ──────────────────────────────────
  const curtain = document.querySelector('.page-curtain');
  if (curtain) {
    curtain.addEventListener('animationend', () => {
      curtain.remove();
    });
  }

  // ── Navigation: scroll state ─────────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ── Mobile Menu ──────────────────────────────────────────
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  const mobileClose = document.querySelector('.nav__mobile-close');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');

  function openMenu() {
    hamburger?.classList.add('open');
    mobileMenu?.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger?.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
    hamburger?.setAttribute('aria-expanded', 'false');
  }

  hamburger?.addEventListener('click', () => {
    if (mobileMenu?.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileClose?.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
      closeMenu();
    }
  });

  // ── Scroll Reveal (IntersectionObserver) ─────────────────
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ── Animated Counter ─────────────────────────────────────
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.counter, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 2000;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current.toLocaleString('fr-FR') + suffix;
            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          }

          requestAnimationFrame(updateCounter);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(el => counterObserver.observe(el));
  }

  // ── Accordion ────────────────────────────────────────────
  const accordionItems = document.querySelectorAll('.accordion__item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion__header');
    header?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      accordionItems.forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
      header.setAttribute('aria-expanded', (!isOpen).toString());
    });
  });

  // ── Active nav link ───────────────────────────────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Product thumbnails ────────────────────────────────────
  const thumbs = document.querySelectorAll('.product-thumb');
  const mainImg = document.querySelector('.product-detail__img');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      if (mainImg) {
        mainImg.style.opacity = '0';
        mainImg.style.transform = 'scale(0.97)';
        setTimeout(() => {
          mainImg.src = thumb.src;
          mainImg.style.opacity = '1';
          mainImg.style.transform = 'scale(1)';
        }, 200);
      }
    });
  });

  // Smooth transition for product image
  if (mainImg) {
    mainImg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  }

  // ── Sticky product CTA ────────────────────────────────────
  const stickyCta = document.querySelector('.sticky-product-cta');
  if (stickyCta) {
    const showAfterPx = 400;
    window.addEventListener('scroll', () => {
      if (window.scrollY > showAfterPx) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    }, { passive: true });
  }

  // ── Parallax hero bg ─────────────────────────────────────
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBg.style.transform = `translateY(${scrollY * 0.25}px)`;
    }, { passive: true });
  }

  // ── Form submit handler ───────────────────────────────────
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Envoi en cours...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = '✓ Message envoyé !';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
          contactForm.reset();
        }, 3000);
      }, 1500);
    });
  }

  // ── WhatsApp float pulse on first load ───────────────────
  const waFloat = document.querySelector('.whatsapp-float');
  if (waFloat) {
    setTimeout(() => {
      waFloat.classList.add('pulse-glow');
    }, 3000);
  }

});
