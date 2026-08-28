/**
 * Navigation Visual Designer HUD (Minimal, Focused Customizer)
 * Dedicated real-time controls for:
 * 1. Positioning (Top Distance, X Offset, Y Offset, Viewport Margins)
 * 2. Margins (Top, Bottom, Left, Right)
 * 3. Size & Padding (Padding X, Padding Y, Item Gap, Corner Radius, Border Width)
 * 4. Font Size & Typography (Links Font Size, Weight, Brand Size, Slash Gap, Mark Size, Clock Size)
 */

(function () {
  'use strict';

  const NAV_CONFIG = {
    // 1. Positioning & Alignment
    '--nav-box-top': { val: 26, unit: 'px', min: 0, max: 120, step: 1, label: 'Top Distance (Y)' },
    '--nav-box-offset-x': { val: 0, unit: 'px', min: -200, max: 200, step: 1, label: 'Horizontal Offset (X)' },
    '--nav-box-offset-y': { val: 0, unit: 'px', min: -100, max: 100, step: 1, label: 'Vertical Offset (Y)' },
    '--hero-margin': { val: 25, unit: 'px', min: 0, max: 100, step: 1, label: 'Viewport Margins' },

    // 2. Margins
    '--nav-box-margin-top': { val: 0, unit: 'px', min: 0, max: 80, step: 1, label: 'Margin Top' },
    '--nav-box-margin-bottom': { val: 0, unit: 'px', min: 0, max: 80, step: 1, label: 'Margin Bottom' },
    '--nav-box-margin-left': { val: 0, unit: 'px', min: 0, max: 80, step: 1, label: 'Margin Left' },
    '--nav-box-margin-right': { val: 0, unit: 'px', min: 0, max: 80, step: 1, label: 'Margin Right' },

    // 3. Sizing & Padding
    '--nav-box-padx': { val: 28, unit: 'px', min: 4, max: 80, step: 1, label: 'Horizontal Padding (X)' },
    '--nav-box-pady': { val: 16, unit: 'px', min: 2, max: 50, step: 1, label: 'Vertical Padding (Y)' },
    '--nav-box-gap': { val: 32, unit: 'px', min: 4, max: 80, step: 1, label: 'Items Gap / Spacing' },
    '--nav-box-radius': { val: 6, unit: 'px', min: 0, max: 40, step: 1, label: 'Corner Radius' },
    '--nav-box-border-width': { val: 1, unit: 'px', min: 0, max: 6, step: 0.5, label: 'Border Width' },

    // 4. Font Size & Typography
    '--nav-box-link-size': { val: 14.5, unit: 'px', min: 10, max: 28, step: 0.5, label: 'Nav Links Font Size' },
    '--nav-box-link-weight': { val: 400, unit: '', min: 300, max: 900, step: 100, label: 'Nav Links Weight' },
    '--nav-box-link-letter-spacing': { val: -0.15, unit: 'px', min: -2.0, max: 4.0, step: 0.05, label: 'Links Letter Spacing' },
    '--nav-box-brand-size': { val: 17, unit: 'px', min: 11, max: 36, step: 0.5, label: 'Brand (N/P) Font Size' },
    '--nav-box-brand-weight': { val: 700, unit: '', min: 300, max: 900, step: 100, label: 'Brand Weight' },
    '--nav-box-brand-slash-gap': { val: 1, unit: 'px', min: -2, max: 10, step: 0.5, label: 'Brand Slash (/) Gap' },
    '--nav-box-brand-r-size': { val: 9, unit: 'px', min: 6, max: 18, step: 0.5, label: 'Brand (®) Mark Size' },
    '--nav-box-brand-r-gap': { val: 2, unit: 'px', min: -4, max: 12, step: 0.5, label: 'Brand (®) Mark Gap' },
    '--nav-pinned-font-size': { val: 11, unit: 'px', min: 9, max: 20, step: 0.5, label: 'Clock & Location Size' }
  };

  const CATEGORIES = [
    {
      title: 'Positioning & Viewport',
      keys: ['--nav-box-top', '--nav-box-offset-x', '--nav-box-offset-y', '--hero-margin']
    },
    {
      title: 'Margins',
      keys: ['--nav-box-margin-top', '--nav-box-margin-bottom', '--nav-box-margin-left', '--nav-box-margin-right']
    },
    {
      title: 'Sizing & Padding',
      keys: ['--nav-box-padx', '--nav-box-pady', '--nav-box-gap', '--nav-box-radius', '--nav-box-border-width']
    },
    {
      title: 'Font Size & Typography',
      keys: [
        '--nav-box-link-size',
        '--nav-box-link-weight',
        '--nav-box-link-letter-spacing',
        '--nav-box-brand-size',
        '--nav-box-brand-weight',
        '--nav-box-brand-slash-gap',
        '--nav-box-brand-r-size',
        '--nav-box-brand-r-gap',
        '--nav-pinned-font-size'
      ]
    }
  ];

  class NavVisualDesigner {
    constructor() {
      this.state = {};
      this.isDraggingSlider = false;
      this.loadSavedState();
      this.buildUI();
      this.applyAll();
    }

    loadSavedState() {
      this.hasSavedState = false;
      try {
        const saved = localStorage.getItem('np_nav_designer_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          for (const k in NAV_CONFIG) {
            this.state[k] = parsed[k] !== undefined ? parsed[k] : NAV_CONFIG[k].val;
          }
          this.hasSavedState = true;
          return;
        }
      } catch (e) {}

      for (const k in NAV_CONFIG) {
        this.state[k] = NAV_CONFIG[k].val;
      }
    }

    saveState() {
      try {
        localStorage.setItem('np_nav_designer_v1', JSON.stringify(this.state));
      } catch (e) {}
    }

    applyValue(key, val) {
      this.state[key] = parseFloat(val);
      this.hasSavedState = true;
      this.saveState();

      const unit = NAV_CONFIG[key].unit;
      document.documentElement.style.setProperty(key, `${val}${unit}`);
    }

    applyAll() {
      if (!this.hasSavedState) return;

      for (const k in this.state) {
        const unit = NAV_CONFIG[k].unit;
        document.documentElement.style.setProperty(k, `${this.state[k]}${unit}`);
      }
    }

    buildUI() {
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
        <span>NAV DESIGNER</span>
      `;
      document.body.appendChild(toggleBtn);

      // 2. HUD Panel
      const panel = document.createElement('div');
      panel.className = 'vd-panel';
      panel.id = 'vd-panel';
      panel.innerHTML = `
        <div class="vd-header">
          <div class="vd-title">
            Navbar Customizer
            <span class="vd-drag-handle">:::</span>
          </div>
          <button class="vd-close-btn" id="vd-close-btn" aria-label="Close Designer">&times;</button>
        </div>

        <div class="vd-toast" id="vd-toast">Saved</div>

        <div class="vd-tabs" id="vd-tabs"></div>

        <div class="vd-body" id="vd-body"></div>

        <div class="vd-footer">
          <button class="vd-btn vd-btn-reset" id="vd-btn-reset">Reset</button>
          <button class="vd-btn vd-btn-copy" id="vd-btn-copy">Copy CSS</button>
        </div>
      `;
      document.body.appendChild(panel);

      const tabsContainer = panel.querySelector('#vd-tabs');
      const body = panel.querySelector('#vd-body');

      // Stop wheel propagation
      panel.addEventListener('wheel', (e) => {
        e.stopPropagation();
      }, { passive: true });

      // Tab navigation for a super clean, non-stacked layout
      let activeTabIdx = 0;

      const renderTab = (tabIdx) => {
        activeTabIdx = tabIdx;
        tabsContainer.querySelectorAll('.vd-tab-btn').forEach((btn, idx) => {
          btn.classList.toggle('active', idx === tabIdx);
        });

        body.innerHTML = '';
        const cat = CATEGORIES[tabIdx];

        cat.keys.forEach(key => {
          const cfg = NAV_CONFIG[key];
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

          body.appendChild(ctrl);
        });
      };

      // Create Tab Buttons
      CATEGORIES.forEach((cat, idx) => {
        const tabBtn = document.createElement('button');
        tabBtn.className = `vd-tab-btn ${idx === 0 ? 'active' : ''}`;
        tabBtn.textContent = cat.title.split(' ')[0]; // Concise label
        tabBtn.title = cat.title;
        tabBtn.addEventListener('click', () => renderTab(idx));
        tabsContainer.appendChild(tabBtn);
      });

      // Initial Render
      renderTab(0);

      // Restore open state
      if (localStorage.getItem('np_vd_open') === 'true') {
        panel.classList.add('active');
      }

      // Toggle & Close Events
      toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('active');
        localStorage.setItem('np_vd_open', panel.classList.contains('active') ? 'true' : 'false');
      });

      panel.querySelector('#vd-close-btn').addEventListener('click', () => {
        panel.classList.remove('active');
        localStorage.setItem('np_vd_open', 'false');
      });

      // Cursor hover states
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

      // Draggable Header
      const header = panel.querySelector('.vd-header');
      let isDraggingPanel = false;
      let startMouseX = 0;
      let startMouseY = 0;
      let initialPanelLeft = 0;
      let initialPanelTop = 0;

      try {
        const savedPos = localStorage.getItem('np_vd_panel_pos');
        if (savedPos) {
          const { left, top } = JSON.parse(savedPos);
          if (left !== undefined && top !== undefined) {
            const maxL = Math.max(10, window.innerWidth - 380);
            const maxT = Math.max(10, window.innerHeight - 200);
            panel.style.left = `${Math.min(maxL, Math.max(10, left))}px`;
            panel.style.top = `${Math.min(maxT, Math.max(10, top))}px`;
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
          }
        }
      } catch (e) {}

      header.addEventListener('mousedown', (e) => {
        if (e.target.closest('#vd-close-btn')) return;

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

        const panelW = panel.offsetWidth || 360;
        const panelH = panel.offsetHeight || 380;
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

      // Reset
      panel.querySelector('#vd-btn-reset').addEventListener('click', () => {
        for (const k in NAV_CONFIG) {
          const defaultVal = NAV_CONFIG[k].val;
          this.applyValue(k, defaultVal);
        }
        renderTab(activeTabIdx);
        this.showToast('Navbar Defaults Restored');
      });

      // Copy CSS
      panel.querySelector('#vd-btn-copy').addEventListener('click', () => {
        let css = ':root {\n';
        for (const k in NAV_CONFIG) {
          css += `  ${k}: ${this.state[k]}${NAV_CONFIG[k].unit};\n`;
        }
        css += '}\n';

        navigator.clipboard.writeText(css).then(() => {
          this.showToast('Navbar CSS Copied!');
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
      }, 1600);
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new NavVisualDesigner());
  } else {
    new NavVisualDesigner();
  }
})();
