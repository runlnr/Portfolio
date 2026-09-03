/**
 * Visual Designer HUD: Manifesto & Work Tab Spacing Studio
 * Real-time top and bottom margin controls for:
 * 1. Manifesto Lockup, Section Padding, Coordinates & Statement
 * 2. Featured Works Header Row & 2-Column Staggered Grid
 * 3. Individual Work Cards (Memphis, U.S. Ski, NK Hoops, Audi F1), Info & Tags
 * 4. Section Bottom & Footer Legal Bar
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'np_manifesto_work_margins_v4';

  const DESIGNER_CONFIG = {
    // ── TAB 1: MANIFESTO LOCKUP & STATEMENT ──────────────────────────────────
    '--manifesto-top-margin':           { val: 60,  unit: 'px', min: 0,   max: 250, step: 2, label: 'Section Top Padding',          type: 'css' },
    '--manifesto-lockup-margin-top':    { val: -18, unit: 'px', min: -50, max: 150, step: 1, label: 'Intro Lockup Margin Top',     type: 'css' },
    '--manifesto-gap':                  { val: 120, unit: 'px', min: 0,   max: 400, step: 5, label: 'Intro Lockup Bottom Margin',  type: 'css' },
    '--manifesto-coord-margin-top':     { val: 3,   unit: 'px', min: -40, max: 100, step: 1, label: 'Coordinates Top Offset',      type: 'css' },
    '--manifesto-coord-gap':            { val: 7,   unit: 'px', min: 0,   max: 80,  step: 1, label: 'Coordinates to Ongoing Gap',   type: 'css' },
    '--manifesto-statement-margin-top': { val: 0,   unit: 'px', min: -40, max: 100, step: 1, label: 'Statement Text Margin Top',   type: 'css' },
    '--manifesto-btn-gap':              { val: 20,  unit: 'px', min: 0,   max: 100, step: 1, label: 'Statement to About Btn Gap',   type: 'css' },
    '--manifesto-btn-margin-bottom':    { val: 0,   unit: 'px', min: -30, max: 80,  step: 1, label: 'About Button Margin Bottom',   type: 'css' },

    // ── TAB 2: FEATURED HEADER & GRID ────────────────────────────────────────
    '--featured-tag-margin-top':        { val: 0,   unit: 'px', min: -50, max: 150, step: 2, label: 'Featured Tag Row Margin Top',    type: 'css' },
    '--featured-tag-margin-bottom':     { val: 0,   unit: 'px', min: -50, max: 150, step: 2, label: 'Featured Tag Row Margin Bottom', type: 'css' },
    '--works-grid-margin-top':          { val: 14,  unit: 'px', min: -60, max: 150, step: 2, label: 'Works Grid Margin Top',          type: 'css' },
    '--works-grid-padding-bottom':      { val: 100, unit: 'px', min: 0,   max: 250, step: 5, label: 'Works Grid Padding Bottom',      type: 'css' },
    '--works-col-left-margin-top':      { val: 0,   unit: 'px', min: -100,max: 350, step: 5, label: 'Left Column Top Margin/Stagger', type: 'css' },
    '--works-col-left-gap':             { val: 70,  unit: 'px', min: 0,   max: 300, step: 5, label: 'Left Column Gap (Cards 1 & 3)',  type: 'css' },
    '--works-col-right-margin-top':     { val: 0,   unit: 'px', min: -100,max: 300, step: 5, label: 'Right Column Top Margin/Stagger',type: 'css' },
    '--works-col-right-gap':            { val: 70,  unit: 'px', min: 0,   max: 300, step: 5, label: 'Right Column Gap (Cards 2 & 4)', type: 'css' },
    '--f3-works-grid-gap':              { val: 25,  unit: 'px', min: 0,   max: 80,  step: 1, label: 'Projects Column Gap (Edge = 25px)', type: 'css' },

    // ── TAB 3: WORK CARDS ────────────────────────────────────────────────────
    '--work-card-title-size':           { val: 20,  unit: 'px', min: 14,  max: 64,  step: 1, label: 'Projects Title Font Size',        type: 'css' },
    '--card-1-margin-top':              { val: 0,   unit: 'px', min: -80, max: 200, step: 2, label: 'Card 1 (Memphis) Margin Top',    type: 'css' },
    '--card-1-margin-bottom':           { val: 0,   unit: 'px', min: -50, max: 200, step: 2, label: 'Card 1 (Memphis) Margin Bottom', type: 'css' },
    '--card-2-margin-top':              { val: 0,   unit: 'px', min: -80, max: 200, step: 2, label: 'Card 2 (U.S. Ski) Margin Top',   type: 'css' },
    '--card-2-margin-bottom':           { val: 0,   unit: 'px', min: -50, max: 200, step: 2, label: 'Card 2 (U.S. Ski) Margin Bottom',type: 'css' },
    '--card-3-margin-top':              { val: 0,   unit: 'px', min: -80, max: 200, step: 2, label: 'Card 3 (NK Hoops) Margin Top',   type: 'css' },
    '--card-3-margin-bottom':           { val: 0,   unit: 'px', min: -50, max: 200, step: 2, label: 'Card 3 (NK Hoops) Margin Bottom',type: 'css' },
    '--card-4-margin-top':              { val: 0,   unit: 'px', min: -80, max: 200, step: 2, label: 'Card 4 (Audi F1) Margin Top',    type: 'css' },
    '--card-4-margin-bottom':           { val: 0,   unit: 'px', min: -50, max: 200, step: 2, label: 'Card 4 (Audi F1) Margin Bottom', type: 'css' },
    '--card-info-margin-top':           { val: 18,  unit: 'px', min: 0,   max: 60,  step: 1, label: 'Card Info (Title/Year) Margin Top',type: 'css' },
    '--card-tags-margin-top':           { val: 10,  unit: 'px', min: 0,   max: 40,  step: 1, label: 'Card Tags Margin Top',            type: 'css' },

    // ── TAB 4: FOOTER & SECTION ──────────────────────────────────────────────
    '--f3-footer-margin-top':           { val: 80,  unit: 'px', min: 0,   max: 250, step: 5, label: 'Footer Legal Bar Margin Top',     type: 'css' },
    '--f3-footer-padding-top':          { val: 32,  unit: 'px', min: 0,   max: 120, step: 2, label: 'Footer Legal Bar Padding Top',    type: 'css' },
    '--section-intro-padding-bottom':   { val: 100, unit: 'px', min: 0,   max: 250, step: 5, label: 'Section Intro Bottom Padding',    type: 'css' },
  };

  const CATEGORIES = [
    {
      id: 'manifesto_tab',
      title: 'Manifesto',
      keys: [
        '--manifesto-top-margin',
        '--manifesto-lockup-margin-top',
        '--manifesto-gap',
        '--manifesto-coord-margin-top',
        '--manifesto-coord-gap',
        '--manifesto-statement-margin-top',
        '--manifesto-btn-gap',
        '--manifesto-btn-margin-bottom'
      ]
    },
    {
      id: 'featured_grid_tab',
      title: 'Header & Grid',
      keys: [
        '--featured-tag-margin-top',
        '--featured-tag-margin-bottom',
        '--works-grid-margin-top',
        '--works-grid-padding-bottom',
        '--works-col-left-margin-top',
        '--works-col-left-gap',
        '--works-col-right-margin-top',
        '--works-col-right-gap',
        '--f3-works-grid-gap'
      ]
    },
    {
      id: 'cards_tab',
      title: 'Work Cards',
      keys: [
        '--work-card-title-size',
        '--card-1-margin-top',
        '--card-1-margin-bottom',
        '--card-2-margin-top',
        '--card-2-margin-bottom',
        '--card-3-margin-top',
        '--card-3-margin-bottom',
        '--card-4-margin-top',
        '--card-4-margin-bottom',
        '--card-info-margin-top',
        '--card-tags-margin-top'
      ]
    },
    {
      id: 'footer_tab',
      title: 'Footer',
      keys: [
        '--f3-footer-margin-top',
        '--f3-footer-padding-top',
        '--section-intro-padding-bottom'
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
        const s = localStorage.getItem(STORAGE_KEY);
        if (s) this.state = JSON.parse(s);
      } catch (e) {}
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
      document.documentElement.style.setProperty(key, val + conf.unit);
      this.saveState();

      clearTimeout(this._refreshTimer);
      this._refreshTimer = setTimeout(() => {
        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }
      }, 60);
    }

    applyAll() {
      for (const [k, conf] of Object.entries(DESIGNER_CONFIG)) {
        const val = this.state[k] ?? conf.val;
        document.documentElement.style.setProperty(k, val + conf.unit);
      }
      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    }

    createUI() {
      document.getElementById('vd-toggle-btn')?.remove();
      document.getElementById('vd-panel')?.remove();

      // 1. Floating Toggle Button
      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'vd-toggle-btn';
      toggleBtn.className = 'vd-toggle-btn';
      toggleBtn.setAttribute('aria-label', 'Toggle Margin Designer HUD');
      toggleBtn.innerHTML = '<span class="vd-toggle-dot"></span><span>MARGINS HUD [D]</span>';
      toggleBtn.style.display = 'none';
      document.body.appendChild(toggleBtn);

      // 2. HUD Panel
      const panel = document.createElement('div');
      panel.id = 'vd-panel';
      panel.className = 'vd-panel';
      panel.setAttribute('data-lenis-prevent', 'true');
      panel.addEventListener('wheel', e => e.stopPropagation(), { passive: true });
      panel.addEventListener('touchmove', e => e.stopPropagation(), { passive: true });

      // Header
      const header = document.createElement('div');
      header.className = 'vd-header';
      header.innerHTML = `
        <div class="vd-title">
          <span>MANIFESTO / WORK HUD</span>
          <span class="vd-drag-handle">⠿</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <button class="vd-jump-btn" id="vd-jump-manifesto" title="Jump to Manifesto" style="background:transparent;border:1px solid rgba(255,255,255,0.15);color:#00ff66;font-family:monospace;font-size:9px;padding:3px 6px;border-radius:3px;cursor:pointer;">↓ Manifesto</button>
          <button class="vd-jump-btn" id="vd-jump-works" title="Jump to Works" style="background:transparent;border:1px solid rgba(255,255,255,0.15);color:#00ff66;font-family:monospace;font-size:9px;padding:3px 6px;border-radius:3px;cursor:pointer;">↓ Works</button>
          <button class="vd-close-btn" aria-label="Close">✕</button>
        </div>
      `;
      panel.appendChild(header);

      // Category Tabs
      const tabsNav = document.createElement('div');
      tabsNav.className = 'vd-tabs';
      CATEGORIES.forEach((cat, idx) => {
        const btn = document.createElement('button');
        btn.className = 'vd-tab-btn' + (idx === 0 ? ' active' : '');
        btn.dataset.tab = cat.id;
        btn.textContent = cat.title;
        btn.addEventListener('click', () => {
          panel.querySelectorAll('.vd-tab-btn').forEach(b => b.classList.remove('active'));
          panel.querySelectorAll('.vd-tab-pane').forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          panel.querySelector('.vd-tab-pane[data-tab="' + cat.id + '"]')?.classList.add('active');
        });
        tabsNav.appendChild(btn);
      });
      panel.appendChild(tabsNav);

      // Body (Panes with Sliders)
      const body = document.createElement('div');
      body.className = 'vd-body';
      body.setAttribute('data-lenis-prevent', 'true');

      CATEGORIES.forEach((cat, idx) => {
        const pane = document.createElement('div');
        pane.className = 'vd-tab-pane' + (idx === 0 ? ' active' : '');
        pane.dataset.tab = cat.id;

        cat.keys.forEach(key => {
          const conf = DESIGNER_CONFIG[key];
          if (!conf) return;
          const curVal = this.state[key] ?? conf.val;
          const unitStr = conf.unit || '';
          const safeId = 'val-' + key.replace(/[^a-zA-Z0-9_]/g, '_');

          const ctrl = document.createElement('div');
          ctrl.className = 'vd-control';
          ctrl.innerHTML = `
            <div class="vd-control-header">
              <span class="vd-control-label">${conf.label}</span>
              <span class="vd-control-value" id="${safeId}">${curVal}${unitStr}</span>
            </div>
            <input type="range" class="vd-range-slider" data-key="${key}" min="${conf.min}" max="${conf.max}" step="${conf.step}" value="${curVal}">
          `;

          const slider = ctrl.querySelector('input');
          const disp = ctrl.querySelector('.vd-control-value');

          slider.addEventListener('input', e => {
            const n = parseFloat(e.target.value);
            disp.textContent = n + unitStr;
            this.applyVal(key, n);
          });

          pane.appendChild(ctrl);
        });

        body.appendChild(pane);
      });
      panel.appendChild(body);

      // Footer
      const footer = document.createElement('div');
      footer.className = 'vd-footer';
      footer.innerHTML = `
        <button class="vd-btn vd-btn-reset" id="vd-btn-reset">Reset All</button>
        <button class="vd-btn vd-btn-copy" id="vd-btn-copy">Copy CSS Tokens</button>
      `;
      panel.appendChild(footer);
      document.body.appendChild(panel);

      // Event Listeners: Toggle & Shortcuts
      toggleBtn.addEventListener('click', () => panel.classList.toggle('active'));
      header.querySelector('.vd-close-btn').addEventListener('click', () => panel.classList.remove('active'));

      header.querySelector('#vd-jump-manifesto')?.addEventListener('click', () => {
        document.getElementById('f3-intro')?.scrollIntoView({ behavior: 'smooth' });
      });

      header.querySelector('#vd-jump-works')?.addEventListener('click', () => {
        document.getElementById('f3-portfolio')?.scrollIntoView({ behavior: 'smooth' });
      });

      window.addEventListener('keydown', e => {
        if ((e.key === 'd' || e.key === 'D') && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          panel.classList.toggle('active');
        }
      });

      // Reset
      footer.querySelector('#vd-btn-reset').addEventListener('click', () => {
        if (!confirm('Reset all manifesto and work margins to defaults?')) return;
        localStorage.removeItem(STORAGE_KEY);
        for (const k in DESIGNER_CONFIG) {
          this.state[k] = DESIGNER_CONFIG[k].val;
        }
        this.applyAll();
        panel.querySelectorAll('input[type="range"]').forEach(s => {
          const k = s.dataset.key;
          if (!DESIGNER_CONFIG[k]) return;
          s.value = DESIGNER_CONFIG[k].val;
          const safeId = '#val-' + k.replace(/[^a-zA-Z0-9_]/g, '_');
          const el = panel.querySelector(safeId);
          if (el) el.textContent = DESIGNER_CONFIG[k].val + (DESIGNER_CONFIG[k].unit || '');
        });
      });

      // Copy CSS Tokens
      footer.querySelector('#vd-btn-copy').addEventListener('click', () => {
        let css = '/* ==========================================================================\n';
        css += '   MANIFESTO & WORK TAB SPACING TOKENS\n';
        css += '   ========================================================================== */\n:root {\n';
        for (const cat of CATEGORIES) {
          css += '  /* ' + cat.title + ' */\n';
          cat.keys.forEach(k => {
            const conf = DESIGNER_CONFIG[k];
            const val = this.state[k] ?? conf.val;
            css += '  ' + k + ': ' + val + conf.unit + ';\n';
          });
          css += '\n';
        }
        css += '}\n';

        navigator.clipboard.writeText(css).then(() => {
          const b = footer.querySelector('#vd-btn-copy');
          const o = b.textContent;
          b.textContent = 'COPIED!';
          b.style.background = '#00ff66';
          b.style.color = '#000';
          setTimeout(() => {
            b.textContent = o;
            b.style.background = '';
            b.style.color = '';
          }, 1800);
        }).catch(() => prompt('Copy CSS Tokens:', css));
      });

      this.makeDraggable(panel, header);
    }

    makeDraggable(el, handle) {
      let px = 0, py = 0, mx = 0, my = 0;
      handle.onmousedown = e => {
        if (e.target.closest('.vd-close-btn') || e.target.closest('.vd-jump-btn')) return;
        e.preventDefault();
        mx = e.clientX;
        my = e.clientY;
        el.classList.add('is-dragging');

        document.onmouseup = () => {
          document.onmouseup = document.onmousemove = null;
          el.classList.remove('is-dragging');
        };

        document.onmousemove = e => {
          e.preventDefault();
          px = mx - e.clientX;
          py = my - e.clientY;
          mx = e.clientX;
          my = e.clientY;
          el.style.top = Math.max(10, el.offsetTop - py) + 'px';
          el.style.left = Math.max(10, el.offsetLeft - px) + 'px';
          el.style.right = 'auto';
        };
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.npVisualDesigner = new VisualDesignerHUD();
    });
  } else {
    window.npVisualDesigner = new VisualDesignerHUD();
  }
})();
