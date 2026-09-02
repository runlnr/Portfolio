/**
 * Visual Designer & Hero Squares Studio HUD
 * Full interactive real-time control HUD for:
 * 1. 4 Corner Squares Sizing, Position & Opacity
 * 2. Shape Sizing & SVG Ratio
 * 3. WebGL ASCII Shader parameters
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'np_hero_designer_state_v4';

  // Config definition: maps control keys to their defaults, min, max, step, unit, and type
  const DESIGNER_CONFIG = {
    // ------------------------------------------------------------------------
    // TAB 1: 4 Corner Slashes (Size & Position)
    // ------------------------------------------------------------------------
    '--corner-slashes-size': { val: 54, unit: 'px', min: 10, max: 150, step: 1, label: 'Slashes Font Size', type: 'css' },
    '--corner-slashes-weight': { val: 700, unit: '', min: 100, max: 900, step: 100, label: 'Slashes Font Weight (100–900)', type: 'css' },
    '--corner-slashes-opacity': { val: 100, min: 0, max: 100, step: 1, unit: '%', label: 'All Slashes Opacity (Master)', type: 'opacity' },
    '--corner-slashes-offset-x': { val: 0, unit: 'px', min: -150, max: 150, step: 1, label: 'Global Offset X', type: 'css' },
    '--corner-slashes-offset-y': { val: -65, unit: 'px', min: -150, max: 150, step: 1, label: 'Global Offset Y', type: 'css' },
    '--corner-tl-x': { val: -20, unit: 'px', min: -200, max: 200, step: 1, label: 'Top-Left Slash X', type: 'css' },
    '--corner-tl-y': { val: -3, unit: 'px', min: -200, max: 200, step: 1, label: 'Top-Left Slash Y', type: 'css' },
    '--corner-tr-x': { val: -3, unit: 'px', min: -200, max: 200, step: 1, label: 'Top-Right Slash X', type: 'css' },
    '--corner-tr-y': { val: -3, unit: 'px', min: -200, max: 200, step: 1, label: 'Top-Right Slash Y', type: 'css' },
    '--corner-bl-x': { val: -20, unit: 'px', min: -200, max: 200, step: 1, label: 'Bottom-Left Slash X', type: 'css' },
    '--corner-bl-y': { val: -8, unit: 'px', min: -200, max: 200, step: 1, label: 'Bottom-Left Slash Y', type: 'css' },
    '--corner-br-x': { val: -3, unit: 'px', min: -200, max: 200, step: 1, label: 'Bottom-Right Slash X', type: 'css' },
    '--corner-br-y': { val: -8, unit: 'px', min: -200, max: 200, step: 1, label: 'Bottom-Right Slash Y', type: 'css' },
    '--corner-tl-opacity': { val: 100, min: 0, max: 100, step: 1, unit: '%', label: 'Top-Left Slash Opacity', type: 'opacity' },
    '--corner-tr-opacity': { val: 100, min: 0, max: 100, step: 1, unit: '%', label: 'Top-Right Slash Opacity', type: 'opacity' },
    '--corner-bl-opacity': { val: 100, min: 0, max: 100, step: 1, unit: '%', label: 'Bottom-Left Slash Opacity', type: 'opacity' },
    '--corner-br-opacity': { val: 100, min: 0, max: 100, step: 1, unit: '%', label: 'Bottom-Right Slash Opacity', type: 'opacity' },

    // ------------------------------------------------------------------------
    // TAB 2: Shape Sizing & Position
    // ------------------------------------------------------------------------
    '--hero-tv-width': { val: 910, unit: 'px', min: 200, max: 1400, step: 5, label: 'Shape Width', type: 'css' },
    '--hero-tv-height': { val: 310, unit: 'px', min: 50, max: 600, step: 2, label: 'Shape Height', type: 'css' },
    '--hero-tv-scale': { val: 1.0, unit: '', min: 0.4, max: 2.0, step: 0.02, label: 'Overall Scale Multiplier', type: 'css' },
    '--hero-tv-top': { val: 50.0, unit: '%', min: 10, max: 90, step: 0.5, label: 'Vertical Pos (Y %)', type: 'css' },
    '--hero-tv-left': { val: 50.0, unit: '%', min: 10, max: 90, step: 0.5, label: 'Horizontal Pos (X %)', type: 'css' },

    // ------------------------------------------------------------------------
    // TAB 3: ASCII Shader
    // ------------------------------------------------------------------------
    'cellSize': { val: 10, unit: 'px', min: 2, max: 24, step: 0.5, label: 'Cell Size (Grid Density)', type: 'shader' },
    'dotScale': { val: 1.3, unit: 'x', min: 0.2, max: 3.0, step: 0.05, label: 'Glyph Fill / Dot Scale', type: 'shader' },
    'contrast': { val: 0.2, unit: 'x', min: 0.1, max: 3.0, step: 0.05, label: 'Video Contrast', type: 'shader' },
    'brightness': { val: 0.7, unit: '', min: -0.5, max: 1.0, step: 0.01, label: 'Video Brightness', type: 'shader' },
    'bloomStrength': { val: 0.3, unit: 'x', min: 0.0, max: 2.5, step: 0.05, label: 'Glow / Bloom Strength', type: 'shader' },
    'tvness': { val: 0.95, unit: '', min: 0.0, max: 2.0, step: 0.05, label: 'CRT Scanlines & Color Mix', type: 'shader' },
    'fisheyeStrength': { val: 0.0, unit: '', min: 0.0, max: 0.5, step: 0.01, label: 'CRT Fisheye Distortion', type: 'shader' },
    'tvSizeX': { val: 2.0, unit: '', min: 0.5, max: 2.0, step: 0.02, label: 'Tube Frame Width Mask (2.0 = full)', type: 'shader' },
    'tvSizeY': { val: 2.0, unit: '', min: 0.5, max: 2.0, step: 0.02, label: 'Tube Frame Height Mask (2.0 = full)', type: 'shader' }
  };

  const CATEGORIES = [
    {
      id: 'shape_sizing',
      title: 'Shape Sizing',
      keys: [
        '--hero-tv-width',
        '--hero-tv-height',
        '--hero-tv-scale',
        '--hero-tv-top',
        '--hero-tv-left'
      ]
    },
    {
      id: 'ascii_shader',
      title: 'ASCII Shader',
      keys: [
        'cellSize',
        'dotScale',
        'contrast',
        'brightness',
        'bloomStrength',
        'tvness',
        'fisheyeStrength',
        'tvSizeX',
        'tvSizeY'
      ]
    },
    {
      id: 'slashes_tab',
      title: 'Slashes',
      keys: [
        '--corner-slashes-size',
        '--corner-slashes-weight',
        '--corner-slashes-opacity',
        '--corner-slashes-offset-x',
        '--corner-slashes-offset-y',
        '--corner-tl-x',
        '--corner-tl-y',
        '--corner-tr-x',
        '--corner-tr-y',
        '--corner-bl-x',
        '--corner-bl-y',
        '--corner-br-x',
        '--corner-br-y',
        '--corner-tl-opacity',
        '--corner-tr-opacity',
        '--corner-bl-opacity',
        '--corner-br-opacity'
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
        console.warn('Could not load designer state', e);
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

      if (conf.type === 'opacity') {
        const decimalVal = (val / 100).toFixed(4).replace(/\.?0+$/, '');
        document.documentElement.style.setProperty(key, decimalVal);
      } else if (conf.type === 'css') {
        const formatted = `${val}${conf.unit}`;
        document.documentElement.style.setProperty(key, formatted);

        const centerVisual = document.getElementById('hero-center-visual');
        const tvWrapper = document.getElementById('hero-tv-wrapper');

        const curW = this.state['--hero-tv-width'] !== undefined ? this.state['--hero-tv-width'] : 910;
        const curH = this.state['--hero-tv-height'] !== undefined ? this.state['--hero-tv-height'] : 310;
        const curTop = this.state['--hero-tv-top'] !== undefined ? this.state['--hero-tv-top'] : 50;
        const curLeft = this.state['--hero-tv-left'] !== undefined ? this.state['--hero-tv-left'] : 50;
        const curScale = this.state['--hero-tv-scale'] !== undefined ? this.state['--hero-tv-scale'] : 1;

        if (centerVisual) {
          centerVisual.style.setProperty('width', `${curW}px`, 'important');
          centerVisual.style.setProperty('height', `${curH}px`, 'important');
          centerVisual.style.setProperty('top', `${curTop}%`, 'important');
          centerVisual.style.setProperty('left', `${curLeft}%`, 'important');
          centerVisual.style.setProperty('transform', `translate(-50%, -50%) scale(${curScale})`, 'important');
        }

        if (tvWrapper) {
          tvWrapper.style.setProperty('width', '100%', 'important');
          tvWrapper.style.setProperty('height', '100%', 'important');
        }

        if (typeof window.initHeroScrollTransition === 'function') {
          window.initHeroScrollTransition();
        } else if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }
      } else if (conf.type === 'shader') {
        if (typeof window.setHeroTvAscii === 'function') {
          const updateObj = {};
          updateObj[key] = val;
          window.setHeroTvAscii(updateObj);
        }
      }

      this.saveState();
    }

    applyAll() {
      const shaderUpdates = {};
      for (const [k, conf] of Object.entries(DESIGNER_CONFIG)) {
        const val = this.state[k] !== undefined ? this.state[k] : conf.val;
        if (conf.type === 'opacity') {
          const decimalVal = (val / 100).toFixed(4).replace(/\.?0+$/, '');
          document.documentElement.style.setProperty(k, decimalVal);
        } else if (conf.type === 'css') {
          const formatted = `${val}${conf.unit}`;
          document.documentElement.style.setProperty(k, formatted);
        } else if (conf.type === 'shader') {
          shaderUpdates[k] = val;
        }
      }

      const centerVisual = document.getElementById('hero-center-visual');
      const tvWrapper = document.getElementById('hero-tv-wrapper');

      const curW = this.state['--hero-tv-width'] !== undefined ? this.state['--hero-tv-width'] : 910;
      const curH = this.state['--hero-tv-height'] !== undefined ? this.state['--hero-tv-height'] : 310;
      const curTop = this.state['--hero-tv-top'] !== undefined ? this.state['--hero-tv-top'] : 50;
      const curLeft = this.state['--hero-tv-left'] !== undefined ? this.state['--hero-tv-left'] : 50;
      const curScale = this.state['--hero-tv-scale'] !== undefined ? this.state['--hero-tv-scale'] : 1;

      if (centerVisual) {
        centerVisual.style.setProperty('width', `${curW}px`, 'important');
        centerVisual.style.setProperty('height', `${curH}px`, 'important');
        centerVisual.style.setProperty('top', `${curTop}%`, 'important');
        centerVisual.style.setProperty('left', `${curLeft}%`, 'important');
        centerVisual.style.setProperty('transform', `translate(-50%, -50%) scale(${curScale})`, 'important');
      }

      if (tvWrapper) {
        tvWrapper.style.setProperty('width', '100%', 'important');
        tvWrapper.style.setProperty('height', '100%', 'important');
      }

      if (typeof window.setHeroTvAscii === 'function' && Object.keys(shaderUpdates).length > 0) {
        window.setHeroTvAscii(shaderUpdates);
      }

      if (typeof window.initHeroScrollTransition === 'function') {
        window.initHeroScrollTransition();
      } else if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    }

    createUI() {
      const oldBtn = document.getElementById('vd-toggle-btn');
      if (oldBtn) oldBtn.remove();
      const oldPanel = document.getElementById('vd-panel');
      if (oldPanel) oldPanel.remove();

      // Toggle Floating Button
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'vd-toggle-btn';
      toggleBtn.id = 'vd-toggle-btn';
      toggleBtn.setAttribute('aria-label', 'Toggle Visual Designer HUD');
      toggleBtn.innerHTML = `
        <span class="vd-toggle-dot"></span>
        <span>VISUAL DESIGNER</span>
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
          <span>ASCII HERO & LAYOUT DESIGNER</span>
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

        if (cat.id === 'shape_sizing') {
          const syncBox = document.createElement('div');
          syncBox.style.cssText = 'display:flex;gap:8px;margin-bottom:6px;';
          syncBox.innerHTML = `
            <button class="vd-btn" id="vd-btn-sync-ratio" style="flex:1;padding:8px;font-size:10px;background:#1a1a20;border:1px solid rgba(255,255,255,0.18);border-radius:4px;color:#00ff66;cursor:pointer;">
              🔒 Snap to Exact SVG Ratio (268.85px)
            </button>
          `;
          syncBox.querySelector('#vd-btn-sync-ratio').addEventListener('click', () => {
            const curW = this.state['--hero-tv-width'] || 910;
            const newH = Math.round((curW / (487.57 / 144.05)) * 100) / 100;
            this.applyVal('--hero-tv-height', newH);
            const slider = pane.querySelector('input[data-key="--hero-tv-height"]');
            if (slider) slider.value = newH;
            const valEl = pane.querySelector('#val---hero-tv-height');
            if (valEl) valEl.textContent = `${newH}px`;
          });
          pane.appendChild(syncBox);
        }

        cat.keys.forEach(key => {
          const conf = DESIGNER_CONFIG[key];
          if (!conf) return;

          const control = document.createElement('div');
          control.className = 'vd-control';

          const curVal = this.state[key] !== undefined ? this.state[key] : conf.val;
          const unitStr = conf.unit !== undefined ? conf.unit : '';

          control.innerHTML = `
            <div class="vd-control-header">
              <span class="vd-control-label">${conf.label}</span>
              <span class="vd-control-value" id="val-${key}">${curVal}${unitStr}</span>
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
            valDisplay.textContent = `${num}${unitStr}`;
            this.applyVal(key, num);
          });

          pane.appendChild(control);
        });

        body.appendChild(pane);
      });

      panel.appendChild(body);

      // Footer
      const footer = document.createElement('div');
      footer.className = 'vd-footer';
      footer.innerHTML = `
        <button class="vd-btn vd-btn-reset" id="vd-btn-reset">Reset All</button>
        <button class="vd-btn vd-btn-copy" id="vd-btn-copy">Copy All Tokens</button>
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

      window.addEventListener('keydown', (e) => {
        if (e.key === 'h' || e.key === 'H' || e.key === 'd' || e.key === 'D' || e.key === 's' || e.key === 'S' || e.key === 'o' || e.key === 'O') {
          if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            panel.classList.toggle('active');
          }
        }
      });

      // Reset
      footer.querySelector('#vd-btn-reset').addEventListener('click', () => {
        if (confirm('Reset all parameters back to defaults?')) {
          localStorage.removeItem(STORAGE_KEY);
          for (const k in DESIGNER_CONFIG) {
            this.state[k] = DESIGNER_CONFIG[k].val;
          }
          this.applyAll();

          panel.querySelectorAll('input[type="range"]').forEach(slider => {
            const k = slider.dataset.key;
            if (DESIGNER_CONFIG[k]) {
              slider.value = DESIGNER_CONFIG[k].val;
              const valEl = panel.querySelector(`#val-${k}`);
              if (valEl) {
                valEl.textContent = `${DESIGNER_CONFIG[k].val}${DESIGNER_CONFIG[k].unit || ''}`;
              }
            }
          });
        }
      });

      // Copy Config
      footer.querySelector('#vd-btn-copy').addEventListener('click', () => {
        let jsConfig = 'window.heroTvAsciiConfig = {\n';
        const shaderCat = CATEGORIES.find(c => c.id === 'ascii_shader');
        if (shaderCat) {
          for (const k of shaderCat.keys) {
            jsConfig += `  ${k}: ${this.state[k] !== undefined ? this.state[k] : DESIGNER_CONFIG[k].val},\n`;
          }
        }
        jsConfig += '};\n\n';

        let cssConfig = '/* Hero CSS Tokens */\n:root {\n';
        for (const cat of CATEGORIES) {
          if (cat.id === 'ascii_shader') continue;
          cssConfig += `  /* ${cat.title} */\n`;
          for (const k of cat.keys) {
            const conf = DESIGNER_CONFIG[k];
            const val = this.state[k] !== undefined ? this.state[k] : conf.val;
            if (conf.type === 'opacity') {
              const decimalVal = (val / 100).toFixed(4).replace(/\.?0+$/, '');
              cssConfig += `  ${k}: ${decimalVal}; /* ${val}% */\n`;
            } else {
              cssConfig += `  ${k}: ${val}${conf.unit};\n`;
            }
          }
          cssConfig += '\n';
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
