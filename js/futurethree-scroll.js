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

    // 4. Portfolio Grid vs List View Switcher
    const viewGridBtn = document.getElementById('f3-view-grid');
    const viewListBtn = document.getElementById('f3-view-list');
    const gridViewContainer = document.getElementById('f3-works-grid');
    const listViewContainer = document.getElementById('f3-works-list');
    const expandWrap = document.querySelector('.f3-works-expand-wrap');
    const hoverPreview = document.getElementById('f3-list-hover-preview');
    const hoverImg = document.getElementById('f3-list-hover-img');

    if (viewGridBtn && viewListBtn && gridViewContainer && listViewContainer) {
      function setView(mode) {
        if (mode === 'list') {
          viewListBtn.classList.add('is-active');
          viewListBtn.setAttribute('aria-checked', 'true');
          viewGridBtn.classList.remove('is-active');
          viewGridBtn.setAttribute('aria-checked', 'false');

          gridViewContainer.style.display = 'none';
          if (expandWrap) expandWrap.style.display = 'none';
          listViewContainer.style.display = 'flex';
        } else {
          viewGridBtn.classList.add('is-active');
          viewGridBtn.setAttribute('aria-checked', 'true');
          viewListBtn.classList.remove('is-active');
          viewListBtn.setAttribute('aria-checked', 'false');

          listViewContainer.style.display = 'none';
          if (hoverPreview) hoverPreview.classList.remove('is-visible');
          gridViewContainer.style.display = 'flex';
          if (expandWrap) expandWrap.style.display = '';
        }

        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }
      }

      viewGridBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setView('grid');
      });

      viewListBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setView('list');
      });

      // Floating cursor image preview for list rows
      if (hoverPreview && hoverImg) {
        const rows = listViewContainer.querySelectorAll('.f3-list-item-row');
        let mouseX = -9999, mouseY = -9999;
        let currentX = -9999, currentY = -9999;
        let isHovering = false;

        rows.forEach(row => {
          row.addEventListener('mouseenter', e => {
            const src = row.getAttribute('data-image');
            if (src) {
              hoverImg.src = src;
              hoverPreview.classList.add('is-visible');
              isHovering = true;
              if (currentX === -9999) {
                currentX = e.clientX + 30;
                currentY = e.clientY - 20;
              }
            }
          });

          row.addEventListener('mouseleave', () => {
            hoverPreview.classList.remove('is-visible');
            isHovering = false;
          });

          row.addEventListener('mousemove', e => {
            mouseX = e.clientX + 30;
            mouseY = e.clientY - 20;
          });
        });

        function animateListHover() {
          if (isHovering) {
            if (currentX === -9999) {
              currentX = mouseX;
              currentY = mouseY;
            }
            currentX += (mouseX - currentX) * 0.18;
            currentY += (mouseY - currentY) * 0.18;
            hoverPreview.style.left = `${currentX}px`;
            hoverPreview.style.top = `${currentY}px`;
          }
          requestAnimationFrame(animateListHover);
        }
        animateListHover();
      }
    }
  }

  window.initFutureThreeScroll = initFutureThreeScroll;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFutureThreeScroll);
  } else {
    initFutureThreeScroll();
  }
})();
