/**
 * 3D Disc Ribbon Carousel Engine (Transparent + ASCII Disc Loop)
 * Seamless infinite-style loop along diagonal 3D trajectory with scroll & drag inertia.
 */

document.addEventListener('DOMContentLoaded', () => {
  const ribbonContainer = document.getElementById('discs-ribbon');
  const scrollThumb = document.getElementById('scroll-thumb');
  const viewport = document.getElementById('hero-viewport');

  if (!ribbonContainer || !viewport) return;

  const NUM_DISCS = 9;

  let discsHtml = '';
  for (let i = 0; i < NUM_DISCS; i++) {
    discsHtml += `
      <div class="ribbon-disc-unit" data-index="${i}" id="ribbon-disc-${i}">
        <img src="assets/images/Transparent%20DISC.png" alt="N/P Disc Base" class="disc-unit-layer disc-unit-base" draggable="false" />
        <img src="assets/images/ASCII%20DISC.png" alt="N/P Disc ASCII" class="disc-unit-layer disc-unit-ascii" id="ascii-layer-${i}" draggable="false" />
      </div>
    `;
  }
  ribbonContainer.innerHTML = discsHtml;

  const discElements = ribbonContainer.querySelectorAll('.ribbon-disc-unit');

  const config = {
    discSpacing: Math.max(340, Math.round(window.innerWidth * 0.28)),
    slopeAngle: -18,
    rotY: -28,
    rotX: 12,
    rotZ: -10,
    depthRatio: 0.38
  };

  let progress = 4.0;
  let targetProgress = 4.0;
  let velocity = 0;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  let isPointerDown = false;
  let startPointerX = 0;
  let lastPointerX = 0;
  let startProgress = 0;

  viewport.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.hero-top-nav')) return;
    isPointerDown = true;
    startPointerX = e.clientX;
    lastPointerX = e.clientX;
    startProgress = targetProgress;
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    const deltaX = e.clientX - startPointerX;
    velocity = (lastPointerX - e.clientX) * 0.003;
    lastPointerX = e.clientX;

    const progressDelta = -deltaX / (config.discSpacing * 0.85);
    targetProgress = startProgress + progressDelta;
  });

  const endPointer = (e) => {
    if (!isPointerDown) return;
    isPointerDown = false;
    try { viewport.releasePointerCapture(e.pointerId); } catch (_) {}
    targetProgress += velocity * 14;
  };

  viewport.addEventListener('pointerup', endPointer);
  viewport.addEventListener('pointercancel', endPointer);

  window.addEventListener('wheel', (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    targetProgress += delta * 0.0022;
  }, { passive: true });

  function animate() {
    progress += (targetProgress - progress) * 0.085;

    const angleRad = config.slopeAngle * (Math.PI / 180);
    const cosAngle = Math.cos(angleRad);
    const sinAngle = Math.sin(angleRad);

    discElements.forEach((disc, i) => {
      let offset = (i - (progress % NUM_DISCS) + NUM_DISCS) % NUM_DISCS;
      if (offset > NUM_DISCS / 2) offset -= NUM_DISCS;

      const distance = offset * config.discSpacing;
      const posX = distance * cosAngle;
      const posY = distance * sinAngle;
      const posZ = -Math.abs(distance) * config.depthRatio;

      const spinAngle = (distance * 0.2) % 360;

      if (Math.abs(offset) > 3.8) {
        disc.style.display = 'none';
      } else {
        disc.style.display = 'block';
        disc.style.transform = `
          translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, ${posZ.toFixed(1)}px)
          translate(-50%, -50%)
          rotateY(${config.rotY}deg)
          rotateX(${config.rotX}deg)
          rotateZ(${(config.rotZ + spinAngle).toFixed(1)}deg)
        `;
        disc.style.zIndex = Math.round(1000 - Math.abs(offset) * 50);
        disc.style.opacity = Math.max(0.1, 1 - Math.abs(offset) * 0.25);

        const asciiLayer = document.getElementById(`ascii-layer-${i}`);
        if (asciiLayer) {
          const rect = disc.getBoundingClientRect();
          const discCenterX = rect.left + rect.width / 2;
          const discCenterY = rect.top + rect.height / 2;

          const dx = mouseX - discCenterX;
          const dy = mouseY - discCenterY;
          const dist = Math.hypot(dx, dy);
          const fieldRadius = Math.max(rect.width * 0.65, 300);

          if (dist < fieldRadius && dist > 0 && Math.abs(offset) < 1.2) {
            const force = Math.pow(1 - dist / fieldRadius, 1.4);
            const maxRepelDist = 45;
            const angle = Math.atan2(dy, dx);
            const repelX = -Math.cos(angle) * force * maxRepelDist;
            const repelY = -Math.sin(angle) * force * maxRepelDist;
            asciiLayer.style.transform = `translate3d(${repelX.toFixed(1)}px, ${repelY.toFixed(1)}px, 0)`;
          } else {
            asciiLayer.style.transform = 'translate3d(0, 0, 0)';
          }
        }
      }
    });

    if (scrollThumb) {
      const normalizedLoop = ((progress % NUM_DISCS) + NUM_DISCS) % NUM_DISCS;
      const thumbRatio = normalizedLoop / NUM_DISCS;
      const maxThumbTravel = 32;
      scrollThumb.style.transform = `translateX(${(thumbRatio * maxThumbTravel).toFixed(1)}px)`;
    }

    requestAnimationFrame(animate);
  }
  animate();
});