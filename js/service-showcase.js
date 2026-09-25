/**
 * Execution Script: Interactive 4-Box Service Showcase
 * Real-time procedural ASCII geometry + bidirectional hover text reveals.
 */

(function () {
  'use strict';

  const SERVICES_DATA = [
    {
      id: 'art-direction',
      title: 'ART DIRECTION',
      text: 'Visual language crafted to captivate. Setting the aesthetic standard where form meets obsession.',
      side: 'left' // displays text on right
    },
    {
      id: 'brand-identity',
      title: 'BRAND IDENTITY',
      text: 'Strategy-led brand systems that remove friction, sharpen positioning, and command instant recognition.',
      side: 'left' // displays text on right
    },
    {
      id: 'website-design',
      title: 'WEBSITE DESIGN',
      text: 'Editorial aesthetics fused with flawless functionality. Digital experiences that turn attention into conviction.',
      side: 'right' // displays text on left
    },
    {
      id: 'social-media-design',
      title: 'SOCIAL MEDIA DESIGN',
      text: 'High-impact visual narratives designed for cultural resonance across modern digital channels.',
      side: 'right' // displays text on left
    }
  ];

  const ASCII_GLYPHS = ['.', '·', ':', '+', '*', '°', '#', '/', '\\', '~', '='];

  function getRandomGlyph() {
    return ASCII_GLYPHS[Math.floor(Math.random() * ASCII_GLYPHS.length)];
  }

  // Initialize ASCII Canvas Renderers for each box
  function initBoxCanvases() {
    const boxes = document.querySelectorAll('.f3-showcase-box');
    boxes.forEach((box, index) => {
      const canvas = box.querySelector('.f3-showcase-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationFrameId = null;
      let width = 0;
      let height = 0;
      let isHovered = false;
      let time = Math.random() * 100;

      // Offscreen buffer for rasterizing vector geometry into ASCII matrix
      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });

      // Exact Hero ASCII Glyph Ramp (from dark/sparse to dense/bright)
      const HERO_DENSE_RAMP = [' ', '.', ':', '-', '=', '+', '*', 'a', 'b', '?', '0', '8', 'W', '#', '@'];

      function resize() {
        const rect = box.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        width = rect.width;
        height = rect.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Calculate ASCII grid cells (cell size ~7.5px for ultra-dense high-fidelity terminal look)
        const targetCellSize = 7.5;
        const cols = Math.max(24, Math.floor(width / targetCellSize));
        const rows = Math.max(24, Math.floor(height / targetCellSize));
        offscreen.width = cols;
        offscreen.height = rows;

        draw();
      }

      window.addEventListener('resize', resize);

      box.addEventListener('mouseenter', () => {
        isHovered = true;
        draw();
      });

      box.addEventListener('mouseleave', () => {
        isHovered = false;
        draw();
      });

      // Static ASCII Rasterization Render Routine
      function draw() {
        if (!width || !height || !offscreen.width || !offscreen.height) {
          return;
        }

        const cols = offscreen.width;
        const rows = offscreen.height;
        const cellW = width / cols;
        const cellH = height / rows;

        // 1. Clear offscreen vector buffer (black background)
        offCtx.fillStyle = '#000000';
        offCtx.fillRect(0, 0, cols, rows);

        const cx = cols / 2;
        const cy = rows / 2;
        // Emil Design Engineering: Generous optical margin and breathing room (scale 0.65)
        const fitScale = (Math.min(cols, rows) / 48) * 0.65;
        const mapX = (x) => cx + (x - 24) * fitScale;
        const mapY = (y) => cy + (y - 24) * fitScale;

        offCtx.strokeStyle = '#ffffff';
        offCtx.fillStyle = '#ffffff';
        offCtx.lineCap = 'round';
        offCtx.lineJoin = 'round';

        // 2. Render Exact User Icon SVG Geometry onto Offscreen Buffer (Static)
        if (index === 0) {
          // --- 1. ART DIRECTION: Viewfinder Corners & Center Focal Dot ---
          // SVG: <path d="M6,18 L6,10 L14,10"/> <path d="M34,10 L42,10 L42,18"/>
          //      <path d="M6,30 L6,38 L14,38"/> <path d="M34,38 L42,38 L42,30"/>
          //      <circle cx="24" cy="24" r="2"/>
          offCtx.lineWidth = 1.6 * fitScale;

          // Top-Left Corner ⌜
          offCtx.beginPath();
          offCtx.moveTo(mapX(6), mapY(18));
          offCtx.lineTo(mapX(6), mapY(10));
          offCtx.lineTo(mapX(14), mapY(10));
          offCtx.stroke();

          // Top-Right Corner ⌝
          offCtx.beginPath();
          offCtx.moveTo(mapX(34), mapY(10));
          offCtx.lineTo(mapX(42), mapY(10));
          offCtx.lineTo(mapX(42), mapY(18));
          offCtx.stroke();

          // Bottom-Left Corner ⌞
          offCtx.beginPath();
          offCtx.moveTo(mapX(6), mapY(30));
          offCtx.lineTo(mapX(6), mapY(38));
          offCtx.lineTo(mapX(14), mapY(38));
          offCtx.stroke();

          // Bottom-Right Corner ⌟
          offCtx.beginPath();
          offCtx.moveTo(mapX(34), mapY(38));
          offCtx.lineTo(mapX(42), mapY(38));
          offCtx.lineTo(mapX(42), mapY(30));
          offCtx.stroke();

          // Center Focal Dot
          offCtx.beginPath();
          offCtx.arc(cx, cy, 2.0 * fitScale, 0, Math.PI * 2);
          offCtx.fill();

        } else if (index === 1) {
          // --- 2. BRAND IDENTITY: Hexagonal Shield & Inner Concentric Seal ---
          // SVG: <path d="M24,4 L41.3,14 L41.3,34 L24,44 L6.7,34 L6.7,14 Z"/>
          //      <circle cx="24" cy="24" r="6"/>
          offCtx.lineWidth = 1.6 * fitScale;

          const hexPoints = [
            { x: 24, y: 4 },
            { x: 41.3, y: 14 },
            { x: 41.3, y: 34 },
            { x: 24, y: 44 },
            { x: 6.7, y: 34 },
            { x: 6.7, y: 14 }
          ];

          // Outer Hexagon
          offCtx.beginPath();
          hexPoints.forEach((pt, i) => {
            const px = mapX(pt.x);
            const py = mapY(pt.y);
            if (i === 0) offCtx.moveTo(px, py);
            else offCtx.lineTo(px, py);
          });
          offCtx.closePath();
          offCtx.stroke();

          // Center Circle
          offCtx.beginPath();
          offCtx.arc(cx, cy, 6.0 * fitScale, 0, Math.PI * 2);
          offCtx.stroke();

        } else if (index === 2) {
          // --- 3. WEBSITE DESIGN: Browser Viewport Window with Split Sidebar ---
          // SVG: <rect x="4" y="8" width="40" height="32" rx="3"/>
          //      <path d="M4,16 L44,16"/>
          //      <path d="M18,16 L18,40"/>
          //      <circle cx="9" cy="12" r="1"/> <circle cx="13" cy="12" r="1"/> <circle cx="17" cy="12" r="1"/>
          offCtx.lineWidth = 1.5 * fitScale;

          const rx = mapX(4);
          const ry = mapY(8);
          const rw = 40 * fitScale;
          const rh = 32 * fitScale;
          const cornerRad = 3 * fitScale;

          // Outer Rounded Rect
          offCtx.beginPath();
          offCtx.roundRect(rx, ry, rw, rh, cornerRad);
          offCtx.stroke();

          // Top Header Line
          offCtx.beginPath();
          offCtx.moveTo(mapX(4), mapY(16));
          offCtx.lineTo(mapX(44), mapY(16));
          offCtx.stroke();

          // Left Sidebar Divider
          offCtx.beginPath();
          offCtx.moveTo(mapX(18), mapY(16));
          offCtx.lineTo(mapX(18), mapY(40));
          offCtx.stroke();

          // 3 Header Dots
          const dotRadius = 1.2 * fitScale;
          [9, 13, 17].forEach((dx) => {
            offCtx.beginPath();
            offCtx.arc(mapX(dx), mapY(12), dotRadius, 0, Math.PI * 2);
            offCtx.fill();
          });

        } else if (index === 3) {
          // --- 4. SOCIAL MEDIA DESIGN: Network Share Node Cluster ---
          // SVG: <path d="M10,24 L38,10"/>
          //      <path d="M10,24 L38,38"/>
          //      <circle cx="10" cy="24" r="4" fill="white"/>
          //      <circle cx="38" cy="10" r="4" fill="white"/>
          //      <circle cx="38" cy="38" r="4" fill="white"/>
          offCtx.lineWidth = 1.6 * fitScale;

          // 2 Branch Connection Lines
          offCtx.beginPath();
          offCtx.moveTo(mapX(10), mapY(24));
          offCtx.lineTo(mapX(38), mapY(10));
          offCtx.moveTo(mapX(10), mapY(24));
          offCtx.lineTo(mapX(38), mapY(38));
          offCtx.stroke();

          // 3 Filled Circle Nodes
          const nodes = [
            { x: 10, y: 24 },
            { x: 38, y: 10 },
            { x: 38, y: 38 }
          ];

          nodes.forEach((nd) => {
            offCtx.beginPath();
            offCtx.arc(mapX(nd.x), mapY(nd.y), 4.0 * fitScale, 0, Math.PI * 2);
            offCtx.fill();
          });
        }

        // 3. Sample Offscreen Buffer & Render Static ASCII Terminal Matrix
        const imgData = offCtx.getImageData(0, 0, cols, rows).data;
        ctx.clearRect(0, 0, width, height);

        const fontSize = Math.max(7, Math.floor(cellH * 0.95));
        ctx.font = `${fontSize}px 'PP Supply Mono', 'PPSupplyMono-Regular', Menlo, Monaco, "Courier New", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const ramp = HERO_DENSE_RAMP;
        const rampMax = ramp.length - 1;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = (r * cols + c) * 4;
            const rVal = imgData[idx];
            const gVal = imgData[idx + 1];
            const bVal = imgData[idx + 2];
            const luma = (rVal * 0.299 + gVal * 0.587 + bVal * 0.114) / 255.0;

            const posX = c * cellW + cellW / 2;
            const posY = r * cellH + cellH / 2;

            if (luma > 0.05) {
              const gIdx = Math.floor(luma * rampMax);
              const glyph = ramp[gIdx];
              const alpha = Math.min(1.0, isHovered ? (luma * 0.95 + 0.15) : (luma * 0.85 + 0.1));

              if (luma > 0.78 && isHovered) {
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = 'rgba(250, 249, 252, 0.6)';
                ctx.shadowBlur = 3;
              } else {
                ctx.fillStyle = `rgba(250, 249, 252, ${alpha.toFixed(2)})`;
                ctx.shadowBlur = 0;
              }

              ctx.fillText(glyph, posX, posY);

            } else {
              // Subtle fixed static grid points (no random blinking)
              if (r % 6 === 0 && c % 6 === 0) {
                ctx.fillStyle = isHovered ? 'rgba(250, 249, 252, 0.08)' : 'rgba(250, 249, 252, 0.03)';
                ctx.shadowBlur = 0;
                ctx.fillText('·', posX, posY);
              }
            }
          }
        }

        // Reset shadow
        ctx.shadowBlur = 0;
      }

      resize();
    });
  }

  // Handle Box-Anchored Text Reveal Interaction
  function initHoverReveal() {
    const showcaseWrap = document.querySelector('.f3-showcase-wrap');
    if (!showcaseWrap) return;

    const boxItems = showcaseWrap.querySelectorAll('.f3-showcase-item');
    let activeIndex = -1;

    function activateBox(index) {
      if (index < 0 || index >= boxItems.length) return;
      activeIndex = index;

      // Dim non-hovered boxes; active box and its anchored description stay visible
      boxItems.forEach((item, i) => {
        if (i === index) {
          item.classList.add('is-active');
          item.classList.remove('is-dimmed');
        } else {
          item.classList.remove('is-active');
          item.classList.add('is-dimmed');
        }
      });
    }

    function resetBoxes() {
      activeIndex = -1;
      boxItems.forEach((item) => {
        item.classList.remove('is-active', 'is-dimmed');
      });
    }

    boxItems.forEach((item, index) => {
      // Desktop Hover
      item.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 768) {
          activateBox(index);
        }
      });

      // Mobile Tap Toggle
      item.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          const desc = item.querySelector('.f3-showcase-desc');
          if (desc) {
            const isOpen = item.classList.contains('is-mobile-open');
            // Close all
            boxItems.forEach(b => b.classList.remove('is-mobile-open'));
            if (!isOpen) {
              item.classList.add('is-mobile-open');
            }
          }
        }
      });
    });

    showcaseWrap.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 768) {
        resetBoxes();
      }
    });
  }

  // DOM ready initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initBoxCanvases();
      initHoverReveal();
    });
  } else {
    initBoxCanvases();
    initHoverReveal();
  }
})();
