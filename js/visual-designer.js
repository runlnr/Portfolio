/**
 * Visual Designer HUD Component (Draggable & Smooth Scrollable)
 * Live in-browser controls for:
 * 1. Hero Margins (24px) & Blueprint Grid Opacity (0.07)
 * 2. Brand Lockup N/P (Size & Weight) & Nav Links (Size, Weight, Column Positions)
 * 3. Central ASCII Ribbon Banner (Width, Length/Height, Horizontal & Vertical Position)
 * 4. Headline Statement & Slashes (Size, Weight, Spacing, Gap)
 * 5. WebGL CRT ASCII Shader (Cell Size, Bloom, Contrast, Brightness)
 */

(function () {
  const DEFAULT_CONFIG = {
    // 1. Viewport & Grid Layout
    '--hero-margin': { val: 20, unit: 'px', min: 10, max: 70, step: 2, label: 'Hero Margins (All 4 Sides)' },
    '--grid-opacity': { val: 0.06, unit: '', min: 0.01, max: 0.35, step: 0.01, label: 'Blueprint Grid Opacity' },

    // 2. Top Navigation Modular Box
    '--nav-box-top': { val: 26, unit: 'px', min: 10, max: 60, step: 2, label: 'Navbar Top Distance' },
    '--nav-box-gap': { val: 32, unit: 'px', min: 14, max: 54, step: 2, label: 'Navbar Item Spacing' },
    '--nav-box-padx': { val: 28, unit: 'px', min: 12, max: 50, step: 2, label: 'Navbar Horizontal Padding' },
    '--nav-box-pady': { val: 16, unit: 'px', min: 6, max: 30, step: 1, label: 'Navbar Vertical Padding' },
    '--nav-box-radius': { val: 6, unit: 'px', min: 0, max: 24, step: 1, label: 'Navbar Corner Radius' },
    '--nav-box-link-size': { val: 14.5, unit: 'px', min: 11, max: 22, step: 0.5, label: 'Nav Links Font Size' },
    '--nav-box-brand-size': { val: 17, unit: 'px', min: 12, max: 28, step: 1, label: 'Brand N/P Font Size' },
    '--nav-box-brand-weight': { val: 700, unit: '', min: 400, max: 800, step: 100, label: 'Brand N/P Font Weight' },

    // 3. Central ASCII Ribbon Banner (Width, Length/Height, Position, Scale)
    '--hero-tv-width': { val: 920, unit: 'px', min: 300, max: 1400, step: 10, label: 'ASCII Ribbon Width' },
    '--hero-tv-height': { val: 128, unit: 'px', min: 20, max: 350, step: 2, label: 'ASCII Ribbon Length (Height)' },
    '--hero-tv-top': { val: 53.0, unit: '%', min: 20.0, max: 80.0, step: 0.5, label: 'Banner Vertical Pos (%)' },
    '--hero-tv-left': { val: 49.5, unit: '%', min: 20.0, max: 80.0, step: 0.5, label: 'Banner Horizontal Pos (%)' },
    '--hero-tv-scale': { val: 1.0, unit: '', min: 0.5, max: 1.8, step: 0.05, label: 'Banner Scale Multiplier' },

    // 4. Headline Statement & Slashes
    '--headline-font-size': { val: 54, unit: 'px', min: 28, max: 72, step: 1, label: 'Headline Font Size' },
    '--headline-font-weight': { val: 400, unit: '', min: 300, max: 700, step: 100, label: 'Headline Weight (Roman)' },
    '--statement-gap': { val: 21, unit: 'px', min: 4, max: 40, step: 1, label: 'Headline Top Spacing' },
    '--slashes-size': { val: 59, unit: 'px', min: 24, max: 72, step: 1, label: 'Slashes (//) Font Size' },
    '--slashes-gap': { val: 11, unit: 'px', min: -4, max: 24, step: 1, label: 'Slashes Vertical Gap' },
    '--slashes-font-weight': { val: 700, unit: '', min: 300, max: 800, step: 100, label: 'Slashes Font Weight' },

    // 5. WebGL CRT ASCII Shader
    'tv-cell-size': { val: 9.5, unit: 'px', min: 2.0, max: 18.0, step: 0.5, label: 'ASCII Character Cell Size' },
    'tv-bloom': { val: 0.85, unit: '', min: 0.00, max: 2.00, step: 0.05, label: 'Phosphor Glow & Bloom' },
    'tv-contrast': { val: 1.05, unit: '', min: 0.20, max: 2.50, step: 0.05, label: 'Waves Video Contrast' },
    'tv-brightness': { val: 0.14, unit: '', min: -0.40, max: 0.60, step: 0.02, label: 'Waves Video Brightness' },
    'tv-dot-scale': { val: 1.5, unit: '', min: 0.5, max: 3.0, step: 0.1, label: 'Character Dot Density' },
    'tv-side-bulge': { val: 0.0, unit: '', min: 0.0, max: 0.15, step: 0.005, label: 'CRT Side Curvature' },
    'tv-vert-bulge': { val: 0.0, unit: '', min: 0.0, max: 0.25, step: 0.005, label: 'CRT Vertical Curvature' },
    'tv-tvness': { val: 1.0, unit: '', min: 0.0, max: 1.0, step: 0.05, label: 'Scanline Phosphor Effect' }
  };

  const SECTIONS = [
    {
      title: 'Viewport & Blueprint Grid',
      keys: ['--hero-margin', '--grid-opacity']
    },
    {
      title: 'Top Modular Navbar',
      keys: ['--nav-box-top', '--nav-box-gap', '--nav-box-padx', '--nav-box-pady', '--nav-box-radius', '--nav-box-link-size', '--nav-box-brand-size', '--nav-box-brand-weight']
    },
    {
      title: 'ASCII Ribbon Banner',
      keys: ['--hero-tv-width', '--hero-tv-height', '--hero-tv-top', '--hero-tv-left', '--hero-tv-scale']
    },
    {
      title: 'Headline Statement & Slashes',
      keys: ['--headline-font-size', '--headline-font-weight', '--statement-gap', '--slashes-size', '--slashes-gap', '--slashes-font-weight']
    },
    {
      title: 'WebGL CRT ASCII Shader',
      keys: ['tv-cell-size', 'tv-bloom', 'tv-contrast', 'tv-brightness', 'tv-dot-scale', 'tv-side-bulge', 'tv-vert-bulge', 'tv-tvness']
    }
  ];

  class VisualDesigner {
    constructor() {
      this.state = {};
      this.isDraggingSlider = false;
      this.loadSavedState();
      this.buildUI();
      this.applyAll();
    }

    loadSavedState() {
      try {
        const saved = localStorage.getItem('np_hero_designer_config_v7');
        if (saved) {
          const parsed = JSON.parse(saved);
          for (const k in DEFAULT_CONFIG) {
            this.state[k] = parsed[k] !== undefined ? parsed[k] : DEFAULT_CONFIG[k].val;
          }
          return;
        }
      } catch (e) {}

      for (const k in DEFAULT_CONFIG) {
        this.state[k] = DEFAULT_CONFIG[k].val;
      }
    }

    saveState() {
      try {
        localStorage.setItem('np_hero_designer_config_v7', JSON.stringify(this.state));
      } catch (e) {}
    }

    applyValue(key, val) {
      this.state[key] = parseFloat(val);
      this.saveState();

      if (key.startsWith('--')) {
        const unit = DEFAULT_CONFIG[key].unit;
        document.documentElement.style.setProperty(key, `${val}${unit}`);

        // Direct hardware sync for immediate real-time rendering with !important priority
        if (key === '--hero-tv-width') {
          const visual = document.getElementById('hero-center-visual');
          const wrapper = document.getElementById('hero-tv-wrapper');
          if (visual) visual.style.setProperty('width', `${val}px`, 'important');
          if (wrapper) wrapper.style.setProperty('width', `${val}px`, 'important');
        }
        if (key === '--hero-tv-height') {
          const wrapper = document.getElementById('hero-tv-wrapper');
          if (wrapper) wrapper.style.setProperty('height', `${val}px`, 'important');
        }
        if (key === '--hero-tv-top') {
          const visual = document.getElementById('hero-center-visual');
          if (visual) visual.style.setProperty('top', `${val}%`, 'important');
        }
        if (key === '--hero-tv-left') {
          const visual = document.getElementById('hero-center-visual');
          if (visual) visual.style.setProperty('left', `${val}%`, 'important');
        }
        if (key === '--hero-tv-scale') {
          const visual = document.getElementById('hero-center-visual');
          if (visual) visual.style.setProperty('transform', `translate(-50%, -50%) scale(${val})`, 'important');
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
      for (const k in this.state) {
        const val = this.state[k];
        if (k.startsWith('--')) {
          const unit = DEFAULT_CONFIG[k].unit;
          document.documentElement.style.setProperty(k, `${val}${unit}`);
        }
      }

      const visual = document.getElementById('hero-center-visual');
      const wrapper = document.getElementById('hero-tv-wrapper');
      if (visual && this.state['--hero-tv-width']) visual.style.setProperty('width', `${this.state['--hero-tv-width']}px`, 'important');
      if (wrapper && this.state['--hero-tv-width']) wrapper.style.setProperty('width', `${this.state['--hero-tv-width']}px`, 'important');
      if (visual && this.state['--hero-tv-top']) visual.style.setProperty('top', `${this.state['--hero-tv-top']}%`, 'important');
      if (visual && this.state['--hero-tv-left']) visual.style.setProperty('left', `${this.state['--hero-tv-left']}%`, 'important');
      if (wrapper && this.state['--hero-tv-height']) wrapper.style.setProperty('height', `${this.state['--hero-tv-height']}px`, 'important');
      if (visual && this.state['--hero-tv-scale']) visual.style.setProperty('transform', `translate(-50%, -50%) scale(${this.state['--hero-tv-scale']})`, 'important');

      if (typeof window.setHeroTvAscii === 'function') {
        window.setHeroTvAscii({
          cellSize: this.state['tv-cell-size'],
          bloomStrength: this.state['tv-bloom'],
          contrast: this.state['tv-contrast'],
          brightness: this.state['tv-brightness'],
          dotScale: this.state['tv-dot-scale'],
          sideBulge: this.state['tv-side-bulge'],
          vertBulge: this.state['tv-vert-bulge'],
          tvness: this.state['tv-tvness']
        });
      }
    }

    buildUI() {
      // Toggle button
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'vd-toggle-btn';
      toggleBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        <span>Visual Designer</span>
      `;
      document.body.appendChild(toggleBtn);

      // HUD Panel container (data-lenis-prevent ensures natural wheel scrolling)
      const panel = document.createElement('div');
      panel.className = 'vd-panel';
      panel.id = 'vd-panel';
      panel.setAttribute('data-lenis-prevent', 'true');
      panel.innerHTML = `
        <div class="vd-toast" id="vd-toast">Copied to Clipboard!</div>
        <div class="vd-header">
          <div class="vd-title">
            Hero Visual Designer
            <span class="vd-drag-handle" title="Drag to move panel">⠿ Drag</span>
          </div>
          <button class="vd-close-btn" aria-label="Close panel">&times;</button>
        </div>
        <div class="vd-body" id="vd-body" data-lenis-prevent="true"></div>
        <div class="vd-footer">
          <button class="vd-btn vd-btn-reset" id="vd-btn-reset">Reset</button>
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
      SECTIONS.forEach(sec => {
        const secEl = document.createElement('div');
        secEl.className = 'vd-section';
        secEl.innerHTML = `<div class="vd-section-title">${sec.title}</div>`;

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

          secEl.appendChild(ctrl);
        });

        body.appendChild(secEl);
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

      panel.querySelector('.vd-close-btn').addEventListener('click', () => {
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

      // --------------------------------------------------------------------------
      // Draggable Panel Functionality
      // --------------------------------------------------------------------------
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
            const maxL = Math.max(10, window.innerWidth - 360);
            const maxT = Math.max(10, window.innerHeight - 200);
            panel.style.left = `${Math.min(maxL, Math.max(10, left))}px`;
            panel.style.top = `${Math.min(maxT, Math.max(10, top))}px`;
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
          }
        }
      } catch (e) {}

      header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.vd-close-btn')) return;

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

        const panelW = panel.offsetWidth || 400;
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

  // Initialize once DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new VisualDesigner());
  } else {
    new VisualDesigner();
  }
})();
