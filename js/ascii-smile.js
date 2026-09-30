/**
 * Execution Script: Interactive 3D ASCII Smiling Face Matrix
 * Real-time depth-buffered 3D ASCII sphere with smiling facial geometry,
 * dynamic spherical lighting, interactive cursor tracking, and procedural blinking.
 */

(function () {
  'use strict';

  function initAsciiSmile() {
    const section = document.getElementById('f3-ascii-smile');
    if (!section) return;

    const canvas = document.getElementById('f3-ascii-smile-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coordsDisplay = section.querySelector('.f3-ascii-coords-val');

    let animId = null;
    let isVisible = false;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    // Interactive motion states
    let currentRotY = 0;
    let currentRotX = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let mouseActive = false;
    let mouseTimer = null;
    let time = 0;

    // Blink state
    let isBlinking = false;
    let nextBlinkTime = 2.5 + Math.random() * 2.5;

    // ASCII Glyph Ramp for sphere surface shading
    const GLYPH_RAMP = [' ', '·', '.', ':', '-', '=', '+', '*', '%', '#'];

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener('resize', resize);
    resize();

    // Mouse tracking on section & canvas
    function onMouseMove(e) {
      const rect = section.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to +1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to +1

      targetRotY = nx * 0.95;
      targetRotX = -ny * 0.65;
      mouseActive = true;

      clearTimeout(mouseTimer);
      mouseTimer = setTimeout(() => {
        mouseActive = false;
      }, 3500);
    }

    function onMouseLeave() {
      mouseActive = false;
    }

    section.addEventListener('mousemove', onMouseMove, { passive: true });
    section.addEventListener('mouseleave', onMouseLeave, { passive: true });

    // Touch support for mobile devices
    function onTouchMove(e) {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = section.getBoundingClientRect();
        const nx = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((touch.clientY - rect.top) / rect.height) * 2 - 1;
        targetRotY = nx * 0.95;
        targetRotX = -ny * 0.65;
        mouseActive = true;
      }
    }

    section.addEventListener('touchmove', onTouchMove, { passive: true });

    // Main render loop
    function render() {
      if (!isVisible) return;

      const dt = 0.016;
      time += dt;

      // Handle natural procedural blinking
      if (time > nextBlinkTime) {
        isBlinking = true;
        if (time > nextBlinkTime + 0.16) {
          isBlinking = false;
          nextBlinkTime = time + 3.0 + Math.random() * 3.5;
        }
      }

      // Smooth camera interpolation
      if (!mouseActive) {
        // Natural gentle idle floating rotation
        targetRotY = Math.sin(time * 0.55) * 0.45;
        targetRotX = Math.cos(time * 0.7) * 0.20;
      }

      currentRotY += (targetRotY - currentRotY) * 0.075;
      currentRotX += (targetRotX - currentRotX) * 0.075;

      // Update telemetry coords if present
      if (coordsDisplay) {
        const xStr = (currentRotY >= 0 ? '+' : '') + currentRotY.toFixed(2);
        const yStr = (currentRotX >= 0 ? '+' : '') + currentRotX.toFixed(2);
        coordsDisplay.textContent = `X:${xStr} Y:${yStr}`;
      }

      // Clear background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Grid dimensions for ASCII matrix
      const fontSize = width < 600 ? 10 : 12;
      const cellW = fontSize * 0.60;
      const cellH = fontSize * 1.05;

      const cols = Math.floor(width / cellW);
      const rows = Math.floor(height / cellH);

      if (cols <= 0 || rows <= 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      const buffer = Array(rows).fill(null).map(() => Array(cols).fill(' '));
      const colorBuffer = Array(rows).fill(null).map(() => Array(cols).fill('#333333'));
      const zBuffer = Array(rows).fill(null).map(() => Array(cols).fill(-9999));

      const cosY = Math.cos(currentRotY), sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX), sinX = Math.sin(currentRotX);

      // Sphere parameters & high-density sampling
      const R = 1.0;
      const stepsTheta = 420;
      const stepsPhi = 230;

      // Light direction (top-left-front)
      const lx = -0.65, ly = 0.75, lz = 1.1;
      const lLen = Math.sqrt(lx * lx + ly * ly + lz * lz);
      const nlx = lx / lLen, nly = ly / lLen, nlz = lz / lLen;

      // Perspective scale factor
      const fov = 3.6;
      const targetRadiusCells = Math.min(cols * 0.38, (rows * (cellH / cellW)) * 0.38);
      const scaleFactor = targetRadiusCells * (fov + 0.3);

      for (let i = 0; i < stepsTheta; i++) {
        const theta = (i / stepsTheta) * Math.PI * 2;
        for (let j = 0; j < stepsPhi; j++) {
          const phi = (j / stepsPhi) * Math.PI - Math.PI / 2;

          const cosPhi = Math.cos(phi);
          const sinPhi = Math.sin(phi);

          // Base 3D Sphere coordinates (Radius R = 1.0)
          const x0 = R * cosPhi * Math.sin(theta);
          const y0 = R * sinPhi;
          const z0 = R * cosPhi * Math.cos(theta);

          // 3D Rotations (Yaw around Y, then Pitch around X)
          const x1 = x0 * cosY + z0 * sinY;
          const y1 = y0;
          const z1 = -x0 * sinY + z0 * cosY;

          const x2 = x1;
          const y2 = y1 * cosX - z1 * sinX;
          const z2 = y1 * sinX + z1 * cosX;

          // Discard back-facing hemisphere points
          if (z2 <= -0.1) continue;

          // Rotated surface normals
          const nx1 = x0 * cosY + z0 * sinY;
          const ny1 = y0;
          const nz1 = -x0 * sinY + z0 * cosY;

          const nx2 = nx1;
          const ny2 = ny1 * cosX - nz1 * sinX;
          const nz2 = ny1 * sinX + nz1 * cosX;

          // Diffuse lighting
          const dot = nx2 * nlx + ny2 * nly + nz2 * nlz;
          const diffuse = Math.max(0, dot);

          // Specular reflection
          const rx = 2 * dot * nx2 - nlx;
          const ry = 2 * dot * ny2 - nly;
          const rz = 2 * dot * nz2 - nlz;
          const spec = Math.pow(Math.max(0, rz), 14) * 0.30;

          const lum = Math.min(1.0, 0.12 + diffuse * 0.60 + spec);

          // Perspective Projection
          const projZ = z2 + fov;
          const projX = (x2 / projZ) * scaleFactor + cols / 2;
          const projY = (-y2 / projZ) * (scaleFactor * (cellW / cellH)) + rows / 2;

          const col = Math.floor(projX);
          const row = Math.floor(projY);

          if (col >= 0 && col < cols && row >= 0 && row < rows) {
            if (z2 > zBuffer[row][col]) {
              zBuffer[row][col] = z2;

              // Detect Facial Features on front face (z0 > 0.16)
              let isEye = false;
              let isEyeHighlight = false;
              let isBrow = false;
              let isSmile = false;
              let isCheek = false;

              if (z0 > 0.16) {
                // Eye centers at (-0.26, 0.18) & (+0.26, 0.18)
                const eyeX = 0.26;
                const eyeY = 0.18;
                const dLeftEye = Math.hypot(x0 - (-eyeX), y0 - eyeY);
                const dRightEye = Math.hypot(x0 - eyeX, y0 - eyeY);

                if (isBlinking) {
                  // Closed smiling eye slit during blink: —
                  if ((Math.abs(x0 - (-eyeX)) < 0.11 || Math.abs(x0 - eyeX) < 0.11) &&
                    Math.abs(y0 - eyeY) < 0.03) {
                    isEye = true;
                  }
                } else {
                  // Expressive round smiling eyes with sparkle highlight
                  const inLeftHighlight = (x0 > -eyeX - 0.05 && x0 < -eyeX - 0.005 && y0 > eyeY + 0.01 && y0 < eyeY + 0.05);
                  const inRightHighlight = (x0 > eyeX - 0.05 && x0 < eyeX - 0.005 && y0 > eyeY + 0.01 && y0 < eyeY + 0.05);

                  if (inLeftHighlight || inRightHighlight) {
                    isEyeHighlight = true;
                  } else if (dLeftEye < 0.08 || dRightEye < 0.08) {
                    isEye = true;
                  }

                  // Eyebrow arches above eyes
                  const browL = eyeY + 0.12 - 2.5 * Math.pow(x0 - (-eyeX), 2);
                  const browR = eyeY + 0.12 - 2.5 * Math.pow(x0 - eyeX, 2);
                  if ((Math.abs(x0 - (-eyeX)) < 0.10 && Math.abs(y0 - browL) < 0.025) ||
                    (Math.abs(x0 - eyeX) < 0.10 && Math.abs(y0 - browR) < 0.025)) {
                    isBrow = true;
                  }
                }

                // Cheerful blush marks at (+-0.42, 0.00)
                const dLeftCheek = Math.hypot(x0 - (-0.42), y0 - 0.00);
                const dRightCheek = Math.hypot(x0 - 0.42, y0 - 0.00);
                if (dLeftCheek < 0.055 || dRightCheek < 0.055) {
                  isCheek = true;
                }

                // Upward curved smile:
                // y = -0.28 + 2.0 * x^2 for |x| <= 0.36
                if (Math.abs(x0) <= 0.36) {
                  const smileCurveY = -0.28 + 2.0 * Math.pow(x0, 2);
                  const distToSmile = Math.abs(y0 - smileCurveY);

                  if (distToSmile < 0.038) {
                    isSmile = true;
                  }
                }
              }

              if (isEyeHighlight) {
                buffer[row][col] = 'o';
                colorBuffer[row][col] = '#ffffff';
              } else if (isEye) {
                buffer[row][col] = isBlinking ? '—' : '■';
                colorBuffer[row][col] = '#ffffff';
              } else if (isBrow) {
                buffer[row][col] = '^';
                colorBuffer[row][col] = '#d0d0d0';
              } else if (isSmile) {
                buffer[row][col] = '#';
                colorBuffer[row][col] = '#ffffff';
              } else if (isCheek) {
                buffer[row][col] = '+';
                colorBuffer[row][col] = '#888888';
              } else {
                // Sphere body shading
                const charIdx = Math.min(GLYPH_RAMP.length - 1, Math.floor(lum * (GLYPH_RAMP.length - 1)));
                buffer[row][col] = GLYPH_RAMP[charIdx];

                const grey = Math.floor(30 + lum * 115);
                colorBuffer[row][col] = `rgb(${grey},${grey},${grey})`;
              }
            }
          }
        }
      }

      // Draw text buffer to canvas
      ctx.font = `${fontSize}px "PPSupplyMono-Regular", "PP Supply Mono", "SF Mono", Menlo, Consolas, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const offsetX = (width - cols * cellW) / 2;
      const offsetY = (height - rows * cellH) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const char = buffer[r][c];
          if (char !== ' ') {
            ctx.fillStyle = colorBuffer[r][c];
            ctx.fillText(char, offsetX + c * cellW + cellW / 2, offsetY + r * cellH + cellH / 2);
          }
        }
      }

      animId = requestAnimationFrame(render);
    }

    // IntersectionObserver to only animate when in view
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!isVisible) {
              isVisible = true;
              resize();
              animId = requestAnimationFrame(render);
            }
          } else {
            isVisible = false;
            if (animId) {
              cancelAnimationFrame(animId);
              animId = null;
            }
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '100px 0px 100px 0px'
      });

      observer.observe(section);
    } else {
      isVisible = true;
      animId = requestAnimationFrame(render);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAsciiSmile);
  } else {
    initAsciiSmile();
  }
})();
