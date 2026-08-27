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
    const statementRow = document.querySelector('.hero-statement-row');
    const blueprintContainer = document.querySelector('.hero-blueprint-container');
    const langSelector = document.getElementById('hero-lang-selector');
    const midMetaBar = document.querySelector('.hero-mid-meta-bar');
    const centerVisual = document.getElementById('hero-center-visual');
    const bottomBar = document.getElementById('hero-bottom-bar') || document.querySelector('.hero-bottom-bar');

    if (!heroViewport || !tvWrapper) {
      console.warn('HeroScrollTransition: Essential elements missing');
      return;
    }

    // Register ScrollTrigger plugin
    window.gsap.registerPlugin(window.ScrollTrigger);

    // Initial sizes helper (respects Visual Designer or CSS overrides)
    function getInitialTvDimensions() {
      const computed = window.getComputedStyle(document.documentElement);
      const w = parseFloat(computed.getPropertyValue('--hero-tv-width')) || 910;
      const h = parseFloat(computed.getPropertyValue('--hero-tv-height')) || 156;
      return { w, h };
    }

    // Target dimensions: exactly 20px margin on all sides (left, right, top, bottom)
    function getTargetTvDimensions() {
      const computed = window.getComputedStyle(document.documentElement);
      const heroMargin = parseFloat(computed.getPropertyValue('--hero-margin')) || 20;
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
      : { sideBulge: 0.035, vertBulge: 0.14, tvSizeX: 0.93, tvSizeY: 0.82 };

    const initSide = initialShaderParams.sideBulge || 0.035;
    const initVert = initialShaderParams.vertBulge || 0.14;
    const initSizeX = initialShaderParams.tvSizeX || 0.93;
    const initSizeY = initialShaderParams.tvSizeY || 0.82;

    const shapeProxy = {
      sideBulge: initSide,
      vertBulge: initVert,
      tvSizeX: initSizeX,
      tvSizeY: initSizeY
    };

    function updateShader() {
      if (typeof window.setHeroTvAscii === 'function') {
        window.setHeroTvAscii({
          sideBulge: shapeProxy.sideBulge,
          vertBulge: shapeProxy.vertBulge,
          tvSizeX: shapeProxy.tvSizeX,
          tvSizeY: shapeProxy.tvSizeY
        });
      }
    }

    // Total scroll track travel
    const scrollDistance = window.innerHeight * 0.85;

    const tl = window.gsap.timeline({
      scrollTrigger: {
        trigger: heroViewport,
        start: 'top top',
        end: `+=${scrollDistance}`,
        pin: true,
        scrub: 1.0, // Smooth organic scrub with physical momentum
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          window.heroScrollProgress = self.progress;
          if (typeof window.updateNavbarTheme === 'function') {
            window.updateNavbarTheme();
          }
        }
      }
    });
    currentTimeline = tl;

    // Timing markers:
    // Text slides up and exits completely at t = 0.35
    // At t = 0.35, TV extension is at 90%
    // TV reaches full 20px margins at t = 0.60 and holds cleanly
    const TEXT_EXIT_TIME = 0.35;
    const TV_FINISH_TIME = 0.60;

    // --------------------------------------------------------------------------
    // 1. Hero Text, Slashes & Adjacent Components: Fade & blur in-place (no sliding up)
    // --------------------------------------------------------------------------
    if (statementRow) {
      window.gsap.set(statementRow, { xPercent: -50, y: 0 });
      tl.fromTo(
        statementRow,
        { opacity: 1, filter: 'blur(0px)' },
        {
          opacity: 0,
          filter: 'blur(10px)',
          ease: 'power1.out',
          duration: TEXT_EXIT_TIME
        },
        0
      );
    }

    const auxElements = [langSelector, midMetaBar, blueprintContainer, bottomBar].filter(Boolean);
    if (auxElements.length > 0) {
      tl.fromTo(
        auxElements,
        { opacity: 1, filter: 'blur(0px)' },
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
          top: () => `${parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--hero-tv-top')) || 55}%`,
          left: () => `${parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--hero-tv-left')) || 49.5}%`,
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
    // 2. CRT TV Extension: 0 -> 90% while text exits (0 to 0.42)
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

    // Shader 90% uncurling during 0 to 0.42
    tl.fromTo(
      shapeProxy,
      {
        sideBulge: initSide,
        vertBulge: initVert,
        tvSizeX: initSizeX,
        tvSizeY: initSizeY
      },
      {
        sideBulge: initSide * 0.10, // 90% uncurled
        vertBulge: initVert * 0.10,
        tvSizeX: initSizeX + (1.0 - initSizeX) * 0.90,
        tvSizeY: initSizeY + (1.0 - initSizeY) * 0.90,
        ease: 'power1.out',
        duration: TEXT_EXIT_TIME,
        onUpdate: updateShader
      },
      0
    );

    // --------------------------------------------------------------------------
    // 3. CRT TV Slower Final 10% Extension: 90% -> 100% (0.42 to 0.65)
    // --------------------------------------------------------------------------
    tl.to(
      tvWrapper,
      {
        width: () => `${getTargetTvDimensions().w}px`,
        height: () => `${getTargetTvDimensions().h}px`,
        maxWidth: 'none',
        maxHeight: 'none',
        opacity: 1,
        ease: 'power1.inOut',
        duration: TV_FINISH_TIME - TEXT_EXIT_TIME
      },
      TEXT_EXIT_TIME
    );

    // Shader completes final 10% flattening to clean rectangle
    tl.to(
      shapeProxy,
      {
        sideBulge: 0.0,  // Pure straight sides
        vertBulge: 0.0,  // Pure straight top/bottom
        tvSizeX: 1.0,
        tvSizeY: 1.0,
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
        if (statementRow) {
          statementRow.style.removeProperty('filter');
          statementRow.style.removeProperty('opacity');
        }
        if (auxElements && auxElements.length > 0) {
          auxElements.forEach((el) => {
            el.style.removeProperty('filter');
            el.style.removeProperty('opacity');
          });
        }
        if (centerVisual) {
          centerVisual.style.removeProperty('width');
          centerVisual.style.removeProperty('height');
          centerVisual.style.removeProperty('top');
          centerVisual.style.removeProperty('left');
          centerVisual.style.removeProperty('max-width');
          centerVisual.style.removeProperty('max-height');
        }
        if (tvWrapper) {
          tvWrapper.style.removeProperty('width');
          tvWrapper.style.removeProperty('height');
          tvWrapper.style.removeProperty('max-width');
          tvWrapper.style.removeProperty('max-height');
        }
      }
    }

    clearInlineOverridesAtTop();
    tl.eventCallback('onUpdate', clearInlineOverridesAtTop);

    // Refresh ScrollTrigger on window resize
    window.addEventListener('resize', () => {
      window.ScrollTrigger.refresh();
    }, { passive: true });
  }

  window.initHeroScrollTransition = initHeroScrollTransition;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initHeroScrollTransition, 100);
    });
  } else {
    setTimeout(initHeroScrollTransition, 100);
  }
})();
