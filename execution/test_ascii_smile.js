const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function renderAsciiSmile(width = 800, height = 480, time = 1.2, mouseX = 0, mouseY = 0) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  const cols = 80;
  const rows = 40;
  const cellW = width / cols;
  const cellH = height / rows;

  const buffer = Array(rows).fill(null).map(() => Array(cols).fill(' '));
  const colorBuffer = Array(rows).fill(null).map(() => Array(cols).fill('#444444'));
  const zBuffer = Array(rows).fill(null).map(() => Array(cols).fill(-9999));

  // Rotation angles
  const rotY = time * 0.6 + mouseX * 0.8;
  const rotX = Math.sin(time * 0.4) * 0.2 + mouseY * 0.5;

  const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
  const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

  const glyphRamp = [' ', '.', '·', ':', '-', '=', '+', '*', 'x', '#', '%', '@'];

  const R = 1.0;
  const stepsTheta = 120;
  const stepsPhi = 60;

  // Render sphere surface
  for (let i = 0; i < stepsTheta; i++) {
    const theta = (i / stepsTheta) * Math.PI * 2;
    for (let j = 0; j < stepsPhi; j++) {
      const phi = (j / stepsPhi) * Math.PI - Math.PI / 2;

      // Base sphere coords
      const x0 = R * Math.cos(phi) * Math.sin(theta);
      const y0 = R * Math.sin(phi);
      const z0 = R * Math.cos(phi) * Math.cos(theta);

      // Normal vector
      const nx0 = x0, ny0 = y0, nz0 = z0;

      // 3D Rotation (Y then X)
      // Y-axis rotation
      const x1 = x0 * cosY + z0 * sinY;
      const y1 = y0;
      const z1 = -x0 * sinY + z0 * cosY;

      // X-axis rotation
      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      // Rotated Normal
      const nx1 = nx0 * cosY + nz0 * sinY;
      const ny1 = ny0;
      const nz1 = -nx0 * sinY + nz0 * cosY;

      const nx2 = nx1;
      const ny2 = ny1 * cosX - nz1 * sinX;
      const nz2 = ny1 * sinX + nz1 * cosX;

      // Only front-facing hemisphere
      if (z2 <= -0.2) continue;

      // Lighting (light from top-left-front)
      const lx = -0.5, ly = 0.7, lz = 1.0;
      const lLen = Math.sqrt(lx*lx + ly*ly + lz*lz);
      const dot = (nx2 * lx + ny2 * ly + nz2 * lz) / lLen;
      const lum = Math.max(0, dot);

      // Perspective projection
      const fov = 3.2;
      const projX = (x2 / (z2 + fov)) * 28 + cols / 2;
      const projY = (-y2 / (z2 + fov)) * 24 + rows / 2;

      const col = Math.floor(projX);
      const row = Math.floor(projY);

      if (col >= 0 && col < cols && row >= 0 && row < rows) {
        if (z2 > zBuffer[row][col]) {
          zBuffer[row][col] = z2;

          // Check if point belongs to face features (in original unrotated space: z0 > 0)
          let isEye = false;
          let isSmile = false;

          if (z0 > 0.3) {
            // Left & Right Eyes (arched / round smiling eyes)
            const leftEyeDist = Math.hypot(x0 - (-0.35), y0 - 0.28);
            const rightEyeDist = Math.hypot(x0 - (0.35), y0 - 0.28);

            if (leftEyeDist < 0.11 || rightEyeDist < 0.11) {
              isEye = true;
            }

            // Smile curve: y = -0.25 + 0.22 * (x / 0.5)^2
            if (Math.abs(x0) <= 0.55) {
              const smileY = -0.28 + 0.25 * Math.pow(x0 / 0.55, 2);
              const distToSmile = Math.abs(y0 - smileY);
              if (distToSmile < 0.075) {
                isSmile = true;
              }
            }
          }

          if (isEye) {
            buffer[row][col] = '■';
            colorBuffer[row][col] = '#ffffff';
          } else if (isSmile) {
            buffer[row][col] = '#';
            colorBuffer[row][col] = '#ffffff';
          } else {
            const charIdx = Math.min(glyphRamp.length - 1, Math.floor(lum * (glyphRamp.length - 1)));
            buffer[row][col] = glyphRamp[charIdx];
            // Subtle greyscale shading
            const grey = Math.floor(60 + lum * 140);
            colorBuffer[row][col] = `rgb(${grey},${grey},${grey})`;
          }
        }
      }
    }
  }

  // Draw buffer to canvas
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const char = buffer[r][c];
      if (char !== ' ') {
        ctx.fillStyle = colorBuffer[r][c];
        ctx.fillText(char, c * cellW + cellW / 2, r * cellH + cellH / 2);
      }
    }
  }

  return canvas.toBuffer('image/png');
}

try {
  const buf = renderAsciiSmile(800, 480, 0.6, 0.1, 0.05);
  fs.writeFileSync(path.resolve('C:/Users/haina/.gemini/antigravity-ide/brain/65fddc38-952e-407e-9a32-5a793fdc4604/ascii_smile_test.png'), buf);
  console.log('Saved ascii_smile_test.png');
} catch (e) {
  console.error(e);
}
