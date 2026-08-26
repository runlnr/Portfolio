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
    ctx.fillStyle = '#ffffff';
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
    video.src = 'assets/videos/Yellow%20Waves.mp4';
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

    const defaultConfig = {
      cellSize: 9.5,
      dotScale: 1.5,
      contrast: 1.05,
      brightness: 0.14,
      fisheyeStrength: 0.0,
      bloomStrength: 0.85,
      tvness: 1.0,
      sideBulge: 0.0,   // Straight crisp sides for letterbox banner
      vertBulge: 0.0,   // Straight top & bottom
      tvSizeX: 1.0,
      tvSizeY: 1.0,
    };

    const params = Object.assign({}, defaultConfig, window.heroTvAsciiConfig || {});
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
      uniform float u_glyph_count;
      uniform float u_time;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      vec2 coverUV(vec2 uv, vec2 src, vec2 dst) {
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
        return outUV;
      }

      vec2 fisheyeUV(vec2 uv, float strength) {
        vec2 p = uv * 2.0 - 1.0;
        float aspect = u_resolution.x / max(u_resolution.y, 1.0);
        p.x *= aspect;
        float r2 = dot(p, p);
        p *= (1.0 + strength * r2);
        p.x /= aspect;
        return p * 0.5 + 0.5;
      }

      float tvShape(vec2 p, vec2 b, float bulgeTop, float bulgeBot, float vBulgeTop, float vBulgeBot) {
        float yNorm = clamp(p.y / b.y, -1.0, 1.0);
        float bulge = mix(bulgeBot, bulgeTop, smoothstep(-1.0, 1.0, yNorm));
        float effW = b.x + bulge * (1.0 - yNorm * yNorm);

        float xNorm = clamp(p.x / b.x, -1.0, 1.0);
        float vBulge = p.y < 0.0 ? vBulgeBot : vBulgeTop;
        float effH = b.y + vBulge * (1.0 - xNorm * xNorm);

        vec2 d = abs(p) - vec2(effW, effH);
        return max(d.x, d.y);
      }

      void main() {
        vec2 frag = v_uv * u_resolution;
        vec2 cellCoord = floor(frag / u_cell);
        vec2 center = (cellCoord + 0.5) * u_cell;
        vec2 cellUV = center / u_resolution;

        // CRT barrel distortion
        cellUV = fisheyeUV(cellUV, u_fisheye_strength * u_tvness);
        cellUV = clamp(cellUV, vec2(0.001), vec2(0.999));
        vec2 videoUV = coverUV(cellUV, u_video_resolution, u_resolution);

        // TV CRT Tube Shape clipping
        vec2 tubeP = v_uv * 2.0 - 1.0;
        vec2 tvSize = vec2(u_tv_size_x, u_tv_size_y);
        float tubeDist = tvShape(tubeP, tvSize, u_side_bulge, u_side_bulge, u_vert_bulge, u_vert_bulge);
        float pxToUnits = 2.0 / min(u_resolution.x, u_resolution.y);
        float edgeFalloff = u_cell * 0.9 * pxToUnits;
        float tubeMask = 1.0 - smoothstep(0.0, edgeFalloff, tubeDist);

        // Sample video
        vec3 color = texture2D(u_video, videoUV).rgb;
        float luma = dot(color, vec3(0.299, 0.587, 0.114));
        luma = clamp((luma - 0.5) * u_contrast + 0.5 + u_brightness, 0.0, 1.0);

        // ASCII glyph selection
        float glyphIndex = floor((1.0 - luma) * (u_glyph_count - 1.0) + 0.5);
        vec2 local = (mod(frag, u_cell) - (u_cell * 0.5)) / (u_cell * 0.5 * max(u_dot_scale, 0.1));
        vec2 glyphLocal = clamp(local * 0.5 + 0.5, 0.0, 1.0);
        vec2 glyphUV = vec2((glyphIndex + glyphLocal.x) / u_glyph_count, glyphLocal.y);
        float glyphMask = texture2D(u_glyph, glyphUV).r;

        // CRT subtle phosphor background grid
        vec3 bgCharColor = vec3(0.07, 0.07, 0.07);
        vec3 activeColor = color * 1.35;
        vec3 characterColor = mix(bgCharColor, activeColor, clamp(luma * 1.5, 0.0, 1.0));

        // Scanline modulation
        float scanline = sin(frag.y * 1.2) * 0.05 + 0.95;
        vec3 asciiColor = characterColor * glyphMask * scanline;

        // Bloom
        vec3 bloom = activeColor * smoothstep(0.65, 1.0, luma) * u_bloom_strength;
        vec3 finalColor = asciiColor + bloom;

        float alpha = clamp(tubeMask, 0.0, 1.0);
        gl_FragColor = vec4(finalColor * alpha, alpha);
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
    const uGlyphCount = gl.getUniformLocation(program, 'u_glyph_count');
    const uTime = gl.getUniformLocation(program, 'u_time');

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
        gl.uniform1f(uGlyphCount, glyphChars.length);
        gl.uniform1f(uTime, performance.now() * 0.001);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      currentAnimId = requestAnimationFrame(render);
    }

    currentResizeHandler = resize;
    window.addEventListener('resize', currentResizeHandler, { passive: true });
    video.play().catch(() => {});
    render();
  }

  window.initHeroTvAscii = initHeroTvAscii;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroTvAscii);
  } else {
    initHeroTvAscii();
  }
})();
