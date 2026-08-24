/**
 * Live Visual Designer Tool
 * Preconfigured with exact user-defined layout specs
 */

(function() {
  const EXACT_CONFIG = {
    fontSize: 13,
    lineHeight: 13.5,
    letterSpacing: -0.3,
    fontWeight: 600,
    paddingY: 10,
    paddingX: 12,
    centerMaxWidth: 900,
    centerGap: 110,
    stackGap: 0,
    centerAlign: 'left'
  };

  // Always sync with the exact settings unless customized further
  localStorage.setItem('SWAG_DESIGN_CONFIG', JSON.stringify(EXACT_CONFIG));
  let config = { ...EXACT_CONFIG };

  // Apply to Document CSS Variables
  function applyConfig() {
    const root = document.documentElement;
    root.style.setProperty('--nav-font-size', `${config.fontSize}px`);
    root.style.setProperty('--nav-line-height', `${config.lineHeight}px`);
    root.style.setProperty('--nav-letter-spacing', `${config.letterSpacing}px`);
    root.style.setProperty('--nav-font-weight', config.fontWeight);
    root.style.setProperty('--nav-padding-y', `${config.paddingY}px`);
    root.style.setProperty('--nav-padding-x', `${config.paddingX}px`);
    root.style.setProperty('--nav-center-max-width', `${config.centerMaxWidth}px`);
    root.style.setProperty('--nav-center-gap', `${config.centerGap}px`);
    root.style.setProperty('--nav-stack-gap', `${config.stackGap}px`);
    root.style.setProperty('--nav-center-align', config.centerAlign);

    const centerGroup = document.querySelector('.nav-center-group');
    if (centerGroup) {
      centerGroup.style.maxWidth = `${config.centerMaxWidth}px`;
      centerGroup.style.gap = `${config.centerGap}px`;
      centerGroup.style.textAlign = config.centerAlign;
    }
  }

  // Inject GUI into page
  function injectGUI() {
    if (document.getElementById('designer-panel')) return;

    // Toggle Button
    const btn = document.createElement('button');
    btn.id = 'designer-toggle-btn';
    btn.className = 'designer-toggle-btn';
    btn.title = 'Open Visual Designer Toolbar';
    btn.innerHTML = '<span>✦ Visual Designer</span>';
    document.body.appendChild(btn);

    // Panel
    const panel = document.createElement('div');
    panel.id = 'designer-panel';
    panel.className = 'designer-panel';
    panel.innerHTML = `
      <div class="designer-header">
        <span>Visual Designer GUI</span>
        <button id="designer-close-btn" style="background:none; border:none; color:#aaa; font-size:14px; cursor:pointer;">✕</button>
      </div>

      <!-- Typography Section -->
      <div class="designer-section-title">Typography (Inter Display)</div>

      <div class="designer-control-row">
        <div class="designer-control-label">
          <span>Font Size</span>
          <span id="gui-val-fontsize">${config.fontSize}px</span>
        </div>
        <input type="range" id="gui-slide-fontsize" class="designer-slider" min="9" max="24" step="0.5" value="${config.fontSize}">
      </div>

      <div class="designer-control-row">
        <div class="designer-control-label">
          <span>Line Height</span>
          <span id="gui-val-lineheight">${config.lineHeight}px</span>
        </div>
        <input type="range" id="gui-slide-lineheight" class="designer-slider" min="9" max="28" step="0.5" value="${config.lineHeight}">
      </div>

      <div class="designer-control-row">
        <div class="designer-control-label">
          <span>Letter Spacing</span>
          <span id="gui-val-letterspace">${config.letterSpacing}px</span>
        </div>
        <input type="range" id="gui-slide-letterspace" class="designer-slider" min="-2.0" max="3.0" step="0.1" value="${config.letterSpacing}">
      </div>

      <div class="designer-control-row">
        <div class="designer-control-label">
          <span>Font Weight</span>
          <span id="gui-val-weight">${config.fontWeight}</span>
        </div>
        <input type="range" id="gui-slide-weight" class="designer-slider" min="400" max="800" step="100" value="${config.fontWeight}">
      </div>

      <!-- Nav Spacing & Layout Section -->
      <div class="designer-section-title">Header Spacing &amp; Layout</div>

      <div class="designer-control-row">
        <div class="designer-control-label">
          <span>Nav Padding Y (Top/Bottom)</span>
          <span id="gui-val-paddingy">${config.paddingY}px</span>
        </div>
        <input type="range" id="gui-slide-paddingy" class="designer-slider" min="0" max="50" step="1" value="${config.paddingY}">
      </div>

      <div class="designer-control-row">
        <div class="designer-control-label">
          <span>Nav Padding X (Sides)</span>
          <span id="gui-val-paddingx">${config.paddingX}px</span>
        </div>
        <input type="range" id="gui-slide-paddingx" class="designer-slider" min="0" max="70" step="1" value="${config.paddingX}">
      </div>

      <div class="designer-control-row">
        <div class="designer-control-label">
          <span>Center Group Width</span>
          <span id="gui-val-maxwidth">${config.centerMaxWidth}px</span>
        </div>
        <input type="range" id="gui-slide-maxwidth" class="designer-slider" min="400" max="1400" step="20" value="${config.centerMaxWidth}">
      </div>

      <div class="designer-control-row">
        <div class="designer-control-label">
          <span>Center Column Gap</span>
          <span id="gui-val-gap">${config.centerGap}px</span>
        </div>
        <input type="range" id="gui-slide-gap" class="designer-slider" min="0" max="160" step="2" value="${config.centerGap}">
      </div>

      <div class="designer-control-row">
        <div class="designer-control-label">
          <span>Stack Row Gap (Lines)</span>
          <span id="gui-val-stackgap">${config.stackGap}px</span>
        </div>
        <input type="range" id="gui-slide-stackgap" class="designer-slider" min="0" max="16" step="1" value="${config.stackGap}">
      </div>

      <div class="designer-section-title">Center Text Alignment</div>
      <div class="designer-btn-group" style="margin-top:0;">
        <button id="gui-align-left" class="designer-btn ${config.centerAlign === 'left' ? 'primary' : ''}">Left</button>
        <button id="gui-align-center" class="designer-btn ${config.centerAlign === 'center' ? 'primary' : ''}">Center</button>
        <button id="gui-align-right" class="designer-btn ${config.centerAlign === 'right' ? 'primary' : ''}">Right</button>
      </div>

      <!-- Actions -->
      <div class="designer-btn-group">
        <button id="gui-btn-save" class="designer-btn primary">Save Look</button>
        <button id="gui-btn-reset" class="designer-btn">Reset</button>
      </div>
    `;
    document.body.appendChild(panel);

    // Event Bindings
    btn.addEventListener('click', () => panel.classList.toggle('active'));
    document.getElementById('designer-close-btn').addEventListener('click', () => panel.classList.remove('active'));

    const bind = (sliderId, labelId, key, suffix = '') => {
      const slider = document.getElementById(sliderId);
      const label = document.getElementById(labelId);
      if (slider && label) {
        slider.addEventListener('input', (e) => {
          config[key] = parseFloat(e.target.value);
          label.textContent = `${config[key]}${suffix}`;
          applyConfig();
          localStorage.setItem('SWAG_DESIGN_CONFIG', JSON.stringify(config));
        });
      }
    };

    bind('gui-slide-fontsize', 'gui-val-fontsize', 'fontSize', 'px');
    bind('gui-slide-lineheight', 'gui-val-lineheight', 'lineHeight', 'px');
    bind('gui-slide-letterspace', 'gui-val-letterspace', 'letterSpacing', 'px');
    bind('gui-slide-weight', 'gui-val-weight', 'fontWeight', '');
    bind('gui-slide-paddingy', 'gui-val-paddingy', 'paddingY', 'px');
    bind('gui-slide-paddingx', 'gui-val-paddingx', 'paddingX', 'px');
    bind('gui-slide-maxwidth', 'gui-val-maxwidth', 'centerMaxWidth', 'px');
    bind('gui-slide-gap', 'gui-val-gap', 'centerGap', 'px');
    bind('gui-slide-stackgap', 'gui-val-stackgap', 'stackGap', 'px');

    const setAlign = (align) => {
      config.centerAlign = align;
      ['left', 'center', 'right'].forEach(a => {
        const b = document.getElementById(`gui-align-${a}`);
        if (b) b.className = `designer-btn ${a === align ? 'primary' : ''}`;
      });
      applyConfig();
      localStorage.setItem('SWAG_DESIGN_CONFIG', JSON.stringify(config));
    };

    document.getElementById('gui-align-left').addEventListener('click', () => setAlign('left'));
    document.getElementById('gui-align-center').addEventListener('click', () => setAlign('center'));
    document.getElementById('gui-align-right').addEventListener('click', () => setAlign('right'));

    const saveBtn = document.getElementById('gui-btn-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        localStorage.setItem('SWAG_DESIGN_CONFIG', JSON.stringify(config));
        saveBtn.textContent = 'Saved! ✓';
        setTimeout(() => saveBtn.textContent = 'Save Look', 2000);
      });
    }

    const resetBtn = document.getElementById('gui-btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        localStorage.removeItem('SWAG_DESIGN_CONFIG');
        config = { ...EXACT_CONFIG };
        applyConfig();
        location.reload();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyConfig();
    injectGUI();
  });
})();
