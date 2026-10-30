// Living light over the painted garden: a small WebGL pass that redraws the same painting
// with masked sea ripples, sun glints and slowly breathing clouds. The <img> stays underneath,
// so if WebGL is missing or anything fails, the page simply shows the still painting.
const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = p * .5 + .5; v.y = 1. - v.y; gl_Position = vec4(p, 0., 1.); }`;
const FRAG = `precision mediump float;
uniform sampler2D art; uniform sampler2D mask; uniform vec2 cover; uniform float time; uniform float warmth; uniform float night; uniform float grade;
uniform vec2 sun; uniform vec2 lantern; uniform vec2 par; uniform float ia;
varying vec2 v;
float hash(vec2 q){ return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec2 uv = (v - .5) * cover + .5;               // object-fit: cover, centred
  // 2.5D: shift each painted plane by its depth (B channel), refined with a second lookup.
  float d = texture2D(mask, uv).b;
  d = texture2D(mask, uv + par * (d - .4) * .018).b;
  uv = clamp(uv + par * (d - .4) * .018, .001, .999);
  vec4 m = texture2D(mask, uv);
  float sea = m.r, sky = m.g;
  float depth = clamp((uv.y - .25) * 3., .2, 1.);
  vec2 off = vec2(sin(uv.y * 520. * (1.6 - depth) + time * 1.3) * .0011,
                  sin(uv.x * 90. + time * .9 + uv.y * 40.) * .0006) * sea * depth;
  off.x += sky * sin(time * .11 + uv.y * 6.) * .0022;
  vec3 c = texture2D(art, uv + off).rgb;
  float lum = dot(c, vec3(.299, .587, .114));
  vec2 asp = vec2(ia, 1.);                        // image-space circles
  float halo = exp(-distance(uv * asp, sun * asp) * 6.);
  // Golden hour -> sunset warmth.
  c = mix(c, c * vec3(1.07, 1., .9) + vec3(.06, .03, 0.) * halo, warmth);
  c += vec3(1., .82, .55) * halo * (.05 + .1 * warmth) * (1. - sea * .5) * (1. - night);
  // Starry night: cool moonlit grade, the sun becomes a moon, stars in the sky, lantern glows.
  vec3 moonlit = vec3(.16, .22, .42) * lum * 1.6 + c * vec3(.18, .2, .3);
  c = mix(c, moonlit, night * .85 * grade);
  vec2 moonAt = (sun + vec2(.03, -.09)) * asp;
  float md = distance(uv * asp, moonAt);
  float moon = smoothstep(.026, .022, md) * (1. - .25 * smoothstep(.0, .022, distance(uv * asp, moonAt + vec2(.008, -.004))));
  c += night * grade * vec3(.55, .6, .8) * exp(-md * 12.) * .35;
  c += night * grade * (vec3(.95, .93, .85) * moon + vec3(.5, .55, .7) * halo * .25);
  vec2 cell = floor(uv * vec2(180., 320.));
  float st = hash(cell); vec2 f = fract(uv * vec2(180., 320.)) - .5;
  float star = step(.985, st) * smoothstep(.22, .0, length(f)) * (.6 + .4 * sin(time * 2. + st * 60.));
  c += night * sky * star * vec3(1., .97, .9) * (1. - uv.y * 1.6);
  float ld = distance(uv * asp, lantern * asp);
  c += night * (vec3(1., .72, .38) * exp(-ld * 22.) * .8 + vec3(.22, .13, .04) * exp(-ld * 3.5));
  // Glints twinkle on bright water: gold by day, silver under the moon.
  vec2 gp = uv * vec2(260., 520.);
  vec2 gf = fract(gp) - .5;
  float tw = hash(floor(gp));
  float spark = pow(max(0., sin(time * (1.2 + tw * 2.2) + tw * 40.)), 18.) * step(.72, tw)
              * smoothstep(.5, .05, abs(gf.x)) * smoothstep(.5, .1, abs(gf.y));
  vec3 glint = mix(vec3(1., .93, .78), vec3(.8, .88, 1.), night);
  c += glint * spark * smoothstep(.52 - night * .25, .85 - night * .25, lum) * sea * (.55 - night * .3);
  gl_FragColor = vec4(c, 1.);
}`;


export function createLivingLayer(container, getOrientation, initialScene) {
  let scene = initialScene;
  const canvas = document.createElement('canvas');
  canvas.className = 'living';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false, powerPreference: 'low-power' });
  if (!gl) return null;

  const prog = gl.createProgram();
  for (const [type, src] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]]) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    gl.attachShader(prog, s);
  }
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = Object.fromEntries(['art', 'mask', 'cover', 'time', 'warmth', 'night', 'grade', 'sun', 'lantern', 'par', 'ia'].map((n) => [n, gl.getUniformLocation(prog, n)]));
  gl.uniform1i(u.art, 0); gl.uniform1i(u.mask, 1);

  const textures = [gl.createTexture(), gl.createTexture()];
  let imgSize = [1, 1];
  let orientation = null;
  let ready = false;
  let running = false;
  let warmth = 0, warmthGoal = 0, night = 0, nightGoal = 0;
  const par = [0, 0], parGoal = [0, 0];
  let lastInput = -1e9;
  let frame = 0;
  const t0 = performance.now();

  function upload(unit, image) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, textures[unit]);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  }
  const load = (src) => new Promise((res, rej) => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = rej; i.src = src; });

  // Places without a painted mask still get gentle depth: far at the top, near at the bottom.
  function fallbackMask() {
    const c = document.createElement('canvas'); c.width = 4; c.height = 64;
    const g = c.getContext('2d'); const grd = g.createLinearGradient(0, 0, 0, 64);
    grd.addColorStop(0, 'rgb(0,0,0)'); grd.addColorStop(.4, 'rgb(0,0,60)'); grd.addColorStop(1, 'rgb(0,0,230)');
    g.fillStyle = grd; g.fillRect(0, 0, 4, 64); return c;
  }

  async function setOrientation(o, force = false) {
    if (o === orientation && !force) return;
    orientation = o;
    ready = false;
    canvas.classList.remove('is-ready');
    try {
      const want = scene;
      const [art, mask] = await Promise.all([load(want.art[o]), load(want.mask[o]).catch(fallbackMask)]);
      if (o !== orientation || want !== scene) return;
      upload(0, art); upload(1, mask);
      imgSize = [art.naturalWidth, art.naturalHeight];
      ready = true;
      resize();
      draw();
      canvas.classList.add('is-ready');
    } catch (err) { console.warn('Living light layer unavailable; showing the still painting.', err); }
  }

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.round(container.clientWidth * dpr)), h = Math.max(1, Math.round(container.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    const ca = w / h, ia = imgSize[0] / imgSize[1];
    gl.uniform2f(u.cover, ca > ia ? 1 : ca / ia, ca > ia ? ia / ca : 1);
    gl.uniform1f(u.ia, ia);
  }

  function draw() {
    if (!ready) return;
    warmth += (warmthGoal - warmth) * 0.04;
    night += (nightGoal - night) * 0.035;
    const now = performance.now();
    // Idle: the view sways very slowly so the depth is felt without touching anything.
    if (now - lastInput > 4000) { const k = (now - t0) / 1000; parGoal[0] = Math.sin(k * .16) * .35; parGoal[1] = Math.sin(k * .11) * .12; }
    par[0] += (parGoal[0] - par[0]) * 0.07; par[1] += (parGoal[1] - par[1]) * 0.07;
    gl.uniform1f(u.time, (performance.now() - t0) / 1000);
    gl.uniform1f(u.warmth, warmth);
    gl.uniform1f(u.night, night);
    gl.uniform1f(u.grade, scene.paintedNight ? 0 : 1);
    gl.uniform2fv(u.par, par);
    gl.uniform2fv(u.sun, scene.sun?.[orientation] || [-1, -1]);
    gl.uniform2fv(u.lantern, scene.lantern?.[orientation] || [-1, -1]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function loop() {
    if (!running) return;
    draw();
    frame = requestAnimationFrame(loop);
  }

  (container.querySelector('picture') || container.firstChild).after(canvas);
  setOrientation(getOrientation());
  new ResizeObserver(() => { resize(); if (!running) draw(); }).observe(container);
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); running = false; canvas.remove(); });

  return {
    canvas,
    setOrientation,
    setScene(next) { scene = next; return setOrientation(getOrientation(), true); },
    play() { if (running) return; running = true; frame = requestAnimationFrame(loop); },
    pause() { running = false; cancelAnimationFrame(frame); },
    setWarmth(v) { warmthGoal = v; if (!running) { warmth = v; draw(); } },
    setNight(v) { nightGoal = v; if (!running) { night = v; draw(); } },
    // x, y in -1..1; the painting's planes shift by depth.
    setParallax(x, y) { lastInput = performance.now(); parGoal[0] = Math.max(-1, Math.min(1, x)); parGoal[1] = Math.max(-1, Math.min(1, y)); },
    get ready() { return ready; },
    get running() { return running; },
  };
}
