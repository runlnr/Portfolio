/**
 * N/P® Hero Lava ASCII Spark Particle Engine
 * Authentic ASCII characters (*, +, #, @, ^, x, °, v, ·, .) as molten lava sparks
 * erupting from within the ASCII TV lava pool, arcing upward into the air above,
 * and falling back down into the molten sea.
 */

(() => {
  'use strict';

  // ─── Configuration ──────────────────────────────────────────────────────────
  const CONFIG = {
    // Ambient spawn rate: sparks per second (tuned for ambient, deliberate eruptions)
    emitRate: 2.8,

    // Physics
    minVY: -260,       // Upward launch velocity (negative Y = up)
    maxVY: -470,       // Max height into the space above the TV
    spreadVX: 80,      // Horizontal drift (px/s)
    gravity: 540,      // Downward acceleration (px/s²)
    drag: 0.012,       // Air resistance
    wobbleFreq: 7,     // Shimmer frequency
    wobbleAmp: 16,     // Shimmer amplitude

    // Typography & Limits
    fontFamily: '"Sometype Mono", "Share Tech Mono", Consolas, Menlo, monospace',
    maxScrollProgress: 0.15, // Gracefully pauses as user scrolls away
  };

  // ASCII Glyph Archetypes
  const SPARK_ARCHETYPES = [
    // 1. Stellar Spark: twinkling stars, crosses & apex orbs
    {
      type: 'stellar',
      weight: 0.45,
      risingGlyphs: ['*', '+', 'x', '^', '*'],
      apexGlyphs: ['*', '°', '+', 'o', '¤'],
      fallingGlyphs: ['v', '·', '.', '`'],
      fontSize: 15,
      trailChar: '·',
      lifeMult: 1.05,
    },
    // 2. Magma Fragment: heavy molten ASCII symbols
    {
      type: 'magma',
      weight: 0.30,
      risingGlyphs: ['#', '@', '%', '&', '8', '$'],
      apexGlyphs: ['#', '%', '0', '&', 'O'],
      fallingGlyphs: [':', ';', '.', '·'],
      fontSize: 17,
      trailChar: ':',
      lifeMult: 0.95,
    },
    // 3. Fleck / Ember: sharp darting sparks
    {
      type: 'fleck',
      weight: 0.25,
      risingGlyphs: ['^', '!', '/', '\\', '|'],
      apexGlyphs: ['^', '~', '-', '°'],
      fallingGlyphs: ['v', ',', '.', '·'],
      fontSize: 13,
      trailChar: '.',
      lifeMult: 1.15,
    }
  ];

  let sparks = [];
  let bubbles = [];
  let splashes = [];
  let lastTime = null;
  let animId = null;
  let emitAccum = 0;
  let bubbleTimer = 0;

  let canvas = null;
  let ctx = null;
  let tvWrapper = null;

  // Pick a random archetype based on weights
  function pickArchetype() {
    const r = Math.random();
    let sum = 0;
    for (let i = 0; i < SPARK_ARCHETYPES.length; i++) {
      sum += SPARK_ARCHETYPES[i].weight;
      if (r <= sum) return SPARK_ARCHETYPES[i];
    }
    return SPARK_ARCHETYPES[0];
  }

  // Calculate the surface Y (top rim of the ASCII TV) in CSS pixels
  function getSurfaceY() {
    if (!canvas || !tvWrapper) return 304;
    const tvH = tvWrapper.offsetHeight || 156;
    const cssH = canvas.offsetHeight || 460;
    return cssH - tvH;
  }

  // ─── Spark Factory ──────────────────────────────────────────────────────────
  function createSpark(customX = null, burstPower = 1.0) {
    const surfaceY = getSurfaceY();
    const cssW = canvas.offsetWidth || (tvWrapper.offsetWidth + 100);

    // Keep spawn bounds inside the TV width (leaving 50px margins for the canvas offset)
    const minX = 65;
    const maxX = cssW - 65;
    const x = customX !== null ? Math.max(minX, Math.min(maxX, customX)) : minX + Math.random() * (maxX - minX);

    // Erupt from slightly inside the molten pool surface (0–16px beneath the top edge)
    const y = surfaceY + Math.random() * 16;

    const archetype = pickArchetype();

    // Launch velocity
    const vx = (Math.random() - 0.5) * 2 * CONFIG.spreadVX * burstPower;
    const vy = (CONFIG.minVY + Math.random() * (CONFIG.maxVY - CONFIG.minVY)) * burstPower;

    // Flight duration to reach apex and fall back to surface:
    const tApex = Math.abs(vy) / CONFIG.gravity;
    const maxFlightTime = (tApex * 2.15) * archetype.lifeMult;

    return {
      x,
      y,
      originY: surfaceY,
      vx,
      vy,
      wobbleOffset: Math.random() * Math.PI * 2,
      maxLife: maxFlightTime,
      age: 0,
      archetype,
      glyphIndex: Math.floor(Math.random() * 5),
      flickerTimer: 0,
      char: archetype.risingGlyphs[0],
      trail: [],
    };
  }

  // ─── Surface Bubble Factory ────────────────────────────────────────────────
  // Bubbles swell on the top rim of the lava, expand in ASCII, and POP into sparks
  function createBubble() {
    const surfaceY = getSurfaceY();
    const cssW = canvas.offsetWidth || (tvWrapper.offsetWidth + 100);
    const x = 75 + Math.random() * (cssW - 150);

    return {
      x,
      y: surfaceY + 2,
      age: 0,
      duration: 0.38 + Math.random() * 0.22,
      stages: ['.', 'o', 'O', '*'],
      hasPopped: false,
    };
  }

  // ─── Splash on Return ──────────────────────────────────────────────────────
  // When an ASCII spark plunges back into the lava pool, it triggers a brief ripple
  function createSplash(x, surfaceY) {
    splashes.push({
      x,
      y: surfaceY + 2,
      age: 0,
      duration: 0.18,
      char: Math.random() > 0.5 ? '~' : '*',
      color: '#ff9d00',
    });
  }

  // ─── Color & Palette ───────────────────────────────────────────────────────
  // Temperature 1.0 (white hot) -> 0.0 (dark red ember)
  function getSparkStyle(temp, alpha) {
    if (temp > 0.70) {
      return {
        fill: `rgba(255, 255, 240, ${alpha})`,
        glow: `rgba(255, 235, 120, ${alpha * 0.9})`,
        blur: 8,
      };
    } else if (temp > 0.40) {
      return {
        fill: `rgba(255, 195, 30, ${alpha})`,
        glow: `rgba(255, 135, 0, ${alpha * 0.75})`,
        blur: 6,
      };
    } else if (temp > 0.18) {
      return {
        fill: `rgba(255, 75, 15, ${alpha})`,
        glow: `rgba(220, 40, 0, ${alpha * 0.55})`,
        blur: 4,
      };
    } else {
      return {
        fill: `rgba(180, 30, 5, ${alpha * 0.85})`,
        glow: `transparent`,
        blur: 0,
      };
    }
  }

  // ─── Resize Canvas ─────────────────────────────────────────────────────────
  function resizeCanvas() {
    if (!canvas || !tvWrapper) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.offsetWidth || (tvWrapper.offsetWidth + 100);
    const cssH = canvas.offsetHeight || 460;

    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);

    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
  }

  // ─── Render Loop ───────────────────────────────────────────────────────────
  function tick(now) {
    animId = requestAnimationFrame(tick);

    if (!lastTime) { lastTime = now; return; }
    const dt = Math.min((now - lastTime) / 1000, 0.05); // cap frame step
    lastTime = now;

    const surfaceY = getSurfaceY();
    const scrollProg = window.heroScrollProgress || 0;
    const isHeroVisible = scrollProg < CONFIG.maxScrollProgress;

    // 1. Clear canvas
    const cssW = canvas.offsetWidth;
    const cssH = canvas.offsetHeight;
    ctx.clearRect(0, 0, cssW, cssH);

    // 2. Ambient Spark Emitter
    if (isHeroVisible) {
      emitAccum += CONFIG.emitRate * dt;
      while (emitAccum >= 1) {
        sparks.push(createSpark());
        emitAccum -= 1;
      }

      // Ambient Surface Bubbles (occasional natural lava pops)
      bubbleTimer += dt;
      if (bubbleTimer > 2.2) {
        bubbleTimer = 0;
        bubbles.push(createBubble());
      }
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 3. Render & Update Lava Surface Bubbles
    bubbles = bubbles.filter(b => {
      b.age += dt;
      const progress = b.age / b.duration;
      if (progress >= 1.0) {
        // Pop! Eject a crisp spark
        if (!b.hasPopped && isHeroVisible) {
          sparks.push(createSpark(b.x, 0.82));
          b.hasPopped = true;
        }
        return false;
      }

      const stageIndex = Math.min(Math.floor(progress * b.stages.length), b.stages.length - 1);
      const glyph = b.stages[stageIndex];

      ctx.save();
      ctx.font = `700 15px ${CONFIG.fontFamily}`;
      ctx.fillStyle = progress > 0.65 ? '#fffad0' : '#ffa500';
      ctx.shadowColor = '#ff6600';
      ctx.shadowBlur = 7;
      ctx.fillText(glyph, b.x, b.y);
      ctx.restore();

      return true;
    });

    // 4. Render & Update Splashes (when sparks fall back down into pool)
    splashes = splashes.filter(sp => {
      sp.age += dt;
      const t = sp.age / sp.duration;
      if (t >= 1.0) return false;

      ctx.save();
      ctx.font = `700 14px ${CONFIG.fontFamily}`;
      ctx.fillStyle = `rgba(255, 160, 30, ${1 - t})`;
      ctx.shadowColor = '#ff6600';
      ctx.shadowBlur = 5;
      ctx.fillText(sp.char, sp.x, sp.y);
      ctx.restore();
      return true;
    });

    // 5. Render & Update ASCII Sparks
    sparks = sparks.filter(s => {
      s.age += dt;
      if (s.age >= s.maxLife) return false;

      // Trail history for retro motion blur
      s.trail.unshift({ x: s.x, y: s.y, char: s.char });
      if (s.trail.length > 3) s.trail.pop();

      // Physics
      s.vy += CONFIG.gravity * dt;
      s.vx *= (1 - CONFIG.drag);
      s.vy *= (1 - CONFIG.drag);

      const wobble = Math.sin((s.age * CONFIG.wobbleFreq) + s.wobbleOffset) * CONFIG.wobbleAmp * dt;
      s.x += (s.vx + wobble) * dt;
      s.y += s.vy * dt;

      // Landing check: falling back down past the top surface of the pool
      if (s.vy > 40 && s.y >= surfaceY + 12) {
        createSplash(s.x, surfaceY);
        return false;
      }

      // Lifecycle & Temperature
      const progress = s.age / s.maxLife;
      const temp = Math.max(0, 1.0 - Math.pow(progress, 1.05));
      const alpha = progress > 0.75 ? Math.max(0, (1.0 - progress) / 0.25) : 1.0;

      // ASCII Character cycling
      s.flickerTimer += dt;
      if (s.flickerTimer > 0.075) {
        s.flickerTimer = 0;
        s.glyphIndex++;
      }

      const arch = s.archetype;
      let glyphList;
      if (s.vy < -45) {
        glyphList = arch.risingGlyphs;
      } else if (Math.abs(s.vy) <= 45) {
        glyphList = arch.apexGlyphs;
      } else {
        glyphList = arch.fallingGlyphs;
      }
      s.char = glyphList[s.glyphIndex % glyphList.length];

      const style = getSparkStyle(temp, alpha);

      ctx.save();

      // Draw subtle trailing ghost (ASCII motion blur)
      if (s.trail.length >= 2) {
        const tr = s.trail[1];
        ctx.font = `600 ${Math.max(10, arch.fontSize - 3)}px ${CONFIG.fontFamily}`;
        ctx.fillStyle = `rgba(255, 120, 20, ${alpha * 0.28})`;
        ctx.shadowBlur = 0;
        ctx.fillText(arch.trailChar, tr.x, tr.y);
      }

      // Draw Main ASCII Character Spark
      ctx.font = `700 ${arch.fontSize}px ${CONFIG.fontFamily}`;
      ctx.fillStyle = style.fill;
      if (style.blur > 0) {
        ctx.shadowColor = style.glow;
        ctx.shadowBlur = style.blur;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillText(s.char, s.x, s.y);

      ctx.restore();
      return true;
    });
  }

  // ─── Interactive Mouse Eruptions ───────────────────────────────────────────
  function initInteractivity() {
    if (!tvWrapper || !canvas) return;

    let lastMouseEmit = 0;
    tvWrapper.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastMouseEmit < 160) return; // gentler throttle for calm bursts
      lastMouseEmit = now;

      const rect = canvas.getBoundingClientRect();
      const localX = e.clientX - rect.left;

      sparks.push(createSpark(localX, 0.88 + Math.random() * 0.32));
    }, { passive: true });
  }

  // ─── Initialization ────────────────────────────────────────────────────────
  function initLavaSparks() {
    canvas = document.getElementById('hero-spark-canvas');
    tvWrapper = document.getElementById('hero-tv-wrapper');
    if (!canvas || !tvWrapper) return;

    ctx = canvas.getContext('2d');
    resizeCanvas();

    window.addEventListener('resize', () => {
      resizeCanvas();
    }, { passive: true });

    initInteractivity();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    sparks = [];
    bubbles = [];
    splashes = [];
    lastTime = null;
    emitAccum = 0;

    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(tick);
  }

  window.initLavaSparks = initLavaSparks;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLavaSparks);
  } else {
    initLavaSparks();
  }
})();
