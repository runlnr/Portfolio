/**
 * Visual Designer HUD
 * Interactive real-time control HUD for calibrating ASCII shader parameters,
 * rectangular TV box layout, corner slashes, and typography.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'np_visual_designer_state';

  // Config definition: maps control keys to their default, min, max, step, unit, and type
  const DESIGNER_CONFIG = {
    // ------------------------------------------------------------------------
    // TAB 1: ASCII Box & Frame Layout (CSS)
    // ------------------------------------------------------------------------
    '--hero-tv-width': { val: 910, unit: 'px', min: 280, max: 1400, step: 5, label: 'ASCII Box Width', type: 'css' },
    '--hero-tv-height': { val: 200, unit: 'px', min: 50, max: 400, step: 2, label: 'ASCII Box Height', type: 'css' },
    '--hero-tv-top': { val: 51, unit: '%', min: 10, max: 90, step: 0.5, label: 'ASCII Vertical Pos (Y %)', type: 'css' },
    '--hero-tv-left': { val: 50, unit: '%', min: 10, max: 90, step: 0.5, label: 'ASCII Horizontal Pos (X %)', type: 'css' },
    '--hero-tv-scale': { val: 1.0, unit: '', min: 0.4, max: 2.0, step: 0.02, label: 'ASCII Overall Scale', type: 'css' },
    '--corner-slashes-size': { val: 54, unit: 'px', min: 16, max: 80, step: 1, label: 'Corner Slashes Font Size', type: 'css' },
    '--corner-slashes-offset-x': { val: 0, unit: 'px', min: -100, max: 100, step: 1, label: 'Corner Slashes Offset X', type: 'css' },
    '--corner-slashes-offset-y': { val: -60, unit: 'px', min: -140, max: 60, step: 1, label: 'Corner Slashes Offset Y', type: 'css' },

    // ------------------------------------------------------------------------
    // TAB 2: ASCII Shader Effect
    // ------------------------------------------------------------------------
    'cellSize': { val: 10, unit: 'px', min: 2, max: 24, step: 0.5, label: 'Cell Size (Grid Density)', type: 'shader' },
    'dotScale': { val: 1.3, unit: 'x', min: 0.2, max: 3.0, step: 0.05, label: 'Glyph Fill / Dot Scale', type: 'shader' },
    'contrast': { val: 0.2, unit: 'x', min: 0.1, max: 3.0, step: 0.05, label: 'Video Contrast', type: 'shader' },
    'brightness': { val: 0.7, unit: '', min: -0.5, max: 1.0, step: 0.01, label: 'Video Brightness', type: 'shader' },
    'bloomStrength': { val: 0.3, unit: 'x', min: 0.0, max: 2.5, step: 0.05, label: 'Glow / Bloom Strength', type: 'shader' },
    'tvness': { val: 0.95, unit: '', min: 0.0, max: 2.0, step: 0.05, label: 'CRT Scanlines & Color Mix', type: 'shader' },
    'fisheyeStrength': { val: 0.0, unit: '', min: 0.0, max: 0.5, step: 0.01, label: 'CRT Fisheye Distortion', type: 'shader' },
    'sideBulge': { val: 0.0, unit: '', min: 0.0, max: 0.4, step: 0.01, label: 'Side Tube Curvature', type: 'shader' },
    'vertBulge': { val: 0.0, unit: '', min: 0.0, max: 0.4, step: 0.01, label: 'Vertical Tube Curvature', type: 'shader' },
    'tvSizeX': { val: 1.5, unit: '', min: 0.5, max: 2.0, step: 0.02, label: 'Tube Frame Width Mask', type: 'shader' },
    'tvSizeY': { val: 1.0, unit: '', min: 0.5, max: 2.0, step: 0.02, label: 'Tube Frame Height Mask', type: 'shader' },

    // ------------------------------------------------------------------------
    // TAB 3: Nav & Typography
    // ------------------------------------------------------------------------
    '--nav-box-top': { val: 25, unit: 'px', min: 0, max: 80, step: 1, label: 'Nav Bar Top', type: 'css' },
    '--nav-box-width': { val: 470, unit: 'px', min: 200, max: 800, step: 5, label: 'Nav Bar Width', type: 'css' },
    '--headline-font-size': { val: 60, unit: 'px', min: 24, max: 96, step: 1, label: 'Headline Font Size', type: 'css' },
    '--tagline-font-size': { val: 19.5, unit: 'px', min: 12, max: 32, step: 0.5, label: 'Tagline Font Size', type: 'css' },
    '--tagline-left': { val: 200, unit: 'px', min: -100, max: 400, step: 2, label: 'Tagline Left Center Offset', type: 'css' }
  };

  const CATEGORIES = [
    {
      id: 'ascii_box',
      title: 'ASCII Box & Frame',
      keys: [
        '--hero-tv-width',
        '--hero-tv-height',
        '--hero-tv-top',
        '--hero-tv-left',
        '--hero-tv-scale',
        '--corner-slashes-size',
        '--corner-slashes-offset-x',
        '--corner-slashes-offset-y'
      ]
    },
    {
      id: 'ascii_shader',
      title: 'ASCII Effect',
      keys: [
        'cellSize',
        'dotScale',
        'contrast',
        'brightness',
        'bloomStrength',
        'tvness',
        'fisheyeStrength',
        'sideBulge',
        'vertBulge',
        'tvSizeX',
        'tvSizeY'
      ]
    },
    {
      id: 'typography',
      title: 'Typography & Nav',
      keys: [
        '--nav-box-top',
        '--nav-box-width',
        '--headline-font-size',
        '--tagline-font-size',
        '--tagline-left'
      ]
    }
  ];

  class VisualDesignerHUD {
    constructor() {
      this.state = {};
      this.loadState();
      this.createUI();
      this.applyAll();
    }

    loadState() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          this.state = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Could not load visual designer state', e);
      }

      for (const k in DESIGNER_CONFIG) {
        if (this.state[k] === undefined) {
          this.state[k] = DESIGNER_CONFIG[k].val;
        }
      }
    }

    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {}
    }

    applyVal(key, val) {
      const conf = DESIGNER_CONFIG[key];
      if (!conf) return;

      this.state[key] = val;

      if (conf.type === 'shader') {
        if (typeof window.setHeroTvAscii === 'function') {
          const updateObj = {};
          updateObj[key] = val;
          window.setHeroTvAscii(updateObj);
        }
      } else if (conf.type === 'css') {
        let formatted = `${val}${conf.unit}`;
        if (key === '--tagline-left') {
          formatted = `calc(50% + ${val}px)`;
        }
        document.documentElement.style.setProperty(key, formatted);

        // Remove any inline clipPath if lingering
        const tvWrapper = document.getElementById('hero-tv-wrapper');
        if (tvWrapper && tvWrapper.style.clipPath) {
          tvWrapper.style.clipPath = '';
          tvWrapper.style.webkitClipPath = '';
        }

        const centerVisual = document.getElementById('hero-center-visual');
        if (centerVisual) {
          if (key === '--hero-tv-width') centerVisual.style.width = `${val}px`;
          if (key === '--hero-tv-height') {
            centerVisual.style.height = `${val}px`;
            if (tvWrapper) tvWrapper.style.height = `${val}px`;
          }
          if (key === '--hero-tv-top') centerVisual.style.top = `${val}%`;
          if (key === '--hero-tv-left') centerVisual.style.left = `${val}%`;
          if (key === '--hero-tv-scale') centerVisual.style.transform = `translate(-50%, -50%) scale(${val})`;
        }

        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }
      }

      this.saveState();
    }

    applyAll() {
      const shaderUpdates = {};
      for (const [k, conf] of Object.entries(DESIGNER_CONFIG)) {
        const val = this.state[k] !== undefined ? this.state[k] : conf.val;
        if (conf.type === 'shader') {
          shaderUpdates[k] = val;
        } else if (conf.type === 'css') {
          let formatted = `${val}${conf.unit}`;
          if (k === '--tagline-left') {
            formatted = `calc(50% + ${val}px)`;
          }
          document.documentElement.style.setProperty(k, formatted);
        }
      }

      const tvWrapper = document.getElementById('hero-tv-wrapper');
      if (tvWrapper && tvWrapper.style.clipPath) {
        tvWrapper.style.clipPath = '';
        tvWrapper.style.webkitClipPath = '';
      }

      if (typeof window.setHeroTvAscii === 'function' && Object.keys(shaderUpdates).length > 0) {
        window.setHeroTvAscii(shaderUpdates);
      }
    }

    createUI() {
      // Toggle Floating Button
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'vd-toggle-btn';
      toggleBtn.id = 'vd-toggle-btn';
      toggleBtn.setAttribute('aria-label', 'Toggle ASCII Designer HUD');
      toggleBtn.innerHTML = `
        <span class="vd-toggle-dot"></span>
        <span>ASCII DESIGNER</span>
      `;
      document.body.appendChild(toggleBtn);

      // Main HUD Panel
      const panel = document.createElement('div');
      panel.className = 'vd-panel';
      panel.id = 'vd-panel';
      panel.setAttribute('data-lenis-prevent', 'true');

      panel.addEventListener('wheel', (e) => { e.stopPropagation(); }, { passive: true });
      panel.addEventListener('touchmove', (e) => { e.stopPropagation(); }, { passive: true });

      // Header
      const header = document.createElement('div');
      header.className = 'vd-header';
      header.innerHTML = `
        <div class="vd-title">
          <span>ASCII VISUAL DESIGNER</span>
          <span class="vd-drag-handle">:::</span>
        </div>
        <button class="vd-close-btn" aria-label="Close Designer">&times;</button>
      `;
      panel.appendChild(header);

      // Tabs Header
      const tabsNav = document.createElement('div');
      tabsNav.className = 'vd-tabs';
      tabsNav.setAttribute('data-lenis-prevent', 'true');

      CATEGORIES.forEach((cat, idx) => {
        const tabBtn = document.createElement('button');
        tabBtn.className = `vd-tab-btn ${idx === 0 ? 'active' : ''}`;
        tabBtn.dataset.tab = cat.id;
        tabBtn.textContent = cat.title;
        tabBtn.addEventListener('click', () => {
          panel.querySelectorAll('.vd-tab-btn').forEach(b => b.classList.remove('active'));
          panel.querySelectorAll('.vd-tab-pane').forEach(p => p.classList.remove('active'));
          tabBtn.classList.add('active');
          const targetPane = panel.querySelector(`.vd-tab-pane[data-tab="${cat.id}"]`);
          if (targetPane) targetPane.classList.add('active');
        });
        tabsNav.appendChild(tabBtn);
      });
      panel.appendChild(tabsNav);

      // Body (Panes)
      const body = document.createElement('div');
      body.className = 'vd-body';
      body.setAttribute('data-lenis-prevent', 'true');
      body.setAttribute('data-lenis-prevent-wheel', 'true');
      body.setAttribute('data-lenis-prevent-touch', 'true');

      CATEGORIES.forEach((cat, idx) => {
        const pane = document.createElement('div');
        pane.className = `vd-tab-pane ${idx === 0 ? 'active' : ''}`;
        pane.dataset.tab = cat.id;

        cat.keys.forEach(key => {
          const conf = DESIGNER_CONFIG[key];
          if (!conf) return;

          const control = document.createElement('div');
          control.className = 'vd-control';

          const curVal = this.state[key] !== undefined ? this.state[key] : conf.val;
          const displayVal = `${curVal}${conf.unit}`;

          control.innerHTML = `
            <div class="vd-control-header">
              <span class="vd-control-label">${conf.label}</span>
              <span class="vd-control-value" id="val-${key}">${displayVal}</span>
            </div>
            <input type="range" 
                   class="vd-range-slider" 
                   data-key="${key}" 
                   min="${conf.min}" 
                   max="${conf.max}" 
                   step="${conf.step}" 
                   value="${curVal}">
          `;

          const slider = control.querySelector('input');
          const valDisplay = control.querySelector('.vd-control-value');

          slider.addEventListener('input', (e) => {
            const num = parseFloat(e.target.value);
            valDisplay.textContent = `${num}${conf.unit}`;
            this.applyVal(key, num);
          });

          pane.appendChild(control);
        });

        body.appendChild(pane);
      });

      panel.appendChild(body);

      // Footer with Reset and Copy
      const footer = document.createElement('div');
      footer.className = 'vd-footer';
      footer.innerHTML = `
        <button class="vd-btn vd-btn-reset" id="vd-btn-reset">Reset</button>
        <button class="vd-btn vd-btn-copy" id="vd-btn-copy">Copy Config</button>
      `;
      panel.appendChild(footer);
      document.body.appendChild(panel);

      // Events
      toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('active');
      });

      header.querySelector('.vd-close-btn').addEventListener('click', () => {
        panel.classList.remove('active');
      });

      // Press 'H' or 'D' to toggle
      window.addEventListener('keydown', (e) => {
        if (e.key === 'h' || e.key === 'H' || e.key === 'd' || e.key === 'D') {
          if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            panel.classList.toggle('active');
          }
        }
      });

      // Reset
      footer.querySelector('#vd-btn-reset').addEventListener('click', () => {
        if (confirm('Reset parameters back to defaults?')) {
          localStorage.removeItem(STORAGE_KEY);
          for (const k in DESIGNER_CONFIG) {
            this.state[k] = DESIGNER_CONFIG[k].val;
          }
          this.applyAll();

          // Refresh slider displays
          panel.querySelectorAll('input[type="range"]').forEach(slider => {
            const k = slider.dataset.key;
            if (DESIGNER_CONFIG[k]) {
              slider.value = DESIGNER_CONFIG[k].val;
              const valEl = panel.querySelector(`#val-${k}`);
              if (valEl) {
                valEl.textContent = `${DESIGNER_CONFIG[k].val}${DESIGNER_CONFIG[k].unit}`;
              }
            }
          });
        }
      });

      // Copy Config
      footer.querySelector('#vd-btn-copy').addEventListener('click', () => {
        let jsConfig = 'window.heroTvAsciiConfig = {\n';
        for (const k of CATEGORIES[1].keys) {
          jsConfig += `  ${k}: ${this.state[k]},\n`;
        }
        jsConfig += '};\n\n';

        let cssConfig = '/* Hero CSS Tokens */\n:root {\n';
        // Box tokens
        cssConfig += `  /* ${CATEGORIES[0].title} */\n`;
        for (const k of CATEGORIES[0].keys) {
          const conf = DESIGNER_CONFIG[k];
          cssConfig += `  ${k}: ${this.state[k]}${conf.unit};\n`;
        }
        cssConfig += `\n  /* ${CATEGORIES[2].title} */\n`;
        for (const k of CATEGORIES[2].keys) {
          const conf = DESIGNER_CONFIG[k];
          let valStr = `${this.state[k]}${conf.unit}`;
          if (k === '--tagline-left') valStr = `calc(50% + ${this.state[k]}px)`;
          cssConfig += `  ${k}: ${valStr};\n`;
        }
        cssConfig += '}\n';

        const fullExport = `${jsConfig}${cssConfig}`;

        navigator.clipboard.writeText(fullExport).then(() => {
          const btn = footer.querySelector('#vd-btn-copy');
          const origText = btn.textContent;
          btn.textContent = 'COPIED!';
          btn.style.background = '#00ff66';
          btn.style.color = '#000000';
          setTimeout(() => {
            btn.textContent = origText;
            btn.style.background = '';
            btn.style.color = '';
          }, 1800);
        }).catch(() => {
          prompt('Copy settings below:', fullExport);
        });
      });

      this.makeDraggable(panel, header);
    }

    makeDraggable(el, handle) {
      let posX = 0, posY = 0, mouseX = 0, mouseY = 0;

      handle.onmousedown = (e) => {
        if (e.target.closest('.vd-close-btn')) return;
        e.preventDefault();
        mouseX = e.clientX;
        mouseY = e.clientY;
        el.classList.add('is-dragging');

        document.onmouseup = () => {
          document.onmouseup = null;
          document.onmousemove = null;
          el.classList.remove('is-dragging');
        };

        document.onmousemove = (e) => {
          e.preventDefault();
          posX = mouseX - e.clientX;
          posY = mouseY - e.clientY;
          mouseX = e.clientX;
          mouseY = e.clientY;
          el.style.top = Math.max(10, el.offsetTop - posY) + 'px';
          el.style.left = Math.max(10, el.offsetLeft - posX) + 'px';
          el.style.right = 'auto';
        };
      };
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.npVisualDesigner = new VisualDesignerHUD();
    });
  } else {
    window.npVisualDesigner = new VisualDesignerHUD();
  }
})();
