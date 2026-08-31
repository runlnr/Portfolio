/**
 * FUTURE THREE® Editorial Scroll Interactions
 * Live Seconds Clock, GSAP ScrollTriggers & Parallax Watermarks
 */

(function () {
  'use strict';

  function initFutureThreeScroll() {
    // 1. GSAP ScrollTrigger Motion

    // 2. GSAP ScrollTrigger Motion
    if (window.gsap && window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) { return; }

      // Intro text reveal
      const introStatement = document.querySelector('.f3-intro-statement');
      if (introStatement) {
        window.gsap.from(
          introStatement,
          {
            opacity: 0,
            y: 25,
            duration: 0.85,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: '.f3-section-intro',
              start: 'top 90%',
              once: true
            }
          }
        );
      }

      // Staggered Entrance Animation for 2-Column Works Grid (4 Projects)
      const workCards = document.querySelectorAll('.f3-work-card');
      if (workCards.length > 0) {
        window.gsap.fromTo(
          workCards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: '.f3-works-grid-container',
              start: 'top 85%',
              once: true
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
