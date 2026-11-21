/**
 * Coastline transition between the hero and #about.
 *
 * Vanilla port of a domain-warped fbm "coastline" mask. The noise is fixed to
 * the viewport (so the edge grows in place, as if pinned, even though
 * Locomotive Scroll moves the hero with transforms), and the next section's
 * color sweeps up through the hero on an eased curve. The edge always stays
 * above the hero's bottom, so the hero/About boundary never shows as a line.
 *
 * Layers (all inside the hero's isolated stacking context):
 *   .hero-coastline      WebGL tide, below the name row and Engineer block.
 *                        Inside those "ink zones" it paints black instead of white.
 *   protected rows       white text, untouched.
 *   .hero-coastline-ink  2D copy of the tide, clipped to the ink zones, painted
 *                        white with mix-blend-mode: difference. Over the black
 *                        tide that gives a white background and dark text, so
 *                        the name, links and Engineer block stay readable.
 */
(function () {
  var canvas = document.querySelector('.hero-coastline');
  var ink = document.querySelector('.hero-coastline-ink');
  var header = document.getElementById('top');
  var next = document.getElementById('about');
  if (!canvas || !ink || !header || !next) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return; // plain cut: canvases stay hidden

  var SCALE = 7;         // noise zoom, per viewport height
  var AMPLITUDE = 0.34;  // coastline reach, fraction of viewport height
  var OCTAVES = 6;
  var SEED = 2;
  var FOAM = 0.32;       // opacity of the thin foam line ahead of the tide
  var ZONE_PAD = 14;     // px of padding around protected text

  var gl, ctx2d;
  try {
    gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true });
    ctx2d = ink.getContext('2d');
  } catch (e) { gl = null; }
  if (!gl || !ctx2d) return;

  var vsSrc = [
    'attribute vec2 position;',
    'varying vec2 vUv;',
    'void main() { vUv = position * 0.5 + 0.5; gl_Position = vec4(position, 0.0, 1.0); }'
  ].join('\n');

  var fsSrc = [
    'precision highp float;',
    'varying vec2 vUv;',
    'uniform vec2 uSize;',       // canvas css px
    'uniform float uTop;',       // canvas top, viewport px
    'uniform float uViewH;',
    'uniform float uRise;',      // mean coastline height above hero bottom, px
    'uniform float uAmp;',       // coastline amplitude, px
    'uniform float uAA;',        // edge softness, px
    'uniform float uFoam;',
    'uniform float uSeed;',
    'uniform float uScale;',
    'uniform int uOctaves;',
    'uniform vec3 uColor;',
    'uniform vec4 uZone0;',      // x0, y0, x1, y1 in canvas css px (top-left origin)
    'uniform vec4 uZone1;',
    'float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
    'float valueNoise(vec2 p) {',
    '  vec2 i = floor(p); vec2 f = fract(p);',
    '  float a = hash(i); float b = hash(i + vec2(1.0, 0.0));',
    '  float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));',
    '  vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;',
    '}',
    'float fbm(vec2 p) {',
    '  float v = 0.0; float amp = 0.5;',
    '  for (int i = 0; i < 8; i++) { if (i >= uOctaves) break; v += amp * valueNoise(p); p *= 2.02; amp *= 0.5; }',
    '  return v;',
    '}',
    'vec2 turbulence(vec2 uv, float amount) {',
    '  vec2 warp = vec2(fbm(uv + vec2(1.7, 9.2)), fbm(uv + vec2(8.3, 2.8)));',
    '  return uv + (warp - 0.5) * amount;',
    '}',
    'float boxDist(vec2 p, vec4 z) {',
    '  vec2 d = max(vec2(z.x - p.x, z.y - p.y), vec2(p.x - z.z, p.y - z.w));',
    '  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);',
    '}',
    'void main() {',
    '  vec2 px = vec2(vUv.x * uSize.x, (1.0 - vUv.y) * uSize.y);', // canvas css px, top-left origin
    '  float vy = uTop + px.y;',                                    // viewport y
    '  float h = uSize.y - px.y;',                                  // height above hero bottom
    '  vec2 nUv = vec2(px.x - uSize.x * 0.5, -vy) / uViewH * uScale + 0.5;',
    '  float amount = 320.0 / uSize.x + uSeed;',
    '  float hAmp = uAmp * 0.5;',
    '  float tide = h < uRise ? 1.0 : 0.0; float foam = 0.0;',
    '  if (uAmp > 0.0 && abs(h - uRise) < hAmp + uAA) {',
    '    float n = fbm(turbulence(nUv, amount));',
    '    float e = h + (n - 0.5) * uAmp;',
    '    tide = 1.0 - smoothstep(uRise - uAA, uRise + uAA, e);',
    '  }',
    '  float fr = uRise + uViewH * 0.018;',
    '  if (uFoam > 0.0 && uAmp > 0.0 && abs(h - fr) < hAmp + uAA) {',
    '    float n2 = fbm(turbulence(nUv * 1.6 + 3.1, amount));',
    '    float e2 = h + (n2 - 0.5) * uAmp * 0.55 + (fbm(turbulence(nUv, amount)) - 0.5) * uAmp * 0.45;',
    '    foam = (1.0 - smoothstep(fr - uAA * 2.0, fr + uAA * 2.0, e2)) * uFoam;',
    '  } else if (h < fr) { foam = uFoam; }',
    '  float dz = min(boxDist(px, uZone0), boxDist(px, uZone1));',
    '  if (dz <= 0.0) {',
    // ink zone: hard black tide; the ink layer above turns it white and the text dark
    '    float m = step(0.5, tide);',
    '    gl_FragColor = vec4(0.0, 0.0, 0.0, m);',
    '  } else {',
    '    float a = max(tide, foam * smoothstep(0.0, 48.0, dz));',
    '    gl_FragColor = vec4(uColor * a, a);',
    '  }',
    '}'
  ].join('\n');

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader compile failed');
    return s;
  }

  var program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vsSrc));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fsSrc));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'link failed');
  } catch (err) {
    console.warn('[coastline]', err);
    return;
  }
  gl.useProgram(program);

  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var pos = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  var u = {};
  ['uSize', 'uTop', 'uViewH', 'uRise', 'uAmp', 'uAA', 'uFoam', 'uSeed', 'uScale', 'uOctaves', 'uColor', 'uZone0', 'uZone1']
    .forEach(function (k) { u[k] = gl.getUniformLocation(program, k); });

  // Bottom color = the next section's real computed background (walks up to
  // the first opaque ancestor, since #about itself is transparent).
  function readColor() {
    var el = next;
    while (el) {
      var m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
      if (m && (m.length < 4 || parseFloat(m[3]) > 0)) return [m[0] / 255, m[1] / 255, m[2] / 255];
      el = el.parentElement;
    }
    return [1, 1, 1];
  }
  var color = readColor();

  // Text that must stay readable: the name + profile links, and Engineer + stack.
  var zoneEls = [header.querySelector('.big-name .name-wrap'), header.querySelector('.hero-title-group')];
  var OFF = [-1e5, -1e5, -1e5, -1e5];

  var cssW = 1, cssH = 1, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cssW = Math.max(1, canvas.clientWidth);
    cssH = Math.max(1, canvas.clientHeight);
    canvas.width = ink.width = Math.round(cssW * dpr);
    canvas.height = ink.height = Math.round(cssH * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function smooth(t) { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); }

  var raf = 0, visible = false;
  function draw() {
    var vh = window.innerHeight || 1;
    var rect = canvas.getBoundingClientRect();
    var bottom = rect.top + cssH;
    // 0 while the hero fills the screen, 1 once its bottom edge reaches the top.
    var p = Math.min(1, Math.max(0, 1 - bottom / vh));
    var ampMax = AMPLITUDE * vh;
    var t = Math.min(1, p / 0.18);
    var amp = ampMax * (1 - Math.pow(1 - t, 3));      // edge is jagged from the first pixel of scroll
    var e = smooth(p / 0.78);                         // eased sweep, clears the screen early
    var meanY = vh - e * (vh + ampMax * 0.6);         // coastline mean, viewport y
    // Never let a dip reach the hero bottom: that is where a straight line would show.
    var rise = Math.max(amp * 0.5 + 2, bottom - meanY);
    if (p <= 0) rise = 0;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    ctx2d.setTransform(1, 0, 0, 1, 0, 0);
    ctx2d.clearRect(0, 0, ink.width, ink.height);

    if (p > 0) {
      var zones = zoneEls.map(function (el) {
        if (!el) return OFF;
        var r = el.getBoundingClientRect();
        if (!r.width) return OFF;
        return [r.left - rect.left - ZONE_PAD, r.top - rect.top - ZONE_PAD, r.right - rect.left + ZONE_PAD, r.bottom - rect.top + ZONE_PAD]
          .map(function (v) { return Math.round(v * dpr) / dpr; });
      });
      gl.uniform2f(u.uSize, cssW, cssH);
      gl.uniform1f(u.uTop, rect.top);
      gl.uniform1f(u.uViewH, vh);
      gl.uniform1f(u.uRise, rise);
      gl.uniform1f(u.uAmp, amp);
      gl.uniform1f(u.uAA, 0.75 / dpr);
      gl.uniform1f(u.uFoam, FOAM * smooth(p / 0.12));
      gl.uniform1f(u.uSeed, SEED);
      gl.uniform1f(u.uScale, SCALE);
      gl.uniform1i(u.uOctaves, OCTAVES);
      gl.uniform3fv(u.uColor, color);
      gl.uniform4fv(u.uZone0, zones[0]);
      gl.uniform4fv(u.uZone1, zones[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // Ink layer: copy the tide inside the zones only, then tint it white.
      ctx2d.globalCompositeOperation = 'source-over';
      zones.forEach(function (z) {
        if (z === OFF) return;
        var x = Math.max(0, Math.round(z[0] * dpr)), y = Math.max(0, Math.round(z[1] * dpr));
        var w = Math.min(ink.width, Math.round(z[2] * dpr)) - x, h = Math.min(ink.height, Math.round(z[3] * dpr)) - y;
        if (w > 0 && h > 0) ctx2d.drawImage(canvas, x, y, w, h, x, y, w, h);
      });
      ctx2d.globalCompositeOperation = 'source-in';
      ctx2d.fillStyle = '#fff';
      ctx2d.fillRect(0, 0, ink.width, ink.height);
      ctx2d.globalCompositeOperation = 'source-over';
    }
    if (visible) raf = requestAnimationFrame(draw);
  }

  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);
  resize();

  function stop() {
    visible = false;
    cancelAnimationFrame(raf);
    canvas.classList.remove('is-ready');
    ink.classList.remove('is-ready');
  }

  // Render only while the hero is on screen.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    }).observe(canvas);
  } else {
    visible = true;
    raf = requestAnimationFrame(draw);
  }

  canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); stop(); });
  if (reduce.addEventListener) reduce.addEventListener('change', function (e) { if (e.matches) stop(); });

  draw();
  canvas.classList.add('is-ready');
  ink.classList.add('is-ready');
})();
