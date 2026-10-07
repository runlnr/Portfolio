/**
 * FUTURE THREE® Editorial Scroll Interactions
 * Live Seconds Clock, GSAP ScrollTriggers & Parallax Watermarks
 */

/**
 * ==========================================================================
 * USER CONFIGURATION: Future Three® Scroll-Trigger Timing
 * Easily adjust how deep elements must scroll into view before animating:
 * ==========================================================================
 */
window.F3_SCROLL_CONFIG = Object.assign({
  // Root margin bottom offset for intersection detection:
  // '-15%' means element must travel ~15% into the viewport from the bottom before triggering
  rootMargin: '0px 0px -15% 0px',

  // Initial viewport check threshold on page load:
  // 0.78 means element must already be within the top 78% of the viewport to animate immediately
  initialTriggerRatio: 0.78,

  // Intersection threshold (5% of element visible in the active margin area)
  threshold: 0.05,

  // Small delay (in ms) between intersection detection and line mask emergence
  revealDelayMs: 60
}, window.F3_SCROLL_CONFIG || {});

(function () {
  'use strict';

  function initFutureThreeScroll() {
    if (!window.matchMedia('(min-width: 1024px)').matches) return;
    // 1. Scroll-Driven Editorial Cascade Reveal System
    function initScrollReveal() {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const targets = document.querySelectorAll(
        '.f3-intro-lockup, .f3-intro-divider-row, .f3-featured-tag-row, .f3-work-card, .f3-gallery-card-wrap, .f3-gallery-hairline-divider, .f3-services-directory-section .f3-single-divider-row, .f3-services-statement-wrap, .f3-services-directory-grid > .f3-services-col, .f3-section-contact .f3-single-divider-row, .f3-contact-left-col, .f3-contact-action-row, .f3-contact-corners-bar'
      );

      if (!targets.length) return;
      if (!('IntersectionObserver' in window)) return;

      const cfg = window.F3_SCROLL_CONFIG || {};
      const rootMargin = cfg.rootMargin || '0px 0px -15% 0px';
      const threshold = typeof cfg.threshold === 'number' ? cfg.threshold : 0.05;
      const initialRatio = typeof cfg.initialTriggerRatio === 'number' ? cfg.initialTriggerRatio : 0.78;

      targets.forEach(el => {
        el.classList.add('f3-scroll-reveal');
      });

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
            const lineInners = entry.target.querySelectorAll('.f3-line-inner');
            lineInners.forEach(inner => inner.classList.add('is-visible'));
            setTimeout(() => {
              if (entry.target && entry.target.style) {
                entry.target.style.transitionDelay = '0s';
              }
            }, 600);
          }
        });
      }, {
        root: null,
        rootMargin: rootMargin,
        threshold: threshold
      });

      targets.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * initialRatio && rect.bottom > 0) {
          el.classList.add('is-revealed');
          const lineInners = el.querySelectorAll('.f3-line-inner');
          lineInners.forEach(inner => inner.classList.add('is-visible'));
          setTimeout(() => {
            if (el && el.style) {
              el.style.transitionDelay = '0s';
            }
          }, 600);
        } else {
          observer.observe(el);
        }
      });
    }

    initScrollReveal();

    // 2. Future Three® Staggered Line Mask Text Reveal System (Editorial Statements & Quotes)
    function initScrollLineReveal() {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const candidateSelectors = [
        '.f3-intro-statement',
        '.f3-services-statement',
        '.f3-contact-hook-title',
        '.about-intro-statement',
        '.about-manifesto-text',
        '.f3-about-bio-text',
        '.f3-about-quote',
        '[data-split-inview]',
        '[data-line-reveal]'
      ].join(', ');

      const allCandidates = document.querySelectorAll(candidateSelectors);
      const revealTargets = Array.from(allCandidates).filter(el => {
        // Exclude mono text classes or mono ancestors
        if (el.closest('.type-mono-a, .type-mono-b, .type-mono-c, .type-mono-d, [class*="type-mono"], [data-mono]')) return false;
        if (el.matches('.type-mono-a, .type-mono-b, .type-mono-c, .type-mono-d, [class*="type-mono"], [data-mono]')) return false;

        // Exclude footer, buttons, inputs, controls
        if (el.closest('footer, .f3-footer, .f3-footer-location, .f3-signature-text, button, a, input, textarea, select')) return false;

        // Exclude media, canvas, ASCII elements
        if (el.matches('.hero-ascii, .f3-ascii-target, .f3-intro-status, .f3-intro-live-time, .f3-intro-city') || el.closest('.hero-ascii, .f3-ascii-target')) return false;

        const text = el.textContent.trim();
        if (!text || text.length === 0) return false;

        return true;
      });

      if (!revealTargets.length || !('IntersectionObserver' in window)) return;

      function splitIntoLines(el) {
        if (el.dataset.lineRevealReady === 'true') return;

        const originalText = el.textContent.trim();
        if (!originalText) return;
        if (!el.getAttribute('aria-label')) {
          el.setAttribute('aria-label', originalText);
        }

        // Check if explicit <br> tags exist
        const hasManualBr = el.querySelector('br') !== null;
        let lines = [];

        if (hasManualBr) {
          const parts = el.innerHTML
            .replace(/\r\n/g, '\n')
            .split(/<br\s*\/?>/i)
            .map(p => p.replace(/<[^>]+>/g, '').trim())
            .filter(p => p.length > 0);
          if (parts.length > 1) {
            lines = parts;
          }
        }

        if (!lines.length) {
          // Temporarily wrap words to measure natural offsetTop wrapping
          const words = originalText.split(/\s+/);
          el.innerHTML = words
            .map(w => `<span class="f3-temp-word" style="display:inline-block; margin-right:0.25em;">${w}</span>`)
            .join('');

          const wordSpans = Array.from(el.querySelectorAll('.f3-temp-word'));
          let currentLine = [];
          let currentTop = null;

          wordSpans.forEach(span => {
            const top = span.offsetTop;
            if (currentTop === null || Math.abs(top - currentTop) > 6) {
              if (currentLine.length) lines.push(currentLine.join(' '));
              currentLine = [span.textContent];
              currentTop = top;
            } else {
              currentLine.push(span.textContent);
            }
          });
          if (currentLine.length) lines.push(currentLine.join(' '));
        }

        el.innerHTML = '';
        lines.forEach((lineText, idx) => {
          const mask = document.createElement('span');
          mask.className = 'f3-line-mask';
          mask.setAttribute('aria-hidden', 'true');

          const inner = document.createElement('span');
          inner.className = 'f3-line-inner';
          inner.style.setProperty('--line-idx', idx);
          inner.textContent = lineText;

          mask.appendChild(inner);
          el.appendChild(mask);
        });

        el.dataset.lineRevealReady = 'true';
      }

      revealTargets.forEach(splitIntoLines);

      const cfg = window.F3_SCROLL_CONFIG || {};
      const rootMargin = cfg.rootMargin || '0px 0px -15% 0px';
      const threshold = typeof cfg.threshold === 'number' ? cfg.threshold : 0.05;
      const initialRatio = typeof cfg.initialTriggerRatio === 'number' ? cfg.initialTriggerRatio : 0.78;
      const revealDelay = typeof cfg.revealDelayMs === 'number' ? cfg.revealDelayMs : 60;

      function playLineReveal(el) {
        if (!el || el._lineRevealPlayed) return;
        el._lineRevealPlayed = true;

        setTimeout(() => {
          requestAnimationFrame(() => {
            const inners = el.querySelectorAll('.f3-line-inner');
            inners.forEach(inner => {
              inner.classList.add('is-visible');
            });
            el.classList.add('is-revealed');
          });
        }, revealDelay);
      }

      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            playLineReveal(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: rootMargin,
        threshold: threshold
      });

      revealTargets.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * initialRatio && rect.bottom > 0) {
          playLineReveal(el);
        } else {
          revealObserver.observe(el);
        }
      });
    }

    initScrollLineReveal();

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

    if (viewGridBtn && viewListBtn && gridViewContainer && listViewContainer) {
      function setView(mode) {
        if (mode === 'list') {
          viewListBtn.classList.add('is-active');
          viewListBtn.setAttribute('aria-checked', 'true');
          viewGridBtn.classList.remove('is-active');
          viewGridBtn.setAttribute('aria-checked', 'false');

          gridViewContainer.style.display = 'none';
          if (expandWrap) expandWrap.style.display = 'none';
          if (viewCursorTag) viewCursorTag.classList.remove('is-visible');
          listViewContainer.style.display = 'flex';
        }

        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }
      }

      viewGridBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Unclickable / In Development
      });

      viewListBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setView('list');
      });
    }

    // 5. Floating /view/ Cursor Follower Tag for Work Cards & In-Development elements
    let viewCursorTag = document.getElementById('f3-cursor-view-tag');
    if (!viewCursorTag) {
      viewCursorTag = document.createElement('div');
      viewCursorTag.id = 'f3-cursor-view-tag';
      viewCursorTag.className = 'f3-cursor-view-tag';
      viewCursorTag.textContent = '/view/';
      viewCursorTag.setAttribute('aria-hidden', 'true');
      document.body.appendChild(viewCursorTag);
    }

    const f3WorkCards = document.querySelectorAll('.f3-work-card, .f3-gallery-item, #f3-view-grid, [data-cursor]');
    if (f3WorkCards.length > 0 && viewCursorTag) {
      let mouseX = -9999, mouseY = -9999;
      let currentX = -9999, currentY = -9999;
      let isHoveringCard = false;

      f3WorkCards.forEach(card => {
        card.addEventListener('mouseenter', e => {
          isHoveringCard = true;
          const href = (card.getAttribute('href') || '').toLowerCase();
          const cardText = (card.textContent || '').toLowerCase();
          const ariaLabel = (card.getAttribute('aria-label') || '').toLowerCase();
          const customTag = card.getAttribute('data-cursor');
          const isAudi = href.includes('audi') || cardText.includes('audi') || ariaLabel.includes('audi') || cardText.includes('revolut');
          viewCursorTag.textContent = customTag || (isAudi ? '/coming soon/' : '/view/');
          viewCursorTag.classList.add('is-visible');
          mouseX = e.clientX;
          mouseY = e.clientY;
          if (currentX === -9999) {
            currentX = mouseX;
            currentY = mouseY;
            viewCursorTag.style.transform = `translate3d(${currentX + 12}px, ${currentY - 15}px, 0)`;
          }
        });

        card.addEventListener('mouseleave', () => {
          isHoveringCard = false;
          viewCursorTag.classList.remove('is-visible');
        });

        card.addEventListener('mousemove', e => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          if (!isHoveringCard) {
            isHoveringCard = true;
            const href = (card.getAttribute('href') || '').toLowerCase();
            const cardText = (card.textContent || '').toLowerCase();
            const ariaLabel = (card.getAttribute('aria-label') || '').toLowerCase();
            const customTag = card.getAttribute('data-cursor');
            const isAudi = href.includes('audi') || cardText.includes('audi') || ariaLabel.includes('audi') || cardText.includes('revolut');
            viewCursorTag.textContent = customTag || (isAudi ? '/coming soon/' : '/view/');
            viewCursorTag.classList.add('is-visible');
          }
        });
      });

      document.addEventListener('mouseleave', () => {
        isHoveringCard = false;
        viewCursorTag.classList.remove('is-visible');
      });

      let viewRafId = null;
      function startViewCursorAnim() {
        if (viewRafId) return;
        function step() {
          if (isHoveringCard) {
            if (currentX === -9999) {
              currentX = mouseX;
              currentY = mouseY;
            }
            currentX += (mouseX - currentX) * 0.22;
            currentY += (mouseY - currentY) * 0.22;
            viewCursorTag.style.transform = `translate3d(${currentX + 12}px, ${currentY - 15}px, 0)`;
            viewRafId = requestAnimationFrame(step);
          } else {
            viewRafId = null;
          }
        }
        viewRafId = requestAnimationFrame(step);
      }

      f3WorkCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          startViewCursorAnim();
        });
        card.addEventListener('mousemove', () => {
          startViewCursorAnim();
        });
      });
    }

    // 7. Footer Social Hover Handle Switcher (@scherre -> @pxly, @phnm08, @_phnm._)
    function initFooterSignatureHandleSwitcher() {
      const signatureContainer = document.querySelector('.f3-footer-brand-signature');
      const signatureTextEl = signatureContainer ? signatureContainer.querySelector('.f3-signature-text') : null;
      const socialLinks = document.querySelectorAll('.f3-footer-social-link[data-handle]');
      const socialsList = document.querySelector('.f3-footer-socials-list');

      if (!signatureTextEl || socialLinks.length === 0) return;

      const DEFAULT_HANDLE = '@scherre';
      const ASCII_POOL = 'abcdefghijklmnopqrstuvwxyz0123456789_.-';

      function formatHandleToHTML(str) {
        let uIndex = 0;
        return str.split('').map(ch => {
          if (ch === '_') {
            uIndex++;
            return `<span class="neue-haas-underscore underscore-${uIndex}">_</span>`;
          }
          return ch;
        }).join('');
      }

      function getRandomChar() {
        return ASCII_POOL[Math.floor(Math.random() * ASCII_POOL.length)];
      }

      let currentDisplayed = DEFAULT_HANDLE;
      let animRafId = null;

      function scrambleTo(targetText, duration = 280) {
        if (!targetText || targetText === currentDisplayed) return;

        if (animRafId) {
          cancelAnimationFrame(animRafId);
          animRafId = null;
        }

        if (signatureContainer) {
          signatureContainer.setAttribute('aria-label', targetText);
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
          currentDisplayed = targetText;
          signatureTextEl.innerHTML = formatHandleToHTML(targetText);
          return;
        }

        const startText = currentDisplayed;
        currentDisplayed = targetText;
        const maxLen = Math.max(startText.length, targetText.length);
        const startTime = performance.now();

        function frame(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Progressive resolve left to right
          let resultHTML = '';
          let uIndex = 0;

          for (let i = 0; i < maxLen; i++) {
            const charResolveThreshold = 0.15 + (i / Math.max(1, maxLen)) * 0.75;

            if (i >= targetText.length) {
              // Extra trailing characters fade/dissolve out
              if (progress < 0.45) {
                const randCh = getRandomChar();
                if (randCh === '_') {
                  uIndex++;
                  resultHTML += `<span class="neue-haas-underscore underscore-${uIndex}">_</span>`;
                } else {
                  resultHTML += randCh;
                }
              }
            } else {
              const targetChar = targetText[i];
              if (targetChar === '@' || targetChar === '.' || progress >= charResolveThreshold) {
                if (targetChar === '_') {
                  uIndex++;
                  resultHTML += `<span class="neue-haas-underscore underscore-${uIndex}">_</span>`;
                } else {
                  resultHTML += targetChar;
                }
              } else {
                const randCh = getRandomChar();
                if (randCh === '_') {
                  uIndex++;
                  resultHTML += `<span class="neue-haas-underscore underscore-${uIndex}">_</span>`;
                } else {
                  resultHTML += randCh;
                }
              }
            }
          }

          signatureTextEl.innerHTML = resultHTML;

          if (progress < 1) {
            animRafId = requestAnimationFrame(frame);
          } else {
            signatureTextEl.innerHTML = formatHandleToHTML(targetText);
            animRafId = null;
          }
        }

        animRafId = requestAnimationFrame(frame);
      }

      socialLinks.forEach(link => {
        const handle = link.getAttribute('data-handle');
        if (!handle) return;

        // Hover & touch interactions: update to handle and retain as active
        link.addEventListener('mouseenter', () => scrambleTo(handle));
        link.addEventListener('focus', () => scrambleTo(handle));
        link.addEventListener('touchstart', () => scrambleTo(handle), { passive: true });
        link.addEventListener('mouseleave', () => scrambleTo(DEFAULT_HANDLE));
        link.addEventListener('blur', () => scrambleTo(DEFAULT_HANDLE));
      });

      if (socialsList) {
        socialsList.addEventListener('mouseleave', () => scrambleTo(DEFAULT_HANDLE));
      }
    }

    initFooterSignatureHandleSwitcher();

    // 4. Interactive Hover Letter Shuffle on Mono Elements
    // Targets: Nav Status Line, HCMC status text, Studio & Client time labels, Colophon footer notices, and 4-Box Service labels
    const MONO_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    function getRandomMonoChar() {
      return MONO_CHARS[Math.floor(Math.random() * MONO_CHARS.length)];
    }

    function initShuffleOnElement(el) {
      if (!el) return;
      if (el.querySelector('a, button, input')) return;
      el.dataset.shuffleInit = 'true';

      const originalText = el.textContent.trim().replace(/\s+/g, ' ');
      if (!originalText) return;
      const fragment = document.createDocumentFragment();

      for (let i = 0; i < originalText.length; i++) {
        const char = originalText[i];
        if (/\s/.test(char)) {
          const spaceSpan = document.createElement('span');
          spaceSpan.className = 'f3-mono-shuffle-space';
          spaceSpan.innerHTML = '&nbsp;';
          spaceSpan.setAttribute('aria-hidden', 'true');
          fragment.appendChild(spaceSpan);
        } else if (char === '©' || char === '®' || char === '_' || char === '.') {
          const staticSpan = document.createElement('span');
          staticSpan.className = 'f3-mono-shuffle-static';
          staticSpan.textContent = char;
          fragment.appendChild(staticSpan);
        } else {
          const span = document.createElement('span');
          span.className = 'f3-mono-shuffle-letter';
          span.textContent = char;
          span.dataset.original = char;
          fragment.appendChild(span);
        }
      }

      el.innerHTML = '';
      el.appendChild(fragment);

      const letters = el.querySelectorAll('.f3-mono-shuffle-letter');
      letters.forEach(letter => {
        const originalChar = letter.dataset.original;
        let intervalId = null;
        let timeoutId = null;
        let isHovered = false;

        function startShuffling() {
          if (!intervalId) {
            intervalId = setInterval(() => {
              letter.textContent = getRandomMonoChar();
            }, 35);
          }
        }

        function stopShuffling() {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          letter.textContent = originalChar;
        }

        letter._startShuffling = startShuffling;
        letter._stopShuffling = stopShuffling;

        letter.addEventListener('pointerenter', () => {
          isHovered = true;
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          startShuffling();
        });

        letter.addEventListener('pointerleave', () => {
          isHovered = false;
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          timeoutId = setTimeout(() => {
            if (!isHovered) {
              stopShuffling();
            }
            timeoutId = null;
          }, 2000);
        });
      });
    }

    function initMonoLetterShuffle(customTarget) {
      let targets = [];
      if (customTarget) {
        if (customTarget instanceof Node) {
          targets = [customTarget];
        } else if (typeof customTarget === 'string') {
          targets = Array.from(document.querySelectorAll(customTarget));
        } else if (Array.isArray(customTarget) || customTarget instanceof NodeList) {
          targets = Array.from(customTarget);
        }
      } else {
        targets = Array.from(document.querySelectorAll(
          '.nav-status-line, .f3-intro-city, .f3-corner-label, .f3-colophon-left, .f3-colophon-center, .f3-colophon-privacy-link, .f3-showcase-label, .f3-gallery-img-code'
        ));
      }

      targets.forEach(el => {
        if (!el) return;
        if (!customTarget && el.dataset.shuffleInit === 'true') return;
        initShuffleOnElement(el);
      });
    }

    window.initMonoLetterShuffle = initMonoLetterShuffle;
    initMonoLetterShuffle();
  }

  window.initScherreScroll = initFutureThreeScroll;
  window.initFutureThreeScroll = initFutureThreeScroll;

  function handleFutureThreeResponsive() {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      initFutureThreeScroll();
    }
  }

  const f3DesktopQuery = window.matchMedia('(min-width: 1024px)');
  if (f3DesktopQuery.addEventListener) {
    f3DesktopQuery.addEventListener('change', handleFutureThreeResponsive);
  } else {
    f3DesktopQuery.addListener(handleFutureThreeResponsive);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleFutureThreeResponsive);
  } else {
    handleFutureThreeResponsive();
  }
})();
