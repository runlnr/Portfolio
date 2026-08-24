/**
 * Offgrid-Style 3D Optical Glass Slab Component
 * High-Visibility Smoky Crystal Glass with Brilliant White Edge Catches & Softbox Studio Reflections.
 */

import * as THREE from './vendor/three.module.js';

export class HeroSlash3D {
  constructor(canvasId, containerId) {
    this.canvas = document.getElementById(canvasId);
    this.container = document.getElementById(containerId) || document.body;
    if (!this.canvas) return;

    this.isDisposed = false;
    this.animationFrameId = null;

    // Mouse tracking state
    this.targetTiltX = 0;
    this.targetTiltY = 0;
    this.currentTiltX = 0;
    this.currentTiltY = 0;

    this.init();
  }

  init() {
    // 1. Scene & Camera
    this.scene = new THREE.Scene();

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 360);

    // 2. High-Performance WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.6;

    // 3. High-Contrast Studio Environment Map for Specular Reflections
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    
    // Top High-Key Softbox (Creates bright top cap reflection)
    const topLightGeo = new THREE.PlaneGeometry(400, 300);
    const topLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const topLight = new THREE.Mesh(topLightGeo, topLightMat);
    topLight.position.set(0, 240, 140);
    topLight.lookAt(0, 0, 0);
    envScene.add(topLight);

    // Bottom High-Key Softbox (Creates bright bottom cap reflection)
    const btmLight = new THREE.Mesh(topLightGeo, topLightMat);
    btmLight.position.set(0, -240, 140);
    btmLight.lookAt(0, 0, 0);
    envScene.add(btmLight);

    // Left & Right Reflection Light Strips (Create bright vertical edge reflections)
    const stripGeo = new THREE.PlaneGeometry(60, 500);
    const stripMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    
    const stripL = new THREE.Mesh(stripGeo, stripMat);
    stripL.position.set(-160, 0, 160);
    stripL.lookAt(0, 0, 0);
    envScene.add(stripL);

    const stripR = new THREE.Mesh(stripGeo, stripMat);
    stripR.position.set(160, 0, 160);
    stripR.lookAt(0, 0, 0);
    envScene.add(stripR);

    // Center Front Soft Fill
    const centerFillGeo = new THREE.PlaneGeometry(300, 300);
    const centerFillMat = new THREE.MeshBasicMaterial({ color: 0x99bbdd, side: THREE.DoubleSide });
    const centerFill = new THREE.Mesh(centerFillGeo, centerFillMat);
    centerFill.position.set(0, 0, -200);
    centerFill.lookAt(0, 0, 0);
    envScene.add(centerFill);

    this.envMap = pmremGenerator.fromScene(envScene).texture;
    this.scene.environment = this.envMap;
    pmremGenerator.dispose();

    // 4. Lighting Rig
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(this.ambientLight);

    // Key Lights
    this.dirLight1 = new THREE.DirectionalLight(0xffffff, 6.0);
    this.dirLight1.position.set(80, 160, 180);
    this.scene.add(this.dirLight1);

    this.dirLight2 = new THREE.DirectionalLight(0xffffff, 5.0);
    this.dirLight2.position.set(-80, -160, 180);
    this.scene.add(this.dirLight2);

    // Point lights for sharp specular sparkle
    this.pointLight1 = new THREE.PointLight(0xffffff, 8.0, 700);
    this.pointLight1.position.set(0, 170, 130);
    this.scene.add(this.pointLight1);

    this.pointLight2 = new THREE.PointLight(0xffffff, 7.0, 700);
    this.pointLight2.position.set(0, -170, 130);
    this.scene.add(this.pointLight2);

    // 5. Extruded 3D Glass Slab Geometry
    const shape = new THREE.Shape();
    const w = 34;       // Width of glass slab
    const h = 240;      // Height of glass slab
    const slant = 70;   // Slanted angle

    shape.moveTo(-w / 2 - slant / 2, -h / 2);
    shape.lineTo(w / 2 - slant / 2, -h / 2);
    shape.lineTo(w / 2 + slant / 2, h / 2);
    shape.lineTo(-w / 2 + slant / 2, h / 2);
    shape.closePath();

    const extrudeSettings = {
      depth: 44,
      bevelEnabled: true,
      bevelThickness: 5,
      bevelSize: 4,
      bevelSegments: 8,
      curveSegments: 16
    };

    this.geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    this.geometry.center(); // Center pivot point

    // 6. High-Contrast Smoky Crystal Glass Material (Offgrid Look)
    this.material = new THREE.MeshPhysicalMaterial({
      color: 0x18181c,              // Smoky dark glass body
      emissive: 0x08080a,           // Subtle ambient visibility
      roughness: 0.04,              // Ultra-glossy
      metalness: 0.12,              // Deep reflection
      clearcoat: 1.0,               // High-gloss outer varnish
      clearcoatRoughness: 0.02,
      reflectivity: 1.0,
      specularIntensity: 3.5,
      specularColor: new THREE.Color(0xffffff),
      transparent: true,
      opacity: 0.78,                // Translucent smoky glass
      envMap: this.envMap,
      envMapIntensity: 3.2
    });

    this.slashMesh = new THREE.Mesh(this.geometry, this.material);

    // Add crisp beveled edge highlight wireframe/glow
    const edgesGeo = new THREE.EdgesGeometry(this.geometry, 28);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      linewidth: 1
    });
    this.edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    this.slashMesh.add(this.edgesMesh);

    // Initial angle matching Offgrid reference
    this.slashMesh.rotation.z = -0.15;

    // Pivot group for compound rotation and mouse parallax
    this.pivotGroup = new THREE.Group();
    this.pivotGroup.add(this.slashMesh);
    this.scene.add(this.pivotGroup);

    // 7. Bind Listeners & Start Animation
    this.onResize = this.onResize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.animate = this.animate.bind(this);

    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);

    this.animate();
  }

  onMouseMove(e) {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;

    // Smooth parallax tilt response
    this.targetTiltX = -normY * 0.35;
    this.targetTiltY = normX * 0.35;
  }

  onResize() {
    if (this.isDisposed || !this.renderer) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }

  animate() {
    if (this.isDisposed) return;

    this.animationFrameId = requestAnimationFrame(this.animate);

    // Continuous 360° rotation along Y-axis
    this.slashMesh.rotation.y += 0.012;

    // Damped mouse parallax tilt (lerp)
    this.currentTiltX += (this.targetTiltX - this.currentTiltX) * 0.06;
    this.currentTiltY += (this.targetTiltY - this.currentTiltY) * 0.06;

    this.pivotGroup.rotation.x = this.currentTiltX;
    this.pivotGroup.rotation.y = this.currentTiltY * 0.5;

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.isDisposed = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);

    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
    if (this.envMap) this.envMap.dispose();
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }

    while (this.scene.children.length > 0) {
      const obj = this.scene.children[0];
      this.scene.remove(obj);
    }
  }
}

// Auto-initialize when mounted
document.addEventListener('DOMContentLoaded', () => {
  window.heroSlash3D = new HeroSlash3D('hero-slash-canvas', 'hero-viewport');
});
