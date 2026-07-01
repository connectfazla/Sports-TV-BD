/* Fluid hero background: a fullscreen shader plane (three.js) running
   domain-warped fbm noise in the trust-blue palette. The pointer drags
   a soft attractor through the field so the fluid answers the cursor.
   Communicates: the work is alive, precise and calm, not static. */
(function () {
  var canvas = document.querySelector('[data-fluid-canvas]');
  if (!canvas || typeof THREE === 'undefined') return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  var scene = new THREE.Scene();
  var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  /* Palette per theme, passed as vec3 uniforms (0..1 rgb) */
  var palettes = {
    light: {
      base: [0.965, 0.973, 0.984],   // ink-050
      mid:  [0.847, 0.902, 0.976],   // blue-100
      deep: [0.298, 0.533, 0.859]    // blue-400
    },
    dark: {
      base: [0.047, 0.071, 0.125],   // ink-900
      mid:  [0.071, 0.137, 0.278],   // blue-900
      deep: [0.184, 0.341, 0.678]    // blue-600
    }
  };

  function currentPalette() {
    var theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    return palettes[theme];
  }

  var uniforms = {
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uBase: { value: new THREE.Vector3().fromArray(currentPalette().base) },
    uMid: { value: new THREE.Vector3().fromArray(currentPalette().mid) },
    uDeep: { value: new THREE.Vector3().fromArray(currentPalette().deep) }
  };

  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: [
      'void main() {',
      '  gl_Position = vec4(position, 1.0);',
      '}'
    ].join('\n'),
    fragmentShader: [
      'precision highp float;',
      'uniform float uTime;',
      'uniform vec2 uRes;',
      'uniform vec2 uMouse;',
      'uniform vec3 uBase;',
      'uniform vec3 uMid;',
      'uniform vec3 uDeep;',

      'float hash(vec2 p) {',
      '  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);',
      '}',

      'float noise(vec2 p) {',
      '  vec2 i = floor(p);',
      '  vec2 f = fract(p);',
      '  vec2 u = f * f * (3.0 - 2.0 * f);',
      '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),',
      '             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);',
      '}',

      'float fbm(vec2 p) {',
      '  float v = 0.0;',
      '  float a = 0.5;',
      '  for (int i = 0; i < 5; i++) {',
      '    v += a * noise(p);',
      '    p = p * 2.05 + vec2(11.3, 7.7);',
      '    a *= 0.5;',
      '  }',
      '  return v;',
      '}',

      'void main() {',
      '  vec2 uv = gl_FragCoord.xy / uRes;',
      '  vec2 p = uv;',
      '  p.x *= uRes.x / uRes.y;',
      '  float t = uTime * 0.06;',

      '  vec2 m = uMouse;',
      '  m.x *= uRes.x / uRes.y;',
      '  float pull = smoothstep(0.9, 0.0, distance(p, m));',

      /* domain warping: q warps p, r warps q -> fluid folds */
      '  vec2 q = vec2(fbm(p * 1.6 + t), fbm(p * 1.6 - t * 0.7 + 4.2));',
      '  vec2 r = vec2(fbm(p * 1.6 + q * 1.8 + vec2(1.7, 9.2) + t * 0.5),',
      '                fbm(p * 1.6 + q * 1.8 + vec2(8.3, 2.8) - t * 0.4));',
      '  r += pull * 0.55 * (m - p);',
      '  float f = fbm(p * 1.6 + r * 2.2);',

      '  vec3 col = mix(uBase, uMid, smoothstep(0.15, 0.62, f));',
      '  col = mix(col, uDeep, smoothstep(0.55, 0.95, f) * 0.85);',
      '  col += uDeep * pull * 0.10;',

      /* fade toward top so nav stays readable, vignette bottom corners */
      '  float fade = smoothstep(1.0, 0.55, uv.y);',
      '  col = mix(uBase, col, 0.25 + 0.75 * fade);',

      '  gl_FragColor = vec4(col, 1.0);',
      '}'
    ].join('\n')
  });

  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  function resize() {
    var w = canvas.clientWidth || canvas.parentElement.clientWidth;
    var h = canvas.clientHeight || canvas.parentElement.clientHeight;
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(renderer.domElement.width, renderer.domElement.height);
  }
  window.addEventListener('resize', resize);
  resize();

  /* Pointer easing so the attractor trails the cursor like liquid */
  var target = { x: 0.5, y: 0.5 };
  window.addEventListener('pointermove', function (e) {
    var rect = canvas.getBoundingClientRect();
    target.x = (e.clientX - rect.left) / rect.width;
    target.y = 1.0 - (e.clientY - rect.top) / rect.height;
  });

  window.addEventListener('themechange', function () {
    var pal = currentPalette();
    uniforms.uBase.value.fromArray(pal.base);
    uniforms.uMid.value.fromArray(pal.mid);
    uniforms.uDeep.value.fromArray(pal.deep);
  });

  var clock = new THREE.Clock();
  var heroVisible = true;

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
    }).observe(canvas);
  }

  function frame() {
    requestAnimationFrame(frame);
    if (!heroVisible) return;
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uMouse.value.x += (target.x - uniforms.uMouse.value.x) * 0.04;
    uniforms.uMouse.value.y += (target.y - uniforms.uMouse.value.y) * 0.04;
    renderer.render(scene, camera);
  }

  if (reduceMotion) {
    /* One still frame, no loop */
    uniforms.uTime.value = 12.0;
    renderer.render(scene, camera);
  } else {
    frame();
  }
})();
