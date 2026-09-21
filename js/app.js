/**
 * ==========================================================================
 * USER CONFIGURATION: Loading Screen & Page Transitions
 * Easily adjust timing (in milliseconds) below:
 * ==========================================================================
 */

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// 1. Loading Screen Fill & Reveal Speeds (in milliseconds)
window.LOADER_CONFIG = {
  // Fill duration: Time (ms) for logo to fill from grey to solid white
  fillDuration: 5000,
  // Fill easing exponent: Fast in, slow out curve (1.5 = energetic initial surge, smooth deceleration)
  fillEasingExp: 1.5,
  // Step 1: Hold fully white logo for 2 seconds (2000ms)
  whiteHoldDuration: 2000,
  // Step 2: Duration for logo itself to fade out (800ms)
  logoFadeDuration: 800,
  // Step 3: Wait on pure solid black screen for 1 second (1000ms)
  blackHoldDuration: 1000,
  // Step 4: Fade-out reveal: Duration (ms) for black loader overlay to fade into hero page
  fadeDuration: 1100,
  slideUpDuration: 1100
};

// 2. Page Transition Speed (Silk-Smooth Cross-Fade: 1100ms fade + 800ms black screen wait + 1100ms reveal)
window.TRANSITION_CONFIG = {
  coverDuration: 1100,   // 1100ms to fade out to black on click
  holdDuration: 800,     // 800ms black screen wait in the middle
  revealDuration: 1100,  // 1100ms to fade in the new page on arrival
  ease: 'cubic-bezier(0.16, 1, 0.3, 1)'
};

// 3. ASCII Decode Durations (in milliseconds) — relaxed cinematic decode speed
window.PROJECT_SCRAMBLE_DURATION = 1350; // Total duration for project page context ASCII decode
window.HERO_SCRAMBLE_DURATION = 1250;    // Total duration for hero bottom text ASCII decode

// Helper: Replay loader anytime in Console using `replayIntroLoader()`
window.replayIntroLoader = function () {
  sessionStorage.removeItem('np_has_seen_intro');
  window.location.reload();
};

/**
 * 3. Viewport Text Reveal Engine (Authentic In-Place ASCII Shuffle Appear)
 * Runs strictly once after the page fade-in transition finishes
 */
let hasRevealedViewportText = false;

window.triggerViewportTextReveal = function () {
  if (hasRevealedViewportText) return;
  hasRevealedViewportText = true;

  const isProjectPage = !!document.querySelector('.project-main-wrap');

  if (isProjectPage) {
    // 1. Project Page: Simultaneous Terminal Matrix ASCII appear across all context content
    if (typeof window.triggerProjectAsciiAppear === 'function') {
      window.triggerProjectAsciiAppear();
    } else {
      let retries = 0;
      const checkProjectAscii = setInterval(() => {
        retries++;
        if (typeof window.triggerProjectAsciiAppear === 'function' || retries > 12) {
          clearInterval(checkProjectAscii);
          if (typeof window.triggerProjectAsciiAppear === 'function') {
            window.triggerProjectAsciiAppear();
          }
        }
      }, 25);
    }
  } else {
    // 2. Hero Page: Authentic ASCII appear animation on "Nothing here/" and "/by accident."
    if (typeof window.triggerHeroAsciiAppear === 'function') {
      window.triggerHeroAsciiAppear();
    } else {
      let retry = 0;
      const checkHeroAscii = setInterval(() => {
        retry++;
        if (typeof window.triggerHeroAsciiAppear === 'function' || retry > 12) {
          clearInterval(checkHeroAscii);
          if (typeof window.triggerHeroAsciiAppear === 'function') {
            window.triggerHeroAsciiAppear();
          }
        }
      }, 25);
    }
  }
};

/**
/**
 * Developer Helpers to inspect & calibrate loading screen logo:
 * - previewLoader('grey')   : Freezes loader in initial grey state
 * - previewLoader('half')   : Freezes loader 50% filled with white
 * - previewLoader('white')  : Freezes loader 100% filled with white
 * - previewLoader('fill')   : Plays the 3-second white fill animation live
 * - previewLoader('close')  : Hides loader and resumes normal view
 */
window.previewLoader = function (state = 'white') {
  const loader = document.getElementById('site-loader');
  const fillWrap = document.getElementById('loader-logo-fill-wrap');
  if (!loader) return;
  if (state === 'close' || state === false) {
    loader.style.display = 'none';
    loader.style.pointerEvents = 'none';
    document.body.classList.remove('is-loading');
    return;
  }
  loader.style.display = 'block';
  loader.style.pointerEvents = 'all';
  loader.classList.remove('slide-up', 'fade-out');
  const logoCenter = document.getElementById('loader-logo-center');
  if (logoCenter) logoCenter.classList.remove('fade-out');
  document.body.classList.add('is-loading');

  if (state === 'grey' || state === 'start') {
    if (fillWrap) fillWrap.style.clipPath = 'inset(100% 0 0 0)';
  } else if (state === '50' || state === 'half') {
    if (fillWrap) fillWrap.style.clipPath = 'inset(50% 0 0 0)';
  } else if (state === 'fill') {
    if (fillWrap) {
      fillWrap.style.clipPath = 'inset(100% 0 0 0)';
      let start = null;
      const duration = (window.LOADER_CONFIG && window.LOADER_CONFIG.fillDuration) || 5000;
      const exp = (window.LOADER_CONFIG && typeof window.LOADER_CONFIG.fillEasingExp === 'number') ? window.LOADER_CONFIG.fillEasingExp : 1.5;
      function step(now) {
        if (!start) start = now;
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, exp);
        fillWrap.style.clipPath = `inset(${(1 - eased) * 100}% 0 0 0)`;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  } else {
    // default: 'white'
    if (fillWrap) fillWrap.style.clipPath = 'inset(0% 0 0 0)';
  }
};
window.freezeIntroLoader = window.previewLoader;

document.addEventListener('DOMContentLoaded', () => {

  // 1. First-Time Access Check & Intro Loader (3-second logo fill, then slide up)
  const loader = document.getElementById('site-loader');
  const fillWrap = document.getElementById('loader-logo-fill-wrap');
  const hasSeenIntro = sessionStorage.getItem('np_has_seen_intro');

  let loaderFinished = !!hasSeenIntro;

  if (!hasSeenIntro && loader) {
    document.body.classList.add('is-loading');

    const cfg = Object.assign({
      fillDuration: 5000,
      fillEasingExp: 1.5,
      settlingHold: 0,
      slideUpDuration: 1100
    }, window.LOADER_CONFIG || {});

    let startTime = null;

    function animateFill(now) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / cfg.fillDuration, 1);
      // Fast in, slow out easing: starts with an energetic surge and smoothly settles into the top
      const exp = typeof cfg.fillEasingExp === 'number' ? cfg.fillEasingExp : 1.5;
      const eased = 1 - Math.pow(1 - progress, exp);
      const clipBottom = (1 - eased) * 100;

      if (fillWrap) {
        fillWrap.style.clipPath = `inset(${clipBottom}% 0 0 0)`;
      }

      if (progress < 1) {
        requestAnimationFrame(animateFill);
      } else {
        if (fillWrap) {
          fillWrap.style.clipPath = 'inset(0% 0 0 0)';
        }
        onFillComplete();
      }
    }

    requestAnimationFrame(animateFill);

    function onFillComplete() {
      const whiteHold = typeof cfg.whiteHoldDuration === 'number' ? cfg.whiteHoldDuration : 2000;
      const logoFade = typeof cfg.logoFadeDuration === 'number' ? cfg.logoFadeDuration : 800;
      const blackHold = typeof cfg.blackHoldDuration === 'number' ? cfg.blackHoldDuration : 1000;
      const fadeDuration = typeof cfg.fadeDuration === 'number' ? cfg.fadeDuration : (typeof cfg.slideUpDuration === 'number' ? cfg.slideUpDuration : 1100);

      const logoCenter = document.getElementById('loader-logo-center');

      // 1. Keep the fully white logo there for 2 seconds (2000ms)
      setTimeout(() => {
        // 2. Fade out the logo
        if (logoCenter) {
          logoCenter.style.transition = `opacity ${logoFade}ms cubic-bezier(0.16, 1, 0.3, 1)`;
          logoCenter.classList.add('fade-out');
        }

        // 3. Wait for logo fade duration + 1 second on solid black screen
        setTimeout(() => {
          // 4. Fade into the hero page
          loader.style.transition = `opacity ${fadeDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
          loader.classList.add('slide-up', 'fade-out');
          document.body.classList.remove('is-loading');
          document.body.classList.add('loader-revealed');
          loaderFinished = true;
          sessionStorage.setItem('np_has_seen_intro', 'true');
          initHeroTvInteraction();

          // Start ASCII appear decoding immediately as hero fade begins (zero delay)
          if (window.triggerHeroAsciiAppear) {
            window.triggerHeroAsciiAppear();
          }

          if (window.location.hash === '#f3-portfolio') {
            setTimeout(() => scrollToPortfolioSection(true), 400);
          }

          // Remove loader once page fade completes
          setTimeout(() => {
            loader.style.display = 'none';
            loader.style.pointerEvents = 'none';
          }, fadeDuration);
        }, logoFade + blackHold);
      }, whiteHold);
    }
  } else {
    if (loader) {
      loader.style.display = 'none';
      loader.style.pointerEvents = 'none';
    }
    document.body.classList.remove('is-loading');
    document.body.classList.add('loader-revealed');
    initHeroTvInteraction();
    if (window.initHeroHeadlineScramble) {
      window.initHeroHeadlineScramble(false);
    }
    if (window.location.hash === '#f3-portfolio') {
      setTimeout(() => scrollToPortfolioSection(true), 250);
    }
  }

  // Helper: Smooth scroll to the Portfolio / Works section on the hero site
  function scrollToPortfolioSection(smooth = true) {
    const portfolio = document.getElementById('f3-portfolio');
    if (!portfolio) {
      const curPath = window.location.pathname;
      const isHome = curPath === '/' || curPath.endsWith('/') || curPath.endsWith('/index.html') || curPath.endsWith('index.html');
      if (!isHome) {
        navigateTo('index.html#f3-portfolio');
      }
      return;
    }
    if (window.motionStack && window.motionStack.lenis) {
      window.motionStack.lenis.resize();
      window.motionStack.lenis.scrollTo(portfolio, { offset: -20, immediate: !smooth, duration: smooth ? 1.2 : 0 });
    } else if (window.lenis) {
      window.lenis.scrollTo(portfolio, { offset: -20, immediate: !smooth, duration: smooth ? 1.2 : 0 });
    } else {
      portfolio.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  }
  window.scrollToPortfolioSection = scrollToPortfolioSection;

  // 1b. Hero TV Setup (Hover & Tilt disabled per user instruction)
  function initHeroTvInteraction() {
    const tvWrapper = document.getElementById('hero-tv-wrapper');
    if (tvWrapper) {
      tvWrapper.style.transform = 'none';
    }
  }

  // 2. Multi-Page Navigation Helper with Smooth Fade Transition
  let isNavigating = false;

  function navigateTo(url) {
    if (!url) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const curtain = document.getElementById('page-transition-curtain');

    if (prefersReducedMotion || !curtain || isNavigating) {
      window.location.href = url;
      return;
    }

    isNavigating = true;
    sessionStorage.setItem('np_is_navigating', 'true');

    // Phase 1: Smoothly fade dark overlay in (opacity 0 -> 1)
    curtain.classList.remove('is-revealing');
    curtain.classList.add('is-covering');

    const duration = (window.TRANSITION_CONFIG && window.TRANSITION_CONFIG.coverDuration) || 1100;
    setTimeout(() => {
      window.location.href = url;
    }, duration);
  }
  window.navigateTo = navigateTo;

  // Reveal incoming page smoothly (dark overlay fades out: opacity 1 -> 0)
  function initPageTransitions() {
    const curtain = document.getElementById('page-transition-curtain');
    const isNavigatingIn = sessionStorage.getItem('np_is_navigating') === 'true';

    if (curtain && isNavigatingIn) {
      const holdDuration = (window.TRANSITION_CONFIG && window.TRANSITION_CONFIG.holdDuration) || 800;
      const revealDuration = (window.TRANSITION_CONFIG && window.TRANSITION_CONFIG.revealDuration) || 1100;

      // Force layout reflow so opacity: 1 is guaranteed painted before fade-out starts
      void curtain.offsetHeight;

      // Wait 800ms on solid black screen before fading in the new page
      setTimeout(() => {
        requestAnimationFrame(() => {
          // Phase 3: Smoothly fade dark overlay out (opacity 1 -> 0)
          curtain.classList.remove('is-covering');
          curtain.classList.add('is-revealing');
          document.documentElement.classList.remove('is-navigating-in');

          // Trigger appearing animation IMMEDIATELY as fade begins (ZERO DELAY):
          if (window.triggerViewportTextReveal) {
            window.triggerViewportTextReveal();
          }

          setTimeout(() => {
            curtain.classList.remove('is-revealing');
            sessionStorage.removeItem('np_is_navigating');
            isNavigating = false;
          }, revealDuration);
        });
      }, holdDuration);
    } else if (!isNavigatingIn) {
      document.documentElement.classList.remove('is-navigating-in');
    }

    // Intercept internal page link clicks across the site
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Ignore hash-only anchors or JS actions
      if (href.startsWith('#') || href.startsWith('javascript:')) return;

      // Ignore project modal triggers and in-situ overlay links
      if (link.closest('.f3-work-card, .f3-list-item-row') || link.hasAttribute('data-project-id') || link.closest('#pm-modal-overlay')) {
        return;
      }

      // Ignore new tab links, downloads, mailto, tel
      if (link.target === '_blank' || link.hasAttribute('download')) return;
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return;

      // Check external vs internal domain
      try {
        const targetUrl = new URL(href, window.location.href);
        if (targetUrl.origin !== window.location.origin) return;

        // If target is same path and query with hash, allow smooth scroll anchor
        if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search && targetUrl.hash) {
          return;
        }

        e.preventDefault();
        navigateTo(href);
      } catch (err) {
        // Fallback for relative paths
        e.preventDefault();
        navigateTo(href);
      }
    });

    // Reset on browser back/forward history navigation (bfcache)
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        sessionStorage.removeItem('np_is_navigating');
        document.documentElement.classList.remove('is-navigating-in');
        if (curtain) {
          curtain.classList.remove('is-covering', 'is-revealing');
        }
        isNavigating = false;
      }
    });
  }

  initPageTransitions();

  function updateActiveNavLinks(url) {
    const cleanUrl = (url || window.location.pathname).split('?')[0].split('#')[0];
    const isHomePage = cleanUrl === '/' || cleanUrl.endsWith('index.html') || cleanUrl === '';

    document.querySelectorAll('.nav-link, .hero-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const cleanHref = href.split('?')[0].split('#')[0];

      // Pure hash anchors (like #f3-portfolio) should not match full page URLs; handled by scroll-spy
      if (!cleanHref) {
        link.classList.remove('active');
        return;
      }

      if (isHomePage) {
        if (cleanHref === 'index.html' || cleanHref === '/') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      } else {
        if (cleanHref !== 'index.html' && cleanHref !== '/' && cleanUrl.endsWith(cleanHref)) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  // Portfolio Section Scroll-Spy (activates "Works" square only when portfolio is in view)
  function initPortfolioScrollSpy() {
    const portfolio = document.getElementById('f3-portfolio');
    const worksLink = document.getElementById('nav-works-link') || document.querySelector('a[href="#f3-portfolio"]');
    if (!portfolio || !worksLink) return;

    let portfolioTop = 0;
    let portfolioBottom = 0;

    function updatePortfolioMetrics() {
      const rect = portfolio.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset || 0;
      portfolioTop = rect.top + scrollY;
      portfolioBottom = rect.bottom + scrollY;
    }

    updatePortfolioMetrics();
    window.addEventListener('resize', updatePortfolioMetrics, { passive: true });

    function checkPosition(currentY) {
      const y = typeof currentY === 'number' ? currentY : (window.scrollY || window.pageYOffset || 0);
      const topInView = portfolioTop - y;
      const bottomInView = portfolioBottom - y;
      const isInView = topInView <= 200 && bottomInView >= 150;
      if (isInView) {
        worksLink.classList.add('active');
      } else {
        worksLink.classList.remove('active');
      }
    }

    let spyLenisHooked = false;
    function hookSpyLenis() {
      if (window.motionStack && window.motionStack.lenis && !spyLenisHooked) {
        spyLenisHooked = true;
        window.motionStack.lenis.on('scroll', (e) => checkPosition(e.scroll));
        return true;
      }
      return false;
    }

    window.addEventListener('scroll', () => {
      if (!spyLenisHooked) {
        if (!hookSpyLenis()) {
          checkPosition();
        }
      }
    }, { passive: true });

    setTimeout(() => {
      hookSpyLenis();
      updatePortfolioMetrics();
    }, 100);

    checkPosition();
  }

  // 3c. Nav Bar Status Line ASCII Scramble Transition on Scroll
  // Cycles between:
  //   State 'sharp': "Looking sharp today" (Hero Viewport)
  //   State 'works': "What stood out"       (Manifesto / Featured Works Section)
  function initNavStatusScramble() {
    const statusEl = document.getElementById('nav-status-line');
    const introSection = document.getElementById('f3-intro') || document.querySelector('.f3-section-intro');
    if (!statusEl || !introSection) return;

    const TEXT_HERO = 'Looking sharp today';
    const TEXT_WORKS = 'What stood out';
    const ASCII_GLYPHS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~\\X#0123456789ABCDEF!?:;';

    function getRandomGlyph() {
      return ASCII_GLYPHS[Math.floor(Math.random() * ASCII_GLYPHS.length)];
    }

    let currentState = 'sharp'; // 'sharp' | 'works'
    let isScrambling = false;
    let queuedState = null;
    let activeIntervalId = null;

    let introTop = 0;
    function updateIntroMetrics() {
      const rect = introSection.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset || 0;
      introTop = rect.top + scrollY;
    }

    updateIntroMetrics();
    window.addEventListener('resize', updateIntroMetrics, { passive: true });

    function scrambleNavText(targetText, duration = 700) {
      return new Promise((resolve) => {
        if (activeIntervalId) {
          clearInterval(activeIntervalId);
          activeIntervalId = null;
        }

        const startText = statusEl.textContent.trim() || TEXT_HERO;
        const maxLen = Math.max(startText.length, targetText.length);
        const fps = 36;
        const totalFrames = Math.max(20, Math.floor((duration / 1000) * fps));
        let frame = 0;

        // Shuffled resolution order (randomized indices, NOT progressive left-to-right)
        const indices = Array.from({ length: maxLen }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        const resolveFrames = new Array(maxLen);
        for (let k = 0; k < maxLen; k++) {
          const charIndex = indices[k];
          const staggerRatio = k / Math.max(1, maxLen);
          resolveFrames[charIndex] = Math.floor(totalFrames * (0.30 + staggerRatio * 0.55));
        }

        activeIntervalId = setInterval(() => {
          frame++;
          let result = '';

          for (let i = 0; i < maxLen; i++) {
            if (i >= targetText.length) {
              // Trailing character dissolve
              if (frame < totalFrames * 0.5) {
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

          statusEl.textContent = result;

          if (frame >= totalFrames) {
            clearInterval(activeIntervalId);
            activeIntervalId = null;
            statusEl.textContent = targetText;
            resolve();
          }
        }, 1000 / fps);
      });
    }

    async function transitionTo(targetState) {
      if (currentState === targetState && !isScrambling) return;

      if (isScrambling) {
        queuedState = targetState;
        return;
      }

      currentState = targetState;
      isScrambling = true;
      const targetText = targetState === 'works' ? TEXT_WORKS : TEXT_HERO;

      await scrambleNavText(targetText, 700);
      isScrambling = false;

      if (queuedState && queuedState !== currentState) {
        const next = queuedState;
        queuedState = null;
        transitionTo(next);
      } else {
        queuedState = null;
      }
    }

    function checkNavScroll(currentY) {
      const y = typeof currentY === 'number' ? currentY : (window.scrollY || window.pageYOffset || 0);
      const viewportHeight = window.innerHeight || 800;
      // Trigger threshold: when #f3-intro top reaches ~30% into viewport from bottom
      const threshold = viewportHeight * 0.70;
      const distFromTop = introTop - y;

      if (distFromTop <= threshold) {
        transitionTo('works');
      } else {
        transitionTo('sharp');
      }
    }

    let scrambleLenisHooked = false;
    function hookScrambleLenis() {
      if (window.motionStack && window.motionStack.lenis && !scrambleLenisHooked) {
        scrambleLenisHooked = true;
        window.motionStack.lenis.on('scroll', (e) => checkNavScroll(e.scroll));
        return true;
      }
      return false;
    }

    window.addEventListener('scroll', () => {
      if (!scrambleLenisHooked) {
        if (!hookScrambleLenis()) {
          checkNavScroll();
        }
      }
    }, { passive: true });

    setTimeout(() => {
      hookScrambleLenis();
      updateIntroMetrics();
      checkNavScroll();
    }, 100);

    checkNavScroll();
  }

  window.initNavStatusScramble = initNavStatusScramble;
  initPortfolioScrollSpy();
  initNavStatusScramble();

  function rehydratePage(url, mainElement) {
    // Re-initialize Lucide Icons
    if (window.initIcons) window.initIcons();

    // Route-specific initializers
    if (url.includes('works.html')) {
      if (window.initWorksPage) window.initWorksPage();
    } else if (url.includes('project.html')) {
      if (window.initProjectPage) window.initProjectPage();
    } else if (url.includes('contact.html')) {
      if (window.initContactPage) window.initContactPage();
    } else if (url.includes('index.html') || url.split('#')[0].endsWith('/') || url.includes('#f3-portfolio')) {
      if (window.initHeroTvAscii) {
        window.initHeroTvAscii();
      }
      if (window.initHeroScrollTransition) {
        setTimeout(() => window.initHeroScrollTransition(), 50);
      }
      if (window.initFutureThreeScroll) {
        window.initFutureThreeScroll();
      }
      initHeroTvInteraction();
      initPortfolioScrollSpy();
      initNavStatusScramble();
      if (window.initModularDropdown) {
        window.initModularDropdown();
      }
      if (window.initTextFlip) {
        window.initTextFlip();
      }
      if (window.initHeroHeadlineScramble) {
        window.initHeroHeadlineScramble(true);
      }
      if (window.initLavaSparks) {
        window.initLavaSparks();
      }
    }

    // Refresh GSAP ScrollTrigger & Motion Stack
    if (window.motionStack) {
      window.motionStack.initScrollReveals();
      window.motionStack.initMagneticButtons();
      window.motionStack.refresh();
    }

    if (typeof updateNavbarTheme === 'function') {
      updateNavbarTheme();
    }
  }

  // Intercept internal page link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    const target = link.getAttribute('target');

    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('javascript:') || target === '_blank' || e.metaKey || e.ctrlKey) {
      return;
    }

    const curNavPath = window.location.pathname;
    const isHomePage = curNavPath === '/' || curNavPath.endsWith('/') || curNavPath.endsWith('/index.html') || curNavPath.endsWith('index.html');

    // Direct click on N/P brand logo / Home link
    const isBrandHomeClick = link.classList.contains('hero-nav-brand') ||
      link.classList.contains('nav-box-brand') ||
      link.getAttribute('aria-label')?.includes('Home') ||
      link.querySelector('.nav-brand-logo');

    if (isBrandHomeClick) {
      if (typeof closeNavDropdown === 'function') {
        closeNavDropdown();
      }

      if (isHomePage) {
        e.preventDefault();
        if (window.location.hash) {
          if (window.history.pushState) {
            window.history.pushState(null, '', window.location.pathname);
          }
        }
        if (window.motionStack && window.motionStack.lenis) {
          window.motionStack.lenis.scrollTo(0, { immediate: false, duration: 0.8 });
        } else if (window.lenis) {
          window.lenis.scrollTo(0, { immediate: false, duration: 0.8 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      } else {
        // When on a subpage (e.g. project.html), smoothly cross-fade to index.html
        e.preventDefault();
        navigateTo('index.html');
        return;
      }
    }

    // In-page hash anchor clicks on the home page (e.g. #f3-portfolio, #f3-intro, #f3-footer)
    if (href.startsWith('#') || (isHomePage && (href.startsWith('index.html#') || href.startsWith('/#')))) {
      const hash = href.includes('#') ? '#' + href.split('#')[1] : href;
      const targetElem = document.querySelector(hash);
      if (targetElem) {
        e.preventDefault();
        if (typeof closeNavDropdown === 'function') {
          closeNavDropdown();
        }
        if (window.motionStack && window.motionStack.lenis) {
          window.motionStack.lenis.scrollTo(targetElem, { offset: -20, duration: 1.0 });
        } else if (window.lenis) {
          window.lenis.scrollTo(targetElem, { offset: -20, duration: 1.0 });
        } else {
          targetElem.scrollIntoView({ behavior: 'smooth' });
        }
        if (window.history.pushState) {
          window.history.pushState(null, '', hash);
        }
        return;
      }
    }
  });

  // Handle browser back/forward buttons smoothly
  window.addEventListener('popstate', () => {
    if (window.location.hash) {
      const targetElem = document.querySelector(window.location.hash);
      if (targetElem) {
        if (window.motionStack && window.motionStack.lenis) {
          window.motionStack.lenis.scrollTo(targetElem, { offset: -20, duration: 0.8 });
        } else {
          targetElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  });


  // 3. Dynamic Navbar Theme (Consistent Dark Theme across all sections)
  function updateNavbarTheme() {
    const navs = document.querySelectorAll('.hero-top-nav, .site-nav-top');
    if (!navs.length) return;

    // Resting viewport position of navbar (~52px from top)
    const probeY = 52;
    const probeX = Math.max(30, Math.min(window.innerWidth - 30, window.innerWidth / 2));

    let detectedTheme = 'dark'; // All-black background site

    // Generic element scanner for specific sections with explicit overrides
    if (document.elementsFromPoint) {
      const elements = document.elementsFromPoint(probeX, probeY);
      for (const el of elements) {
        // Skip fixed overlays, nav, loaders, curtains, and particles
        if (
          el.closest('.hero-top-nav, .site-nav-top, .site-loader-overlay, .page-transition-curtain, #hero-spark-canvas, .hero-spark-canvas')
        ) {
          continue;
        }

        // Section data-theme attribute has highest priority
        const themeAttr = el.closest('[data-theme]')?.getAttribute('data-theme');
        if (themeAttr === 'light' || themeAttr === 'dark') {
          detectedTheme = themeAttr;
          break;
        }

        // Specific class checks
        if (el.closest('.theme-light, .light-section')) {
          detectedTheme = 'light';
          break;
        }
        if (el.closest('.theme-dark, .dark-section')) {
          detectedTheme = 'dark';
          break;
        }

        // Check if inside hero section
        if (el.closest('#hero-viewport, .hero-center-viewport')) {
          detectedTheme = 'dark';
          break;
        }

        // Check computed background color luminance
        const computedBg = window.getComputedStyle(el).backgroundColor;
        if (computedBg && computedBg !== 'transparent' && computedBg !== 'rgba(0, 0, 0, 0)') {
          const match = computedBg.match(/\d+/g);
          if (match && match.length >= 3) {
            const r = parseInt(match[0], 10);
            const g = parseInt(match[1], 10);
            const b = parseInt(match[2], 10);
            const a = match[3] !== undefined ? parseFloat(match[3]) : 1;
            if (a > 0.4) {
              const brightness = (r * 299 + g * 587 + b * 114) / 1000;
              detectedTheme = brightness > 140 ? 'light' : 'dark';
              break;
            }
          }
        }
      }
    }

    navs.forEach(nav => {
      if (detectedTheme === 'light') {
        nav.classList.add('nav-theme-light');
        nav.classList.remove('nav-theme-dark');
      } else {
        nav.classList.add('nav-theme-dark');
        nav.classList.remove('nav-theme-light');
      }
    });
  }

  window.updateNavbarTheme = updateNavbarTheme;

  // 3b. Permanent Navigation Bar Visibility on Scroll (Never hides on scroll down)
  const navElements = document.querySelectorAll('.hero-top-nav, .site-nav-top');
  let heroBottomCache = 0;

  function updateHeroMetrics() {
    const heroViewport = document.getElementById('hero-viewport');
    if (heroViewport) {
      const rect = heroViewport.getBoundingClientRect();
      heroBottomCache = rect.top + (window.scrollY || window.pageYOffset || 0) + heroViewport.offsetHeight;
    } else {
      heroBottomCache = 0;
    }
  }

  function handleNavScroll(currentY) {
    updateNavbarTheme();
    // Navbar stays permanently visible across all scroll positions
    navElements.forEach(el => el.classList.remove('nav-hidden'));
  }

  let lenisNavHooked = false;
  function hookLenisNav() {
    if (window.motionStack && window.motionStack.lenis && !lenisNavHooked) {
      lenisNavHooked = true;
      window.motionStack.lenis.on('scroll', (e) => {
        handleNavScroll(e.scroll);
      });
      return true;
    }
    return false;
  }

  window.addEventListener('scroll', () => {
    if (!lenisNavHooked) {
      if (!hookLenisNav()) {
        handleNavScroll(window.scrollY || window.pageYOffset || 0);
      }
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    updateNavbarTheme();
    updateHeroMetrics();
  }, { passive: true });

  // Initial call on page boot
  updateHeroMetrics();
  updateNavbarTheme();

  // Hook into Lenis smooth scroll updates
  setTimeout(() => {
    hookLenisNav();
    updateHeroMetrics();
  }, 100);

  // 4. Live Ho Chi Minh City / GMT+7 Clock & Date
  function updateLiveClock() {
    const clockElements = document.querySelectorAll('.live-clock');
    const dateElements = document.querySelectorAll('.live-date');
    const now = new Date();

    try {
      const clockOptions = {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      const timeStr = new Intl.DateTimeFormat('en-US', clockOptions).format(now).toUpperCase();
      clockElements.forEach(el => {
        if (el.classList.contains('header-clock')) {
          el.textContent = `${timeStr} (GMT+7)`;
        } else {
          el.textContent = timeStr;
        }
      });
    } catch (e) {
      const hours = String((now.getUTCHours() + 7) % 24).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      clockElements.forEach(el => {
        el.textContent = `${hours}:${minutes}`;
      });
    }

    if (dateElements.length) {
      try {
        const dateOptions = {
          timeZone: 'Asia/Ho_Chi_Minh',
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        };
        const dateStr = new Intl.DateTimeFormat('en-US', dateOptions).format(now).toUpperCase().replace(',', '');
        dateElements.forEach(el => {
          el.textContent = dateStr;
        });
      } catch (e) {
        dateElements.forEach(el => {
          el.textContent = 'SAT NOV 15';
        });
      }
    }
  }

  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // 4. Smooth Weighted Difference Circle Cursor
  let cursor = document.querySelector('.custom-cursor');
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
  }

  let mouseX = -9999;
  let mouseY = -9999;
  let cursorX = -9999;
  let cursorY = -9999;
  let userHasInteracted = false;
  const CURSOR_SPEED = 0.13;

  let cursorRafId = null;
  let cursorIdleTimer = null;
  let cursorAnimRunning = false;

  function animateCursor() {
    if (userHasInteracted) {
      cursorX += (mouseX - cursorX) * CURSOR_SPEED;
      cursorY += (mouseY - cursorY) * CURSOR_SPEED;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
    }

    cursorRafId = requestAnimationFrame(animateCursor);
  }

  function startCursorAnim() {
    if (cursorAnimRunning) return;
    cursorAnimRunning = true;
    animateCursor();
  }

  function stopCursorAnim() {
    if (!cursorAnimRunning) return;
    cursorAnimRunning = false;
    if (cursorRafId) {
      cancelAnimationFrame(cursorRafId);
      cursorRafId = null;
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!userHasInteracted) {
      cursorX = mouseX;
      cursorY = mouseY;
      userHasInteracted = true;
    }

    const isLoaderActive = document.body.classList.contains('is-loading') ||
      (typeof loaderFinished !== 'undefined' && !loaderFinished);
    if (!isLoaderActive) cursor.style.opacity = '1';

    // Keep cursor loop alive while moving; idle-stop after 150ms of no movement
    startCursorAnim();
    clearTimeout(cursorIdleTimer);
    cursorIdleTimer = setTimeout(stopCursorAnim, 150);
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    if (userHasInteracted && loaderFinished && !document.body.classList.contains('is-loading')) {
      cursor.style.opacity = '1';
    }
  });

  // Hide custom cursor over delicate icon buttons (phone CTA, modal close) if desired
  document.addEventListener('mouseover', (e) => {
    if (e.target && e.target.closest && e.target.closest('.nav-floating-cta, .pm-close-btn')) {
      cursor.classList.add('is-hidden');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target && e.target.closest && e.target.closest('.nav-floating-cta, .pm-close-btn')) {
      cursor.classList.remove('is-hidden');
    }
  });

  // 5. Mobile Navigation Menu
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const closeBtn = document.querySelector('.mobile-close-btn');

  if (menuBtn && mobileOverlay) {
    menuBtn.addEventListener('click', () => {
      mobileOverlay.classList.add('open');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        mobileOverlay.classList.remove('open');
      });
    }

    mobileOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileOverlay.classList.remove('open');
      });
    });
  }

  // 5b. Modular Navbar Hamburger Dropdown Menu
  function closeNavDropdown() {
    const menu = document.getElementById('nav-dropdown-menu');
    const btn = document.getElementById('nav-hamburger-btn');
    const backdrop = document.getElementById('nav-dropdown-backdrop');
    if (!menu) return;
    menu.classList.remove('is-open');
    if (btn) {
      btn.classList.remove('is-active');
      btn.setAttribute('aria-expanded', 'false');
    }
    menu.setAttribute('aria-hidden', 'true');
    if (backdrop) {
      backdrop.classList.remove('is-active');
      backdrop.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('nav-dropdown-active');
    document.documentElement.classList.remove('nav-dropdown-active');

    // Resume Lenis smooth scroll if not inside project modal
    const lenis = (window.motionStack && window.motionStack.lenis) || window.lenis;
    if (lenis && typeof lenis.start === 'function' && !document.body.classList.contains('pm-modal-active')) {
      lenis.start();
    }
  }

  function openNavDropdown() {
    const menu = document.getElementById('nav-dropdown-menu');
    const btn = document.getElementById('nav-hamburger-btn');
    const backdrop = document.getElementById('nav-dropdown-backdrop');
    if (!menu) return;
    menu.classList.add('is-open');
    if (btn) {
      btn.classList.add('is-active');
      btn.setAttribute('aria-expanded', 'true');
    }
    menu.setAttribute('aria-hidden', 'false');
    if (backdrop) {
      backdrop.classList.add('is-active');
      backdrop.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('nav-dropdown-active');
    document.documentElement.classList.add('nav-dropdown-active');

    // Pause Lenis smooth scroll while dropdown menu is active
    const lenis = (window.motionStack && window.motionStack.lenis) || window.lenis;
    if (lenis && typeof lenis.stop === 'function') {
      lenis.stop();
    }
  }

  function initModularDropdown() {
    const navHamburgerBtn = document.getElementById('nav-hamburger-btn');
    const navDropdownMenu = document.getElementById('nav-dropdown-menu');
    const navDropdownBackdrop = document.getElementById('nav-dropdown-backdrop');

    if (!navHamburgerBtn || !navDropdownMenu) return;
    if (navHamburgerBtn._hasDropdownInit) return;
    navHamburgerBtn._hasDropdownInit = true;

    let isCooldown = false;
    const COOLDOWN_DURATION_MS = 520;

    navHamburgerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Prevent spamming when animation hasn't finished yet
      if (isCooldown) return;
      isCooldown = true;
      setTimeout(() => {
        isCooldown = false;
      }, COOLDOWN_DURATION_MS);

      const isOpen = navDropdownMenu.classList.contains('is-open');
      if (isOpen) {
        closeNavDropdown();
      } else {
        openNavDropdown();
      }
    });

    if (navDropdownBackdrop && !navDropdownBackdrop._hasDropdownInit) {
      navDropdownBackdrop._hasDropdownInit = true;
      navDropdownBackdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        closeNavDropdown();
      });
    }

    if (!window._dropdownDocListenersInit) {
      window._dropdownDocListenersInit = true;

      // Close on click outside
      document.addEventListener('click', (e) => {
        const curMenu = document.getElementById('nav-dropdown-menu');
        const curBtn = document.getElementById('nav-hamburger-btn');
        if (curMenu && curMenu.classList.contains('is-open')) {
          if (!curMenu.contains(e.target) && (!curBtn || !curBtn.contains(e.target))) {
            closeNavDropdown();
          }
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        const curMenu = document.getElementById('nav-dropdown-menu');
        if (e.key === 'Escape' && curMenu && curMenu.classList.contains('is-open')) {
          closeNavDropdown();
        }
      });
    }

    // Close on dropdown link click
    navDropdownMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeNavDropdown();
      });
    });

    const navFloatingCta = document.getElementById('nav-floating-cta');
    if (navFloatingCta) {
      navFloatingCta.addEventListener('click', () => {
        closeNavDropdown();
      });
    }
  }

  window.initModularDropdown = initModularDropdown;
  initModularDropdown();

  // 6. Highlight Active Navigation Item Initial
  updateActiveNavLinks(window.location.pathname);
  initPortfolioScrollSpy();

  // 7. Live GMT+7 Clock Engine
  function updateLiveClockGMT7() {
    const clockElements = document.querySelectorAll('.live-clock-gmt, .live-clock');
    if (!clockElements.length) return;

    try {
      const now = new Date();
      // Format 24-hour time with seconds in GMT+7 (Asia/Ho_Chi_Minh)
      const options = {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
      const formatted = `${timeStr} (GMT+7)`;
      const formattedUTC7 = `${timeStr} UTC+7`;

      clockElements.forEach(el => {
        if (el.classList.contains('nav-dropdown-clock') || el.closest('.nav-dropdown-menu') || el.classList.contains('f3-footer-clock') || el.closest('.f3-footer-colophon-bar')) {
          el.textContent = formattedUTC7;
        } else {
          el.textContent = formatted;
        }
      });

      const introTimeElements = document.querySelectorAll('.f3-intro-live-time');
      if (introTimeElements.length) {
        introTimeElements.forEach(el => {
          el.textContent = timeStr;
        });
      }
    } catch (e) {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const gmt7 = new Date(utc + (3600000 * 7));
      const hours = String(gmt7.getHours()).padStart(2, '0');
      const minutes = String(gmt7.getMinutes()).padStart(2, '0');
      const seconds = String(gmt7.getSeconds()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}:${seconds}`;
      const formatted = `${timeStr} (GMT+7)`;
      const formattedUTC7 = `${timeStr} UTC+7`;
      clockElements.forEach(el => {
        if (el.classList.contains('nav-dropdown-clock') || el.closest('.nav-dropdown-menu') || el.classList.contains('f3-footer-clock') || el.closest('.f3-footer-colophon-bar')) {
          el.textContent = formattedUTC7;
        } else {
          el.textContent = formatted;
        }
      });

      const introTimeElements = document.querySelectorAll('.f3-intro-live-time');
      if (introTimeElements.length) {
        introTimeElements.forEach(el => {
          el.textContent = timeStr;
        });
      }
    }
  }

  const clockIntervalId = setInterval(updateLiveClockGMT7, 1000);
  updateLiveClockGMT7();

  // 8. Description Anchor Sync for Top Navigation (Group B left edge === Description left edge)
  let syncRafId = null;
  function syncNavAnchorToDescription() {
    if (syncRafId) cancelAnimationFrame(syncRafId);
    syncRafId = requestAnimationFrame(() => {
      const desc = document.querySelector('.hero-bottom-desc');
      const anchor = document.getElementById('nav-anchor-container');
      if (!desc || !anchor) return;

      const descRect = desc.getBoundingClientRect();
      if (descRect && descRect.left > 0) {
        document.documentElement.style.setProperty('--nav-desc-left', `${descRect.left}px`);
      }
    });
  }

  window.syncNavAnchorToDescription = syncNavAnchorToDescription;

  // Run on load, resize, and layout changes
  window.addEventListener('resize', syncNavAnchorToDescription, { passive: true });
  let bottomBarRo = null;
  if (window.ResizeObserver) {
    const bottomBar = document.querySelector('.hero-bottom-bar');
    if (bottomBar) {
      bottomBarRo = new ResizeObserver(() => syncNavAnchorToDescription());
      bottomBarRo.observe(bottomBar);
    }
  }
  setTimeout(syncNavAnchorToDescription, 60);
  setTimeout(syncNavAnchorToDescription, 300);
  setTimeout(syncNavAnchorToDescription, 1000);

  // Lifecycle Cleanup on page navigation
  window.addEventListener('pagehide', () => {
    clearInterval(clockIntervalId);
    if (syncRafId) cancelAnimationFrame(syncRafId);
    if (bottomBarRo) bottomBarRo.disconnect();
  }, { once: true });
});
