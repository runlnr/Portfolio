/**
 * ==========================================================================
 * USER CONFIGURATION: Loading Screen & Page Transitions
 * Easily adjust timing (in milliseconds) below:
 * ==========================================================================
 */

// 1. Loading Screen Blinking & Emergence Speeds (in milliseconds)
window.LOADER_CONFIG = {
  // Blink 1
  blink1On: 120,          // Time when 1st blink turns ON
  blink1Off: 320,         // Time when 1st blink turns OFF

  // Blink 2
  blink2On: 480,          // Time when 2nd blink turns ON
  blink2Off: 680,         // Time when 2nd blink turns OFF

  // Emergence: Slash stays solid and "N / P" slide outward
  emergeStart: 860,       // Time when "/" turns solid and "N" + "P" slide out

  // ® Mark: Small registered symbol pops up
  rPop: 1420,             // Time when ® pops up next to P

  // Page Reveal: Whole black loader curtain slides up to show the site
  slideUpReveal: 2050,    // Time when loader slides up to reveal page

  // Clean-up: Loader is removed from layout
  exitComplete: 3150      // Time when loader display is set to none
};

// 2. Page Transition Curtains Speed
window.TRANSITION_CONFIG = {
  coverDuration: 1100,    // Milliseconds for curtain to drag UP and cover
  revealDuration: 1200,   // Milliseconds for curtain to continue UP and reveal
  easeCover: 'cubic-bezier(0.65, 0, 0.15, 1)',
  easeReveal: 'cubic-bezier(0.16, 1, 0.3, 1)'
};

// Helper: Replay loader anytime in Console using `replayIntroLoader()`
window.replayIntroLoader = function () {
  sessionStorage.removeItem('np_has_seen_intro');
  window.location.reload();
};

document.addEventListener('DOMContentLoaded', () => {

  // 1. First-Time Access Check & Intro Loader
  const loader = document.getElementById('site-loader');
  const slash = document.getElementById('loader-slash');
  const lockup = document.querySelector('.loader-brand-lockup');
  const hasSeenIntro = sessionStorage.getItem('np_has_seen_intro');

  // Defensive fallback: ensure loader-r exists in loader lockup
  const loaderP = document.getElementById('loader-p');
  let loaderR = document.getElementById('loader-r');
  if (!loaderR && loaderP) {
    loaderR = document.createElement('sup');
    loaderR.className = 'loader-r';
    loaderR.id = 'loader-r';
    loaderR.setAttribute('aria-hidden', 'true');
    loaderR.textContent = '®';
    loaderP.appendChild(loaderR);
  }

  let loaderFinished = !!hasSeenIntro;

  if (!hasSeenIntro && loader && slash && lockup) {
    document.body.classList.add('is-loading');

    const cfg = window.LOADER_CONFIG || {
      blink1On: 120,
      blink1Off: 320,
      blink2On: 480,
      blink2Off: 680,
      emergeStart: 860,
      rPop: 1420,
      slideUpReveal: 2050,
      exitComplete: 3150
    };

    // Blink 1 (fast, crisp pulse)
    setTimeout(() => { slash.style.opacity = '1'; }, cfg.blink1On);
    setTimeout(() => { slash.style.opacity = '0'; }, cfg.blink1Off);

    // Blink 2 (second fast blink before emergence)
    setTimeout(() => { slash.style.opacity = '1'; }, cfg.blink2On);
    setTimeout(() => { slash.style.opacity = '0'; }, cfg.blink2Off);

    // 3rd Beat: Slash emerges solid & N/P slide out smoothly from behind /
    setTimeout(() => {
      slash.style.opacity = '1';
      lockup.classList.add('popped');
    }, cfg.emergeStart);

    // 4th Beat: Copyright R (®) pops up as letters settle into position
    setTimeout(() => {
      lockup.classList.add('r-popped');
    }, cfg.rPop);

    // 5th Beat: Fullscreen loader slides up, revealing the page
    setTimeout(() => {
      loader.classList.add('slide-up');
      document.body.classList.remove('is-loading');
      document.body.classList.add('loader-revealed');
      loaderFinished = true;
      sessionStorage.setItem('np_has_seen_intro', 'true');
      initHeroTvInteraction();
      if (window.initHeroHeadlineScramble) {
        window.initHeroHeadlineScramble(true);
      }
      if (window.location.hash === '#f3-portfolio') {
        setTimeout(() => scrollToPortfolioSection(true), 400);
      }
    }, cfg.slideUpReveal);

    // 6th Beat: Loader completely leaves viewport
    setTimeout(() => {
      loader.style.display = 'none';
      loader.style.pointerEvents = 'none';
    }, cfg.exitComplete);
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

  // 2. Pure Upward SPA Page Transition Engine
  let curtain = document.querySelector('.page-transition-curtain');
  if (!curtain) {
    curtain = document.createElement('div');
    curtain.className = 'page-transition-curtain';
    document.body.appendChild(curtain);
  }

  let isTransitioning = false;

  async function navigateTo(url, push = true) {
    if (isTransitioning) return;
    isTransitioning = true;

    const config = window.TRANSITION_CONFIG || { coverDuration: 480, revealDuration: 520, easeCover: 'cubic-bezier(0.65, 0, 0.15, 1)', easeReveal: 'cubic-bezier(0.16, 1, 0.3, 1)' };

    try {
      let fetchUrl = url.split('#')[0] || 'index.html';
      if (fetchUrl === '' || fetchUrl === '/' || fetchUrl === './') {
        fetchUrl = 'index.html';
      }
      const fetchPromise = fetch(fetchUrl).then(res => res.text());

      // 1. Animate curtain smoothly UP to cover screen
      curtain.style.transition = `transform ${config.coverDuration}ms ${config.easeCover}`;
      curtain.style.transform = 'translateY(0)';

      const [htmlText] = await Promise.all([
        fetchPromise,
        new Promise(resolve => setTimeout(resolve, config.coverDuration))
      ]);

      // 2. Parse fetched HTML and swap main content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');

      document.title = doc.title;

      const currentMain = document.querySelector('main');
      const newMain = doc.querySelector('main');

      if (currentMain && newMain) {
        currentMain.parentNode.replaceChild(newMain, currentMain);
      }

      if (push) {
        window.history.pushState({ url }, '', url);
      }

      window.scrollTo(0, 0);
      if (window.motionStack && window.motionStack.lenis) {
        window.motionStack.lenis.scrollTo(0, { immediate: true });
      }

      updateActiveNavLinks(url);
      rehydratePage(url, newMain);

      // 3. Animate curtain continuing UPWARD to reveal new page
      curtain.style.transition = `transform ${config.revealDuration}ms ${config.easeReveal}`;
      curtain.style.transform = 'translateY(-100%)';

      setTimeout(() => {
        curtain.style.transition = 'none';
        curtain.style.transform = 'translateY(100%)';
        isTransitioning = false;

        if (url.includes('#f3-portfolio') || window.location.hash === '#f3-portfolio') {
          setTimeout(() => scrollToPortfolioSection(true), 60);
        }
      }, config.revealDuration + 40);

    } catch (err) {
      console.error('SPA Navigation fallback:', err && err.stack ? err.stack : err);
      window.location.href = url;
    }
  }

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

    function checkPosition() {
      const rect = portfolio.getBoundingClientRect();
      const isInView = rect.top <= 200 && rect.bottom >= 150;
      if (isInView) {
        worksLink.classList.add('active');
      } else {
        worksLink.classList.remove('active');
      }
    }

    window.addEventListener('scroll', checkPosition, { passive: true });
    if (window.motionStack && window.motionStack.lenis) {
      window.motionStack.lenis.on('scroll', checkPosition);
    }
    checkPosition();
  }

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

    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http://') || href.startsWith('https://') || target === '_blank' || e.metaKey || e.ctrlKey) {
      return;
    }

    // Direct click on N/P brand logo / Home link when already on home page
    const isBrandHomeClick = link.classList.contains('hero-nav-brand') || link.classList.contains('nav-box-brand');
    const curNavPath = window.location.pathname;
    const isHomePage = curNavPath === '/' || curNavPath.endsWith('/') || curNavPath.endsWith('/index.html') || curNavPath.endsWith('index.html');
    const cleanHref = href.split('?')[0].split('#')[0];
    const isHomeHref = cleanHref === '' || cleanHref === '/' || cleanHref === 'index.html' || cleanHref === '/index.html' || cleanHref === './' || cleanHref === './index.html';

    if (isBrandHomeClick && isHomePage && isHomeHref) {
      e.preventDefault();
      if (window.motionStack && window.motionStack.lenis) {
        window.motionStack.lenis.scrollTo(0, { immediate: false, duration: 1.0 });
      } else if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: false, duration: 1.0 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (window.location.hash) {
        if (window.history.pushState) {
          window.history.pushState(null, '', window.location.pathname);
        }
      }
      return;
    }

    // Direct click on Works / #f3-portfolio
    if (href === '#f3-portfolio' || href === 'index.html#f3-portfolio' || href === '/#f3-portfolio') {
      if (isHomePage) {
        e.preventDefault();
        scrollToPortfolioSection(true);
        if (window.history.pushState) {
          window.history.pushState(null, '', '#f3-portfolio');
        }
        return;
      } else {
        e.preventDefault();
        navigateTo('index.html#f3-portfolio');
        return;
      }
    }

    if (href.startsWith('#')) {
      return;
    }

    e.preventDefault();
    navigateTo(href);
  });

  // Handle browser back/forward buttons seamlessly
  window.addEventListener('popstate', (e) => {
    if (window.location.hash === '#f3-portfolio') {
      scrollToPortfolioSection(true);
      return;
    }
    navigateTo(window.location.href, false);
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

  // 3b. Smart Taskbar Hide on Scroll Down / Reveal on Scroll Up
  let lastScrollY = window.scrollY || 0;
  const navElements = document.querySelectorAll('.hero-top-nav, .site-nav-top');

  function handleNavScroll(currentY) {
    updateNavbarTheme();

    // In the hero viewport or near the top of the page, keep nav visible and never hide it
    const heroViewport = document.getElementById('hero-viewport');
    const heroBottom = heroViewport ? heroViewport.getBoundingClientRect().bottom : 0;
    const inHero = heroBottom > 80 || currentY <= 40;

    if (inHero) {
      navElements.forEach(el => el.classList.remove('nav-hidden'));
      lastScrollY = currentY;
      return;
    }

    const delta = currentY - lastScrollY;
    // Smoother hysteresis threshold to avoid micro-twitching
    if (Math.abs(delta) < 8) return;

    if (delta > 0) {
      // Scrolling down -> Hide taskbar smoothly
      navElements.forEach(el => el.classList.add('nav-hidden'));
    } else {
      // Scrolling up -> Reveal taskbar smoothly
      navElements.forEach(el => el.classList.remove('nav-hidden'));
    }

    lastScrollY = currentY;
  }

  window.addEventListener('scroll', () => {
    handleNavScroll(window.scrollY || window.pageYOffset || 0);
  }, { passive: true });

  window.addEventListener('resize', updateNavbarTheme, { passive: true });

  // Initial call on page boot
  updateNavbarTheme();

  // Hook into Lenis smooth scroll updates
  setTimeout(() => {
    if (window.motionStack && window.motionStack.lenis) {
      window.motionStack.lenis.on('scroll', (e) => {
        handleNavScroll(e.scroll);
      });
    }
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
    if (!isLoaderActive) {
      cursor.style.opacity = '1';
    }
  });

  const CURSOR_SPEED = 0.13;

  function animateCursor() {
    if (userHasInteracted) {
      cursorX += (mouseX - cursorX) * CURSOR_SPEED;
      cursorY += (mouseY - cursorY) * CURSOR_SPEED;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
    }

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    if (userHasInteracted && loaderFinished && !document.body.classList.contains('is-loading')) {
      cursor.style.opacity = '1';
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
  const navHamburgerBtn = document.getElementById('nav-hamburger-btn');
  const navDropdownMenu = document.getElementById('nav-dropdown-menu');
  const navDropdownBackdrop = document.getElementById('nav-dropdown-backdrop');

  function closeNavDropdown() {
    if (!navDropdownMenu) return;
    navDropdownMenu.classList.remove('is-open');
    if (navHamburgerBtn) {
      navHamburgerBtn.classList.remove('is-active');
      navHamburgerBtn.setAttribute('aria-expanded', 'false');
    }
    navDropdownMenu.setAttribute('aria-hidden', 'true');
    if (navDropdownBackdrop) {
      navDropdownBackdrop.classList.remove('is-active');
      navDropdownBackdrop.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('nav-dropdown-active');
  }

  function openNavDropdown() {
    if (!navDropdownMenu) return;
    navDropdownMenu.classList.add('is-open');
    if (navHamburgerBtn) {
      navHamburgerBtn.classList.add('is-active');
      navHamburgerBtn.setAttribute('aria-expanded', 'true');
    }
    navDropdownMenu.setAttribute('aria-hidden', 'false');
    if (navDropdownBackdrop) {
      navDropdownBackdrop.classList.add('is-active');
      navDropdownBackdrop.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('nav-dropdown-active');
  }

  if (navHamburgerBtn && navDropdownMenu) {
    navHamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navDropdownMenu.classList.contains('is-open');
      if (isOpen) {
        closeNavDropdown();
      } else {
        openNavDropdown();
      }
    });

    if (navDropdownBackdrop) {
      navDropdownBackdrop.addEventListener('click', () => {
        closeNavDropdown();
      });
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!navDropdownMenu.contains(e.target) && !navHamburgerBtn.contains(e.target)) {
        closeNavDropdown();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navDropdownMenu.classList.contains('is-open')) {
        closeNavDropdown();
      }
    });

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
      const formattedICT = `${timeStr} ICT`;

      clockElements.forEach(el => {
        if (el.classList.contains('nav-dropdown-clock') || el.closest('.nav-dropdown-menu')) {
          el.textContent = formattedICT;
        } else {
          el.textContent = formatted;
        }
      });
    } catch (e) {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const gmt7 = new Date(utc + (3600000 * 7));
      const hours = String(gmt7.getHours()).padStart(2, '0');
      const minutes = String(gmt7.getMinutes()).padStart(2, '0');
      const seconds = String(gmt7.getSeconds()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}:${seconds}`;
      const formatted = `${timeStr} (GMT+7)`;
      const formattedICT = `${timeStr} ICT`;
      clockElements.forEach(el => {
        if (el.classList.contains('nav-dropdown-clock') || el.closest('.nav-dropdown-menu')) {
          el.textContent = formattedICT;
        } else {
          el.textContent = formatted;
        }
      });
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
