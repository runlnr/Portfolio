/**
 * Unified Whole-Block Text Flip Animation Engine
 * Powered by GSAP (gsap.to)
 *
 * Flips the entire text block / title as a single unit on hover and unhover.
 * No character splitting, no wave stagger - clean, silky smooth, hardware-accelerated.
 */

(function () {
  'use strict';

  function initTextFlip() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Select all flip elements across the entire site:
    // 1. Explicit data-text-flip
    // 2. Portfolio project titles (.f3-title-flip)
    // 3. Dropdown navigation links (.nav-row-roll)
    // 4. Subpage top-nav email link (.nav-roll)
    // 5. Any .text-flip class
    const targets = document.querySelectorAll('[data-text-flip], .f3-title-flip, .nav-row-roll, .nav-roll, .text-flip');

    targets.forEach((container) => {
      // Prevent double initialization
      if (container.dataset.flipInitialized === 'true') return;

      // Ignore single-character brand logo rolls (N roll-up, P roll-down)
      if (container.classList.contains('brand-roll')) return;

      let inner = container.querySelector('.nav-row-roll-inner, .nav-roll-inner, .text-flip-inner');

      if (!inner) {
        // Check for existing front and back sub-elements
        const frontEl = container.querySelector('.f3-title-front, .text-flip-front');
        const backEl = container.querySelector('.f3-title-back, .text-flip-back');

        if (frontEl && backEl) {
          inner = document.createElement('span');
          inner.className = 'text-flip-inner';
          inner.style.transform = 'translateY(0%)';
          inner.appendChild(frontEl);
          inner.appendChild(backEl);
          container.innerHTML = '';
          container.appendChild(inner);
        } else {
          const fText = (container.dataset.textFlip || container.textContent).trim();
          const bText = (container.dataset.textFlipBack || container.dataset.textFlip || container.textContent).trim();

          inner = document.createElement('span');
          inner.className = 'text-flip-inner';
          inner.style.transform = 'translateY(0%)';

          const faceFront = document.createElement('span');
          faceFront.className = 'text-flip-face text-flip-front';
          faceFront.textContent = fText;

          const faceBack = document.createElement('span');
          faceBack.className = 'text-flip-face text-flip-back';
          faceBack.setAttribute('aria-hidden', 'true');
          faceBack.textContent = bText;

          inner.appendChild(faceFront);
          inner.appendChild(faceBack);
          container.innerHTML = '';
          container.appendChild(inner);
        }
      }

      if (!inner) return;

      // Ensure accessible labeling
      const fullLabel = (container.getAttribute('aria-label') || container.textContent).trim();
      container.setAttribute('aria-label', fullLabel);
      container.setAttribute('role', 'text');
      container.dataset.flipInitialized = 'true';

      // Determine parent hover trigger
      const trigger = container.closest('.f3-work-card') ||
                      container.closest('.nav-dropdown-row-link') ||
                      container.closest('.hero-nav-link') ||
                      container.closest('[data-flip-trigger]') ||
                      container;

      // Whole-block animation parameters (Cinematic & Deliberate editorial curve)
      const hoverDuration = 0.48;
      const unhoverDuration = 0.38;

      function playFlip(forward) {
        if (prefersReducedMotion || !window.gsap) {
          if (window.gsap) {
            window.gsap.killTweensOf(inner);
          }
          inner.style.transform = forward ? 'translateY(-50%)' : 'translateY(0%)';
          return;
        }

        const targetNum = forward ? -50 : 0;
        const animDuration = forward ? hoverDuration : unhoverDuration;

        let currentY = 0;
        try {
          currentY = parseFloat(window.gsap.getProperty(inner, 'yPercent')) || 0;
        } catch (e) {
          currentY = forward ? 0 : -50;
        }

        const travel = Math.min(1, Math.max(0.15, Math.abs(targetNum - currentY) / 50));
        const duration = animDuration * travel;

        window.gsap.to(inner, {
          yPercent: targetNum,
          duration: duration,
          ease: 'expo.out',
          overwrite: 'auto'
        });
      }

      trigger.addEventListener('mouseenter', () => {
        playFlip(true);
      });

      trigger.addEventListener('mouseleave', () => {
        playFlip(false);
      });
    });
  }

  function warmUpCompositor() {
    document.querySelectorAll('.text-flip-inner, .nav-row-roll-inner, .nav-roll-inner').forEach(inner => {
      if (window.gsap) {
        window.gsap.set(inner, { yPercent: 0 });
      } else if (!inner.style.transform) {
        inner.style.transform = 'translateY(0%)';
      }
    });
  }

  window.initTextFlip = initTextFlip;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTextFlip();
      warmUpCompositor();
    });
  } else {
    initTextFlip();
    warmUpCompositor();
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(warmUpCompositor);
  }
})();
