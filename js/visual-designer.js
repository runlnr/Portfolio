/**
 * Visual Designer HUD (Complete Hero & Navigation Customizer)
 * Clean tabbed layout:
 * 1. [Nav Bar] - Top, Length/Width, Min Width, Padding X/Y, Margins, Gap, Radius, Border
 * 2. [Nav Inside] - Brand N/P Size, Weight, Slash Gap, P Level Offset, (®) Mark, Status Line, 2-line Hamburger
 * 3. [CTA Button] - Corner Rounding, Length (Padding X), Thickness (Padding Y), Font Size, Weight
 * 4. [ASCII & Slashes] - ASCII Art Move Y/X, 4 Slashes Size, Boldness, Horizontal/Vertical Offsets
 * 5. [Headline] - "NOTHING HERE BY ACCIDENT." Size, Weight, Line Height, Letter Spacing, Bottom/Left Pos, Eyebrow
 * 6. [Tagline & Square] - "We help brands say who they are..." Size, Weight, Line Height, Letter Spacing, Bottom/Left Pos, Center Square Size/Y/X
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'np_visual_designer_state_v7';

  const DESIGNER_CONFIG = {
    // ------------------------------------------------------------------------
    // TAB 1: Navigation Bar
    // ------------------------------------------------------------------------
    '--nav-box-top': { val: 25, unit: 'px', min: 0, max: 120, step: 1, label: 'Top Distance (Y)' },
    '--nav-box-width': { val: 470, unit: 'px', min: 0, max: 900, step: 5, label: 'Nav Bar Length / Width (0 = Auto)' },
    '--nav-box-min-width': { val: 290, unit: 'px', min: 160, max: 600, step: 5, label: 'Nav Min Width' },
    '--nav-box-padx': { val: 18, unit: 'px', min: 4, max: 80, step: 1, label: 'Horizontal Padding (X)' },
    '--nav-box-pady': { val: 10, unit: 'px', min: 2, max: 40, step: 1, label: 'Vertical Padding (Y)' },
    '--nav-box-margin-top': { val: 0, unit: 'px', min: 0, max: 60, step: 1, label: 'Margin Top' },
    '--nav-box-margin-bottom': { val: 0, unit: 'px', min: 0, max: 60, step: 1, label: 'Margin Bottom' },
    '--nav-box-margin-left': { val: 0, unit: 'px', min: 0, max: 60, step: 1, label: 'Margin Left' },
    '--nav-box-margin-right': { val: 0, unit: 'px', min: 0, max: 60, step: 1, label: 'Margin Right' },
    '--nav-box-gap': { val: 25, unit: 'px', min: 4, max: 60, step: 1, label: 'Inner Items Gap' },
    '--nav-box-radius': { val: 5, unit: 'px', min: 0, max: 40, step: 1, label: 'Corner Radius' },
    '--nav-box-border-width': { val: 1, unit: 'px', min: 0, max: 5, step: 0.5, label: 'Border Thickness' },

    // ------------------------------------------------------------------------
    // TAB 2: Navigation Inside Elements (Brand, Status, 2-line Hamburger)
    // ------------------------------------------------------------------------
    '--nav-box-brand-size': { val: 17, unit: 'px', min: 11, max: 36, step: 0.5, label: 'Brand (N/P) Font Size' },
    '--nav-box-brand-weight': { val: 700, unit: '', min: 300, max: 900, step: 100, label: 'Brand Font Weight' },
    '--nav-box-brand-slash-gap': { val: 0, unit: 'px', min: -2, max: 10, step: 0.5, label: 'Brand Slash (/) Gap' },
    '--nav-box-brand-p-offset-y': { val: 0, unit: 'px', min: -8, max: 8, step: 0.5, label: 'P Vertical Level Nudge' },
    '--nav-box-brand-r-size': { val: 10, unit: 'px', min: 5, max: 18, step: 0.5, label: 'Registered (®) Mark Size' },
    '--nav-box-brand-r-gap': { val: 1, unit: 'px', min: -4, max: 12, step: 0.5, label: 'Registered (®) Mark Gap' },
    '--nav-status-font-size': { val: 11, unit: 'px', min: 8, max: 20, step: 0.5, label: 'Status Line Font Size' },
    '--nav-status-font-weight': { val: 500, unit: '', min: 300, max: 900, step: 100, label: 'Status Line Weight' },
    '--nav-status-letter-spacing': { val: -0.02, unit: 'em', min: -0.08, max: 0.30, step: 0.01, label: 'Status Letter Spacing' },
    '--nav-hamburger-size': { val: 30, unit: 'px', min: 14, max: 50, step: 1, label: 'Hamburger Button Size' },
    '--nav-hamburger-line-width': { val: 19, unit: 'px', min: 8, max: 40, step: 1, label: 'Hamburger Line Width' },
    '--nav-hamburger-gap': { val: 4.5, unit: 'px', min: 2, max: 16, step: 0.5, label: 'Hamburger 2-Lines Gap' },

    // ------------------------------------------------------------------------
    // TAB 3: CTA Button ("LET'S TALK")
    // ------------------------------------------------------------------------
    '--cta-btn-radius': { val: 4, unit: 'px', min: 0, max: 50, step: 1, label: 'CTA Corner Rounding' },
    '--cta-btn-padx': { val: 20, unit: 'px', min: 6, max: 60, step: 1, label: 'CTA Length (Padding X)' },
    '--cta-btn-pady': { val: 9, unit: 'px', min: 2, max: 30, step: 1, label: 'CTA Thickness (Padding Y)' },
    '--cta-btn-font-size': { val: 10.5, unit: 'px', min: 8, max: 20, step: 0.5, label: 'CTA Font Size' },
    '--cta-btn-font-weight': { val: 600, unit: '', min: 300, max: 900, step: 100, label: 'CTA Font Weight' },

    // ------------------------------------------------------------------------
    // TAB 4: ASCII Art & 4 Corner Slashes
    // ------------------------------------------------------------------------
    '--hero-tv-top': { val: 51, unit: '%', min: 10, max: 90, step: 0.5, label: 'ASCII Vertical Pos (Y %)' },
    '--hero-tv-left': { val: 50, unit: '%', min: 10, max: 90, step: 0.5, label: 'ASCII Horizontal Pos (X %)' },
    '--hero-tv-width': { val: 910, unit: 'px', min: 280, max: 1400, step: 5, label: 'ASCII Box Width' },
    '--hero-tv-height': { val: 156, unit: 'px', min: 50, max: 400, step: 2, label: 'ASCII Box Height' },
    '--hero-tv-scale': { val: 1.0, unit: '', min: 0.4, max: 2.0, step: 0.02, label: 'ASCII Overall Scale' },
    '--corner-slashes-size': { val: 54, unit: 'px', min: 16, max: 80, step: 1, label: '4 Slashes Font Size' },
    '--corner-slashes-weight': { val: 700, unit: '', min: 300, max: 900, step: 100, label: '4 Slashes Boldness' },
    '--corner-slashes-offset-x': { val: 2, unit: 'px', min: -100, max: 100, step: 1, label: 'Slashes Horizontal Offset (X)' },
    '--corner-slashes-offset-y': { val: -60, unit: 'px', min: -140, max: 60, step: 1, label: 'Slashes Vertical Offset (Y)' },

    // ------------------------------------------------------------------------
    // TAB 5: Bottom-Left Headline ("NOTHING HERE BY ACCIDENT.")
    // ------------------------------------------------------------------------
    '--headline-font-size': { val: 60, unit: 'px', min: 22, max: 96, step: 1, label: 'Headline Font Size' },
    '--headline-font-weight': { val: 500, unit: '', min: 300, max: 900, step: 100, label: 'Headline Weight' },
    '--headline-line-height': { val: 0.94, unit: '', min: 0.70, max: 1.40, step: 0.02, label: 'Headline Line Height' },
    '--headline-letter-spacing': { val: -0.03, unit: 'em', min: -0.10, max: 0.10, step: 0.005, label: 'Headline Letter Spacing' },
    '--headline-bottom': { val: 25, unit: 'px', min: 0, max: 200, step: 1, label: 'Bottom Margin / Distance' },
    '--headline-left': { val: 25, unit: 'px', min: 0, max: 200, step: 1, label: 'Left Margin / Distance' },
    '--headline-max-width': { val: 520, unit: 'px', min: 200, max: 900, step: 10, label: 'Headline Max Width' },
    '--eyebrow-font-size': { val: 11, unit: 'px', min: 8, max: 22, step: 0.5, label: 'Eyebrow (/ We are N/P /) Size' },
    '--eyebrow-margin-bottom': { val: 10, unit: 'px', min: 0, max: 30, step: 1, label: 'Eyebrow Bottom Gap' },

    // ------------------------------------------------------------------------
    // TAB 6: Tagline & Center Square
    // ------------------------------------------------------------------------
    '--tagline-font-size': { val: 19.5, unit: 'px', min: 10, max: 32, step: 0.5, label: 'Tagline Font Size' },
    '--tagline-font-weight': { val: 400, unit: '', min: 300, max: 800, step: 100, label: 'Tagline Font Weight' },
    '--tagline-line-height': { val: 1.1, unit: '', min: 0.8, max: 2.6, step: 0.05, label: 'Line Spacing (Line Height)' },
    '--tagline-letter-spacing': { val: -0.015, unit: 'em', min: -0.06, max: 0.25, step: 0.005, label: 'Letter Spacing' },
    '--tagline-bottom': { val: 25, unit: 'px', min: 0, max: 200, step: 1, label: 'Tagline Bottom Pos' },
    '--tagline-left': { val: 200, unit: 'px', min: -200, max: 400, step: 2, label: 'Tagline Left Offset from Center' },
    '--tagline-max-width': { val: 270, unit: 'px', min: 150, max: 600, step: 10, label: 'Tagline Max Width' },
    '--hero-square-size': { val: 7, unit: 'px', min: 2, max: 28, step: 1, label: 'Center Square Size' },
    '--hero-square-bottom': { val: 32, unit: 'px', min: -50, max: 120, step: 1, label: 'Center Square Bottom Offset' },
    '--hero-square-offset-x': { val: 187, unit: 'px', min: -200, max: 300, step: 1, label: 'Center Square Left/Right Offset' }
  };

  const CATEGORIES = [
    {
      id: 'navbar',
      title: 'Nav Bar',
      keys: [
        '--nav-box-top',
        '--nav-box-width',
        '--nav-box-min-width',
        '--nav-box-padx',
        '--nav-box-pady',
        '--nav-box-margin-top',
        '--nav-box-margin-bottom',
        '--nav-box-margin-left',
        '--nav-box-margin-right',
        '--nav-box-gap',
        '--nav-box-radius',
        '--nav-box-border-width'
      ]
    },
    {
      id: 'navelements',
      title: 'Nav Inside',
      keys: [
        '--nav-box-brand-size',
        '--nav-box-brand-weight',
        '--nav-box-brand-slash-gap',
        '--nav-box-brand-p-offset-y',
        '--nav-box-brand-r-size',
        '--nav-box-brand-r-gap',
        '--nav-status-font-size',
        '--nav-status-font-weight',
        '--nav-status-letter-spacing',
        '--nav-hamburger-size',
        '--nav-hamburger-line-width',
        '--nav-hamburger-gap'
      ]
    },
    {
      id: 'cta',
      title: 'CTA Button',
      keys: [
        '--cta-btn-radius',
        '--cta-btn-padx',
        '--cta-btn-pady',
        '--cta-btn-font-size',
        '--cta-btn-font-weight'
      ]
    },
    {
      id: 'slashes',
      title: 'ASCII & Slashes',
      keys: [
        '--hero-tv-top',
        '--hero-tv-left',
        '--hero-tv-width',
        '--hero-tv-height',
        '--hero-tv-scale',
        '--corner-slashes-size',
        '--corner-slashes-weight',
        '--corner-slashes-offset-x',
        '--corner-slashes-offset-y'
      ]
    },
    {
      id: 'headline',
      title: 'Headline',
      keys: [
        '--headline-font-size',
        '--headline-font-weight',
        '--headline-line-height',
        '--headline-letter-spacing',
        '--headline-bottom',
        '--headline-left',
        '--headline-max-width',
        '--eyebrow-font-size',
        '--eyebrow-margin-bottom'
      ]
    },
    {
      id: 'tagline',
      title: 'Tagline & Square',
      keys: [
        '--tagline-font-size',
        '--tagline-font-weight',
        '--tagline-line-height',
        '--tagline-letter-spacing',
        '--tagline-bottom',
        '--tagline-left',
        '--tagline-max-width',
        '--hero-square-size',
        '--hero-square-bottom',
        '--hero-square-offset-x'
      ]
    }
  ];

  class VisualDesignerHUD {
    constructor() {
      this.state = {};
      this.activeTab = 'navbar';
      this.isDragging = false;
      this.loadSavedState();
      this.buildUI();
      this.applyAll();
    }

    loadSavedState() {
      this.hasSavedState = false;
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          for (const k in DESIGNER_CONFIG) {
            this.state[k] = parsed[k] !== undefined ? parsed[k] : DESIGNER_CONFIG[k].val;
          }
          this.hasSavedState = true;
          return;
        }
      } catch (e) {}

      for (const k in DESIGNER_CONFIG) {
        this.state[k] = DESIGNER_CONFIG[k].val;
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

      let formattedVal = `${val}${conf.unit}`;
      if (key === '--nav-box-width') {
        formattedVal = val === 0 ? 'auto' : `${val}px`;
      } else if (key === '--tagline-left') {
        formattedVal = `calc(50% + ${val}px)`;
      }

      document.documentElement.style.setProperty(key, formattedVal);

      // Master offsets for corner slashes
      if (key === '--corner-slashes-offset-x') {
        document.documentElement.style.setProperty('--corner-tl-x', `${val}px`);
        document.documentElement.style.setProperty('--corner-tr-x', `${val}px`);
        document.documentElement.style.setProperty('--corner-bl-x', `${val}px`);
        document.documentElement.style.setProperty('--corner-br-x', `${val}px`);
      } else if (key === '--corner-slashes-offset-y') {
        document.documentElement.style.setProperty('--corner-tl-y', `${val}px`);
        document.documentElement.style.setProperty('--corner-tr-y', `${val}px`);
        document.documentElement.style.setProperty('--corner-bl-y', `${val}px`);
        document.documentElement.style.setProperty('--corner-br-y', `${val}px`);
      }
    }

    applyAll() {
      for (const k in this.state) {
        this.applyVal(k, this.state[k]);
      }
    }

    buildUI() {
      // Toggle button
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'vd-toggle-btn';
      toggleBtn.innerHTML = '<span class="vd-toggle-dot"></span><span>DESIGNER</span>';
      toggleBtn.setAttribute('aria-label', 'Toggle Visual Designer Panel');
      document.body.appendChild(toggleBtn);

      // Main Panel
      const panel = document.createElement('aside');
      panel.className = 'vd-panel';
      panel.id = 'vd-designer-panel';
      panel.setAttribute('data-lenis-prevent', 'true');
      panel.setAttribute('data-lenis-prevent-wheel', 'true');
      panel.setAttribute('data-lenis-prevent-touch', 'true');

      // Stop wheel & touch bubbling so page doesn't scroll instead of designer
      panel.addEventListener('wheel', (e) => {
        e.stopPropagation();
      }, { passive: true });

      panel.addEventListener('touchmove', (e) => {
        e.stopPropagation();
      }, { passive: true });

      // Header
      const header = document.createElement('div');
      header.className = 'vd-header';
      header.innerHTML = `
        <div class="vd-title">
          <span>Visual Designer</span>
          <span class="vd-drag-handle">:::</span>
        </div>
        <button class="vd-close-btn" aria-label="Close Designer">&times;</button>
      `;
      panel.appendChild(header);

      // Tabs Header (Keeps the UI compact and organized)
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
          this.activeTab = cat.id;
        });
        tabsNav.appendChild(tabBtn);
      });
      panel.appendChild(tabsNav);

      // Body (Container for tab panes)
      const body = document.createElement('div');
      body.className = 'vd-body';
      body.setAttribute('data-lenis-prevent', 'true');
      body.setAttribute('data-lenis-prevent-wheel', 'true');
      body.setAttribute('data-lenis-prevent-touch', 'true');

      body.addEventListener('wheel', (e) => {
        e.stopPropagation();
      }, { passive: true });

      CATEGORIES.forEach((cat, idx) => {
        const pane = document.createElement('div');
        pane.className = `vd-tab-pane ${idx === 0 ? 'active' : ''}`;
        pane.dataset.tab = cat.id;
        pane.setAttribute('data-lenis-prevent', 'true');

        cat.keys.forEach(key => {
          const conf = DESIGNER_CONFIG[key];
          if (!conf) return;

          const control = document.createElement('div');
          control.className = 'vd-control';

          const currentVal = this.state[key] !== undefined ? this.state[key] : conf.val;
          let displayVal = `${currentVal}${conf.unit}`;
          if (key === '--nav-box-width' && currentVal === 0) displayVal = 'Auto';

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
                   value="${currentVal}">
          `;

          const slider = control.querySelector('input');
          const valDisplay = control.querySelector('.vd-control-value');

          slider.addEventListener('input', (e) => {
            const num = parseFloat(e.target.value);
            this.state[key] = num;
            let display = `${num}${conf.unit}`;
            if (key === '--nav-box-width' && num === 0) display = 'Auto';
            valDisplay.textContent = display;
            this.applyVal(key, num);
            this.saveState();
          });

          pane.appendChild(control);
        });

        body.appendChild(pane);
      });

      panel.appendChild(body);

      // Footer with Action Buttons
      const footer = document.createElement('div');
      footer.className = 'vd-footer';
      footer.innerHTML = `
        <button class="vd-btn vd-btn-reset" id="vd-btn-reset">Reset</button>
        <button class="vd-btn vd-btn-copy" id="vd-btn-copy">Copy CSS</button>
      `;
      panel.appendChild(footer);
      document.body.appendChild(panel);

      // Event Listeners
      toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('active');
      });

      header.querySelector('.vd-close-btn').addEventListener('click', () => {
        panel.classList.remove('active');
      });

      // Press 'H' to toggle
      window.addEventListener('keydown', (e) => {
        if (e.key === 'h' || e.key === 'H') {
          if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            panel.classList.toggle('active');
          }
        }
      });

      // Reset
      footer.querySelector('#vd-btn-reset').addEventListener('click', () => {
        if (confirm('Reset all Visual Designer adjustments back to defaults?')) {
          localStorage.removeItem(STORAGE_KEY);
          for (const k in DESIGNER_CONFIG) {
            this.state[k] = DESIGNER_CONFIG[k].val;
          }
          this.applyAll();
          // Update inputs
          panel.querySelectorAll('input[type="range"]').forEach(slider => {
            const k = slider.dataset.key;
            if (DESIGNER_CONFIG[k]) {
              slider.value = DESIGNER_CONFIG[k].val;
              const valEl = panel.querySelector(`#val-${k}`);
              if (valEl) {
                const v = DESIGNER_CONFIG[k].val;
                let display = `${v}${DESIGNER_CONFIG[k].unit}`;
                if (k === '--nav-box-width' && v === 0) display = 'Auto';
                valEl.textContent = display;
              }
            }
          });
        }
      });

      // Copy CSS
      footer.querySelector('#vd-btn-copy').addEventListener('click', () => {
        let css = ':root {\n';
        for (const cat of CATEGORIES) {
          css += `  /* ${cat.title} */\n`;
          for (const k of cat.keys) {
            const conf = DESIGNER_CONFIG[k];
            const v = this.state[k];
            let formatted = `${v}${conf.unit}`;
            if (k === '--nav-box-width' && v === 0) formatted = 'auto';
            if (k === '--tagline-left') formatted = `calc(50% + ${v}px)`;
            css += `  ${k}: ${formatted};\n`;
          }
          css += '\n';
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

      // Make Panel Draggable
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

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.navVisualDesigner = new VisualDesignerHUD();
    });
  } else {
    window.navVisualDesigner = new VisualDesignerHUD();
  }
})();
