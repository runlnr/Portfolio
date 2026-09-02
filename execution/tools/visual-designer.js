/**
 * Visual Designer & Hero ASCII Studio HUD
 * Controls for:
 * 1. Shape Sizing & Position (Width, Height, Scale, Top, Left)
 * 2. CRT Tube Curvature & Bezier Geometry (Side Bulge, Top/Bot Bulge, Corner Fillet Radius)
 * 3. Hero Typography (Bottom Headline Size, Weight, Spacing, Margins, Tagline Size)
 * 4. 4 Corner Slashes (Size, Weight, Master Opacity, Individual Opacities, Per-Corner X/Y Position)
 * 5. ASCII Shader parameters (videoScale, videoOffsetX, videoOffsetY, cellSize, dotScale, contrast, brightness, bloom, tvness, fisheye, sideBulge, vertBulge, tvSizeX/Y)
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'np_hero_designer_state_v20';

  const DESIGNER_CONFIG = {
    // ── TAB 1: SHAPE ─────────────────────────────────────────────────────────
    '--hero-tv-width':  { val: 980,  unit: 'px', min: 200,  max: 1600, step: 5,    label: 'Shape Width',               type: 'css' },
    '--hero-tv-height': { val: 540,  unit: 'px', min: 50,   max: 900,  step: 2,    label: 'Shape Height',              type: 'css' },
    '--hero-tv-scale':  { val: 1.0,  unit: '',   min: 0.4,  max: 2.5,  step: 0.02, label: 'Overall Scale',             type: 'css' },
    '--hero-tv-top':    { val: 51.0, unit: '%',  min: 10,   max: 90,   step: 0.5,  label: 'Vertical Position (Y %)',   type: 'css' },
    '--hero-tv-left':   { val: 50.0, unit: '%',  min: 10,   max: 90,   step: 0.5,  label: 'Horizontal Position (X %)', type: 'css' },

    // ── TAB 2: CRT TUBE CURVATURE & GEOMETRY ─────────────────────────────────
    'crtSideBulge':     { val: 5.0,  unit: '%',  min: 0,    max: 15,   step: 0.1,  label: 'Horizontal / Side Bulge (% W)',       type: 'crt' },
    'crtVertBulge':     { val: 11.5, unit: '%',  min: 0,    max: 15,   step: 0.1,  label: 'Vertical / Top-Bot Bulge (% H)',      type: 'crt' },
    'crtCornerRadius':  { val: 0.2,  unit: '%',  min: 0.1,  max: 15,   step: 0.1,  label: 'Corner Fillet Radius (%)',            type: 'crt' },
    'crtEdgeBlur':      { val: 5.0,  unit: 'px', min: 0,    max: 40,   step: 0.5,  label: 'Edge Blur / Defocus',                 type: 'crt' },

    // ── TAB 3: TEXT & TYPOGRAPHY ─────────────────────────────────────────────
    '--hero-bottom-text-size':    { val: 48,    unit: 'px', min: 14,   max: 140, step: 1,     label: 'Bottom Statements Size',    type: 'css' },
    '--hero-bottom-text-weight':  { val: 400,   unit: '',   min: 100,  max: 900, step: 100,   label: 'Bottom Statements Weight',  type: 'css' },
    '--hero-bottom-text-spacing': { val: -0.02, unit: 'em', min: -0.1, max: 0.1, step: 0.005, label: 'Bottom Letter Spacing',    type: 'css' },
    '--hero-bottom-text-bottom':  { val: 25,    unit: 'px', min: 0,    max: 150, step: 1,     label: 'Bottom Margin (Y distance)',type: 'css' },
    '--hero-bottom-text-side':    { val: 25,    unit: 'px', min: 0,    max: 150, step: 1,     label: 'Side Margin (X distance)',  type: 'css' },
    '--tagline-font-size':        { val: 19.5,  unit: 'px', min: 10,   max: 48,  step: 0.5,   label: 'Tagline Font Size',         type: 'css' },

    // ── TAB 4: SLASHES ───────────────────────────────────────────────────────
    '--corner-slashes-size':    { val: 20,  unit: 'px', min: 10,  max: 120,  step: 1,   label: 'Font Size (all corners)',      type: 'css' },
    '--corner-slashes-weight':  { val: 900, unit: '',   min: 100, max: 900,  step: 100, label: 'Font Weight (100-900)',         type: 'css' },
    '--corner-slashes-opacity': { val: 0,   unit: '%',  min: 0,   max: 100,  step: 1,   label: 'Master Opacity (All Slashes)',  type: 'opacity' },
    '--corner-tl-opacity':      { val: 0,   unit: '%',  min: 0,   max: 100,  step: 1,   label: 'Top-Left Slash Opacity',       type: 'opacity' },
    '--corner-tr-opacity':      { val: 0,   unit: '%',  min: 0,   max: 100,  step: 1,   label: 'Top-Right Slash Opacity',      type: 'opacity' },
    '--corner-bl-opacity':      { val: 0,   unit: '%',  min: 0,   max: 100,  step: 1,   label: 'Bot-Left Slash Opacity',       type: 'opacity' },
    '--corner-br-opacity':      { val: 0,   unit: '%',  min: 0,   max: 100,  step: 1,   label: 'Bot-Right Slash Opacity',      type: 'opacity' },
    '--corner-tl-x': { val: -6,  unit: 'px', min: -200, max: 200, step: 1, label: 'Top-Left Slash — X offset',  type: 'css' },
    '--corner-tl-y': { val: -3,  unit: 'px', min: -200, max: 200, step: 1, label: 'Top-Left Slash — Y offset',  type: 'css' },
    '--corner-tr-x': { val: -6,  unit: 'px', min: -200, max: 200, step: 1, label: 'Top-Right Slash — X offset', type: 'css' },
    '--corner-tr-y': { val: -3,  unit: 'px', min: -200, max: 200, step: 1, label: 'Top-Right Slash — Y offset', type: 'css' },
    '--corner-bl-x': { val: -6,  unit: 'px', min: -200, max: 200, step: 1, label: 'Bot-Left Slash — X offset',  type: 'css' },
    '--corner-bl-y': { val: -3,  unit: 'px', min: -200, max: 200, step: 1, label: 'Bot-Left Slash — Y offset',  type: 'css' },
    '--corner-br-x': { val: -6,  unit: 'px', min: -200, max: 200, step: 1, label: 'Bot-Right Slash — X offset', type: 'css' },
    '--corner-br-y': { val: -3,  unit: 'px', min: -200, max: 200, step: 1, label: 'Bot-Right Slash — Y offset', type: 'css' },

    // ── TAB 5: ASCII SHADER ──────────────────────────────────────────────────
    'videoScale':       { val: 1.0,  unit: 'x',  min: 0.3,  max: 3.0,  step: 0.05, label: 'ASCII Character / Video Zoom',   type: 'shader' },
    'videoOffsetX':     { val: 0.0,  unit: '',   min: -1.0, max: 1.0,  step: 0.01, label: 'Pan Character X',                type: 'shader' },
    'videoOffsetY':     { val: 0.0,  unit: '',   min: -1.0, max: 1.0,  step: 0.01, label: 'Pan Character Y',                type: 'shader' },
    'cellSize':         { val: 10,   unit: 'px', min: 2,    max: 28,  step: 0.5,  label: 'Cell Size (Grid Density)',        type: 'shader' },
    'dotScale':         { val: 1.3,  unit: 'x',  min: 0.2,  max: 3.0, step: 0.05, label: 'Glyph Fill / Dot Scale',           type: 'shader' },
    'contrast':         { val: 0.1,  unit: 'x',  min: 0.1,  max: 3.0, step: 0.05, label: 'Video Contrast',                   type: 'shader' },
    'brightness':       { val: 0.7,  unit: '',   min: -0.5, max: 1.5, step: 0.01, label: 'Video Brightness',                 type: 'shader' },
    'bloomStrength':    { val: 0.35, unit: 'x',  min: 0.0,  max: 3.0, step: 0.05, label: 'Glow / Bloom Strength',            type: 'shader' },
    'tvness':           { val: 0.95, unit: '',   min: 0.0,  max: 2.0, step: 0.05, label: 'CRT Scanlines & Color Mix',        type: 'shader' },
    'fisheyeStrength':  { val: 0.08, unit: '',   min: 0.0,  max: 0.5, step: 0.01, label: 'CRT Fisheye Distortion',           type: 'shader' },
    'sideBulge':        { val: 0.06, unit: '',   min: -0.5, max: 0.5, step: 0.01, label: 'Side Bulge (barrel/pin)',          type: 'shader' },
    'vertBulge':        { val: 0.06, unit: '',   min: -0.5, max: 0.5, step: 0.01, label: 'Vertical Bulge',                   type: 'shader' },
    'tvSizeX':          { val: 2.0,  unit: '',   min: 0.5,  max: 2.0, step: 0.02, label: 'Tube Frame Width Mask (2=full)',   type: 'shader' },
    'tvSizeY':          { val: 2.0,  unit: '',   min: 0.5,  max: 2.0, step: 0.02, label: 'Tube Frame Height Mask (2=full)',  type: 'shader' },
  };

  const CATEGORIES = [
    { id: 'shape_sizing',    title: 'Shape',   keys: ['--hero-tv-width','--hero-tv-height','--hero-tv-scale','--hero-tv-top','--hero-tv-left'] },
    { id: 'crt_tube_tab',    title: 'CRT Tube',keys: ['crtSideBulge','crtVertBulge','crtCornerRadius','crtEdgeBlur'] },
    { id: 'typography_tab',  title: 'Text',    keys: ['--hero-bottom-text-size','--hero-bottom-text-weight','--hero-bottom-text-spacing','--hero-bottom-text-bottom','--hero-bottom-text-side','--tagline-font-size'] },
    { id: 'slashes_tab',     title: 'Slashes', keys: ['--corner-slashes-size','--corner-slashes-weight','--corner-slashes-opacity','--corner-tl-opacity','--corner-tr-opacity','--corner-bl-opacity','--corner-br-opacity','--corner-tl-x','--corner-tl-y','--corner-tr-x','--corner-tr-y','--corner-bl-x','--corner-bl-y','--corner-br-x','--corner-br-y'] },
    { id: 'ascii_shader',    title: 'ASCII',   keys: ['videoScale','videoOffsetX','videoOffsetY','cellSize','dotScale','contrast','brightness','bloomStrength','tvness','fisheyeStrength','sideBulge','vertBulge','tvSizeX','tvSizeY'] }
  ];

  class VisualDesignerHUD {
    constructor() {
      this.state = {};
      this.loadState();
      this.createUI();
      this.applyAll();
    }

    loadState() {
      try { const s = localStorage.getItem(STORAGE_KEY); if (s) this.state = JSON.parse(s); } catch(e){}
      for (const k in DESIGNER_CONFIG) { if (this.state[k] === undefined) this.state[k] = DESIGNER_CONFIG[k].val; }
    }

    saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); } catch(e){} }

    computeCrtSvgPath() {
      const hBulgePct = this.state['crtSideBulge'] !== undefined ? this.state['crtSideBulge'] : 2.5;
      const vBulgePct = this.state['crtVertBulge'] !== undefined ? this.state['crtVertBulge'] : 3.5;
      const cornerRadiusPct = this.state['crtCornerRadius'] !== undefined ? this.state['crtCornerRadius'] : 4.0;

      const hb = Math.max(0, Math.min(0.2, hBulgePct / 100));
      const vb = Math.max(0, Math.min(0.2, vBulgePct / 100));
      const r = Math.max(0.001, Math.min(0.2, cornerRadiusPct / 100));

      const p1_x = (hb + r).toFixed(4);
      const p1_y = vb.toFixed(4);

      const p2_x = (1 - hb - r).toFixed(4);
      const p2_y = vb.toFixed(4);

      const p3_x = (1 - hb).toFixed(4);
      const p3_y = (vb + r).toFixed(4);

      const p4_x = (1 - hb).toFixed(4);
      const p4_y = (1 - vb - r).toFixed(4);

      const p5_x = (1 - hb - r).toFixed(4);
      const p5_y = (1 - vb).toFixed(4);

      const p6_x = (hb + r).toFixed(4);
      const p6_y = (1 - vb).toFixed(4);

      const p7_x = hb.toFixed(4);
      const p7_y = (1 - vb - r).toFixed(4);

      const p8_x = hb.toFixed(4);
      const p8_y = (vb + r).toFixed(4);

      const pathStr = `M ${p1_x} ${p1_y} Q 0.5000 0.0000 ${p2_x} ${p2_y} Q ${(1-hb).toFixed(4)} ${vb.toFixed(4)} ${p3_x} ${p3_y} Q 1.0000 0.5000 ${p4_x} ${p4_y} Q ${(1-hb).toFixed(4)} ${(1-vb).toFixed(4)} ${p5_x} ${p5_y} Q 0.5000 1.0000 ${p6_x} ${p6_y} Q ${hb.toFixed(4)} ${(1-vb).toFixed(4)} ${p7_x} ${p7_y} Q 0.0000 0.5000 ${p8_x} ${p8_y} Q ${hb.toFixed(4)} ${vb.toFixed(4)} ${p1_x} ${p1_y} Z`;

      return pathStr;
    }

    applyCrtShape() {
      const pathStr = this.computeCrtSvgPath();
      window.currentCrtPath = pathStr;

      const pathEl = document.getElementById('hero-shape-clip-path');
      if (pathEl) {
        pathEl.setAttribute('d', pathStr);
      }

      const maskPathEl = document.getElementById('hero-shape-mask-path');
      if (maskPathEl) {
        maskPathEl.setAttribute('d', pathStr);
      }

      const blurPx = this.state['crtEdgeBlur'] !== undefined ? this.state['crtEdgeBlur'] : 12.0;
      const w = this.state['--hero-tv-width'] || 980;
      const stdDev = Math.max(0.0001, blurPx / w).toFixed(4);
      const blurEl = document.getElementById('crt-blur-elem');
      if (blurEl) {
        blurEl.setAttribute('stdDeviation', stdDev);
      }

      const tw = document.getElementById('hero-tv-wrapper');
      if (tw) {
        tw.style.removeProperty('clip-path');
        tw.style.removeProperty('-webkit-clip-path');
        tw.style.setProperty('mask-image', 'url(#hero-shape-mask)');
        tw.style.setProperty('-webkit-mask-image', 'url(#hero-shape-mask)');
      }
    }

    applyVal(key, val) {
      const conf = DESIGNER_CONFIG[key]; if (!conf) return;
      this.state[key] = val;

      if (conf.type === 'opacity') {
        const dec = (val/100).toFixed(3);
        document.documentElement.style.setProperty(key, dec);
        this._syncSlashesOpacity();
      } else if (conf.type === 'css') {
        document.documentElement.style.setProperty(key, val + conf.unit);
        this._syncShape();
      } else if (conf.type === 'crt') {
        this.applyCrtShape();
      } else if (conf.type === 'shader') {
        if (typeof window.setHeroTvAscii === 'function') { const u={}; u[key]=val; window.setHeroTvAscii(u); }
      }
      this.saveState();
    }

    _syncSlashesOpacity() {
      const master = ((this.state['--corner-slashes-opacity'] ?? 0) / 100).toFixed(3);
      const tl = ((this.state['--corner-tl-opacity'] ?? 0) / 100).toFixed(3);
      const tr = ((this.state['--corner-tr-opacity'] ?? 0) / 100).toFixed(3);
      const bl = ((this.state['--corner-bl-opacity'] ?? 0) / 100).toFixed(3);
      const br = ((this.state['--corner-br-opacity'] ?? 0) / 100).toFixed(3);

      const elTl = document.querySelector('.ascii-corner-tl');
      const elTr = document.querySelector('.ascii-corner-tr');
      const elBl = document.querySelector('.ascii-corner-bl');
      const elBr = document.querySelector('.ascii-corner-br');

      if (elTl) elTl.style.setProperty('opacity', Math.min(master, tl));
      if (elTr) elTr.style.setProperty('opacity', Math.min(master, tr));
      if (elBl) elBl.style.setProperty('opacity', Math.min(master, bl));
      if (elBr) elBr.style.setProperty('opacity', Math.min(master, br));
    }

    _syncShape() {
      const cv = document.getElementById('hero-center-visual');
      const w = this.state['--hero-tv-width'] ?? 970;
      const h = this.state['--hero-tv-height'] ?? 360;
      const t = this.state['--hero-tv-top'] ?? 51;
      const l = this.state['--hero-tv-left'] ?? 50;
      const s = this.state['--hero-tv-scale'] ?? 1;

      document.documentElement.style.setProperty('--hero-tv-width', w + 'px');
      document.documentElement.style.setProperty('--hero-tv-height', h + 'px');
      document.documentElement.style.setProperty('--hero-tv-top', t + '%');
      document.documentElement.style.setProperty('--hero-tv-left', l + '%');
      document.documentElement.style.setProperty('--hero-tv-scale', s);

      if (cv) {
        cv.style.setProperty('width',     w+'px');
        cv.style.setProperty('height',    h+'px');
        cv.style.setProperty('top',       t+'%');
        cv.style.setProperty('left',      l+'%');
        cv.style.setProperty('transform', `translate(-50%,-50%) scale(${s})`);
      }

      this.applyCrtShape();
      this._syncSlashesOpacity();

      clearTimeout(this._refreshTimer);
      this._refreshTimer = setTimeout(() => {
        if (typeof window.refreshHeroTransition === 'function') {
          window.refreshHeroTransition();
        } else if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }
      }, 100);
    }

    applyAll() {
      const sh = {};
      for (const [k, conf] of Object.entries(DESIGNER_CONFIG)) {
        const val = this.state[k] ?? conf.val;
        if (conf.type==='opacity') document.documentElement.style.setProperty(k,(val/100).toFixed(3));
        else if (conf.type==='css') document.documentElement.style.setProperty(k,val+conf.unit);
        else if (conf.type==='shader') sh[k]=val;
      }
      this._syncShape();
      this.applyCrtShape();
      this._syncSlashesOpacity();
      if (typeof window.setHeroTvAscii==='function' && Object.keys(sh).length>0) window.setHeroTvAscii(sh);
    }

    createUI() {
      document.getElementById('vd-toggle-btn')?.remove();
      document.getElementById('vd-panel')?.remove();

      const panel = document.createElement('div');
      panel.id='vd-panel'; panel.className='vd-panel';
      panel.setAttribute('data-lenis-prevent','true');
      panel.addEventListener('wheel',e=>e.stopPropagation(),{passive:true});
      panel.addEventListener('touchmove',e=>e.stopPropagation(),{passive:true});

      const header = document.createElement('div');
      header.className='vd-header';
      header.innerHTML='<div class="vd-title"><span>HERO DESIGNER</span><span class="vd-drag-handle">⠿</span></div><button class="vd-close-btn" aria-label="Close">✕</button>';
      panel.appendChild(header);

      const tabsNav = document.createElement('div'); tabsNav.className='vd-tabs';
      CATEGORIES.forEach((cat,idx)=>{
        const btn=document.createElement('button');
        btn.className='vd-tab-btn'+(idx===0?' active':'');
        btn.dataset.tab=cat.id; btn.textContent=cat.title;
        btn.addEventListener('click',()=>{
          panel.querySelectorAll('.vd-tab-btn').forEach(b=>b.classList.remove('active'));
          panel.querySelectorAll('.vd-tab-pane').forEach(p=>p.classList.remove('active'));
          btn.classList.add('active');
          panel.querySelector('.vd-tab-pane[data-tab="'+cat.id+'"]')?.classList.add('active');
        });
        tabsNav.appendChild(btn);
      });
      panel.appendChild(tabsNav);

      const body=document.createElement('div'); body.className='vd-body'; body.setAttribute('data-lenis-prevent','true');

      CATEGORIES.forEach((cat,idx)=>{
        const pane=document.createElement('div');
        pane.className='vd-tab-pane'+(idx===0?' active':''); pane.dataset.tab=cat.id;

        if (cat.id==='shape_sizing') {
          const snap=document.createElement('div'); snap.style.marginBottom='8px';
          snap.innerHTML='<button id="vd-snap" style="width:100%;padding:7px;font-size:10px;background:#1a1a20;border:1px solid rgba(255,255,255,0.18);border-radius:4px;color:#00ff66;cursor:pointer;font-family:monospace;">Snap Height to CRT Aspect (970x360)</button>';
          snap.querySelector('#vd-snap').addEventListener('click',()=>{
            const w=this.state['--hero-tv-width']||970;
            const h=Math.round((w/(970/360))*10)/10;
            this.applyVal('--hero-tv-height',h);
            const slider = pane.querySelector('input[data-key="--hero-tv-height"]');
            if (slider) slider.value=h;
            const el = pane.querySelector('#val---hero-tv-height');
            if (el) el.textContent=h+'px';
          });
          pane.appendChild(snap);
        }

        if (cat.id==='crt_tube_tab') {
          const presetsBox = document.createElement('div');
          presetsBox.style.cssText = 'display:flex;gap:6px;margin-bottom:10px;';
          presetsBox.innerHTML = `
            <button class="vd-preset-btn" data-hb="2.5" data-vb="3.5" data-r="4.0" style="flex:1;padding:6px;font-size:9px;background:#1a1a20;border:1px solid rgba(255,255,255,0.18);border-radius:4px;color:#00ff66;cursor:pointer;font-family:monospace;">Classic CRT</button>
            <button class="vd-preset-btn" data-hb="1.5" data-vb="2.0" data-r="3.0" style="flex:1;padding:6px;font-size:9px;background:#1a1a20;border:1px solid rgba(255,255,255,0.18);border-radius:4px;color:#fff;cursor:pointer;font-family:monospace;">Subtle Tube</button>
            <button class="vd-preset-btn" data-hb="4.5" data-vb="5.5" data-r="6.0" style="flex:1;padding:6px;font-size:9px;background:#1a1a20;border:1px solid rgba(255,255,255,0.18);border-radius:4px;color:#fff;cursor:pointer;font-family:monospace;">Heavy Bulbous</button>
            <button class="vd-preset-btn" data-hb="0.0" data-vb="0.0" data-r="0.2" style="flex:1;padding:6px;font-size:9px;background:#1a1a20;border:1px solid rgba(255,255,255,0.18);border-radius:4px;color:#fff;cursor:pointer;font-family:monospace;">Flat Box</button>
          `;
          presetsBox.querySelectorAll('.vd-preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              const hb = parseFloat(btn.dataset.hb);
              const vb = parseFloat(btn.dataset.vb);
              const r = parseFloat(btn.dataset.r);
              this.applyVal('crtSideBulge', hb);
              this.applyVal('crtVertBulge', vb);
              this.applyVal('crtCornerRadius', r);

              const sHb = pane.querySelector('input[data-key="crtSideBulge"]');
              if (sHb) sHb.value = hb;
              const dHb = pane.querySelector('#val-crtSideBulge');
              if (dHb) dHb.textContent = hb + '%';

              const sVb = pane.querySelector('input[data-key="crtVertBulge"]');
              if (sVb) sVb.value = vb;
              const dVb = pane.querySelector('#val-crtVertBulge');
              if (dVb) dVb.textContent = vb + '%';

              const sR = pane.querySelector('input[data-key="crtCornerRadius"]');
              if (sR) sR.value = r;
              const dR = pane.querySelector('#val-crtCornerRadius');
              if (dR) dR.textContent = r + '%';
            });
          });
          pane.appendChild(presetsBox);
        }

        cat.keys.forEach(key=>{
          const conf=DESIGNER_CONFIG[key]; if (!conf) return;
          const curVal=this.state[key]??conf.val; const unitStr=conf.unit||'';
          const ctrl=document.createElement('div'); ctrl.className='vd-control';
          const safeId = 'val-' + key.replace(/[^a-zA-Z0-9_]/g, '_');
          ctrl.innerHTML='<div class="vd-control-header"><span class="vd-control-label">'+conf.label+'</span><span class="vd-control-value" id="'+safeId+'">'+curVal+unitStr+'</span></div><input type="range" class="vd-range-slider" data-key="'+key+'" min="'+conf.min+'" max="'+conf.max+'" step="'+conf.step+'" value="'+curVal+'">';
          const slider=ctrl.querySelector('input');
          const disp=ctrl.querySelector('.vd-control-value');
          slider.addEventListener('input',e=>{ const n=parseFloat(e.target.value); disp.textContent=n+unitStr; this.applyVal(key,n); });
          pane.appendChild(ctrl);
        });
        body.appendChild(pane);
      });
      panel.appendChild(body);

      const footer=document.createElement('div'); footer.className='vd-footer';
      footer.innerHTML='<button class="vd-btn vd-btn-reset" id="vd-btn-reset">Reset All</button><button class="vd-btn vd-btn-copy" id="vd-btn-copy">Copy Tokens</button>';
      panel.appendChild(footer);
      document.body.appendChild(panel);

      header.querySelector('.vd-close-btn').addEventListener('click',()=>panel.classList.remove('active'));
      window.addEventListener('keydown',e=>{ if ((e.key==='d'||e.key==='D') && e.target.tagName!=='INPUT' && e.target.tagName!=='TEXTAREA') panel.classList.toggle('active'); });

      footer.querySelector('#vd-btn-reset').addEventListener('click',()=>{
        if (!confirm('Reset all to defaults?')) return;
        localStorage.removeItem(STORAGE_KEY);
        for (const k in DESIGNER_CONFIG) this.state[k]=DESIGNER_CONFIG[k].val;
        this.applyAll();
        panel.querySelectorAll('input[type="range"]').forEach(s=>{
          const k=s.dataset.key;
          if (!DESIGNER_CONFIG[k]) return;
          s.value=DESIGNER_CONFIG[k].val;
          const safeId = '#val-' + k.replace(/[^a-zA-Z0-9_]/g, '_');
          const el = panel.querySelector(safeId);
          if (el) el.textContent = DESIGNER_CONFIG[k].val + (DESIGNER_CONFIG[k].unit || '');
        });
      });

      footer.querySelector('#vd-btn-copy').addEventListener('click',()=>{
        const pathStr = this.computeCrtSvgPath();

        let js='window.heroTvAsciiConfig = {\n';
        CATEGORIES.find(c=>c.id==='ascii_shader')?.keys.forEach(k=>{ js+='  '+k+': '+(this.state[k]??DESIGNER_CONFIG[k].val)+',\n'; });
        js+='};\n\n';

        let css='/* CSS Tokens */\n:root {\n';
        css+='  /* CRT TV Barrel Clip-Path */\n';
        css+='  --hero-tv-clip-path: url(#hero-shape-clip);\n';
        css+='  /* CRT SVG Path: '+pathStr+' */\n\n';
        for (const cat of CATEGORIES) {
          if (cat.id==='ascii_shader') continue;
          css+='  /* '+cat.title+' */\n';
          cat.keys.forEach(k=>{ const conf=DESIGNER_CONFIG[k]; const val=this.state[k]??conf.val;
            css+=conf.type==='opacity' ? '  '+k+': '+(val/100).toFixed(3)+'; /* '+val+'% */\n' : '  '+k+': '+val+conf.unit+';\n'; });
          css+='  \n';
        }
        css+='}\n';
        navigator.clipboard.writeText(js+css).then(()=>{ const b=footer.querySelector('#vd-btn-copy'); const o=b.textContent; b.textContent='COPIED!'; b.style.background='#00ff66'; b.style.color='#000'; setTimeout(()=>{b.textContent=o;b.style.background='';b.style.color='';},1800); }).catch(()=>prompt('Copy:',js+css));
      });

      this.makeDraggable(panel,header);
    }

    makeDraggable(el,handle) {
      let px=0,py=0,mx=0,my=0;
      handle.onmousedown=e=>{ if(e.target.closest('.vd-close-btn')) return; e.preventDefault(); mx=e.clientX; my=e.clientY; el.classList.add('is-dragging');
        document.onmouseup=()=>{ document.onmouseup=document.onmousemove=null; el.classList.remove('is-dragging'); };
        document.onmousemove=e=>{ e.preventDefault(); px=mx-e.clientX; py=my-e.clientY; mx=e.clientX; my=e.clientY; el.style.top=Math.max(10,el.offsetTop-py)+'px'; el.style.left=Math.max(10,el.offsetLeft-px)+'px'; el.style.right='auto'; };
      };
    }
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{window.npVisualDesigner=new VisualDesignerHUD();});
  else window.npVisualDesigner=new VisualDesignerHUD();
})();
