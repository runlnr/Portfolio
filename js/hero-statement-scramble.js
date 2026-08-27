/**
 * Hero Statement Headline Scramble & Auto-Rotation
 * Alternates between:
 *   1) "Nothing here by accident."
 *   2) "Nothing out of place."
 * With dynamic ASCII / cryptographic decode effect on page load and during each text swap.
 * Automatic randomized interval: between 4 and 7 seconds.
 */

(() => {
  const HEADLINES = [
    {
      line1: 'Nothing here',
      prefix: 'by ',
      serif: 'accident.'
    },
    {
      line1: 'Nothing out',
      prefix: 'of ',
      serif: 'place.'
    }
  ];

  const ASCII_GLYPHS = '!<>-_\\/[]{}—=+*^?#_0123456789ABCDEF~';

  function getRandomGlyph() {
    return ASCII_GLYPHS[Math.floor(Math.random() * ASCII_GLYPHS.length)];
  }

  let currentIndex = 0;
  let swapTimeoutId = null;
  let isScrambling = false;
  let isInitialized = false;

  /**
   * Random duration between 4,000ms (4s) and 7,000ms (7s)
   */
  function getRandomInterval() {
    return Math.floor(4000 + Math.random() * 3000);
  }

  /**
   * Scrambles an individual element's text to targetText with a cinematic, slower ASCII decode effect.
   */
  function scrambleElement(el, targetText, duration = 1250, delay = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (!el) {
          resolve();
          return;
        }

        const originalText = el.textContent || '';
        const maxLen = Math.max(originalText.length, targetText.length);
        const fps = 25;
        const totalFrames = Math.max(22, Math.floor((duration / 1000) * fps));
        let frame = 0;

        // Progressive stagger: characters resolve left-to-right with deliberate wave
        const resolveFrames = [];
        for (let i = 0; i < maxLen; i++) {
          const staggerRatio = i / Math.max(1, maxLen);
          const startResolve = Math.floor(totalFrames * (0.34 + staggerRatio * 0.54));
          resolveFrames.push(startResolve);
        }

        const interval = setInterval(() => {
          frame++;
          let result = '';

          for (let i = 0; i < maxLen; i++) {
            if (i >= targetText.length) {
              // Extra characters from old text: scramble briefly, then vanish
              if (frame < totalFrames * 0.45) {
                result += getRandomGlyph();
              }
            } else {
              const targetChar = targetText[i];
              if (targetChar === ' ') {
                result += ' ';
              } else if (frame >= resolveFrames[i]) {
                result += targetChar;
              } else {
                result += getRandomGlyph();
              }
            }
          }

          el.textContent = result;

          if (frame >= totalFrames) {
            clearInterval(interval);
            el.textContent = targetText;
            resolve();
          }
        }, 1000 / fps);
      }, delay);
    });
  }

  /**
   * Performs the ASCII scramble transition to target headline index
   */
  async function performScramble(targetIdx) {
    const l1 = document.querySelector('.hero-statement-line1');
    const l2 = document.querySelector('.hero-statement-line2');
    if (!l1 || !l2) return;

    let prefixSpan = l2.querySelector('.hero-statement-prefix');
    let serifSpan = l2.querySelector('.hero-statement-serif');

    // Ensure DOM structure has clean prefixSpan and serifSpan
    if (!prefixSpan) {
      prefixSpan = document.createElement('span');
      prefixSpan.className = 'hero-statement-prefix';
      prefixSpan.textContent = 'by ';
      if (serifSpan) {
        l2.insertBefore(prefixSpan, serifSpan);
        let child = l2.firstChild;
        while (child && child !== prefixSpan) {
          const next = child.nextSibling;
          if (child.nodeType === Node.TEXT_NODE) l2.removeChild(child);
          child = next;
        }
      } else {
        l2.appendChild(prefixSpan);
      }
    }

    if (!serifSpan) {
      serifSpan = document.createElement('span');
      serifSpan.className = 'hero-statement-serif';
      serifSpan.textContent = 'accident.';
      l2.appendChild(serifSpan);
    }

    isScrambling = true;
    const target = HEADLINES[targetIdx];

    // Rhythmic, deliberate stagger across the parts: line1 -> prefix -> serif
    await Promise.all([
      scrambleElement(l1, target.line1, 1250, 0),
      scrambleElement(prefixSpan, target.prefix, 1150, 80),
      scrambleElement(serifSpan, target.serif, 1350, 160)
    ]);

    currentIndex = targetIdx;
    isScrambling = false;
  }

  /**
   * Schedules the next swap at a randomized interval between 4s and 7s
   */
  function scheduleNextSwap() {
    if (swapTimeoutId) {
      clearTimeout(swapTimeoutId);
      swapTimeoutId = null;
    }

    const nextDelay = getRandomInterval();

    swapTimeoutId = setTimeout(async () => {
      // Pause if tab is inactive/hidden, resume when user returns
      if (document.hidden) {
        const onVisible = () => {
          if (!document.hidden) {
            document.removeEventListener('visibilitychange', onVisible);
            scheduleNextSwap();
          }
        };
        document.addEventListener('visibilitychange', onVisible);
        return;
      }

      const nextIndex = (currentIndex + 1) % HEADLINES.length;
      await performScramble(nextIndex);
      scheduleNextSwap();
    }, nextDelay);
  }

  /**
   * Initializes headline scramble effect on page reveal / load
   */
  function initHeroHeadlineScramble(force = false) {
    if (isInitialized && !force) return;
    const headline = document.querySelector('.hero-statement-headline');
    if (!headline) return;

    isInitialized = true;

    // Trigger initial ASCII decode reveal
    performScramble(currentIndex).then(() => {
      scheduleNextSwap();
    });
  }

  // Expose API for external control and testing
  window.initHeroHeadlineScramble = initHeroHeadlineScramble;
  window.heroStatementScramble = {
    performScramble,
    scheduleNextSwap,
    get currentIndex() { return currentIndex; },
    get isScrambling() { return isScrambling; },
    HEADLINES
  };

  // Immediate initialize on DOMContentLoaded if intro loader has already run
  document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('np_has_seen_intro')) {
      initHeroHeadlineScramble(false);
    }
  });
})();
