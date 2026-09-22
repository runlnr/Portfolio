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

      function resize() {
        const rect = box.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        width = rect.width;
        height = rect.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      }

      window.addEventListener('resize', resize);
      resize();

      box.addEventListener('mouseenter', () => { isHovered = true; });
      box.addEventListener('mouseleave', () => { isHovered = false; });

      // Procedural Draw routines for each icon index (0: Art Direction, 1: Brand Identity, 2: Website Design, 3: Social Media Design)
      function draw() {
        ctx.clearRect(0, 0, width, height);
        time += isHovered ? 0.04 : 0.015;

        const cx = width / 2;
        const cy = height / 2;
        const baseScale = Math.min(width, height) / 220;

        ctx.fillStyle = '#faf9fc';
        ctx.strokeStyle = '#faf9fc';

        if (index === 0) {
          // --- 1. ART DIRECTION: Concentric Stippled Halo + Ascending Arrow ---
          const haloRadius1 = 52 * baseScale;
          const haloRadius2 = 36 * baseScale;
          const haloRadius3 = 20 * baseScale;

          // Outer ASCII dotted rings
          const dotCount1 = 24;
          for (let i = 0; i < dotCount1; i++) {
            const angle = (i / dotCount1) * Math.PI * 2 + (isHovered ? time * 0.2 : 0);
            const r = haloRadius1 + (isHovered ? Math.sin(time * 3 + i) * 2 : 0);
            const x = cx + Math.cos(angle) * r;
            const y = (cy - 12 * baseScale) + Math.sin(angle) * r;

            ctx.font = `${Math.round(8 * baseScale)}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = isHovered && i % 4 === 0 ? '#ffffff' : 'rgba(250, 249, 252, 0.55)';
            ctx.fillText(isHovered && Math.random() < 0.1 ? getRandomGlyph() : '·', x, y);
          }

          const dotCount2 = 16;
          for (let i = 0; i < dotCount2; i++) {
            const angle = (i / dotCount2) * Math.PI * 2 - (isHovered ? time * 0.15 : 0);
            const r = haloRadius2;
            const x = cx + Math.cos(angle) * r;
            const y = (cy - 12 * baseScale) + Math.sin(angle) * r;

            ctx.font = `${Math.round(8 * baseScale)}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgba(250, 249, 252, 0.75)';
            ctx.fillText(isHovered && Math.random() < 0.08 ? getRandomGlyph() : ':', x, y);
          }

          // Inner dashed circle
          ctx.beginPath();
          ctx.arc(cx, cy - 12 * baseScale, haloRadius3, 0, Math.PI * 2);
          ctx.setLineDash([2 * baseScale, 3 * baseScale]);
          ctx.lineWidth = 1 * baseScale;
          ctx.strokeStyle = 'rgba(250, 249, 252, 0.85)';
          ctx.stroke();
          ctx.setLineDash([]);

          // Ascending arrow stem
          const arrowBottomY = cy + 54 * baseScale;
          const arrowTopY = cy - 2 * baseScale;
          ctx.beginPath();
          ctx.moveTo(cx, arrowBottomY);
          ctx.lineTo(cx, arrowTopY);
          ctx.lineWidth = 1 * baseScale;
          ctx.strokeStyle = '#faf9fc';
          ctx.stroke();

          // Arrow tip
          ctx.beginPath();
          ctx.moveTo(cx - 3.5 * baseScale, arrowTopY + 4 * baseScale);
          ctx.lineTo(cx, arrowTopY);
          ctx.lineTo(cx + 3.5 * baseScale, arrowTopY + 4 * baseScale);
          ctx.lineWidth = 1 * baseScale;
          ctx.strokeStyle = '#faf9fc';
          ctx.stroke();

          // Bottom anchor circle
          ctx.beginPath();
          ctx.arc(cx, arrowBottomY + 2 * baseScale, 5 * baseScale, 0, Math.PI * 2);
          ctx.fillStyle = '#faf9fc';
          ctx.fill();

        } else if (index === 1) {
          // --- 2. BRAND IDENTITY: Hypnotic Vortex Spiral + Anchor Core ---
          const spiralTopY = cy - 42 * baseScale;
          const spiralBottomY = cy + 30 * baseScale;
          const turns = 4.2;

          ctx.beginPath();
          const steps = 140;
          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const angle = t * Math.PI * 2 * turns + (isHovered ? time * 0.8 : time * 0.15);
            // Inverted cone radius: wider at top, narrow at bottom
            const r = (50 * (1 - t) + 2) * baseScale;
            const y = spiralTopY + t * (spiralBottomY - spiralTopY) * 0.72;
            const x = cx + Math.cos(angle) * r;
            const yElliptical = y + Math.sin(angle) * (r * 0.28);

            if (i === 0) ctx.moveTo(x, yElliptical);
            else ctx.lineTo(x, yElliptical);
          }
          ctx.lineWidth = 1 * baseScale;
          ctx.strokeStyle = 'rgba(250, 249, 252, 0.85)';
          ctx.stroke();

          // Vertical tail stem
          const tailStartY = spiralTopY + (spiralBottomY - spiralTopY) * 0.72;
          const tailEndY = cy + 54 * baseScale;
          ctx.beginPath();
          ctx.moveTo(cx, tailStartY);
          ctx.lineTo(cx, tailEndY);
          ctx.lineWidth = 1 * baseScale;
          ctx.strokeStyle = '#faf9fc';
          ctx.stroke();

          // Ascii shimmer dots alongside spiral
          if (isHovered) {
            for (let j = 0; j < 6; j++) {
              const jt = (j / 6 + (time * 0.2)) % 1;
              const jangle = jt * Math.PI * 2 * turns;
              const jr = 48 * (1 - jt) * baseScale;
              const jx = cx + Math.cos(jangle) * jr;
              const jy = spiralTopY + jt * (spiralBottomY - spiralTopY) * 0.72 + Math.sin(jangle) * (jr * 0.28);
              ctx.font = `${Math.round(8 * baseScale)}px monospace`;
              ctx.fillStyle = 'rgba(250, 249, 252, 0.7)';
              ctx.fillText(getRandomGlyph(), jx, jy);
            }
          }

          // Bottom anchor circle
          ctx.beginPath();
          ctx.arc(cx, tailEndY + 2 * baseScale, 5 * baseScale, 0, Math.PI * 2);
          ctx.fillStyle = '#faf9fc';
          ctx.fill();

        } else if (index === 2) {
          // --- 3. WEBSITE DESIGN: Apex Master Node + Branching 5-Way System ---
          const apexY = cy - 28 * baseScale;
          const apexR = 6 * baseScale;
          const auraR = 15 * baseScale;

          // Outer aura dashed circle
          ctx.beginPath();
          ctx.arc(cx, apexY, auraR, 0, Math.PI * 2);
          ctx.setLineDash([2 * baseScale, 2.5 * baseScale]);
          ctx.lineWidth = 1 * baseScale;
          ctx.strokeStyle = 'rgba(250, 249, 252, 0.75)';
          ctx.stroke();
          ctx.setLineDash([]);

          // Apex solid circle
          ctx.beginPath();
          ctx.arc(cx, apexY, apexR, 0, Math.PI * 2);
          ctx.fillStyle = '#faf9fc';
          ctx.fill();

          // Center spine down to branching point
          const branchY = cy + 18 * baseScale;
          ctx.beginPath();
          ctx.moveTo(cx, apexY + apexR);
          ctx.lineTo(cx, branchY);
          ctx.lineWidth = 1 * baseScale;
          ctx.strokeStyle = '#faf9fc';
          ctx.stroke();

          // 5 Bottom Terminals
          const terminalY = cy + 54 * baseScale;
          const terminalCount = 5;
          const span = 68 * baseScale;
          for (let k = 0; k < terminalCount; k++) {
            const tx = cx - span / 2 + (k / (terminalCount - 1)) * span;
            // Line from branch point to terminal
            ctx.beginPath();
            ctx.moveTo(cx, branchY);
            ctx.lineTo(tx, terminalY);
            ctx.lineWidth = 1 * baseScale;
            ctx.strokeStyle = 'rgba(250, 249, 252, 0.85)';
            ctx.stroke();

            // Terminal hollow circle
            ctx.beginPath();
            ctx.arc(tx, terminalY, 4 * baseScale, 0, Math.PI * 2);
            ctx.lineWidth = 1 * baseScale;
            ctx.strokeStyle = '#faf9fc';
            ctx.stroke();

            // Shimmer ASCII pulse along paths on hover
            if (isHovered && Math.random() < 0.25) {
              const lerpT = (Math.sin(time * 4 + k) + 1) / 2;
              const px = cx + (tx - cx) * lerpT;
              const py = branchY + (terminalY - branchY) * lerpT;
              ctx.font = `${Math.round(8 * baseScale)}px monospace`;
              ctx.fillStyle = '#ffffff';
              ctx.fillText(getRandomGlyph(), px, py);
            }
          }

        } else if (index === 3) {
          // --- 4. SOCIAL MEDIA DESIGN: Target Orb + Pulsing Frequency Array ---
          const targetY = cy - 20 * baseScale;
          const targetR1 = 19 * baseScale;
          const targetR2 = 9 * baseScale;
          const centerDotR = 4 * baseScale;

          // Outer target circle
          ctx.beginPath();
          ctx.arc(cx, targetY, targetR1, 0, Math.PI * 2);
          ctx.lineWidth = 1 * baseScale;
          ctx.strokeStyle = 'rgba(250, 249, 252, 0.85)';
          ctx.stroke();

          // Middle solid ring
          ctx.beginPath();
          ctx.arc(cx, targetY, targetR2, 0, Math.PI * 2);
          ctx.fillStyle = '#faf9fc';
          ctx.fill();

          // Center cut-out dot
          ctx.beginPath();
          ctx.arc(cx, targetY, centerDotR, 0, Math.PI * 2);
          ctx.fillStyle = '#080808';
          ctx.fill();

          // Pulsing dashed frequency line downward
          const arrayY = cy + 54 * baseScale;
          ctx.beginPath();
          ctx.moveTo(cx, targetY + targetR1);
          ctx.lineTo(cx, arrayY);
          ctx.setLineDash([2 * baseScale, 2 * baseScale]);
          ctx.lineWidth = 1 * baseScale;
          ctx.strokeStyle = 'rgba(250, 249, 252, 0.7)';
          ctx.stroke();
          ctx.setLineDash([]);

          // 5 Horizontal Baseline Nodes
          const nodeCount = 5;
          const nodeSpan = 64 * baseScale;
          for (let m = 0; m < nodeCount; m++) {
            const nx = cx - nodeSpan / 2 + (m / (nodeCount - 1)) * nodeSpan;
            ctx.beginPath();
            ctx.arc(nx, arrayY, 3.5 * baseScale, 0, Math.PI * 2);
            if (m === 2) {
              // Center node solid
              ctx.fillStyle = '#faf9fc';
              ctx.fill();
            } else {
              // Outer nodes hollow
              ctx.lineWidth = 1 * baseScale;
              ctx.strokeStyle = '#faf9fc';
              ctx.stroke();
            }

            if (isHovered && Math.random() < 0.2) {
              ctx.font = `${Math.round(8 * baseScale)}px monospace`;
              ctx.fillStyle = 'rgba(250, 249, 252, 0.8)';
              ctx.fillText(getRandomGlyph(), nx, arrayY - 10 * baseScale);
            }
          }
        }

        animationFrameId = requestAnimationFrame(draw);
      }

      draw();

      // Clean up if page navigates
      window.addEventListener('beforeunload', () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      });
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
