/**
 * Spacing & Visual Designer HUD Component
 * Live in-browser controls for Description Width/Lines, Disc Sizing, Positioning, and Typography.
 */

(function () {
  const DEFAULT_CONFIG = {
    // 1. Description Sizing, Max Width (2-Line Control) & Position
    '--vd-bottom-desc-max-width': { val: 560, unit: 'px', min: 260, max: 900, step: 5, label: 'Description Max Width (Expand to 2 Lines)' },
    '--vd-desc-left': { val: 55, unit: '%', min: 20, max: 80, step: 0.5, label: 'Description Horizontal Position (Left %)' },
    '--vd-bottom-desc-size': { val: 13, unit: 'px', min: 10, max: 22, step: 0.5, label: 'Description Font Size' },
    '--vd-bottom-desc-line-height': { val: 1.45, unit: '', min: 1.0, max: 2.2, step: 0.05, label: 'Description Line Height' },

    // 2. Disc Controls
    '--center-disc-size': { val: 586, unit: 'px', min: 180, max: 900, step: 2, label: 'Disc Diameter (Size)' },
    '--center-disc-top': { val: 47.5, unit: '%', min: 10, max: 90, step: 0.5, label: 'Disc Vertical Position (Top %)' },
    '--center-disc-left': { val: 50, unit: '%', min: 10, max: 90, step: 0.5, label: 'Disc Horizontal Position (Left %)' },
    '--disc-repulsion-radius': { val: 320, unit: 'px', min: 30, max: 450, step: 5, label: 'Letter Evade Radius' },
    '--disc-repulsion-force': { val: 26, unit: '', min: 5, max: 120, step: 1, label: 'Letter Evade Force' },

    // 3. Group A & B Letter Spacing (Kerning)
    '--group-a-letter-spacing': { val: -0.55, unit: 'px', min: -3.0, max: 4.0, step: 0.05, label: 'Group A Letter Spacing' },
    '--group-b-letter-spacing': { val: -0.55, unit: 'px', min: -3.0, max: 4.0, step: 0.05, label: 'Group B Letter Spacing' },

    // 4. Nav Item Gap & Groups Gap
    '--nav-item-gap': { val: 56, unit: 'px', min: 10, max: 140, step: 1, label: 'Word Gap within Groups' },
    '--nav-groups-gap': { val: 252, unit: 'px', min: 0, max: 650, step: 2, label: 'Gap Between Groups A & B' },

    // 5. Master Nav Letter Spacing
    '--nav-letter-spacing': { val: -0.2, unit: 'px', min: -3.0, max: 4.0, step: 0.05, label: 'Master Nav Letter Spacing' },

    // 6. Live Clock Letter Spacing
    '--clock-letter-spacing': { val: -0.035, unit: 'em', min: -0.15, max: 0.15, step: 0.005, label: 'GMT+7 Clock Letter Spacing' },

    // 7. Nav Font Size & Boldness
    '--nav-font-size': { val: 13.5, unit: 'px', min: 10, max: 22, step: 0.5, label: 'Nav Font Size' },
    '--nav-font-weight': { val: 700, unit: '', min: 300, max: 900, step: 100, label: 'Nav Boldness (Weight)' }
  };

  const SECTIONS = [
    {
      title: 'Studio Description (2-Line Width & Position)',
      keys: ['--vd-bottom-desc-max-width', '--vd-desc-left', '--vd-bottom-desc-size', '--vd-bottom-desc-line-height']
    },
    {
      title: 'ASCII Disc Sizing & Position',
      keys: ['--center-disc-size', '--center-disc-top', '--center-disc-left', '--disc-repulsion-radius', '--disc-repulsion-force']
    },
    {
      title: 'Letter Spacing (Kerning)',
      keys: ['--group-a-letter-spacing', '--group-b-letter-spacing', '--nav-letter-spacing', '--clock-letter-spacing']
    },
    {
      title: 'Group Spacing & Offsets',
      keys: ['--nav-item-gap', '--nav-groups-gap']
    },
    {
      title: 'Typography Sizing & Boldness',
      keys: ['--nav-font-size', '--nav-font-weight']
    }
  ];

  class VisualDesigner {
    constructor() {
      this.state = {};
      this.loadSavedState();
      this.buildUI();
      this.applyAll();
    }

    loadSavedState() {
      try {
        const saved = localStorage.getItem('np_spacing_designer_config');
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
        localStorage.setItem('np_spacing_designer_config', JSON.stringify(this.state));
      } catch (e) {}
    }

    applyVar(key, value, unit) {
      document.documentElement.style.setProperty(key, `${value}${unit}`);
      if (typeof window.syncNavAnchorToDescription === 'function') {
        window.syncNavAnchorToDescription();
      }
    }

    applyAll() {
      for (const key in this.state) {
        const conf = DEFAULT_CONFIG[key];
        if (conf) {
          this.applyVar(key, this.state[key], conf.unit);
        }
      }
    }

    buildUI() {
      // Toggle button
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'vd-toggle-btn';
      toggleBtn.id = 'vd-toggle-btn';
      toggleBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        <span>Spacing Controls</span>
      `;
      document.body.appendChild(toggleBtn);

      // Main Panel
      const panel = document.createElement('div');
      panel.className = 'vd-panel';
      panel.id = 'vd-panel';

      let sectionsHTML = '';
      SECTIONS.forEach((sec, sIdx) => {
        let controlsHTML = '';
        sec.keys.forEach(key => {
          const conf = DEFAULT_CONFIG[key];
          if (!conf) return;
          const val = this.state[key];

          controlsHTML += `
            <div class="vd-control-row" data-key="${key}">
              <div class="vd-label-group">
                <span class="vd-label">${conf.label}</span>
                <span class="vd-val-display" id="disp-${key}">${val}${conf.unit}</span>
              </div>
              <input type="range" 
                     class="vd-slider" 
                     id="slider-${key}"
                     data-key="${key}" 
                     min="${conf.min}" 
                     max="${conf.max}" 
                     step="${conf.step}" 
                     value="${val}">
            </div>
          `;
        });

        sectionsHTML += `
          <div class="vd-section">
            <div class="vd-section-header">
              <span>${sec.title}</span>
            </div>
            <div class="vd-section-body">
              ${controlsHTML}
            </div>
          </div>
        `;
      });

      panel.innerHTML = `
        <div class="vd-header">
          <div class="vd-title">Spacing & Kerning Designer</div>
          <button class="vd-close-btn" id="vd-close-btn" aria-label="Close">&times;</button>
        </div>
        <div class="vd-content">
          ${sectionsHTML}
        </div>
        <div class="vd-footer">
          <button class="vd-action-btn vd-btn-reset" id="vd-btn-reset">Reset</button>
          <button class="vd-action-btn vd-btn-copy" id="vd-btn-copy">Copy JSON</button>
        </div>
      `;

      document.body.appendChild(panel);

      // Event Listeners
      toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('active');
      });

      const closeBtn = panel.querySelector('#vd-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          panel.classList.remove('active');
        });
      }

      // Range Sliders
      panel.querySelectorAll('.vd-slider').forEach(slider => {
        slider.addEventListener('input', e => {
          const key = e.target.getAttribute('data-key');
          const conf = DEFAULT_CONFIG[key];
          const val = parseFloat(e.target.value);
          this.state[key] = val;

          const disp = panel.querySelector(`#disp-${key}`);
          if (disp) {
            disp.textContent = `${val}${conf.unit}`;
          }

          this.applyVar(key, val, conf.unit);
          this.saveState();
        });
      });

      // Reset
      panel.querySelector('#vd-btn-reset').addEventListener('click', () => {
        for (const k in DEFAULT_CONFIG) {
          this.state[k] = DEFAULT_CONFIG[k].val;
          const slider = panel.querySelector(`#slider-${k}`);
          const disp = panel.querySelector(`#disp-${k}`);
          if (slider) slider.value = DEFAULT_CONFIG[k].val;
          if (disp) disp.textContent = `${DEFAULT_CONFIG[k].val}${DEFAULT_CONFIG[k].unit}`;
        }
        this.applyAll();
        this.saveState();
      });

      // Copy JSON
      const copyBtn = panel.querySelector('#vd-btn-copy');
      copyBtn.addEventListener('click', () => {
        const output = {};
        for (const k in this.state) {
          const conf = DEFAULT_CONFIG[k];
          output[k] = `${this.state[k]}${conf.unit}`;
        }

        const jsonStr = JSON.stringify(output, null, 2);
        navigator.clipboard.writeText(jsonStr).then(() => {
          const orig = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          copyBtn.style.background = '#00ff66';
          copyBtn.style.color = '#000000';
          setTimeout(() => {
            copyBtn.textContent = orig;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
          }, 1500);
        });
      });
    }
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new VisualDesigner());
  } else {
    new VisualDesigner();
  }
})();
