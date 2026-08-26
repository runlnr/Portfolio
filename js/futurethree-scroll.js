/**
 * FUTURE THREE® Editorial Scroll Interactions
 * Live Seconds Clock, GSAP ScrollTriggers & Parallax Watermarks
 */

(function () {
  'use strict';

  function initFutureThreeScroll() {
    // 1. Sync Manifesto Left Edge to Behance Nav Link Anchor
    function syncBehanceAnchor() {
      const behanceLink = document.getElementById('nav-behance-link');
      const introGrid = document.querySelector('.f3-intro-split-grid');
      const container = document.querySelector('.f3-section-intro .f3-container');
      if (behanceLink && introGrid && container && window.innerWidth > 900) {
        const behanceRect = behanceLink.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const leftOffset = Math.max(0, behanceRect.left - containerRect.left);
        introGrid.style.gridTemplateColumns = `${leftOffset}px 1fr`;
      } else if (introGrid && window.innerWidth <= 900) {
        introGrid.style.gridTemplateColumns = '1fr';
      }
    }

    syncBehanceAnchor();
    window.removeEventListener('resize', syncBehanceAnchor);
    window.addEventListener('resize', syncBehanceAnchor, { passive: true });

    // 2. GSAP ScrollTrigger Motion
    if (window.gsap && window.ScrollTrigger) {
      window.ScrollTrigger.refresh();

      // Intro text reveal
      const introStatement = document.querySelector('.f3-intro-statement');
      if (introStatement) {
        window.gsap.fromTo(
          introStatement,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.f3-section-intro',
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      // Parallax on giant watermark number _35
      const watermarkNum = document.querySelector('.f3-watermark-number');
      if (watermarkNum) {
        window.gsap.fromTo(
          watermarkNum,
          { y: 30, opacity: 0.3 },
          {
            y: -30,
            opacity: 0.85,
            ease: 'none',
            scrollTrigger: {
              trigger: '.f3-card-03-container',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          }
        );
      }

      // Staggered reveal for service rows
      const serviceRows = document.querySelectorAll('.f3-service-row');
      if (serviceRows.length > 0) {
        window.gsap.fromTo(
          serviceRows,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.f3-services-list',
              start: 'top 82%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      // Kinetic scale for giant billboard
      const billboardText = document.querySelector('.f3-billboard-text');
      if (billboardText) {
        window.gsap.fromTo(
          billboardText,
          { scale: 0.94, opacity: 0.7 },
          {
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.f3-section-billboard',
              start: 'top 90%',
              end: 'bottom 40%',
              scrub: 1
            }
          }
        );
      }
    }

    // 3. Language Selector Button Toggle
    const langSelector = document.getElementById('hero-lang-selector');
    if (langSelector) {
      const langBtns = langSelector.querySelectorAll('.hero-lang-btn');
      langBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          langBtns.forEach((b) => b.classList.remove('is-active', 'active'));
          btn.classList.add('is-active');
          const chosenLang = btn.getAttribute('data-lang') || 'en';
          window.__CURRENT_LANG = chosenLang;
          try {
            localStorage.setItem('site_lang', chosenLang);
          } catch (err) {}
        });
      });
    }
  }

  window.initFutureThreeScroll = initFutureThreeScroll;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFutureThreeScroll);
  } else {
    initFutureThreeScroll();
  }
})();
