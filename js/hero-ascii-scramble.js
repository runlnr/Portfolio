/**
 * Hero ASCII Text Scramble & Mirroring 'E' Engine
 * High-performance ASCII decode on site open & subtle kinetic mirror flipping of 'e' characters at random intervals.
 */

class HeroAsciiScramble {
  constructor(element, options = {}) {
    this.el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.el) return;

    this.options = Object.assign({
      chars: '!<>-_\\/[]{}—=+*^?#%&$@~0123456789XYZ:;•',
      stagger: 14,        // Milliseconds stagger between character starts
      charDuration: 380,  // Milliseconds each character spends shuffling
      fps: 32,            // Character shuffle update frequency (ticks/sec)
      triggerOnHover: false // Disabled hover scramble per user request
    }, options);

    // Capture clean target text
    const existingRaw = (this.el.getAttribute('data-original-text') || this.el.textContent || '').trim().replace(/\s+/g, ' ');
    this.originalText = existingRaw || 'N/P® is an independent graphic design practice based in Ho Chi Minh City, Vietnam.';
    this.el.setAttribute('data-original-text', this.originalText);

    this.rafId = null;
    this.flipTimer = null;
    this.isRunning = false;
    this.lastTick = 0;
    this.tickInterval = 1000 / this.options.fps;

    this.init();
  }

  init() {
    // Initial render with 'e' spans and start the random mirroring flip
    this.el.innerHTML = this.renderTextWithFlipE(this.originalText);
    this.startRandomEFlip();
  }

  renderTextWithFlipE(text) {
    return text.replace(/[eE]/g, (match) => `<span class="hero-flip-e">${match}</span>`);
  }

  getRandomChar() {
    const chars = this.options.chars;
    return chars[Math.floor(Math.random() * chars.length)];
  }

  startRandomEFlip() {
    this.stopRandomEFlip();

    const flipLoop = () => {
      if (!this.el || !document.body.contains(this.el) || this.isRunning) {
        return;
      }

      const eNodes = this.el.querySelectorAll('.hero-flip-e');
      if (eNodes.length > 0) {
        const mode = Math.random();
        if (mode < 0.60) {
          // Flip a single random 'e'
          const randIdx = Math.floor(Math.random() * eNodes.length);
          eNodes[randIdx].classList.toggle('flipped');
        } else if (mode < 0.85) {
          // Ripple cascade flip across all 'e' characters
          eNodes.forEach((node, i) => {
            setTimeout(() => {
              if (document.body.contains(node)) {
                node.classList.toggle('flipped');
              }
            }, i * 85);
          });
        } else {
          // Synchronous toggle of all 'e's
          const anyFlipped = Array.from(eNodes).some(n => n.classList.contains('flipped'));
          eNodes.forEach(n => {
            if (anyFlipped) {
              n.classList.remove('flipped');
            } else {
              n.classList.add('flipped');
            }
          });
        }
      }

      // Next random interval between 2.4s and 5.8s
      const nextDelay = 2400 + Math.random() * 3400;
      this.flipTimer = setTimeout(flipLoop, nextDelay);
    };

    // First flip after 2.2 seconds
    this.flipTimer = setTimeout(flipLoop, 2200);
  }

  stopRandomEFlip() {
    if (this.flipTimer) {
      clearTimeout(this.flipTimer);
      this.flipTimer = null;
    }
  }

  play(customOptions = {}) {
    if (!this.el) return Promise.resolve();

    this.stopRandomEFlip();

    // Respect user prefers-reduced-motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.el.innerHTML = this.renderTextWithFlipE(this.originalText);
      this.startRandomEFlip();
      return Promise.resolve();
    }

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    const opts = Object.assign({}, this.options, customOptions);
    const text = this.originalText;
    const len = text.length;

    // Pre-calculate per-character timeline queue
    this.queue = [];
    for (let i = 0; i < len; i++) {
      const targetChar = text[i];
      const isSpace = targetChar === ' ';
      const start = i * opts.stagger;
      const end = start + (isSpace ? 0 : opts.charDuration);

      this.queue.push({
        from: this.getRandomChar(),
        to: targetChar,
        start,
        end,
        char: isSpace ? ' ' : this.getRandomChar(),
        isSpace
      });
    }

    this.startTime = performance.now();
    this.lastTick = 0;
    this.isRunning = true;
    this.el.style.whiteSpace = 'nowrap';

    return new Promise((resolve) => {
      const update = (now) => {
        const elapsed = now - this.startTime;
        const shouldTick = (now - this.lastTick) >= this.tickInterval;

        if (shouldTick) {
          this.lastTick = now;
        }

        let completeCount = 0;
        let outputHtml = '';

        for (let i = 0; i < len; i++) {
          const item = this.queue[i];

          if (item.isSpace) {
            outputHtml += ' ';
            completeCount++;
            continue;
          }

          if (elapsed >= item.end) {
            completeCount++;
            outputHtml += `<span class="ascii-char ascii-resolved">${item.to}</span>`;
          } else if (elapsed >= item.start) {
            if (shouldTick) {
              item.char = this.getRandomChar();
            }
            outputHtml += `<span class="ascii-char ascii-glyph">${item.char}</span>`;
          } else {
            if (shouldTick && Math.random() < 0.25) {
              item.char = this.getRandomChar();
            }
            outputHtml += `<span class="ascii-char ascii-glyph ascii-pending">${item.char}</span>`;
          }
        }

        this.el.innerHTML = outputHtml;
        this.el.style.whiteSpace = 'nowrap';

        if (completeCount === len) {
          this.isRunning = false;
          this.el.innerHTML = this.renderTextWithFlipE(this.originalText);
          this.el.style.whiteSpace = 'nowrap';
          this.startRandomEFlip();
          this.rafId = null;
          resolve();
        } else {
          this.rafId = requestAnimationFrame(update);
        }
      };

      this.rafId = requestAnimationFrame(update);
    });
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.stopRandomEFlip();
    this.isRunning = false;
    if (this.el) {
      this.el.innerHTML = this.renderTextWithFlipE(this.originalText);
      this.el.style.whiteSpace = 'nowrap';
    }
  }
}

/**
 * Interactive ASCII Disc Engine with Kinetic Letter Repulsion Physics
 * High-performance Canvas rendering of all 5,920 characters from DISC ASCII.svg.
 * When hovering over the disc, letters dynamically evade the cursor and spring back into position.
 */
class AsciiDiscRepulsionEngine {
  constructor(canvasId = 'disc-ascii-canvas') {
    this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.container = this.canvas.closest('.hero-center-visual') || this.canvas.parentElement;
    this.wrapper = this.container ? (this.container.querySelector('#center-disc-wrapper') || this.container) : this.canvas;

    this.width = 1248;
    this.height = 1248;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.count = 0;
    this.ox = null;
    this.oy = null;
    this.x = null;
    this.y = null;
    this.vx = null;
    this.vy = null;
    this.fills = null;
    this.chars = null;

    this.mouseX = -9999;
    this.mouseY = -9999;
    this.isHovered = false;
    this.repulsionRadius = 320;
    this.repulsionForce = 26;
    this.spring = 0.088;
    this.damping = 0.82;

    this.rafId = null;
    this.isDirty = true;

    this.init();
  }

  async init() {
    try {
      const resp = await fetch('assets/disc-ascii-particles.json');
      if (!resp.ok) throw new Error('Status ' + resp.status);
      const data = await resp.json();
      this.loadParticles(data);
    } catch (err) {
      console.warn('Loading fallback from DISC ASCII.svg:', err);
      await this.loadFromSvg();
    }

    this.bindEvents();
    this.startLoop();
  }

  async loadFromSvg() {
    try {
      const resp = await fetch('assets/DISC ASCII.svg');
      const text = await resp.text();
      const regex = /<text\s+x="([^"]+)"\s+y="([^"]+)"\s+fill="([^"]+)">([^<]+)<\/text>/g;
      let match;
      const data = [];
      while ((match = regex.exec(text)) !== null) {
        data.push({
          x: parseFloat(match[1]),
          y: parseFloat(match[2]),
          fill: match[3],
          char: match[4]
        });
      }
      this.loadParticles(data);
    } catch (e) {
      console.error('Failed to load SVG fallback', e);
    }
  }

  loadParticles(data) {
    this.count = data.length;
    this.ox = new Float32Array(this.count);
    this.oy = new Float32Array(this.count);
    this.x = new Float32Array(this.count);
    this.y = new Float32Array(this.count);
    this.vx = new Float32Array(this.count);
    this.vy = new Float32Array(this.count);
    this.fills = new Array(this.count);
    this.chars = new Array(this.count);

    for (let i = 0; i < this.count; i++) {
      const p = data[i];
      this.ox[i] = p.x;
      this.oy[i] = p.y;
      this.x[i] = p.x;
      this.y[i] = p.y;
      this.vx[i] = 0;
      this.vy[i] = 0;
      this.fills[i] = p.fill;
      this.chars[i] = p.char;
    }

    this.isDirty = true;
    this.render();
  }

  bindEvents() {
    const handleMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      const scaleY = this.height / rect.height;
      this.mouseX = (e.clientX - rect.left) * scaleX;
      this.mouseY = (e.clientY - rect.top) * scaleY;
      this.isHovered = true;
      this.isDirty = true;
    };

    if (this.container) {
      this.container.addEventListener('mouseenter', handleMove);
      this.container.addEventListener('mousemove', handleMove);
      this.container.addEventListener('mouseleave', () => {
        this.mouseX = -9999;
        this.mouseY = -9999;
        this.isHovered = false;
        this.isDirty = true;
      });
    }

    this.canvas.addEventListener('mousemove', handleMove);

    // Touch support for mobile devices
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.width / rect.width;
        const scaleY = this.height / rect.height;
        this.mouseX = (touch.clientX - rect.left) * scaleX;
        this.mouseY = (touch.clientY - rect.top) * scaleY;
        this.isHovered = true;
        this.isDirty = true;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.mouseX = -9999;
      this.mouseY = -9999;
      this.isHovered = false;
      this.isDirty = true;
    });

    // Wait for custom fonts to ensure sharp letterforms
    if (document.fonts) {
      document.fonts.ready.then(() => {
        this.isDirty = true;
        this.render();
      });
    }
  }

  updatePhysics() {
    if (!this.count) return false;

    // Read dynamic CSS variables if customized via Visual Designer
    const customRadius = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--disc-repulsion-radius'));
    if (!isNaN(customRadius) && customRadius > 0) {
      this.repulsionRadius = customRadius;
    }
    const customForce = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--disc-repulsion-force'));
    if (!isNaN(customForce) && customForce > 0) {
      this.repulsionForce = customForce;
    }

    let hasMotion = false;
    const count = this.count;
    const mx = this.mouseX;
    const my = this.mouseY;
    const radius = this.repulsionRadius;
    const rSq = radius * radius;
    const repForce = this.repulsionForce;
    const spring = this.spring;
    const damping = this.damping;

    const ox = this.ox;
    const oy = this.oy;
    const x = this.x;
    const y = this.y;
    const vx = this.vx;
    const vy = this.vy;

    for (let i = 0; i < count; i++) {
      let px = x[i];
      let py = y[i];
      let pvx = vx[i];
      let pvy = vy[i];

      // 1. Repulsion Physics: Letters flee away from cursor position
      const dx = px - mx;
      const dy = py - my;
      const distSq = dx * dx + dy * dy;

      if (distSq < rSq && distSq > 0.001) {
        const dist = Math.sqrt(distSq);
        const factor = 1 - dist / radius;
        const force = factor * factor * repForce;
        pvx += (dx / dist) * force;
        pvy += (dy / dist) * force;
        hasMotion = true;
      }

      // 2. Elastic Spring Force: Returns smoothly to origin anchor
      pvx += (ox[i] - px) * spring;
      pvy += (oy[i] - py) * spring;

      // 3. Friction damping
      pvx *= damping;
      pvy *= damping;

      px += pvx;
      py += pvy;

      // Liveness check for idle optimization
      if (Math.abs(pvx) > 0.05 || Math.abs(pvy) > 0.05 || Math.abs(px - ox[i]) > 0.08 || Math.abs(py - oy[i]) > 0.08) {
        hasMotion = true;
      }

      x[i] = px;
      y[i] = py;
      vx[i] = pvx;
      vy[i] = pvy;
    }

    return hasMotion;
  }

  render() {
    if (!this.count) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.font = "16px 'Share Tech Mono', 'Martian Mono', monospace";
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'start';

    const count = this.count;
    const x = this.x;
    const y = this.y;
    const chars = this.chars;
    const fills = this.fills;

    for (let i = 0; i < count; i++) {
      ctx.fillStyle = fills[i];
      ctx.fillText(chars[i], x[i], y[i]);
    }
  }

  startLoop() {
    const loop = () => {
      const hasMotion = this.updatePhysics();
      if (hasMotion || this.isDirty) {
        this.render();
        this.isDirty = hasMotion;
      }
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }
}

// Global factory helper & instance holder
window.HeroAsciiScramble = HeroAsciiScramble;
window.AsciiDiscRepulsionEngine = AsciiDiscRepulsionEngine;

window.initHeroAsciiScramble = function() {
  const el = document.querySelector('.hero-bottom-statement, .hero-statement-text');
  if (el) {
    if (window.heroAsciiScrambleInstance) {
      window.heroAsciiScrambleInstance.stop();
    }
    window.heroAsciiScrambleInstance = new HeroAsciiScramble(el);
  }

  const canvas = document.querySelector('#disc-ascii-canvas');
  if (canvas) {
    window.asciiDiscInstance = new AsciiDiscRepulsionEngine(canvas);
  }

  return window.heroAsciiScrambleInstance;
};

// Initialize as soon as DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const instance = window.initHeroAsciiScramble();
  
  // If intro was already seen / skipped, trigger right away
  const hasSeenIntro = sessionStorage.getItem('np_has_seen_intro');
  if (hasSeenIntro && instance) {
    setTimeout(() => {
      instance.play();
    }, 180);
  }
});
