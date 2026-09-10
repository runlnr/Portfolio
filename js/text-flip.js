/**
 * Shared Character-Stagger Text Flip Animation Engine
 * Powered by Motion.dev (Motion.animate)
 *
 * Each character rolls individually with overlapping left-to-right stagger
 * and symmetric staggered return on mouse leave.
 */

(function () {
  'use strict';

  function extractCharNodes(el) {
    if (!el) return [];
    const rawItems = [];
    function walk(node, inheritedClass) {
      if (node.nodeType === Node.TEXT_NODE) {
        // Normalize all whitespace sequences (\n, \r, \t, spaces) into single spaces
        const text = (node.textContent || '').replace(/\s+/g, ' ');
        for (let i = 0; i < text.length; i++) {
          rawItems.push({ char: text[i], className: inheritedClass || '' });
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const rawClass = (node.className && typeof node.className === 'string') ? node.className : '';
        const cleanClass = rawClass.replace(/\b(f3-title-face|nav-row-text|text-flip-face|nav-roll-inner)\b/g, '').trim();
        const cls = cleanClass ? `${inheritedClass ? inheritedClass + ' ' : ''}${cleanClass}`.trim() : inheritedClass;
        node.childNodes.forEach(child => walk(child, cls));
      }
    }
    walk(el, '');

    // Collapse consecutive spaces and trim leading/trailing spaces
    const result = [];
    for (let i = 0; i < rawItems.length; i++) {
      const item = rawItems[i];
      if (item.char === ' ') {
        if (result.length === 0 || result[result.length - 1].char === ' ') {
          continue;
        }
      }
      result.push(item);
    }
    if (result.length > 0 && result[result.length - 1].char === ' ') {
      result.pop();
    }
    return result;
  }

  function initTextFlip() {
    const Motion = window.Motion;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Select all flip elements across N/P®:
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

      // Check for existing front and back sub-elements
      const frontEl = container.querySelector('.f3-title-front, .nav-row-text:first-child, .nav-roll-inner > span:first-child, .text-flip-front');
      const backEl = container.querySelector('.f3-title-back, .nav-row-text:last-child, .nav-roll-inner > span:last-child, .text-flip-back');

      let frontNodes = [];
      let backNodes = [];

      if (frontEl && backEl) {
        frontNodes = extractCharNodes(frontEl);
        backNodes = extractCharNodes(backEl);
      } else {
        const fText = (container.dataset.textFlip || container.textContent).trim();
        const bText = (container.dataset.textFlipBack || container.dataset.textFlip || container.textContent).trim();
        frontNodes = Array.from(fText).map(c => ({ char: c, className: '' }));
        backNodes = Array.from(bText).map(c => ({ char: c, className: '' }));
      }

      if (frontNodes.length === 0 && backNodes.length === 0) return;

      const fullLabel = (backEl ? backEl.textContent : frontEl ? frontEl.textContent : container.textContent).trim();
      container.setAttribute('aria-label', fullLabel);
      container.setAttribute('role', 'text');

      // Align length of front and back text
      const maxLen = Math.max(frontNodes.length, backNodes.length);
      while (frontNodes.length < maxLen) {
        frontNodes.push({ char: ' ', className: '' });
      }
      while (backNodes.length < maxLen) {
        backNodes.push({ char: ' ', className: '' });
      }

      // Determine parent hover trigger
      const trigger = container.closest('.f3-work-card') ||
                      container.closest('.nav-dropdown-row-link') ||
                      container.closest('.hero-nav-link') ||
                      container.closest('[data-flip-trigger]') ||
                      container;

      // Build segmented DOM by words to preserve natural line wrapping
      const wordsWrapper = document.createElement('span');
      wordsWrapper.className = 'text-flip-wrapper';
      wordsWrapper.setAttribute('aria-hidden', 'true');

      const innerElements = [];
      let currentWord = document.createElement('span');
      currentWord.className = 'text-flip-word';

      for (let i = 0; i < maxLen; i++) {
        const f = frontNodes[i];
        const b = backNodes[i];

        // Handle word boundaries (spaces)
        if (f.char === ' ' && b.char === ' ') {
          if (currentWord.childNodes.length > 0) {
            wordsWrapper.appendChild(currentWord);
            currentWord = document.createElement('span');
            currentWord.className = 'text-flip-word';
          }
          const space = document.createElement('span');
          space.className = 'text-flip-space';
          space.innerHTML = '&nbsp;';
          wordsWrapper.appendChild(space);
          continue;
        }

        const charEl = document.createElement('span');
        const extraClass = (b.className || f.className).trim();
        charEl.className = `text-flip-char${extraClass ? ' ' + extraClass : ''}`;

        const inner = document.createElement('span');
        inner.className = 'text-flip-inner';
        inner.style.transform = 'translateY(0%)';

        const faceFront = document.createElement('span');
        faceFront.className = 'text-flip-face text-flip-front';
        faceFront.textContent = f.char === ' ' ? '\u00A0' : f.char;

        const faceBack = document.createElement('span');
        faceBack.className = 'text-flip-face text-flip-back';
        faceBack.textContent = b.char === ' ' ? '\u00A0' : b.char;

        inner.appendChild(faceFront);
        inner.appendChild(faceBack);
        charEl.appendChild(inner);
        currentWord.appendChild(charEl);
        innerElements.push(inner);
      }

      if (currentWord.childNodes.length > 0) {
        wordsWrapper.appendChild(currentWord);
      }

      // Replace container contents with accessible split DOM
      container.innerHTML = '';
      container.appendChild(wordsWrapper);
      container.dataset.flipInitialized = 'true';

      // Timing calculations
      // Snappy, energetic character stagger: 14ms - 18ms per character
      // Longer titles take longer to complete their wave
      const totalChars = innerElements.length;
      const staggerDelay = totalChars > 16 ? 0.014 : 0.018;
      const hoverDuration = 0.28;
      const unhoverDuration = 0.22;
      const easeCurve = [0.16, 1, 0.3, 1]; // --ease-out-expo

      let isHovered = false;

      function playFlip(forward) {
        if (prefersReducedMotion || !Motion || !Motion.animate) {
          innerElements.forEach(inner => {
            if (inner._activeAnim) {
              try { inner._activeAnim.stop(); } catch (e) {}
              inner._activeAnim = null;
            }
            inner.style.transform = forward ? 'translateY(-50%)' : 'translateY(0%)';
          });
          return;
        }

        const targetY = forward ? '-50%' : '0%';
        const animDuration = forward ? hoverDuration : unhoverDuration;

        innerElements.forEach((inner, idx) => {
          // Cancel prior animation on this character to prevent collision/stacking
          if (inner._activeAnim) {
            try {
              if (typeof inner._activeAnim.cancel === 'function') inner._activeAnim.cancel();
              if (typeof inner._activeAnim.stop === 'function') inner._activeAnim.stop();
            } catch (e) {}
            inner._activeAnim = null;
          }

          let currentY = forward ? 0 : -50;
          const currentTransform = inner.style.transform || '';
          const match = currentTransform.match(/translateY\((-?[\d.]+)%\)/);
          if (match) {
            currentY = parseFloat(match[1]);
          }

          const targetNum = forward ? -50 : 0;
          const finalTransform = forward ? 'translateY(-50%)' : 'translateY(0%)';
          if (Math.abs(currentY - targetNum) < 0.05) {
            inner.style.transform = finalTransform;
            return;
          }

          // Starting keyframe:
          // If starting from 0%, use -0.001% so Motion keeps the translateY GPU layer active throughout delay
          const fromKeyframe = forward
            ? (Math.abs(currentY) < 0.05 ? '-0.001%' : `${currentY}%`)
            : `${currentY}%`;

          const travel = Math.min(1, Math.max(0.15, Math.abs(targetNum - currentY) / 50));
          const duration = animDuration * travel;

          // On hover: staggered wave left-to-right (idx * staggerDelay)
          // On unhover: flip the whole word down simultaneously as a single unit (delay: 0)
          const delay = forward ? idx * staggerDelay : 0;

          const anim = Motion.animate(
            inner,
            { y: [fromKeyframe, targetY] },
            {
              duration: duration,
              delay: delay,
              ease: easeCurve
            }
          );

          inner._activeAnim = anim;

          anim.finished.then(() => {
            if (inner._activeAnim === anim) {
              inner.style.transform = finalTransform;
              inner._activeAnim = null;
            }
          }).catch(() => {});
        });
      }

      trigger.addEventListener('mouseenter', () => {
        isHovered = true;
        playFlip(true);
      });

      trigger.addEventListener('mouseleave', () => {
        isHovered = false;
        playFlip(false);
      });
    });
  }

  function warmUpCompositor() {
    document.querySelectorAll('.text-flip-inner').forEach(inner => {
      inner.style.transform = 'translateY(0%)';
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
