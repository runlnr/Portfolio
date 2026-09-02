/**
 * Visual Designer & Hero ASCII Studio HUD
 * Full interactive real-time control HUD for:
 * 1. Shape Sizing & Position (Width, Height, Scale, Top, Left)
 * 2. Slant & Polygon geometry (Master slant angle in degrees, step height %, step position %, 4 individual zone deltas)
 * 3. ASCII Shader parameters (cellSize, dotScale, videoScale, videoOffsetX, videoOffsetY, contrast, brightness, bloom, tvness, fisheye, sideBulge, vertBulge, tvSizeX/Y)
 * 4. 4 Corner Slashes: Size, Weight, Opacity, Per-Corner X/Y Position
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'np_hero_designer_state_v6';

  const DESIGNER_CONFIG = {
    // ── TAB 1: SHAPE ─────────────────────────────────────────────────────────
    '--hero-tv-width':  { val: 910,  unit: 'px', min: 200,  max: 1600, step: 5,    label: 'Shape Width',               type: 'css' },
    '--hero-tv-height': { val: 310,  unit: 'px', min: 50,   max: 700,  step: 2,    label: 'Shape Height',              type: 'css' },
    '--hero-tv-scale':  { val: 1.0,  unit: '',   min: 0.4,  max: 2.5,  step: 0.02, label: 'Overall Scale',             type: 'css' },
    '--hero-tv-top':    { val: 50.0, unit: '%',  min: 10,   max: 90,   step: 0.5,  label: 'Vertical Position (Y %)',   type: 'css' },
    '--hero-tv-left':   { val: 50.0, unit: '%',  min: 10,   max: 90,   step: 0.5,  label: 'Horizontal Position (X %)', type: 'css' },

    // ── TAB 2: SLANT & POLYGON GEOMETRY ─────────────────────────────────────
    'slantAngle':       { val: 74.65, unit: '°',  min: 25,   max: 89.5, step: 0.25, label: 'Master Slant Angle (from horiz)', type: 'polygon' },
    'stepHeightPct':    { val: 17.0,  unit: '%',  min: 5,    max: 45,   step: 0.1,  label: 'Step Cut Height (% H)',           type: 'polygon' },
    'topStepXPct':      { val: 42.42, unit: '%',  min: 15,   max: 85,   step: 0.1,  label: 'Top Step Cut Pos (% W)',          type: 'polygon' },
    'botStepXPct':      { val: 57.58, unit: '%',  min: 15,   max: 85,   step: 0.1,  label: 'Bottom Step Cut Pos (% W)',       type: 'polygon' },
    'slant_tl_step':    { val: 0.0,   unit: '°',  min: -30,  max: 30,   step: 0.5,  label: 'Top-Left Step Slant Δ',           type: 'polygon' },
    'slant_tr_corner':  { val: 0.0,   unit: '°',  min: -30,  max: 30,   step: 0.5,  label: 'Top-Right Corner Slant Δ',        type: 'polygon' },
    'slant_br_step':    { val: 0.0,   unit: '°',  min: -30,  max: 30,   step: 0.5,  label: 'Bottom-Right Step Slant Δ',       type: 'polygon' },
    'slant_bl_corner':  { val: 0.0,   unit: '°',  min: -30,  max: 30,   step: 0.5,  label: 'Bottom-Left Corner Slant Δ',      type: 'polygon' },

    // ── TAB 3: ASCII SHADER ──────────────────────────────────────────────────
    'videoScale':       { val: 1.0,  unit: 'x',  min: 0.3,  max: 3.0,  step: 0.05, label: 'ASCII Character / Video Zoom',   type: 'shader' },
    'videoOffsetX':     { val: 0.0,  unit: '',   min: -1.0, max: 1.0,  step: 0.01, label: 'Pan Character X',                type: 'shader' },
    'videoOffsetY':     { val: 0.0,  unit: '',   min: -1.0, max: 1.0,  step: 0.01, label: 'Pan Character Y',                type: 'shader' },
    'cellSize':         { val: 10,   unit: 'px', min: 2,    max: 28,  step: 0.5,  label: 'Cell Size (Grid Density)',        type: 'shader' },
    'dotScale':         { val: 1.3,  unit: 'x',  min: 0.2,  max: 3.0, step: 0.05, label: 'Glyph Fill / Dot Scale',           type: 'shader' },
    'contrast':         { val: 0.2,  unit: 'x',  min: 0.1,  max: 3.0, step: 0.05, label: 'Video Contrast',                   type: 'shader' },
    'brightness':       { val: 0.7,  unit: '',   min: -0.5, max: 1.5, step: 0.01, label: 'Video Brightness',                 type: 'shader' },
    'bloomStrength':    { val: 0.3,  unit: 'x',  min: 0.0,  max: 3.0, step: 0.05, label: 'Glow / Bloom Strength',            type: 'shader' },
    'tvness':           { val: 0.95, unit: '',   min: 0.0,  max: 2.0, step: 0.05, label: 'CRT Scanlines & Color Mix',        type: 'shader' },
    'fisheyeStrength':  { val: 0.0,  unit: '',   min: 0.0,  max: 0.5, step: 0.01, label: 'CRT Fisheye Distortion',           type: 'shader' },
    'sideBulge':        { val: 0.0,  unit: '',   min: -0.5, max: 0.5, step: 0.01, label: 'Side Bulge (barrel/pin)',          type: 'shader' },
    'vertBulge':        { val: 0.0,  unit: '',   min: -0.5, max: 0.5, step: 0.01, label: 'Vertical Bulge',                   type: 'shader' },
    'tvSizeX':          { val: 2.0,  unit: '',   min: 0.5,  max: 2.0, step: 0.02, label: 'Tube Frame Width Mask (2=full)',   type: 'shader' },
    'tvSizeY':          { val: 2.0,  unit: '',   min: 0.5,  max: 2.0, step: 0.02, label: 'Tube Frame Height Mask (2=full)',  type: 'shader' },

    // ── TAB 4: SLASHES ───────────────────────────────────────────────────────
    '--corner-slashes-size':    { val: 43,  unit: 'px', min: 10,  max: 120,  step: 1,   label: 'Font Size (all corners)',      type: 'css' },
    '--corner-slashes-weight':  { val: 600, unit: '',   min: 100, max: 900,  step: 100, label: 'Font Weight (100-900)',         type: 'css' },
    '--corner-slashes-opacity': { val: 100, unit: '%',  min: 0,   max: 100,  step: 1,   label: 'Master Opacity',               type: 'opacity' },
    '--corner-tl-x': { val: -22, unit: 'px', min: -200, max: 200, step: 1, label: 'Top-Left Slash — X offset',  type: 'css' },
    '--corner-tl-y': { val: -6,  unit: 'px', min: -200, max: 200, step: 1, label: 'Top-Left Slash — Y offset',  type: 'css' },
    '--corner-tr-x': { val: -22, unit: 'px', min: -200, max: 200, step: 1, label: 'Top-Right Slash — X offset', type: 'css' },
    '--corner-tr-y': { val: -6,  unit: 'px', min: -200, max: 200, step: 1, label: 'Top-Right Slash — Y offset', type: 'css' },
    '--corner-bl-x': { val: -22, unit: 'px', min: -200, max: 200, step: 1, label: 'Bot-Left Slash — X offset',  type: 'css' },
    '--corner-bl-y': { val: -6,  unit: 'px', min: -200, max: 200, step: 1, label: 'Bot-Left Slash — Y offset',  type: 'css' },
    '--corner-br-x': { val: -22, unit: 'px', min: -200, max: 200, step: 1, label: 'Bot-Right Slash — X offset', type: 'css' },
    '--corner-br-y': { val: -6,  unit: 'px', min: -200, max: 200, step: 1, label: 'Bot-Right Slash — Y offset', type: 'css' },
  };

  const CATEGORIES = [
    { id: 'shape_sizing', title: 'Shape',   keys: ['--hero-tv-width','--hero-tv-height','--hero-tv-scale','--hero-tv-top','--hero-tv-left'] },
    { id: 'slant_tab',    title: 'Slant',   keys: ['slantAngle','stepHeightPct','topStepXPct','botStepXPct','slant_tl_step','slant_tr_corner','slant_br_step','slant_bl_corner'] },
    { id: 'ascii_shader', title: 'ASCII',   keys: ['videoScale','videoOffsetX','videoOffsetY','cellSize','dotScale','contrast','brightness','bloomStrength','tvness','fisheyeStrength','sideBulge','vertBulge','tvSizeX','tvSizeY'] },
    { id: 'slashes_tab',  title: 'Slashes', keys: ['--corner-slashes-size','--corner-slashes-weight','--corner-slashes-opacity','--corner-tl-x','--corner-tl-y','--corner-tr-x','--corner-tr-y','--corner-bl-x','--corner-bl-y','--corner-br-x','--corner-br-y'] }
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

    computePolygon() {
      const w = this.state['--hero-tv-width'] || 910;
      const h = this.state['--hero-tv-height'] || 310;
      const yStep = (this.state['stepHeightPct'] !== undefined ? this.state['stepHeightPct'] : 17.0) / 100;
      const topX = (this.state['topStepXPct'] !== undefined ? this.state['topStepXPct'] : 42.421) / 100;
      const botX = (this.state['botStepXPct'] !== undefined ? this.state['botStepXPct'] : 57.577) / 100;

      const masterAngle = this.state['slantAngle'] !== undefined ? this.state['slantAngle'] : 74.65;
      const tlDelta = this.state['slant_tl_step'] || 0;
      const trDelta = this.state['slant_tr_corner'] || 0;
      const brDelta = this.state['slant_br_step'] || 0;
      const blDelta = this.state['slant_bl_corner'] || 0;

      function getDx(angleDeg) {
        const clamped = Math.max(15, Math.min(89.5, angleDeg));
        const rad = (clamped * Math.PI) / 180;
        const hStepPx = h * yStep;
        const dxPx = hStepPx / Math.tan(rad);
        return dxPx / w;
      }

      const dx1 = getDx(masterAngle + tlDelta);
      const dx2 = getDx(masterAngle + trDelta);
      const dx3 = getDx(masterAngle + brDelta);
      const dx4 = getDx(masterAngle + blDelta);

      const p1_x = Math.max(0, topX - dx1 / 2);
      const p1_y = 0;

      const p2_x = Math.max(0, 1.0 - dx2);
      const p2_y = 0;

      const p3_x = 1.0;
      const p3_y = yStep;

      const p4_x = 1.0;
      const p4_y = 1.0 - yStep;

      const p5_x = Math.max(0, botX - dx3 / 2);
      const p5_y = 1.0 - yStep;

      const p6_x = Math.min(1.0, botX + dx3 / 2);
      const p6_y = 1.0;

      const p7_x = Math.min(1.0, dx4);
      const p7_y = 1.0;

      const p8_x = 0;
      const p8_y = 1.0 - yStep;

      const p9_x = 0;
      const p9_y = yStep;

      const p10_x = Math.min(1.0, topX + dx1 / 2);
      const p10_y = yStep;

      function toPct(val) {
        return (val * 100).toFixed(3) + '%';
      }

      const polyCss = `polygon(${toPct(p1_x)} ${toPct(p1_y)}, ${toPct(p2_x)} ${toPct(p2_y)}, ${toPct(p3_x)} ${toPct(p3_y)}, ${toPct(p4_x)} ${toPct(p4_y)}, ${toPct(p5_x)} ${toPct(p5_y)}, ${toPct(p6_x)} ${toPct(p6_y)}, ${toPct(p7_x)} ${toPct(p7_y)}, ${toPct(p8_x)} ${toPct(p8_y)}, ${toPct(p9_x)} ${toPct(p9_y)}, ${toPct(p10_x)} ${toPct(p10_y)})`;

      const polySvgPoints = `${p1_x.toFixed(5)} ${p1_y.toFixed(5)}, ${p2_x.toFixed(5)} ${p2_y.toFixed(5)}, ${p3_x.toFixed(5)} ${p3_y.toFixed(5)}, ${p4_x.toFixed(5)} ${p4_y.toFixed(5)}, ${p5_x.toFixed(5)} ${p5_y.toFixed(5)}, ${p6_x.toFixed(5)} ${p6_y.toFixed(5)}, ${p7_x.toFixed(5)} ${p7_y.toFixed(5)}, ${p8_x.toFixed(5)} ${p8_y.toFixed(5)}, ${p9_x.toFixed(5)} ${p9_y.toFixed(5)}, ${p10_x.toFixed(5)} ${p10_y.toFixed(5)}`;

      return { polyCss, polySvgPoints };
    }

    applyPolygon() {
      const { polyCss, polySvgPoints } = this.computePolygon();
      window.currentShapePolygon = polyCss;
      document.documentElement.style.setProperty('--hero-tv-clip-path', polyCss);

      const tw = document.getElementById('hero-tv-wrapper');
      if (tw) {
        tw.style.setProperty('clip-path', polyCss, 'important');
        tw.style.setProperty('-webkit-clip-path', polyCss, 'important');
      }

      const svgPoly = document.querySelector('#hero-shape-clip polygon');
      if (svgPoly) {
        svgPoly.setAttribute('points', polySvgPoints);
      }
    }

    applyVal(key, val) {
      const conf = DESIGNER_CONFIG[key]; if (!conf) return;
      this.state[key] = val;
      if (conf.type === 'opacity') {
        document.documentElement.style.setProperty(key, (val/100).toFixed(3));
      } else if (conf.type === 'css') {
        document.documentElement.style.setProperty(key, val + conf.unit);
        this._syncShape();
      } else if (conf.type === 'polygon') {
        this.applyPolygon();
      } else if (conf.type === 'shader') {
        if (typeof window.setHeroTvAscii === 'function') { const u={}; u[key]=val; window.setHeroTvAscii(u); }
      }
      this.saveState();
    }

    _syncShape() {
      const cv = document.getElementById('hero-center-visual');
      const tw = document.getElementById('hero-tv-wrapper');
      const w = this.state['--hero-tv-width'] ?? 910;
      const h = this.state['--hero-tv-height'] ?? 310;
      const t = this.state['--hero-tv-top'] ?? 50;
      const l = this.state['--hero-tv-left'] ?? 50;
      const s = this.state['--hero-tv-scale'] ?? 1;

      document.documentElement.style.setProperty('--hero-tv-width', w + 'px');
      document.documentElement.style.setProperty('--hero-tv-height', h + 'px');
      document.documentElement.style.setProperty('--hero-tv-top', t + '%');
      document.documentElement.style.setProperty('--hero-tv-left', l + '%');
      document.documentElement.style.setProperty('--hero-tv-scale', s);

      if (cv) {
        cv.style.setProperty('width',     w+'px',  'important');
        cv.style.setProperty('height',    h+'px',  'important');
        cv.style.setProperty('top',       t+'%',   'important');
        cv.style.setProperty('left',      l+'%',   'important');
        cv.style.setProperty('transform', `translate(-50%,-50%) scale(${s})`, 'important');
      }
      if (tw) {
        tw.style.setProperty('width',  '100%', 'important');
        tw.style.setProperty('height', '100%', 'important');
      }
      this.applyPolygon();

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
      this.applyPolygon();
      if (typeof window.setHeroTvAscii==='function' && Object.keys(sh).length>0) window.setHeroTvAscii(sh);
    }

    createUI() {
      document.getElementById('vd-toggle-btn')?.remove();
      document.getElementById('vd-panel')?.remove();

      const toggleBtn = document.createElement('button');
      toggleBtn.id='vd-toggle-btn'; toggleBtn.className='vd-toggle-btn';
      toggleBtn.setAttribute('aria-label','Toggle Visual Designer');
      toggleBtn.innerHTML='<span class="vd-toggle-dot"></span><span>DESIGNER</span>';
      document.body.appendChild(toggleBtn);

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
          snap.innerHTML='<button id="vd-snap" style="width:100%;padding:7px;font-size:10px;background:#1a1a20;border:1px solid rgba(255,255,255,0.18);border-radius:4px;color:#00ff66;cursor:pointer;font-family:monospace;">Snap Height to Aspect Ratio (910x310)</button>';
          snap.querySelector('#vd-snap').addEventListener('click',()=>{
            const w=this.state['--hero-tv-width']||910;
            const h=Math.round((w/(910/310))*10)/10;
            this.applyVal('--hero-tv-height',h);
            const slider = pane.querySelector('input[data-key="--hero-tv-height"]');
            if (slider) slider.value=h;
            const el = pane.querySelector('#val---hero-tv-height');
            if (el) el.textContent=h+'px';
          });
          pane.appendChild(snap);
        }

        if (cat.id==='slant_tab') {
          const presetsBox = document.createElement('div');
          presetsBox.style.cssText = 'display:flex;gap:6px;margin-bottom:10px;';
          presetsBox.innerHTML = `
            <button class="vd-preset-btn" data-angle="74.65" style="flex:1;padding:6px;font-size:9px;background:#1a1a20;border:1px solid rgba(255,255,255,0.18);border-radius:4px;color:#fff;cursor:pointer;font-family:monospace;">Default (74.6°)</button>
            <button class="vd-preset-btn" data-angle="60" style="flex:1;padding:6px;font-size:9px;background:#1a1a20;border:1px solid rgba(255,255,255,0.18);border-radius:4px;color:#00ff66;cursor:pointer;font-family:monospace;">60° Slashes</button>
            <button class="vd-preset-btn" data-angle="45" style="flex:1;padding:6px;font-size:9px;background:#1a1a20;border:1px solid rgba(255,255,255,0.18);border-radius:4px;color:#fff;cursor:pointer;font-family:monospace;">45° Diagonal</button>
            <button class="vd-preset-btn" data-angle="89.5" style="flex:1;padding:6px;font-size:9px;background:#1a1a20;border:1px solid rgba(255,255,255,0.18);border-radius:4px;color:#fff;cursor:pointer;font-family:monospace;">Straight 90°</button>
          `;
          presetsBox.querySelectorAll('.vd-preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              const ang = parseFloat(btn.dataset.angle);
              this.applyVal('slantAngle', ang);
              const slider = pane.querySelector('input[data-key="slantAngle"]');
              if (slider) slider.value = ang;
              const disp = pane.querySelector('#val-slantAngle');
              if (disp) disp.textContent = ang + '°';
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

      toggleBtn.addEventListener('click',()=>panel.classList.toggle('active'));
      header.querySelector('.vd-close-btn').addEventListener('click',()=>panel.classList.remove('active'));
      window.addEventListener('keydown',e=>{ if ((e.key==='d'||e.key==='D') && e.target.tagName!=='INPUT') panel.classList.toggle('active'); });

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
        const { polyCss } = this.computePolygon();

        let js='window.heroTvAsciiConfig = {\n';
        CATEGORIES.find(c=>c.id==='ascii_shader')?.keys.forEach(k=>{ js+='  '+k+': '+(this.state[k]??DESIGNER_CONFIG[k].val)+',\n'; });
        js+='};\n\n';

        let css='/* CSS Tokens */\n:root {\n';
        css+='  /* Polygon Slant Clip-Path */\n';
        css+='  --hero-tv-clip-path: '+polyCss+';\n\n';
        for (const cat of CATEGORIES) {
          if (cat.id==='ascii_shader' || cat.id==='slant_tab') continue;
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
