/**
 * Real-Time Generative ASCII Disc Particle Engine
 * Procedurally generates concentric ASCII vinyl tracks with real-time cursor magnetic repulsion & spring physics.
 */

class AsciiDiscEngine {
  constructor(canvasId, containerId) {
    this.canvas = document.getElementById(canvasId);
    this.container = document.getElementById(containerId);
    if (!this.canvas || !this.container) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouseX = -9999;
    this.mouseY = -9999;
    this.isMouseInside = false;

    // ASCII Character Sets by Density & Theme
    this.glyphBank = [
      '#', '@', '%', '&', '$', '8', 'X', 'O', '0', 'Q', 
      '4', 'L', 'O', 'W', '+', '*', '=', '~', '-', ':', '.', ' '
    ];

    this.labelWords = [
      'N/P', 'GRAPHIC', 'DESIGN', 'VIETNAM', 'GMT+7', '2026', 
      'STUDIO', 'SYSTEM', 'TYPO', 'IDENTITY', 'AUDIO', 'DISC'
    ];

    this.init();
  }

  init() {
    this.resize();
    this.generateParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    this.width = rect.width || 660;
    this.height = rect.height || 660;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.radius = Math.min(this.width, this.height) * 0.46;
  }

  generateParticles() {
    this.particles = [];
    const numRings = 48;
    const minRadius = this.radius * 0.08;
    const maxRadius = this.radius;

    for (let r = 0; r < numRings; r++) {
      const ringRatio = r / numRings;
      const currentRadius = minRadius + ringRatio * (maxRadius - minRadius);

      const isLabelZone = ringRatio < 0.32;
      const isLeadIn = ringRatio > 0.94;
      const isSpindle = ringRatio < 0.05;

      if (isSpindle) continue;

      const circumference = 2 * Math.PI * currentRadius;
      const charSpacing = isLabelZone ? 10.5 : (12 + (r % 3) * 2);
      const count = Math.floor(circumference / charSpacing);

      const labelText = this.labelWords[r % this.labelWords.length];

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const originX = this.centerX + Math.cos(angle) * currentRadius;
        const originY = this.centerY + Math.sin(angle) * currentRadius;

        let char = ' ';
        let alpha = 0.5;
        let fontSize = 9;
        let weight = '400';

        if (isLabelZone) {
          const charIndex = i % labelText.length;
          char = labelText[charIndex];
          alpha = 0.85 + Math.sin(angle * 3) * 0.15;
          fontSize = 10;
          weight = '700';
        } else if (isLeadIn) {
          const leadChars = ['.', ':', '+', '-', '|'];
          char = leadChars[(i + r) % leadChars.length];
          alpha = 0.35;
          fontSize = 8;
        } else {
          const grooveNoise = Math.sin(angle * 8 + r * 0.5) * Math.cos(r * 0.3);
          const glyphIndex = Math.floor(Math.abs(grooveNoise) * this.glyphBank.length) % this.glyphBank.length;
          char = this.glyphBank[glyphIndex];

          const sheenAngle = angle - Math.PI / 4;
          const sheen = Math.pow(Math.cos(sheenAngle * 2), 4);
          alpha = 0.25 + sheen * 0.65;
          fontSize = 8.5;
        }

        this.particles.push({
          originX,
          originY,
          x: originX,
          y: originY,
          vx: 0,
          vy: 0,
          char,
          alpha,
          fontSize,
          weight,
          angle,
          radius: currentRadius,
          isLabel: isLabelZone
        });
      }
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.generateParticles();
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;

      this.isMouseInside = (
        this.mouseX >= -100 && 
        this.mouseX <= this.width + 100 && 
        this.mouseY >= -100 && 
        this.mouseY <= this.height + 100
      );
    });

    window.addEventListener('mouseleave', () => {
      this.isMouseInside = false;
      this.mouseX = -9999;
      this.mouseY = -9999;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const mouseX = this.mouseX;
    const mouseY = this.mouseY;
    const repelRadius = 95;
    const repelForce = 22;
    const spring = 0.085;
    const damping = 0.82;

    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      if (this.isMouseInside) {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.hypot(dx, dy);

        if (dist < repelRadius && dist > 0) {
          const force = Math.pow(1 - dist / repelRadius, 1.8) * repelForce;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      const springX = (p.originX - p.x) * spring;
      const springY = (p.originY - p.y) * spring;

      p.vx += springX;
      p.vy += springY;

      p.vx *= damping;
      p.vy *= damping;

      p.x += p.vx;
      p.y += p.vy;

      this.ctx.font = `${p.weight} ${p.fontSize}px 'Martian Mono', 'Inter Display', monospace`;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      this.ctx.fillText(p.char, p.x, p.y);
    }

    // Center Spindle Hole
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.radius * 0.05, 0, Math.PI * 2);
    this.ctx.fillStyle = '#000000';
    this.ctx.fill();
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.stroke();

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.asciiDisc = new AsciiDiscEngine('ascii-disc-canvas', 'disc-wrapper');
});
