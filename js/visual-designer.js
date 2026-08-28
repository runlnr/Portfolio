/**
 * Visual Designer HUD Component (Draggable & Real-Time Live Customizer)
 * Live in-browser controls for:
 * 1. Top Navigation Modular Box (Positioning, Size, Margins, Font Sizes, Offsets)
 * 2. Manifesto Statement & Section Spacing
 * 3. Editorial 2-Column Grid Layout & Spacing
 * 4. Card 01 (DAY ONE® RUN) Sizing, Position & Typography
 * 5. Card 02 (AARDVARK) Sizing, Position & Typography
 * 6. Card 03 (RODEWALD) & Giant Watermark 25
 * 7. Contact Info Coordinates (Address, Phone, Email)
 * 8. THE BEST OF N/P & Portfolio Header
 * 9. Viewport & Blueprint Grid Layout
 * 10. Central ASCII Ribbon Banner
 * 11. Headline Statement & Slashes
 * 12. WebGL CRT ASCII Shader
 */

(function () {
  'use strict';

  const DEFAULT_CONFIG = {
    // 1. Top Navigation Modular Box
    '--nav-box-top': { val: 26, unit: 'px', min: 0, max: 120, step: 1, label: 'Navbar Top Distance (Y)' },
    '--nav-box-offset-x': { val: 0, unit: 'px', min: -200, max: 200, step: 1, label: 'Navbar Center Shift (X Offset)' },
    '--nav-box-offset-y': { val: 0, unit: 'px', min: -100, max: 100, step: 1, label: 'Navbar Center Shift (Y Offset)' },
    '--nav-box-margin-top': { val: 0, unit: 'px', min: 0, max: 80, step: 1, label: 'Navbar Margin Top' },
    '--nav-box-margin-bottom': { val: 0, unit: 'px', min: 0, max: 80, step: 1, label: 'Navbar Margin Bottom' },
    '--nav-box-margin-left': { val: 0, unit: 'px', min: 0, max: 80, step: 1, label: 'Navbar Margin Left' },
    '--nav-box-margin-right': { val: 0, unit: 'px', min: 0, max: 80, step: 1, label: 'Navbar Margin Right' },
    '--nav-box-gap': { val: 32, unit: 'px', min: 4, max: 80, step: 1, label: 'Navbar Items Gap / Spacing' },
    '--nav-box-padx': { val: 28, unit: 'px', min: 4, max: 80, step: 1, label: 'Navbar Horizontal Padding (X)' },
    '--nav-box-pady': { val: 16, unit: 'px', min: 2, max: 50, step: 1, label: 'Navbar Vertical Padding (Y)' },
    '--nav-box-radius': { val: 6, unit: 'px', min: 0, max: 40, step: 1, label: 'Navbar Corner Radius' },
    '--nav-box-border-width': { val: 1, unit: 'px', min: 0, max: 6, step: 0.5, label: 'Navbar Border Width' },
    '--nav-box-link-size': { val: 14.5, unit: 'px', min: 10, max: 28, step: 0.5, label: 'Nav Links Font Size' },
    '--nav-box-link-weight': { val: 400, unit: '', min: 300, max: 900, step: 100, label: 'Nav Links Font Weight' },
    '--nav-box-link-letter-spacing': { val: -0.15, unit: 'px', min: -2.0, max: 4.0, step: 0.05, label: 'Nav Links Letter Spacing' },
    '--nav-box-brand-size': { val: 17, unit: 'px', min: 11, max: 36, step: 0.5, label: 'Brand N/P Font Size' },
    '--nav-box-brand-weight': { val: 700, unit: '', min: 300, max: 900, step: 100, label: 'Brand N/P Font Weight' },
    '--nav-box-brand-letter-spacing': { val: 0, unit: 'px', min: -2.0, max: 4.0, step: 0.1, label: 'Brand Letter Spacing' },
    '--nav-box-brand-slash-gap': { val: 1, unit: 'px', min: -2, max: 10, step: 0.5, label: 'Brand Slash (/) Gap' },
    '--nav-box-brand-r-size': { val: 9, unit: 'px', min: 6, max: 18, step: 0.5, label: 'Brand (®) Font Size' },
    '--nav-box-brand-r-gap': { val: 2, unit: 'px', min: -4, max: 12, step: 0.5, label: 'Brand (®) Offset Spacing' },
    '--nav-pinned-font-size': { val: 11, unit: 'px', min: 9, max: 20, step: 0.5, label: 'Pinned Clock/Location Font Size' },

    // 2. Manifesto Statement & Section Spacing
    '--manifesto-line-height': { val: 1.04, unit: '', min: 0.90, max: 2.20, step: 0.02, label: 'Line Spacing (Line Height)' },
    '--manifesto-letter-spacing': { val: -1.2, unit: 'px', min: -4.0, max: 4.0, step: 0.1, label: 'Letter Spacing' },
    '--manifesto-top-margin': { val: 60, unit: 'px', min: 0, max: 180, step: 2, label: 'Statement Top Margin' },
    '--manifesto-left-margin': { val: 25, unit: 'px', min: 0, max: 200, step: 2, label: 'Statement Left Margin' },
    '--manifesto-right-margin': { val: 25, unit: 'px', min: 0, max: 120, step: 2, label: 'Statement Right Margin' },
    '--manifesto-max-width': { val: 830, unit: 'px', min: 500, max: 1400, step: 10, label: 'Statement Max Width' },
    '--manifesto-font-size': { val: 49, unit: 'px', min: 24, max: 68, step: 1, label: 'Statement Font Size' },
    '--manifesto-gap': { val: 200, unit: 'px', min: 20, max: 300, step: 5, label: 'Statement Bottom Gap' },
    '--manifesto-padding-bottom': { val: 95, unit: 'px', min: 30, max: 300, step: 5, label: 'Section Bottom Padding' },
    '--manifesto-min-height': { val: 0, unit: 'px', min: 0, max: 1000, step: 20, label: 'Section Min Height (Length)' },

    // 3. Editorial 2-Column Grid Layout
    '--editorial-grid-gap': { val: 16, unit: 'px', min: 8, max: 120, step: 2, label: 'Grid Column Gap (Left/Right)' },
    '--editorial-left-col-ratio': { val: 1.0, unit: '', min: 0.6, max: 1.6, step: 0.05, label: 'Left vs Right Column Ratio' },

    // 4. Card 01 (DAY ONE® RUN)
    '--card-01-width': { val: 89, unit: '%', min: 30, max: 140, step: 1, label: 'Card 01 Width (%)' },
    '--card-01-height': { val: 670, unit: 'px', min: 250, max: 1200, step: 5, label: 'Card 01 Length / Height (px)' },
    '--card-01-aspect': { val: 1.18, unit: '', min: 0.50, max: 2.50, step: 0.02, label: 'Card 01 Aspect Ratio' },
    '--card-01-offset-x': { val: -2, unit: 'px', min: -150, max: 150, step: 2, label: 'Card 01 Horizontal Offset' },
    '--card-01-offset-y': { val: 0, unit: 'px', min: -150, max: 150, step: 2, label: 'Card 01 Vertical Offset' },
    '--card-01-margin-bottom': { val: 235, unit: 'px', min: 0, max: 350, step: 5, label: 'Card 01 Bottom Gap' },
    '--card-01-title-size': { val: 50, unit: 'px', min: 16, max: 72, step: 1, label: 'Card 01 Title Size' },
    '--card-01-title-weight': { val: 500, unit: '', min: 300, max: 800, step: 100, label: 'Card 01 Title Weight' },
    '--card-01-letter-spacing': { val: -1.5, unit: 'px', min: -3.0, max: 3.0, step: 0.1, label: 'Card 01 Letter Spacing' },

    // 5. Card 02 (AARDVARK)
    '--card-02-width': { val: 108, unit: '%', min: 30, max: 140, step: 1, label: 'Card 02 Width (%)' },
    '--card-02-height': { val: 630, unit: 'px', min: 200, max: 1000, step: 5, label: 'Card 02 Length / Height (px)' },
    '--card-02-aspect': { val: 10.0, unit: '', min: 6.0, max: 16.0, step: 0.2, label: 'Card 02 Aspect Ratio (16 / X)' },
    '--card-02-offset-x': { val: -60, unit: 'px', min: -150, max: 150, step: 2, label: 'Card 02 Horizontal Offset' },
    '--card-02-offset-y': { val: 150, unit: 'px', min: -150, max: 250, step: 2, label: 'Card 02 Vertical Offset' },
    '--card-02-title-size': { val: 49, unit: 'px', min: 16, max: 72, step: 1, label: 'Card 02 Title Size' },
    '--card-02-title-weight': { val: 500, unit: '', min: 300, max: 800, step: 100, label: 'Card 02 Title Weight' },
    '--card-02-letter-spacing': { val: -1.6, unit: 'px', min: -3.0, max: 3.0, step: 0.1, label: 'Card 02 Letter Spacing' },

    // 6. Card 03 (RODEWALD) & Watermark 25
    '--card-03-width': { val: 59, unit: '%', min: 25, max: 120, step: 1, label: 'Card 03 Width (%)' },
    '--card-03-height': { val: 440, unit: 'px', min: 150, max: 800, step: 5, label: 'Card 03 Length / Height (px)' },
    '--card-03-aspect': { val: 1.10, unit: '', min: 0.50, max: 2.50, step: 0.02, label: 'Card 03 Aspect Ratio' },
    '--card-03-offset-x': { val: 17, unit: '%', min: -20, max: 60, step: 1, label: 'Card 03 Left Margin / Pos (%)' },
    '--card-03-offset-y': { val: 74, unit: 'px', min: -150, max: 200, step: 2, label: 'Card 03 Vertical Offset' },
    '--card-03-title-size': { val: 49, unit: 'px', min: 16, max: 72, step: 1, label: 'Card 03 Title Size' },
    '--card-03-title-weight': { val: 500, unit: '', min: 300, max: 800, step: 100, label: 'Card 03 Title Weight' },
    '--card-03-letter-spacing': { val: -1.5, unit: 'px', min: -3.0, max: 3.0, step: 0.1, label: 'Card 03 Letter Spacing' },
    '--watermark-size': { val: 400, unit: 'px', min: 80, max: 500, step: 5, label: 'Watermark 25 Font Size' },
    '--watermark-top': { val: -60, unit: 'px', min: -200, max: 80, step: 2, label: 'Watermark Top Position' },
    '--watermark-left': { val: 150, unit: 'px', min: -120, max: 250, step: 2, label: 'Watermark Left Position' },
    '--watermark-opacity': { val: 1.0, unit: '', min: 0.05, max: 1.0, step: 0.05, label: 'Watermark Opacity' },

    // 7. Contact Coordinates (Address, Phone, Email)
    '--contact-font-size': { val: 17.5, unit: 'px', min: 10, max: 28, step: 0.5, label: 'Contact Font Size' },
    '--contact-label-weight': { val: 500, unit: '', min: 300, max: 800, step: 100, label: 'Contact Labels Weight' },
    '--contact-value-weight': { val: 500, unit: '', min: 300, max: 700, step: 100, label: 'Contact Values Weight' },
    '--contact-letter-spacing': { val: -0.6, unit: 'px', min: -2.0, max: 2.0, step: 0.1, label: 'Contact Letter Spacing' },
    '--contact-line-height': { val: 1.1, unit: '', min: 0.8, max: 2.2, step: 0.05, label: 'Contact Line Spacing' },
    '--contact-padding-bottom': { val: 200, unit: 'px', min: 10, max: 300, step: 5, label: 'Space Below Contact Grid' },
    '--contact-col-gap': { val: 8, unit: 'px', min: 2, max: 80, step: 2, label: 'Contact Columns Gap' },
    '--contact-offset-x': { val: -78, unit: 'px', min: -150, max: 80, step: 2, label: 'Contact Horizontal Offset' },
    '--contact-offset-y': { val: 0, unit: 'px', min: -80, max: 80, step: 2, label: 'Contact Vertical Offset' },

    // 8. THE BEST OF N/P & Portfolio Header
    '--best-title-size': { val: 33, unit: 'px', min: 16, max: 56, step: 1, label: 'THE BEST OF N/P Font Size' },
    '--best-title-weight': { val: 500, unit: '', min: 300, max: 900, step: 100, label: 'THE BEST OF N/P Weight' },
    '--best-title-letter-spacing': { val: -1.8, unit: 'px', min: -3.0, max: 3.0, step: 0.1, label: 'THE BEST Letter Spacing' },
    '--best-title-line-height': { val: 0.95, unit: '', min: 0.75, max: 1.60, step: 0.05, label: 'THE BEST Line Spacing' },
    '--best-header-padding-bottom': { val: 10, unit: 'px', min: 2, max: 50, step: 1, label: 'Header Bottom Border Padding' },
    '--best-tag-serif-size': { val: 29, unit: 'px', min: 14, max: 48, step: 1, label: '/Portfolio Serif Font Size' },
    '--best-view-all-size': { val: 22, unit: 'px', min: 10, max: 32, step: 0.5, label: 'VIEW ALL Font Size' },
    '--best-disciplines-size': { val: 11, unit: 'px', min: 9, max: 18, step: 0.5, label: 'Disciplines Font Size' },
    '--best-disciplines-padding-top': { val: 10, unit: 'px', min: 0, max: 40, step: 2, label: 'Disciplines Top Padding' },
    '--best-disciplines-padding-bottom': { val: 70, unit: 'px', min: 4, max: 120, step: 2, label: 'Disciplines Bottom Gap' },
    '--best-header-offset-y': { val: 60, unit: 'px', min: -60, max: 120, step: 2, label: 'Header Vertical Offset' },

    // 9. Viewport & Blueprint Grid Layout
    '--hero-margin': { val: 25, unit: 'px', min: 0, max: 100, step: 1, label: 'Hero / Viewport Margins' },
    '--grid-opacity': { val: 0.06, unit: '', min: 0.01, max: 0.35, step: 0.01, label: 'Blueprint Grid Opacity' },

    // 10. Central ASCII Ribbon Banner
    '--hero-tv-width': { val: 900, unit: 'px', min: 300, max: 1400, step: 10, label: 'ASCII Ribbon Width' },
    '--hero-tv-height': { val: 160, unit: 'px', min: 20, max: 350, step: 2, label: 'ASCII Ribbon Length (Height)' },
    '--hero-tv-top': { val: 52.0, unit: '%', min: 20.0, max: 80.0, step: 0.5, label: 'Banner Vertical Pos (%)' },
    '--hero-tv-left': { val: 49.5, unit: '%', min: 20.0, max: 80.0, step: 0.5, label: 'Banner Horizontal Pos (%)' },
    '--hero-tv-scale': { val: 1.0, unit: '', min: 0.5, max: 1.8, step: 0.05, label: 'Banner Scale Multiplier' },
    '--hero-tv-rect-margin-x': { val: 25, unit: 'px', min: 0, max: 80, step: 1, label: 'Expanded Fullscreen Left/Right Margin' },
    '--hero-tv-rect-margin-y': { val: 25, unit: 'px', min: 0, max: 80, step: 1, label: 'Expanded Fullscreen Top/Bottom Margin' },

    // 11. Headline Statement & Slashes
    '--headline-font-size': { val: 55, unit: 'px', min: 28, max: 72, step: 1, label: 'Headline Font Size' },
    '--headline-font-weight': { val: 400, unit: '', min: 300, max: 700, step: 100, label: 'Headline Weight (Roman)' },
    '--statement-gap': { val: 20, unit: 'px', min: 4, max: 40, step: 1, label: 'Headline Top Spacing' },
    '--slashes-size': { val: 61, unit: 'px', min: 24, max: 72, step: 1, label: 'Slashes (//) Font Size' },
    '--slashes-gap': { val: 13, unit: 'px', min: -4, max: 24, step: 1, label: 'Slashes Vertical Gap' },
    '--slashes-font-weight': { val: 700, unit: '', min: 300, max: 800, step: 100, label: 'Slashes Font Weight' },

    // 12. WebGL CRT ASCII Shader
    'tv-cell-size': { val: 9.5, unit: 'px', min: 2.0, max: 18.0, step: 0.5, label: 'ASCII Character Cell Size' },
    'tv-bloom': { val: 0.9, unit: '', min: 0.00, max: 2.00, step: 0.05, label: 'Phosphor Glow & Bloom' },
    'tv-contrast': { val: 1.05, unit: '', min: 0.20, max: 2.50, step: 0.05, label: 'Waves Video Contrast' },
    'tv-brightness': { val: 0.14, unit: '', min: -0.40, max: 0.60, step: 0.02, label: 'Waves Video Brightness' },
    'tv-dot-scale': { val: 1.5, unit: '', min: 0.5, max: 3.0, step: 0.1, label: 'Character Dot Density' },
    'tv-side-bulge': { val: 0.0, unit: '', min: 0.0, max: 0.15, step: 0.005, label: 'CRT Side Curvature' },
    'tv-vert-bulge': { val: 0.0, unit: '', min: 0.0, max: 0.25, step: 0.005, label: 'CRT Vertical Curvature' },
    'tv-tvness': { val: 1.0, unit: '', min: 0.0, max: 1.0, step: 0.05, label: 'Scanline Phosphor Effect' }
  };

  const SECTIONS = [
    {
      id: 'sec-navbar',
      title: 'Top Navigation Modular Bar',
      defaultOpen: true,
      keys: [
        '--nav-box-top',
        '--nav-box-offset-x',
        '--nav-box-offset-y',
        '--hero-margin',
        '--nav-box-margin-top',
        '--nav-box-margin-bottom',
        '--nav-box-margin-left',
        '--nav-box-margin-right',
        '--nav-box-padx',
        '--nav-box-pady',
        '--nav-box-gap',
        '--nav-box-radius',
        '--nav-box-border-width',
        '--nav-box-link-size',
        '--nav-box-link-weight',
        '--nav-box-link-letter-spacing',
        '--nav-box-brand-size',
        '--nav-box-brand-weight',
        '--nav-box-brand-letter-spacing',
        '--nav-box-brand-slash-gap',
        '--nav-box-brand-r-size',
        '--nav-box-brand-r-gap',
        '--nav-pinned-font-size'
      ]
    },
    {
      id: 'sec-manifesto',
      title: 'Manifesto Statement & Spacing',
      defaultOpen: false,
      keys: [
        '--manifesto-line-height',
        '--manifesto-letter-spacing',
        '--manifesto-top-margin',
        '--manifesto-left-margin',
        '--manifesto-right-margin',
        '--manifesto-max-width',
        '--manifesto-font-size',
        '--manifesto-gap',
        '--manifesto-padding-bottom',
        '--manifesto-min-height'
      ]
    },
    {
      id: 'sec-grid',
      title: 'Editorial 2-Column Grid',
      defaultOpen: false,
      keys: [
        '--editorial-grid-gap',
        '--editorial-left-col-ratio'
      ]
    },
    {
      id: 'sec-card1',
      title: 'Card 01 (DAY ONE® RUN)',
      defaultOpen: false,
      keys: [
        '--card-01-width',
        '--card-01-height',
        '--card-01-aspect',
        '--card-01-offset-x',
        '--card-01-offset-y',
        '--card-01-margin-bottom',
        '--card-01-title-size',
        '--card-01-title-weight',
        '--card-01-letter-spacing'
      ]
    },
    {
      id: 'sec-card2',
      title: 'Card 02 (AARDVARK)',
      defaultOpen: false,
      keys: [
        '--card-02-width',
        '--card-02-height',
        '--card-02-aspect',
        '--card-02-offset-x',
        '--card-02-offset-y',
        '--card-02-title-size',
        '--card-02-title-weight',
        '--card-02-letter-spacing'
      ]
    },
    {
      id: 'sec-card3',
      title: 'Card 03 & Watermark 25',
      defaultOpen: false,
      keys: [
        '--card-03-width',
        '--card-03-height',
        '--card-03-aspect',
        '--card-03-offset-x',
        '--card-03-offset-y',
        '--card-03-title-size',
        '--card-03-title-weight',
        '--card-03-letter-spacing',
        '--watermark-size',
        '--watermark-top',
        '--watermark-left',
        '--watermark-opacity'
      ]
    },
    {
      id: 'sec-contact',
      title: 'Contact Info (Address, Phone, Email)',
      defaultOpen: false,
      keys: [
        '--contact-font-size',
        '--contact-label-weight',
        '--contact-value-weight',
        '--contact-letter-spacing',
        '--contact-line-height',
        '--contact-padding-bottom',
        '--contact-col-gap',
        '--contact-offset-x',
        '--contact-offset-y'
      ]
    },
    {
      id: 'sec-best',
      title: 'THE BEST OF N/P & Header',
      defaultOpen: false,
      keys: [
        '--best-title-size',
        '--best-title-weight',
        '--best-title-letter-spacing',
        '--best-title-line-height',
        '--best-header-padding-bottom',
        '--best-tag-serif-size',
        '--best-view-all-size',
        '--best-disciplines-size',
        '--best-disciplines-padding-top',
        '--best-disciplines-padding-bottom',
        '--best-header-offset-y'
      ]
    },
    {
      id: 'sec-viewport',
      title: 'Viewport & Blueprint Grid',
      defaultOpen: false,
      keys: ['--hero-margin', '--grid-opacity']
    },
    {
      id: 'sec-ribbon',
      title: 'ASCII Ribbon Banner',
      defaultOpen: false,
      keys: ['--hero-tv-width', '--hero-tv-height', '--hero-tv-top', '--hero-tv-left', '--hero-tv-scale', '--hero-tv-rect-margin-x', '--hero-tv-rect-margin-y']
    },
    {
      id: 'sec-headline',
      title: 'Headline Statement & Slashes',
      defaultOpen: false,
      keys: ['--headline-font-size', '--headline-font-weight', '--statement-gap', '--slashes-size', '--slashes-gap', '--slashes-font-weight']
    },
    {
      id: 'sec-shader',
      title: 'WebGL CRT ASCII Shader',
      defaultOpen: false,
      keys: ['tv-cell-size', 'tv-bloom', 'tv-contrast', 'tv-brightness', 'tv-dot-scale', 'tv-side-bulge', 'tv-vert-bulge', 'tv-tvness']
    }
  ];

  class VisualDesigner {
    constructor() {
      this.state = {};
      this.isDraggingSlider = false;
      this.refreshTimeout = null;
      this.loadSavedState();
      this.buildUI();
      this.applyAll();
    }

    loadSavedState() {
      // Purge any stale older-version keys to prevent them from leaking
      ['np_visual_designer_v1','np_visual_designer_v2','np_visual_designer_v3',
       'np_visual_designer_v4','np_visual_designer_v5','np_visual_designer_v6',
       'np_visual_designer_v7','np_visual_designer_v8','np_visual_designer_v9',
       'np_visual_designer_v10','np_visual_designer_v11','np_visual_designer_v12', 'np_visual_designer_v13'].forEach(k => localStorage.removeItem(k));

      this.hasSavedState = false;
      try {
        const saved = localStorage.getItem('np_visual_designer_v14');
        if (saved) {
          const parsed = JSON.parse(saved);
          for (const k in DEFAULT_CONFIG) {
            this.state[k] = parsed[k] !== undefined ? parsed[k] : DEFAULT_CONFIG[k].val;
          }
          this.hasSavedState = true;
          return;
        }
      } catch (e) {}

      for (const k in DEFAULT_CONFIG) {
        this.state[k] = DEFAULT_CONFIG[k].val;
      }
    }

    saveState() {
      try {
        localStorage.setItem('np_visual_designer_v14', JSON.stringify(this.state));
      } catch (e) {}
    }

    applyValue(key, val) {
      this.state[key] = parseFloat(val);
      this.hasSavedState = true;
      this.saveState();

      if (key.startsWith('--')) {
        const unit = DEFAULT_CONFIG[key].unit;
        document.documentElement.style.setProperty(key, `${val}${unit}`);

        // Debounced ScrollTrigger refresh when dimensions change
        if (window.ScrollTrigger) {
          clearTimeout(this.refreshTimeout);
          this.refreshTimeout = setTimeout(() => {
            window.ScrollTrigger.refresh();
          }, 120);
        }
      } else if (typeof window.setHeroTvAscii === 'function') {
        const shaderUpdates = {};
        if (key === 'tv-cell-size') shaderUpdates.cellSize = parseFloat(val);
        if (key === 'tv-bloom') shaderUpdates.bloomStrength = parseFloat(val);
        if (key === 'tv-contrast') shaderUpdates.contrast = parseFloat(val);
        if (key === 'tv-brightness') shaderUpdates.brightness = parseFloat(val);
        if (key === 'tv-dot-scale') shaderUpdates.dotScale = parseFloat(val);
        if (key === 'tv-side-bulge') shaderUpdates.sideBulge = parseFloat(val);
        if (key === 'tv-vert-bulge') shaderUpdates.vertBulge = parseFloat(val);
        if (key === 'tv-tvness') shaderUpdates.tvness = parseFloat(val);
        window.setHeroTvAscii(shaderUpdates);
      }
    }

    applyAll() {
      if (!this.hasSavedState) return;

      for (const k in this.state) {
        const val = this.state[k];
        if (k.startsWith('--')) {
          const unit = DEFAULT_CONFIG[k].unit;
          document.documentElement.style.setProperty(k, `${val}${unit}`);
        }
      }
    }

    buildUI() {
      // Avoid duplicate panels
      const existingBtn = document.getElementById('vd-toggle-btn');
      if (existingBtn) existingBtn.remove();
      const existingPanel = document.getElementById('vd-panel');
      if (existingPanel) existingPanel.remove();

      // 1. Floating Toggle Button
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'vd-toggle-btn';
      toggleBtn.id = 'vd-toggle-btn';
      toggleBtn.innerHTML = `
        <span class="vd-toggle-dot"></span>
        <span>DESIGNER</span>
      `;
      document.body.appendChild(toggleBtn);

      // 2. Main HUD Panel
      const panel = document.createElement('div');
      panel.className = 'vd-panel';
      panel.id = 'vd-panel';
      panel.innerHTML = `
        <div class="vd-header">
          <div class="vd-title">
            Visual Designer
            <span class="vd-drag-handle">:::</span>
          </div>
          <div class="vd-header-actions">
            <button class="vd-collapse-all-btn" id="vd-collapse-all">Toggle All</button>
            <button class="vd-close-btn" id="vd-close-btn" aria-label="Close Designer">&times;</button>
          </div>
        </div>

        <div class="vd-toast" id="vd-toast">Saved</div>

        <div class="vd-body" id="vd-body"></div>

        <div class="vd-footer">
          <button class="vd-btn vd-btn-reset" id="vd-btn-reset">Reset Defaults</button>
          <button class="vd-btn vd-btn-copy" id="vd-btn-copy">Copy CSS</button>
        </div>
      `;
      document.body.appendChild(panel);

      const body = panel.querySelector('#vd-body');

      // Stop wheel propagation so scroll events inside the panel don't leak to page
      panel.addEventListener('wheel', (e) => {
        e.stopPropagation();
      }, { passive: true });

      // Populate sections & controls
      SECTIONS.forEach((sec, idx) => {
        const secEl = document.createElement('div');
        secEl.className = `vd-section ${sec.defaultOpen ? 'open' : ''}`;
        secEl.id = sec.id;

        secEl.innerHTML = `
          <div class="vd-section-header" data-target="${sec.id}">
            <span class="vd-section-title">
              <span class="vd-section-icon">▶</span>
              ${sec.title}
            </span>
            <span class="vd-section-count">${sec.keys.length} items</span>
          </div>
          <div class="vd-section-controls" id="${sec.id}-controls"></div>
        `;

        const controlsContainer = secEl.querySelector(`#${sec.id}-controls`);

        sec.keys.forEach(key => {
          const cfg = DEFAULT_CONFIG[key];
          if (!cfg) return;
          const currentVal = this.state[key];

          const ctrl = document.createElement('div');
          ctrl.className = 'vd-control';
          ctrl.innerHTML = `
            <div class="vd-control-header">
              <span class="vd-control-label">${cfg.label}</span>
              <span class="vd-control-value" id="vd-val-${key}">${currentVal}${cfg.unit}</span>
            </div>
            <input 
              type="range" 
              class="vd-range-slider" 
              id="vd-input-${key}"
              min="${cfg.min}" 
              max="${cfg.max}" 
              step="${cfg.step}" 
              value="${currentVal}"
            >
          `;

          const slider = ctrl.querySelector(`#vd-input-${key}`);
          const valDisplay = ctrl.querySelector(`#vd-val-${key}`);

          slider.addEventListener('input', (e) => {
            const val = e.target.value;
            valDisplay.textContent = `${val}${cfg.unit}`;
            this.applyValue(key, val);
          });

          controlsContainer.appendChild(ctrl);
        });

        // Accordion click handler
        secEl.querySelector('.vd-section-header').addEventListener('click', () => {
          secEl.classList.toggle('open');
        });

        body.appendChild(secEl);
      });

      // Toggle all sections button
      let allExpanded = false;
      panel.querySelector('#vd-collapse-all').addEventListener('click', () => {
        allExpanded = !allExpanded;
        panel.querySelectorAll('.vd-section').forEach(sec => {
          if (allExpanded) sec.classList.add('open');
          else sec.classList.remove('open');
        });
      });

      // Restore open state
      if (localStorage.getItem('np_vd_open') === 'true') {
        panel.classList.add('active');
      }

      // Events: Toggle & Close
      toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('active');
        localStorage.setItem('np_vd_open', panel.classList.contains('active') ? 'true' : 'false');
      });

      panel.querySelector('#vd-close-btn').addEventListener('click', () => {
        panel.classList.remove('active');
        localStorage.setItem('np_vd_open', 'false');
      });

      // Cursor visibility management over HUD
      [toggleBtn, panel].forEach(el => {
        el.addEventListener('mouseenter', () => {
          document.body.classList.add('vd-cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
          if (!this.isDraggingSlider) {
            document.body.classList.remove('vd-cursor-hover');
          }
        });
      });

      panel.addEventListener('mousedown', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('vd-range-slider')) {
          this.isDraggingSlider = true;
          document.body.classList.add('vd-cursor-hover');
        }
      });

      window.addEventListener('mouseup', () => {
        if (this.isDraggingSlider) {
          this.isDraggingSlider = false;
          if (!panel.matches(':hover') && !toggleBtn.matches(':hover')) {
            document.body.classList.remove('vd-cursor-hover');
          }
        }
      });

      // Draggable Panel Functionality
      const header = panel.querySelector('.vd-header');
      let isDraggingPanel = false;
      let startMouseX = 0;
      let startMouseY = 0;
      let initialPanelLeft = 0;
      let initialPanelTop = 0;

      // Restore saved panel position
      try {
        const savedPos = localStorage.getItem('np_vd_panel_pos');
        if (savedPos) {
          const { left, top } = JSON.parse(savedPos);
          if (left !== undefined && top !== undefined) {
            const maxL = Math.max(10, window.innerWidth - 460);
            const maxT = Math.max(10, window.innerHeight - 200);
            panel.style.left = `${Math.min(maxL, Math.max(10, left))}px`;
            panel.style.top = `${Math.min(maxT, Math.max(10, top))}px`;
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
          }
        }
      } catch (e) {}

      header.addEventListener('mousedown', (e) => {
        if (e.target.closest('#vd-close-btn') || e.target.closest('#vd-collapse-all')) return;

        isDraggingPanel = true;
        panel.classList.add('is-dragging');

        const rect = panel.getBoundingClientRect();
        initialPanelLeft = rect.left;
        initialPanelTop = rect.top;
        startMouseX = e.clientX;
        startMouseY = e.clientY;

        panel.style.left = `${initialPanelLeft}px`;
        panel.style.top = `${initialPanelTop}px`;
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';

        e.preventDefault();
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDraggingPanel) return;

        const deltaX = e.clientX - startMouseX;
        const deltaY = e.clientY - startMouseY;

        let newLeft = initialPanelLeft + deltaX;
        let newTop = initialPanelTop + deltaY;

        const panelW = panel.offsetWidth || 440;
        const panelH = panel.offsetHeight || 500;
        newLeft = Math.max(8, Math.min(window.innerWidth - panelW - 8, newLeft));
        newTop = Math.max(8, Math.min(window.innerHeight - panelH - 8, newTop));

        panel.style.left = `${newLeft}px`;
        panel.style.top = `${newTop}px`;
      });

      window.addEventListener('mouseup', () => {
        if (isDraggingPanel) {
          isDraggingPanel = false;
          panel.classList.remove('is-dragging');
          try {
            const rect = panel.getBoundingClientRect();
            localStorage.setItem('np_vd_panel_pos', JSON.stringify({ left: rect.left, top: rect.top }));
          } catch (e) {}
        }
      });

      // Reset button
      panel.querySelector('#vd-btn-reset').addEventListener('click', () => {
        for (const k in DEFAULT_CONFIG) {
          const defaultVal = DEFAULT_CONFIG[k].val;
          this.applyValue(k, defaultVal);
          const slider = panel.querySelector(`#vd-input-${k}`);
          const valDisplay = panel.querySelector(`#vd-val-${k}`);
          if (slider) slider.value = defaultVal;
          if (valDisplay) valDisplay.textContent = `${defaultVal}${DEFAULT_CONFIG[k].unit}`;
        }
        this.showToast('Defaults Restored');
      });

      // Copy CSS button
      panel.querySelector('#vd-btn-copy').addEventListener('click', () => {
        let css = ':root {\n';
        for (const k in DEFAULT_CONFIG) {
          if (k.startsWith('--')) {
            css += `  ${k}: ${this.state[k]}${DEFAULT_CONFIG[k].unit};\n`;
          }
        }
        css += '}\n\n// WebGL ASCII Shader Settings:\n';
        css += `cellSize: ${this.state['tv-cell-size']},\n`;
        css += `bloomStrength: ${this.state['tv-bloom']},\n`;
        css += `contrast: ${this.state['tv-contrast']},\n`;
        css += `brightness: ${this.state['tv-brightness']},\n`;
        css += `dotScale: ${this.state['tv-dot-scale']},\n`;
        css += `sideBulge: ${this.state['tv-side-bulge']},\n`;
        css += `vertBulge: ${this.state['tv-vert-bulge']},\n`;
        css += `tvness: ${this.state['tv-tvness']}\n`;

        navigator.clipboard.writeText(css).then(() => {
          this.showToast('CSS Copied to Clipboard!');
        }).catch(() => {
          this.showToast('Copy Failed');
        });
      });
    }

    showToast(msg) {
      const toast = document.getElementById('vd-toast');
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 1800);
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new VisualDesigner());
  } else {
    new VisualDesigner();
  }
})();
