/**
 * Manifesto Statement Visual Designer HUD
 * Dedicated real-time customizer for Manifesto Statement Typography & Positioning:
 * 1. Statement Max Width (--manifesto-max-width)
 * 2. Font Sizing (--manifesto-font-size)
 * 3. Line Spacing (--manifesto-line-height)
 * 4. Letter Spacing (--manifesto-letter-spacing)
 * 5. Top Distance (Y) (--manifesto-top-margin)
 * 6. Left Offset (X) (--manifesto-left-margin)
 * 7. Bottom Gap to Works (--manifesto-gap)
 * 8. Gap to About Button (--manifesto-btn-gap)
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'np_manifesto_designer_v2';

  const SECTIONS = [
    {
      title: 'TYPOGRAPHY & DIMENSIONS',
      keys: [
        '--manifesto-max-width',
        '--manifesto-font-size',
        '--manifesto-line-height',
        '--manifesto-letter-spacing'
      ]
    },
    {
      title: 'POSITIONING & SPACING',
      keys: [
        '--manifesto-top-margin',
        '--manifesto-left-margin',
        '--manifesto-gap',
        '--manifesto-btn-gap'
      ]
    }
  ];

  const DESIGNER_CONFIG = {
    // Typography & Dimensions
    '--manifesto-max-width': {
      val: 850,
      unit: 'px',
      min: 300,
      max: 1600,
      step: 10,
      label: 'Statement Max Width'
    },
    '--manifesto-font-size': {
      val: 49,
      unit: 'px',
      min: 18,
      max: 96,
      step: 1,
      label: 'Font Sizing'
    },
    '--manifesto-line-height': {
      val: 1.1,
      unit: '',
      min: 0.70,
      max: 2.20,
      step: 0.02,
      label: 'Line Spacing (Line Height)'
    },
    '--manifesto-letter-spacing': {
      val: -0.8,
      unit: 'px',
      min: -5.0,
      max: 4.0,
      step: 0.1,
      label: 'Letter Spacing'
    },

    // Positioning & Spacing
    '--manifesto-top-margin': {
      val: 38,
      unit: 'px',
      min: 0,
      max: 250,
      step: 2,
      label: 'Top Distance (Y)'
    },
    '--manifesto-left-margin': {
      val: 14,
      unit: 'px',
      min: 0,
      max: 250,
      step: 2,
      label: 'Left Offset (X)'
    },
    '--manifesto-gap': {
      val: 106,
      unit: 'px',
      min: 0,
      max: 250,
      step: 2,
      label: 'Bottom Gap to Works'
    },
    '--manifesto-btn-gap': {
      val: 26,
      unit: 'px',
      min: 0,
      max: 100,
      step: 2,
      label: 'Gap to About Button'
    }
  };

  class ManifestoVisualDesigner {
    constructor() {
      this.state = {};
      this.loadState();
      this.applyAll();
      this.createUI();
    }

    loadState() {
      let saved = null;
      try {
        saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      } catch (e) {}

      for (const [key, conf] of Object.entries(DESIGNER_CONFIG)) {
        this.state[key] = (saved && saved[key] !== undefined) ? saved[key] : conf.val;
      }
    }

    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {}
    }

    apply(key, val) {
      const conf = DESIGNER_CONFIG[key];
      if (!conf) return;
      this.state[key] = parseFloat(val);
      const formatted = `${this.state[key]}${conf.unit}`;
      document.documentElement.style.setProperty(key, formatted);

      // Direct DOM updates for instantaneous feedback
      const manifestoStatement = document.querySelector('.f3-intro-statement');
      const manifestoCol = document.querySelector('.f3-intro-right-col');
      const sectionIntro = document.querySelector('.f3-section-intro');
      const worksHeader = document.querySelector('.f3-works-header');

      if (key === '--manifesto-max-width' && manifestoCol) {
        manifestoCol.style.maxWidth = formatted;
      }
      if (key === '--manifesto-font-size' && manifestoStatement) {
        manifestoStatement.style.fontSize = formatted;
      }
      if (key === '--manifesto-line-height' && manifestoStatement) {
        manifestoStatement.style.lineHeight = formatted;
      }
      if (key === '--manifesto-letter-spacing' && manifestoStatement) {
        manifestoStatement.style.letterSpacing = formatted;
      }
      if (key === '--manifesto-left-margin' && manifestoCol) {
        manifestoCol.style.marginLeft = formatted;
      }
      if (key === '--manifesto-top-margin' && sectionIntro) {
        sectionIntro.style.paddingTop = formatted;
      }
      if (key === '--manifesto-gap' && worksHeader) {
        worksHeader.style.marginBottom = formatted;
      }
      if (key === '--manifesto-btn-gap' && manifestoStatement) {
        manifestoStatement.style.marginBottom = formatted;
      }

      this.saveState();
    }

    applyAll() {
      for (const [key, val] of Object.entries(this.state)) {
        this.apply(key, val);
      }
    }

    createUI() {
      // Toggle Floating Button
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'vd-toggle-btn';
      toggleBtn.id = 'vd-toggle-btn';
      toggleBtn.setAttribute('aria-label', 'Toggle Manifesto Designer HUD');
      toggleBtn.innerHTML = `
        <span class="vd-toggle-dot"></span>
        <span>MANIFESTO DESIGNER</span>
      `;
      document.body.appendChild(toggleBtn);

      // Main HUD Panel
      const panel = document.createElement('div');
      panel.className = 'vd-panel';
      panel.id = 'vd-panel';

      // Header
      const header = document.createElement('div');
      header.className = 'vd-header';
      header.innerHTML = `
        <div class="vd-title">
          <span>MANIFESTO DESIGNER</span>
          <span class="vd-drag-handle">⠿</span>
        </div>
        <button class="vd-close-btn" aria-label="Close HUD">✕</button>
      `;
      panel.appendChild(header);

      // Body / Controls List
      const body = document.createElement('div');
      body.className = 'vd-body';

      for (const sec of SECTIONS) {
        const secHeader = document.createElement('div');
        secHeader.className = 'vd-section-label';
        secHeader.textContent = sec.title;
        body.appendChild(secHeader);

        for (const key of sec.keys) {
          const conf = DESIGNER_CONFIG[key];
          if (!conf) continue;

          const curVal = this.state[key];
          const ctrl = document.createElement('div');
          ctrl.className = 'vd-control';
          ctrl.innerHTML = `
            <div class="vd-control-header">
              <span class="vd-control-label">${conf.label}</span>
              <span class="vd-control-value" id="val-${key}">${curVal}${conf.unit}</span>
            </div>
            <input 
              type="range" 
              class="vd-range-slider" 
              data-key="${key}"
              min="${conf.min}" 
              max="${conf.max}" 
              step="${conf.step}" 
              value="${curVal}" 
            />
          `;

          const slider = ctrl.querySelector('.vd-range-slider');
          const valDisplay = ctrl.querySelector(`#val-${key}`);

          slider.addEventListener('input', (e) => {
            const v = parseFloat(e.target.value);
            this.apply(key, v);
            valDisplay.textContent = `${v}${conf.unit}`;
          });

          body.appendChild(ctrl);
        }
      }

      panel.appendChild(body);

      // Footer
      const footer = document.createElement('div');
      footer.className = 'vd-footer';
      footer.innerHTML = `
        <button class="vd-btn vd-btn-reset" id="vd-btn-reset">Reset</button>
        <button class="vd-btn vd-btn-copy" id="vd-btn-copy">Copy CSS</button>
      `;
      panel.appendChild(footer);
      document.body.appendChild(panel);

      // Interactions & Event Listeners
      toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('active');
      });

      header.querySelector('.vd-close-btn').addEventListener('click', () => {
        panel.classList.remove('active');
      });

      // Press 'M' or 'H' to toggle
      window.addEventListener('keydown', (e) => {
        if (e.key === 'm' || e.key === 'M' || e.key === 'h' || e.key === 'H') {
          if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            panel.classList.toggle('active');
          }
        }
      });

      // Reset
      footer.querySelector('#vd-btn-reset').addEventListener('click', () => {
        if (confirm('Reset Manifesto statement sizing and positioning back to defaults?')) {
          localStorage.removeItem(STORAGE_KEY);
          for (const [k, conf] of Object.entries(DESIGNER_CONFIG)) {
            this.state[k] = conf.val;
            this.apply(k, conf.val);
            const slider = panel.querySelector(`input[data-key="${k}"]`);
            const valDisplay = panel.querySelector(`#val-${k}`);
            if (slider) slider.value = conf.val;
            if (valDisplay) valDisplay.textContent = `${conf.val}${conf.unit}`;
          }
        }
      });

      // Copy CSS
      footer.querySelector('#vd-btn-copy').addEventListener('click', () => {
        let css = ':root {\n  /* Manifesto Statement Controls */\n';
        for (const sec of SECTIONS) {
          css += `  /* ${sec.title} */\n`;
          for (const k of sec.keys) {
            const conf = DESIGNER_CONFIG[k];
            css += `  ${k}: ${this.state[k]}${conf.unit};\n`;
          }
        }
        css += '}\n';

        navigator.clipboard.writeText(css).then(() => {
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
          prompt('Copy CSS rules below:', css);
        });
      });

      // Drag Handling
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
          el.style.top = (el.offsetTop - posY) + 'px';
          el.style.left = (el.offsetLeft - posX) + 'px';
          el.style.right = 'auto';
        };
      };
    }
  }

  // Initialize once DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.manifestoVisualDesigner = new ManifestoVisualDesigner();
    });
  } else {
    window.manifestoVisualDesigner = new ManifestoVisualDesigner();
  }
})();
