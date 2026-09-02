/**
 * Hero Scroll-Driven Transition (Inspired by Revelatio)
 * 
 * Choreography:
 * 1. Hero text and description slide UP together without fading (opacity: 1 throughout).
 * 2. When the text and description are completely out of view, the CRT TV is at 90% of its
 *    full extension into a rectangle.
 * 3. The CRT TV then slower and smoothly completes the remaining 10% of its rectangular extension.
 * 4. Padded rectangle leaves exact 20px black margins on all sides.
 * 5. Smooth, un-darkened transition into the Manifesto Statement section (#f3-intro) with 60px top margin.
 */

(function () {
  'use strict';

  let currentTimeline = null;

  function initHeroScrollTransition() {
    if (!window.gsap || !window.ScrollTrigger) {
      console.warn('HeroScrollTransition: GSAP or ScrollTrigger not loaded');
      return;
    }

    if (currentTimeline) {
      currentTimeline.kill();
      currentTimeline = null;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const heroViewport = document.getElementById('hero-viewport');
    const tvWrapper = document.getElementById('hero-tv-wrapper');
    const bottomHeadline = document.getElementById('hero-bottom-headline-wrap');
    const bottomTextLeft = document.getElementById('hero-text-left');
    const bottomTextRight = document.getElementById('hero-text-right');
    const topRightGroup = document.getElementById('hero-top-right-group');
    const centerTagline = document.getElementById('hero-center-tagline');
    const bottomSocials = document.getElementById('hero-bottom-socials');
    const cornerSlashes = Array.from(document.querySelectorAll('.ascii-corner-slash'));
    const blueprintContainer = document.querySelector('.hero-blueprint-container');
    const midMetaBar = document.querySelector('.hero-mid-meta-bar');
    const centerVisual = document.getElementById('hero-center-visual');

    if (!heroViewport || !tvWrapper) {
      console.warn('HeroScrollTransition: Essential elements missing');
      return;
    }

    // Register ScrollTrigger plugin
    window.gsap.registerPlugin(window.ScrollTrigger);

    const DEFAULT_CRT_PATH = 'M 0.0520 0.1150 Q 0.5000 0.0000 0.9480 0.1150 Q 0.9500 0.1150 0.9500 0.1170 Q 1.0000 0.5000 0.9500 0.8830 Q 0.9500 0.8850 0.9480 0.8850 Q 0.5000 1.0000 0.0520 0.8850 Q 0.0500 0.8850 0.0500 0.8830 Q 0.0000 0.5000 0.0500 0.1170 Q 0.0500 0.1150 0.0520 0.1150 Z';
    const RECT_CRT_PATH    = 'M 0.0000 0.0000 Q 0.5000 0.0000 1.0000 0.0000 Q 1.0000 0.0000 1.0000 0.0000 Q 1.0000 0.5000 1.0000 1.0000 Q 1.0000 1.0000 1.0000 1.0000 Q 0.5000 1.0000 0.0000 1.0000 Q 0.0000 1.0000 0.0000 1.0000 Q 0.0000 0.5000 0.0000 0.0000 Q 0.0000 0.0000 0.0000 0.0000 Z';

    const getCrtPath = () => window.currentCrtPath || DEFAULT_CRT_PATH;
    const clipPathEl = document.getElementById('hero-shape-clip-path');
    const maskPathEl = document.getElementById('hero-shape-mask-path');
    const blurFilterEl = document.getElementById('crt-blur-elem');

    // Initial sizes helper (respects Visual Designer or CSS overrides)
    function getInitialTvDimensions() {
      const computed = window.getComputedStyle(document.documentElement);
      const w = parseFloat(computed.getPropertyValue('--hero-tv-width')) || 910;
      const h = parseFloat(computed.getPropertyValue('--hero-tv-height')) || (w / (487.57 / 144.05));
      return { w, h };
    }

    // Target dimensions: exactly 25px margin on all sides (left, right, top, bottom)
    function getTargetTvDimensions() {
      const computed = window.getComputedStyle(document.documentElement);
      const heroMargin = parseFloat(computed.getPropertyValue('--hero-margin')) || 25;
      const marginX = parseFloat(computed.getPropertyValue('--hero-tv-rect-margin-x')) || heroMargin;
      const marginY = parseFloat(computed.getPropertyValue('--hero-tv-rect-margin-y')) || heroMargin;
      const targetW = window.innerWidth - (marginX * 2);
      const targetH = window.innerHeight - (marginY * 2);
      return { w: targetW, h: targetH };
    }

    // Helper to calculate dimensions at a given percentage between initial and target
    function getTvDimensionsAt(progress) {
      const init = getInitialTvDimensions();
      const target = getTargetTvDimensions();
      return {
        w: init.w + (target.w - init.w) * progress,
        h: init.h + (target.h - init.h) * progress
      };
    }

    // Initial shader curvature settings
    const initialShaderParams = (typeof window.getHeroTvAscii === 'function')
      ? window.getHeroTvAscii()
      : { sideBulge: 0.0, vertBulge: 0.0, tvSizeX: 2.0, tvSizeY: 2.0, edgeSoftness: 0.05 };

    const initSide = initialShaderParams.sideBulge || 0.0;
    const initVert = initialShaderParams.vertBulge || 0.0;
    const initSizeX = initialShaderParams.tvSizeX || 2.0;
    const initSizeY = initialShaderParams.tvSizeY || 2.0;
    const initEdgeSoft = initialShaderParams.edgeSoftness || 0.05;

    const shapeProxy = {
      sideBulge: initSide,
      vertBulge: initVert,
      tvSizeX: initSizeX,
      tvSizeY: initSizeY,
      edgeSoftness: initEdgeSoft
    };

    function updateShader() {
      if (typeof window.setHeroTvAscii === 'function') {
        window.setHeroTvAscii({
          sideBulge: shapeProxy.sideBulge,
          vertBulge: shapeProxy.vertBulge,
          tvSizeX: shapeProxy.tvSizeX,
          tvSizeY: shapeProxy.tvSizeY,
          edgeSoftness: shapeProxy.edgeSoftness
        });
      }
    }

    // GSAP ScrollTrigger Timeline
    const tl = window.gsap.timeline({
      scrollTrigger: {
        trigger: heroViewport,
        start: 'top top',
        end: '+=100%',
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        fastScrollEnd: true,
        preventOverlaps: true,
        onLeave: () => {
          if (typeof window.updateNavbarTheme === 'function') {
            window.updateNavbarTheme();
          }
        },
        onEnterBack: () => {
          if (typeof window.updateNavbarTheme === 'function') {
            window.updateNavbarTheme();
          }
        }
      }
    });
    currentTimeline = tl;

    // Timing markers:
    const TEXT_EXIT_TIME = 0.35;
    const TV_FINISH_TIME = 0.60;

    // --------------------------------------------------------------------------
    // 1. Hero Text & Auxiliary Components: Fade & blur in-place
    // --------------------------------------------------------------------------
    const auxElements = [
      bottomHeadline,
      bottomTextLeft,
      bottomTextRight,
      topRightGroup,
      centerTagline,
      bottomSocials,
      midMetaBar,
      blueprintContainer,
      ...cornerSlashes
    ].filter(Boolean);

    if (auxElements.length > 0) {
      tl.fromTo(
        auxElements,
        {
          opacity: (i, target) => {
            if (target.classList.contains('ascii-corner-slash')) {
              const comp = window.getComputedStyle(document.documentElement);
              const master = parseFloat(comp.getPropertyValue('--corner-slashes-opacity')) ?? 1;
              if (target.classList.contains('ascii-corner-tl')) {
                const v = comp.getPropertyValue('--corner-tl-opacity');
                return v !== '' ? parseFloat(v) : master;
              }
              if (target.classList.contains('ascii-corner-tr')) {
                const v = comp.getPropertyValue('--corner-tr-opacity');
                return v !== '' ? parseFloat(v) : master;
              }
              if (target.classList.contains('ascii-corner-bl')) {
                const v = comp.getPropertyValue('--corner-bl-opacity');
                return v !== '' ? parseFloat(v) : master;
              }
              if (target.classList.contains('ascii-corner-br')) {
                const v = comp.getPropertyValue('--corner-br-opacity');
                return v !== '' ? parseFloat(v) : master;
              }
              return master;
            }
            return 1;
          },
          filter: 'blur(0px)'
        },
        {
          opacity: 0,
          filter: 'blur(8px)',
          ease: 'power1.out',
          duration: TEXT_EXIT_TIME
        },
        0
      );
    }

    // Center visual moves to exact center and expands width & height
    if (centerVisual) {
      tl.fromTo(
        centerVisual,
        {
          top: () => `${parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--hero-tv-top')) || 50}%`,
          left: () => `${parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--hero-tv-left')) || 50}%`,
          width: () => `${getInitialTvDimensions().w}px`,
          height: () => `${getInitialTvDimensions().h}px`,
          maxWidth: 'none',
          maxHeight: 'none',
          scale: 1
        },
        {
          top: '50%',
          left: '50%',
          width: () => `${getTargetTvDimensions().w}px`,
          height: () => `${getTargetTvDimensions().h}px`,
          maxWidth: 'none',
          maxHeight: 'none',
          scale: 1,
          ease: 'power2.inOut',
          duration: TV_FINISH_TIME
        },
        0
      );
    }

    // --------------------------------------------------------------------------
    // 2. CRT TV Extension: 0 -> 90% while text exits (0 to 0.35)
    // --------------------------------------------------------------------------
    tl.fromTo(
      tvWrapper,
      {
        width: () => `${getInitialTvDimensions().w}px`,
        height: () => `${getInitialTvDimensions().h}px`,
        maxWidth: 'none',
        maxHeight: 'none',
        opacity: 1
      },
      {
        width: () => `${getTvDimensionsAt(0.90).w}px`,
        height: () => `${getTvDimensionsAt(0.90).h}px`,
        maxWidth: 'none',
        maxHeight: 'none',
        opacity: 1,
        ease: 'power1.out',
        duration: TEXT_EXIT_TIME
      },
      0
    );

    // SVG CRT Bezier path uncurling to flat rectangle
    if (clipPathEl) {
      tl.fromTo(
        clipPathEl,
        { attr: { d: getCrtPath } },
        {
          attr: { d: RECT_CRT_PATH },
          ease: 'power1.out',
          duration: TEXT_EXIT_TIME
        },
        0
      );
    }

    if (maskPathEl) {
      tl.fromTo(
        maskPathEl,
        { attr: { d: getCrtPath } },
        {
          attr: { d: RECT_CRT_PATH },
          ease: 'power1.out',
          duration: TEXT_EXIT_TIME
        },
        0
      );
    }

    if (blurFilterEl) {
      tl.fromTo(
        blurFilterEl,
        { attr: { stdDeviation: () => blurFilterEl.getAttribute('stdDeviation') || '0.012' } },
        {
          attr: { stdDeviation: '0.000' },
          ease: 'power1.out',
          duration: TEXT_EXIT_TIME
        },
        0
      );
    }

    // Shader uncurling during 0 to 0.35
    tl.fromTo(
      shapeProxy,
      {
        sideBulge: initSide,
        vertBulge: initVert,
        tvSizeX: initSizeX,
        tvSizeY: initSizeY,
        edgeSoftness: initEdgeSoft
      },
      {
        sideBulge: 0.0,
        vertBulge: 0.0,
        tvSizeX: 2.0,
        tvSizeY: 2.0,
        edgeSoftness: 0.0,
        ease: 'power1.out',
        duration: TEXT_EXIT_TIME,
        onUpdate: updateShader
      },
      0
    );

    // --------------------------------------------------------------------------
    // 3. CRT TV Slower Final 10% Extension: 90% -> 100% (0.35 to 0.60)
    // --------------------------------------------------------------------------
    tl.to(
      tvWrapper,
      {
        width: () => `${getTargetTvDimensions().w}px`,
        height: () => `${getTargetTvDimensions().h}px`,
        maxWidth: 'none',
        maxHeight: 'none',
        opacity: 1,
        ease: 'power2.out',
        duration: TV_FINISH_TIME - TEXT_EXIT_TIME
      },
      TEXT_EXIT_TIME
    );

    // Shader completes final 10% flattening to clean rectangle
    tl.to(
      shapeProxy,
      {
        sideBulge: 0.0,
        vertBulge: 0.0,
        tvSizeX: 2.0,
        tvSizeY: 2.0,
        ease: 'power1.inOut',
        duration: TV_FINISH_TIME - TEXT_EXIT_TIME,
        onUpdate: updateShader
      },
      TEXT_EXIT_TIME
    );

    // Hold at exact 20px full margins before unpinning cleanly into Manifesto Statement
    tl.to({}, { duration: 0.40 }, TV_FINISH_TIME);

    // Allow CSS variables and Visual Designer sliders to control styles when at scroll position 0
    function clearInlineOverridesAtTop() {
      if (window.scrollY === 0) {
        if (auxElements && auxElements.length > 0) {
          auxElements.forEach((el) => {
            el.style.removeProperty('filter');
            el.style.removeProperty('opacity');
          });
        }
        if (centerVisual) {
          centerVisual.style.removeProperty('max-width');
          centerVisual.style.removeProperty('max-height');
        }
        if (tvWrapper) {
          tvWrapper.style.removeProperty('max-width');
          tvWrapper.style.removeProperty('max-height');
        }
      }
    }

    clearInlineOverridesAtTop();
    tl.eventCallback('onUpdate', clearInlineOverridesAtTop);

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
    }, { passive: true });
  }

  function destroyHeroScrollTransition() {
    if (currentTimeline) {
      currentTimeline.kill();
      currentTimeline = null;
    }
  }

  function refreshHeroTransition() {
    if (currentTimeline) {
      currentTimeline.invalidate();
    }
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
  }

  window.initHeroScrollTransition = initHeroScrollTransition;
  window.destroyHeroScrollTransition = destroyHeroScrollTransition;
  window.refreshHeroTransition = refreshHeroTransition;

  window.addEventListener('pagehide', destroyHeroScrollTransition, { once: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initHeroScrollTransition, 100);
    });
  } else {
    setTimeout(initHeroScrollTransition, 100);
  }
})();
