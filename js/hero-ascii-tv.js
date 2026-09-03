/**
 * N/P® Hero TV ASCII Shader
 * Real-time WebGL Video-to-ASCII CRT TV Effect
 * Inspired by Revelatio Studio TV CRT frame architecture
 */

(() => {
  let currentAnimId = null;
  let currentVideo = null;
  let currentResizeHandler = null;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createProgram(gl, vsSource, fsSource) {
    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  function createGlyphAtlas(chars, glyphSize = 52, fontWeight = 700) {
    const canvas = document.createElement('canvas');
    canvas.width = chars.length * glyphSize;
    canvas.height = glyphSize;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#faf9fc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontWeight} ${Math.floor(glyphSize * 0.78)}px Menlo, Monaco, "Courier New", monospace`;
    for (let i = 0; i < chars.length; i += 1) {
      ctx.fillText(chars[i], i * glyphSize + glyphSize * 0.5, glyphSize * 0.54);
    }
    return canvas;
  }

  function initHeroTvAscii() {
    const canvas = document.getElementById('hero-tv-canvas');
    if (!canvas) return;

    if (currentAnimId) {
      cancelAnimationFrame(currentAnimId);
      currentAnimId = null;
    }
    if (currentVideo) {
      try {
        currentVideo.pause();
        currentVideo.src = '';
        currentVideo.remove();
      } catch (e) {}
      currentVideo = null;
    }
    if (currentResizeHandler) {
      window.removeEventListener('resize', currentResizeHandler);
      currentResizeHandler = null;
    }

    const video = document.createElement('video');
    video.src = 'assets/videos/Static.mp4';
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    video.style.display = 'none';
    document.body.appendChild(video);
    currentVideo = video;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
    });
    if (!gl) {
      console.warn('WebGL not supported for Hero TV ASCII');
      return;
    }

    window.heroTvAsciiConfig = window.heroTvAsciiConfig || {
      videoScale: 1,
      videoOffsetX: 0,
      videoOffsetY: 0,
      cellSize: 10,
      dotScale: 1.35,
      contrast: 0.1,
      brightness: 0.69,
      bloomStrength: 0.4,
      tvness: 0.95,
      fisheyeStrength: 0.08,
      sideBulge: 0.06,
      vertBulge: 0.06,
      tvSizeX: 2,
      tvSizeY: 2,
    };

    const defaultConfig = {
      cellSize: 10,
      dotScale: 1.35,
      contrast: 0.1,
      brightness: 0.69,
      bloomStrength: 0.4,
      tvness: 0.95,
      fisheyeStrength: 0.08,
      sideBulge: 0.06,
      vertBulge: 0.06,
      tvSizeX: 2.0,
      tvSizeY: 2.0,
      videoScale: 1.0,
      videoOffsetX: 0.0,
      videoOffsetY: 0.0,
      edgeSoftness: 0.05
    };

    let savedShaderState = {};
    try {
      const stored = localStorage.getItem('np_hero_designer_state_v6') || localStorage.getItem('np_visual_designer_state');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed) {
          Object.keys(defaultConfig).forEach(k => {
            if (parsed[k] !== undefined) savedShaderState[k] = parsed[k];
          });
        }
      }
    } catch (e) {}

    const params = Object.assign({}, defaultConfig, savedShaderState, window.heroTvAsciiConfig || {});
    window.setHeroTvAscii = function(newParams) {
      Object.assign(params, newParams);
    };
    window.getHeroTvAscii = function() {
      return { ...params };
    };

    const glyphChars = '@#W$9876543210?!abc;:+=-,._  ';
    const glyphAtlas = createGlyphAtlas(glyphChars);

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_video;
      uniform sampler2D u_glyph;
      uniform vec2 u_resolution;
      uniform vec2 u_video_resolution;
      uniform float u_cell;
      uniform float u_dot_scale;
      uniform float u_brightness;
      uniform float u_contrast;
      uniform float u_fisheye_strength;
      uniform float u_bloom_strength;
      uniform float u_tvness;
      uniform float u_side_bulge;
      uniform float u_vert_bulge;
      uniform float u_tv_size_x;
      uniform float u_tv_size_y;
      uniform float u_video_scale;
      uniform vec2 u_video_offset;
      uniform float u_glyph_count;
      uniform float u_time;
      uniform float u_edge_softness;

      vec2 coverUV(vec2 uv, vec2 src, vec2 dst, float vScale, vec2 vOffset) {
        float srcAspect = src.x / src.y;
        float dstAspect = dst.x / dst.y;
        vec2 outUV = uv;
        if (dstAspect > srcAspect) {
          float scale = srcAspect / dstAspect;
          outUV.y = uv.y * scale + (1.0 - scale) * 0.5;
        } else {
          float scale = dstAspect / srcAspect;
          outUV.x = uv.x * scale + (1.0 - scale) * 0.5;
        }
        outUV = (outUV - 0.5 - vOffset) / max(vScale, 0.05) + 0.5;
        return outUV;
      }

      vec2 crtDistortUV(vec2 uv, float sideBulge, float vertBulge, float fisheye) {
        vec2 p = uv * 2.0 - 1.0;
        float aspect = u_resolution.x / max(u_resolution.y, 1.0);
        p.x *= aspect;
        
        // CRT Barrel distortion
        p.x += p.x * (p.y * p.y) * sideBulge * 0.4;
        p.y += p.y * (p.x * p.x) * (vertBulge / max(aspect * aspect, 0.1)) * 0.4;

        float r2 = dot(p, p);
        p *= (1.0 + fisheye * r2);
        p.x /= aspect;
        return p * 0.5 + 0.5;
      }

      void main() {
        vec2 frag = v_uv * u_resolution;
        vec2 cellCoord = floor(frag / u_cell);
        vec2 center = (cellCoord + 0.5) * u_cell;
        vec2 cellUV = center / u_resolution;

        // CRT barrel distortion
        vec2 sampleUV = crtDistortUV(cellUV, u_side_bulge * u_tvness, u_vert_bulge * u_tvness, u_fisheye_strength * u_tvness);
        sampleUV = clamp(sampleUV, vec2(0.001), vec2(0.999));
        vec2 videoUV = coverUV(sampleUV, u_video_resolution, u_resolution, u_video_scale, u_video_offset);

        // Sample video
        vec3 color = texture2D(u_video, videoUV).rgb;

        // Watermark suppressor
        vec2 wmMin = vec2(0.82, 0.04);
        vec2 wmMax = vec2(0.99, 0.30);
        if (videoUV.x > wmMin.x && videoUV.x < wmMax.x && videoUV.y > wmMin.y && videoUV.y < wmMax.y) {
          vec2 cleanFloorUV = vec2(clamp(videoUV.x - 0.14, 0.65, 0.81), clamp(videoUV.y + 0.06, 0.04, 0.36));
          vec3 cleanFloorColor = texture2D(u_video, cleanFloorUV).rgb;
          vec2 wmCenter = (wmMin + wmMax) * 0.5;
          vec2 wmHalf = (wmMax - wmMin) * 0.5;
          vec2 dNorm = abs(videoUV - wmCenter) / wmHalf;
          float blend = 1.0 - smoothstep(0.60, 1.0, max(dNorm.x, dNorm.y));
          color = mix(color, cleanFloorColor, blend);
        }

        float luma = dot(color, vec3(0.299, 0.587, 0.114));
        luma = clamp((luma - 0.5) * u_contrast + 0.5 + u_brightness, 0.0, 1.0);

        // ASCII glyph selection
        float glyphIndex = floor((1.0 - luma) * (u_glyph_count - 1.0) + 0.5);
        vec2 local = (mod(frag, u_cell) - (u_cell * 0.5)) / (u_cell * 0.5 * max(u_dot_scale, 0.1));
        vec2 glyphLocal = clamp(local * 0.5 + 0.5, 0.0, 1.0);
        vec2 glyphUV = vec2((glyphIndex + glyphLocal.x) / u_glyph_count, glyphLocal.y);
        float glyphMask = texture2D(u_glyph, glyphUV).r;

        // Natural video color matching without artificial outline/stroke
        vec3 bgCharColor = vec3(0.012, 0.012, 0.012);
        vec3 activeColor = color;
        vec3 characterColor = mix(bgCharColor, activeColor, clamp(luma * 1.2, 0.0, 1.0));

        // Scanline modulation
        float scanline = sin(frag.y * 1.2) * 0.05 + 0.95;
        vec3 asciiColor = characterColor * glyphMask * scanline;

        // Bloom
        vec3 bloom = activeColor * smoothstep(0.65, 1.0, luma) * u_bloom_strength;
        vec3 finalColor = asciiColor + bloom;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const program = createProgram(gl, vs, fs);
    if (!program) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uVideo = gl.getUniformLocation(program, 'u_video');
    const uGlyph = gl.getUniformLocation(program, 'u_glyph');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uVideoResolution = gl.getUniformLocation(program, 'u_video_resolution');
    const uCell = gl.getUniformLocation(program, 'u_cell');
    const uDotScale = gl.getUniformLocation(program, 'u_dot_scale');
    const uBrightness = gl.getUniformLocation(program, 'u_brightness');
    const uContrast = gl.getUniformLocation(program, 'u_contrast');
    const uFisheyeStrength = gl.getUniformLocation(program, 'u_fisheye_strength');
    const uBloomStrength = gl.getUniformLocation(program, 'u_bloom_strength');
    const uTvness = gl.getUniformLocation(program, 'u_tvness');
    const uSideBulge = gl.getUniformLocation(program, 'u_side_bulge');
    const uVertBulge = gl.getUniformLocation(program, 'u_vert_bulge');
    const uTvSizeX = gl.getUniformLocation(program, 'u_tv_size_x');
    const uTvSizeY = gl.getUniformLocation(program, 'u_tv_size_y');
    const uVideoScale = gl.getUniformLocation(program, 'u_video_scale');
    const uVideoOffset = gl.getUniformLocation(program, 'u_video_offset');
    const uGlyphCount = gl.getUniformLocation(program, 'u_glyph_count');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uEdgeSoftness = gl.getUniformLocation(program, 'u_edge_softness');

    const videoTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, videoTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const glyphTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, glyphTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glyphAtlas);

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    }

    function render() {
      resize();

      if (video.readyState >= 2) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, videoTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        gl.uniform1i(uVideo, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, glyphTexture);
        gl.uniform1i(uGlyph, 1);

        gl.uniform2f(uVideoResolution, video.videoWidth || canvas.width, video.videoHeight || canvas.height);
        gl.uniform1f(uCell, params.cellSize * (window.devicePixelRatio || 1));
        gl.uniform1f(uDotScale, params.dotScale);
        gl.uniform1f(uBrightness, params.brightness);
        gl.uniform1f(uContrast, params.contrast);
        gl.uniform1f(uFisheyeStrength, params.fisheyeStrength);
        gl.uniform1f(uBloomStrength, params.bloomStrength);
        gl.uniform1f(uTvness, params.tvness);
        gl.uniform1f(uSideBulge, params.sideBulge);
        gl.uniform1f(uVertBulge, params.vertBulge);
        gl.uniform1f(uTvSizeX, params.tvSizeX);
        gl.uniform1f(uTvSizeY, params.tvSizeY);
        gl.uniform1f(uVideoScale, params.videoScale !== undefined ? params.videoScale : 1.0);
        gl.uniform2f(uVideoOffset, params.videoOffsetX || 0.0, params.videoOffsetY || 0.0);
        gl.uniform1f(uGlyphCount, glyphChars.length);
        gl.uniform1f(uTime, performance.now() * 0.001);
        gl.uniform1f(uEdgeSoftness, params.edgeSoftness !== undefined ? params.edgeSoftness : 0.05);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      currentAnimId = requestAnimationFrame(render);
    }

    currentResizeHandler = resize;
    window.addEventListener('resize', currentResizeHandler, { passive: true });
    video.play().catch(() => {});
    render();
  }

  function destroyHeroTvAscii() {
    if (currentAnimId) {
      cancelAnimationFrame(currentAnimId);
      currentAnimId = null;
    }
    if (currentVideo) {
      try {
        currentVideo.pause();
        currentVideo.src = '';
        currentVideo.remove();
      } catch (e) {}
      currentVideo = null;
    }
    if (currentResizeHandler) {
      window.removeEventListener('resize', currentResizeHandler);
      currentResizeHandler = null;
    }
  }

  window.initHeroTvAscii = initHeroTvAscii;
  window.destroyHeroTvAscii = destroyHeroTvAscii;

  window.addEventListener('pagehide', destroyHeroTvAscii, { once: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroTvAscii);
  } else {
    initHeroTvAscii();
  }
})();
