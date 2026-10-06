/**
 * FUTURE THREE® Editorial Scroll Interactions
 * Live Seconds Clock, GSAP ScrollTriggers & Parallax Watermarks
 */

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

      targets.forEach(el => {
        el.classList.add('f3-scroll-reveal');
      });

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
            setTimeout(() => {
              if (entry.target && entry.target.style) {
                entry.target.style.transitionDelay = '0s';
              }
            }, 600);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08
      });

      targets.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
          el.classList.add('is-revealed');
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

    // 2. Scroll-Driven Typewriter Text Reveal System
    function initScrollTypewriter() {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const typeTargets = document.querySelectorAll(
        '.f3-intro-statement, .f3-services-statement, .f3-contact-hook-title, .about-intro-statement, [data-typewriter]'
      );

      if (!typeTargets.length || !('IntersectionObserver' in window)) return;

      typeTargets.forEach(el => {
        if (el.dataset.typewriterReady === 'true') return;
        if (el.querySelector('input, textarea, select, button, svg, img, video, canvas')) return;

        const originalText = el.textContent.trim();
        if (!originalText) return;
        if (!el.getAttribute('aria-label')) {
          el.setAttribute('aria-label', originalText);
        }

        const chars = [];
        const container = document.createElement('span');
        container.className = 'f3-typewriter-inner';
        container.setAttribute('aria-hidden', 'true');

        function processNode(node) {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            // Tokenize into words and whitespace runs
            const tokens = text.match(/\S+|\s+/g) || [];
            tokens.forEach(token => {
              if (/^\s+$/.test(token)) {
                const spaceSpan = document.createElement('span');
                spaceSpan.className = 'f3-type-space';
                spaceSpan.textContent = ' ';
                container.appendChild(spaceSpan);
              } else {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'f3-type-word';
                for (let i = 0; i < token.length; i++) {
                  const ch = token[i];
                  const charSpan = document.createElement('span');
                  charSpan.className = 'f3-type-char is-hidden';
                  charSpan.textContent = ch;
                  wordSpan.appendChild(charSpan);
                  chars.push(charSpan);
                }
                container.appendChild(wordSpan);
              }
            });
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'BR') {
              container.appendChild(document.createElement('br'));
            } else {
              const wrapper = document.createElement(node.tagName.toLowerCase());
              Array.from(node.attributes).forEach(attr => {
                wrapper.setAttribute(attr.name, attr.value);
              });
              Array.from(node.childNodes).forEach(child => processNode(child));
              container.appendChild(wrapper);
            }
          }
        }

        Array.from(el.childNodes).forEach(node => processNode(node));

        el.innerHTML = '';
        el.appendChild(container);
        el.dataset.typewriterReady = 'true';
        el._typewriterChars = chars;
      });

      function playTypewriter(el) {
        if (!el || el._typewriterPlayed) return;
        el._typewriterPlayed = true;

        const chars = el._typewriterChars;
        if (!chars || !chars.length) return;

        let index = 0;
        const total = chars.length;
        const charInterval = total > 50 ? Math.max(9.5, Math.floor(650 / total)) : 12;
        let lastTime = performance.now();

        function step(now) {
          if (now - lastTime >= charInterval) {
            const stepsToAdvance = Math.min(Math.floor((now - lastTime) / charInterval), 4);
            for (let s = 0; s < stepsToAdvance && index < total; s++) {
              chars[index].classList.remove('is-hidden');
              chars[index].classList.add('is-visible');
              index++;
            }
            lastTime = now;
          }
          if (index < total) {
            requestAnimationFrame(step);
          }
        }
        requestAnimationFrame(step);
      }

      const typeObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            playTypewriter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -30px 0px',
        threshold: 0.1
      });

      typeTargets.forEach(el => {
        if (!el._typewriterChars || !el._typewriterChars.length) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
          playTypewriter(el);
        } else {
          typeObserver.observe(el);
        }
      });
    }

    initScrollTypewriter();

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
