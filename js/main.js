import { settings, copy } from './content.js';
import { ui } from './experience-copy.js';
import { createLivingLayer } from './living.js';
import { chapters, availableArt, closeupUrl } from './chapters.js';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const params = new URLSearchParams(location.search);
const store = { get(key) { try { return localStorage.getItem(key); } catch { return null; } }, set(key, value) { try { localStorage.setItem(key, value); } catch {} } };
let lang = params.get('lang') || store.get('gift-lang') || settings.defaultLang;
if (!copy[lang]) lang = 'en';
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const portraitQuery = matchMedia('(max-aspect-ratio: 4/5)');
let reduceMotion = motionQuery.matches || store.get('gift-motion') === 'less';
let lastSpot = null;
let entered = false;
let enteringTimer;
let parallaxFrame;
let activeSpot = null;
let noteTrigger = null;
const visited = new Set();          // keys like 'garden:cat'
let places = [chapters[0]];
let place = chapters[0];
let closeups = new Set();
let enteredOnce = false;
let starTimer, rainTimer;   // declared early: renderPlaces runs during startup
const spotOf = (id) => place.spots.find(s => s.id === id);
const t = (key) => key.split('.').reduce((value, part) => value?.[part], copy[lang]);

function applyLanguage() {
  document.documentElement.lang = lang;
  document.title = t('title');
  $$('[data-i18n]').forEach(el => { const value = t(el.dataset.i18n); if (typeof value === 'string') el.textContent = value; });
  $$('[data-ui]').forEach(el => { el.textContent = ui[lang][el.dataset.ui]; });
  $$('.lang button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));
  $('.lang').setAttribute('aria-label', ui[lang].language);
  $('#home').setAttribute('aria-label', ui[lang].home);
  $('#hotspots').setAttribute('aria-label', ui[lang].places);
  $('.dock').setAttribute('aria-label', ui[lang].places);
  $('#time-of-day').setAttribute('aria-label', ui[lang].timeLabel);
  updateProgress();
  if (lastSpot && $('#note').open) fillNote(lastSpot);
  renderSpots();
  renderPlaces();
}
function spotText(spot, field) {
  return spot.copy === 'content' ? t(`spots.${spot.id}.${field}`) : spot.copy[lang]?.[field] ?? spot.copy.en[field];
}
function renderLetter(done) {
  const paras = t('letter').map(text => Object.assign(document.createElement('p'), { textContent: text }));
  if (done) paras.push(Object.assign(document.createElement('p'), { textContent: ui[lang].ps, className: 'ps' }));
  $('#letter-body').replaceChildren(...paras);
}
function updateProgress() {
  const all = places.flatMap(c => c.spots.filter(s => !s.letter && !s.secret).map(s => `${c.id}:${s.id}`));
  const n = all.filter(k => visited.has(k)).length;
  const secretsFound = places.flatMap(c => c.spots.filter(s => s.secret).map(s => `${c.id}:${s.id}`)).filter(k => visited.has(k)).length;
  $('#found').textContent = ui[lang].foundOf(n, all.length) + (secretsFound ? ` · ✦ ${secretsFound} ${ui[lang].secretsLabel}` : '');
  const done = n === all.length;
  $('#explore-hint').textContent = done ? ui[lang].allFound + ui[lang].allFoundSecret : ui[lang].explore;
  renderLetter(done);
  document.body.classList.toggle('all-found', done);
}
function fillNote(id) { const spot = spotOf(id); if (!spot) return; $('#note-title').textContent = spotText(spot, 'title'); $('#note-body').textContent = spotText(spot, 'body'); }
function showDialog(dialog) {
  $$('dialog[open]').forEach(other => { if (other !== dialog) other.close(); });
  if (dialog.id === 'note') dialog.show();
  else dialog.showModal();
  if (dialog.id === 'letter') $('.paper').scrollTop = 0;
}
function openSpot(spot) {
  if (spotOf(spot)?.letter) return showDialog($('#letter'));
  lastSpot = spot; visited.add(`${place.id}:${spot}`); fillNote(spot); updateProgress();
  noteTrigger = document.activeElement;
  $$(`[data-spot="${spot}"]`).forEach(el => el.classList.add('is-visited'));
  reactToScene(spot);
  showDialog($('#note'));
  $('#note [data-close]').focus({preventScroll:true});
}
function baseGeometry() {
  const image = $('#garden-art'), art = $('#artwork');
  const w = image.clientWidth, h = image.clientHeight;
  const scale = Math.max(w / (image.naturalWidth || w), h / (image.naturalHeight || h));
  const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
  return {w,h,width,height,x0:art.offsetLeft+(w-width)/2,y0:art.offsetTop+(h-height)/2};
}
function objectPositions() {
  const o = orientation();
  return Object.fromEntries(place.spots.map(s => [s.id, (s.focus || s.at)[o]]));
}
// Close-ups fade in only once decoded, so the first frame is never an empty placeholder.
async function showCloseup(url, spot) {
  const art = $('#closeup .closeup-art'), bg = $('#closeup .closeup-bg');
  if (!art.src.endsWith(url)) {
    art.src = url; bg.src = url;
    try { await art.decode(); } catch { /* still show what we have */ }
  }
  if (activeSpot === spot) document.body.classList.add('closeup-open');
}
// A little thing opens its own painted close-up (crossfade), never a zoom into the scene.
// Until a close-up painting exists, the scene simply stays as it is behind the note.
function reactToScene(spot) {
  activeSpot = spot;
  const def = spotOf(spot) || {};
  const key = `${place.id}-${spot}`;
  const hasCloseup = closeups.has(key);
  if (hasCloseup) showCloseup(closeupUrl(place.id, spot), spot);
  document.body.classList.add('scene-focused');
  document.body.classList.toggle('scene-sunset',!!def.warm);
  living?.setWarmth(def.warm?1:baseWarmth());
  $('#hotspots').inert=true; $('.garden-bottom').inert=true;
  if (!reduceMotion && def.burst) {
    let x = innerWidth/2, y = innerHeight*.45;
    if (!hasCloseup) { const geo = baseGeometry(), pos = objectPositions()[spot]; x = geo.x0+pos[0]*geo.width; y = geo.y0+pos[1]*geo.height; }
    const many = def.burst !== '♡';
    for(let i=0;i<(many?7:1);i++){
      const particle=document.createElement('span');
      particle.className=`scene-feedback${many?' petal-burst':''}`;
      particle.textContent=def.burst;
      particle.setAttribute('aria-hidden','true');
      particle.style.left=`${x+(i-3)*8}px`;
      particle.style.top=`${y}px`;
      particle.style.setProperty('--drift',`${(i-3)*17}px`);
      particle.style.animationDelay=`${.7+i*.09}s`;
      particle.style.opacity='0';
      $('#experience').append(particle);
      setTimeout(()=>particle.remove(),4300);
    }
  }
}
function resetScene() {
  activeSpot=null;
  document.body.classList.remove('scene-focused','scene-sunset','closeup-open');
  living?.setWarmth(baseWarmth());
  for(const property of ['--scene-zoom','--focus-x','--focus-y']) $('#artwork').style.removeProperty(property);
  $('#hotspots').inert=false; $('.garden-bottom').inert=false;
  $$('.scene-feedback').forEach(el=>el.remove());
  if(noteTrigger?.isConnected && !$('#garden').hidden) noteTrigger.focus({preventScroll:true});
  positionHotspots();
}
function enterGarden() {
  clearTimeout(enteringTimer);
  // The garden meets her where she is: it starts at dusk or night when she opens it in the evening.
  if (!enteredOnce) { enteredOnce = true; const h = new Date().getHours(); if (!params.has('day')) setTime(h >= 19 || h < 5 ? 'night' : h >= 17 ? 'sunset' : 'golden'); }
  $('#note').close(); resetScene();
  entered = true;
  $('#intro').inert = true;
  $('#intro').classList.add('is-leaving');
  $('#garden').hidden = false;
  document.body.classList.add('in-garden');
  positionHotspots();
  ($('.spot-letter') || $('.dock button'))?.focus({ preventScroll: true });
  enteringTimer = setTimeout(() => { $('#intro').hidden = true; }, reduceMotion ? 0 : 750);
}
function returnHome(event) {
  event?.preventDefault();
  clearTimeout(enteringTimer);
  $('#note').close(); resetScene();
  leaveQuiet();
  entered = false;
  $('#garden').hidden = true;
  $('#intro').hidden = false;
  $('#intro').inert = false;
  $('#intro').classList.remove('is-leaving');
  document.body.classList.remove('in-garden');
  $('#open-gift').focus({ preventScroll: true });
}
function setMotion(value, persist = true) {
  reduceMotion = value || motionQuery.matches;
  document.body.classList.toggle('reduce-motion', reduceMotion);
  $('#motion-btn').setAttribute('aria-pressed', String(reduceMotion));
  if (persist) store.set('gift-motion', value ? 'less' : 'normal');
  if (reduceMotion) { $('#artwork').style.removeProperty('--pan-x'); $('#artwork').style.removeProperty('--pan-y'); }
  syncLiving();
}
function quiet() {
  $$('dialog[open]').forEach(dialog => dialog.close());
  resetScene();
  document.body.classList.add('staying');
  if (document.body.classList.contains('all-found') && !reduceMotion) startRain();
  $('.topbar').inert = true; $('#garden').inert = true;
  $('#return-btn').hidden = false;
  $('#return-btn').focus({ preventScroll: true });
}
function leaveQuiet() {
  const wasQuiet = document.body.classList.contains('staying');
  document.body.classList.remove('staying');
  stopRain();
  $('.topbar').inert = false; $('#garden').inert = false;
  $('#return-btn').hidden = true;
  if (wasQuiet && entered) $('#quiet-btn').focus({ preventScroll: true });
}
// Positions are relative to the painted asset, compensated for object-fit cropping.
function positionHotspots() {
  const image = $('#garden-art');
  if (!image.naturalWidth) return;
  const {width,height,x0,y0} = baseGeometry();
  const o = orientation();
  $$('.hotspot').forEach(button => {
    const [x,y] = spotOf(button.dataset.spot).at[o];
    const targetX = x0 + x*width, targetY = y0 + y*height;
    // Offscreen objects remain available through the dock.
    const captionBottom = $('.garden-caption').getBoundingClientRect().bottom;
    const bottomTop = $('.garden-bottom').getBoundingClientRect().top;
    button.hidden = targetX < 48 || targetX > innerWidth-48 || targetY < Math.max(120, captionBottom + 24) || targetY > bottomTop - 26;
    button.style.left = `${targetX}px`; button.style.top = `${targetY}px`;
  });
  $$('.hit-region').forEach(button=>{
    const [x,y]=objectPositions()[button.dataset.spot];
    const cx=x0+x*width, cy=y0+y*height;
    // A painted object cropped out of view (wide screens crop the sides) is simply not tappable.
    button.hidden = cx < 14 || cx > innerWidth-14 || cy < 14 || cy > innerHeight-14;
    button.style.left=`${cx}px`;button.style.top=`${cy}px`;
    const [hw, hh] = spotOf(button.dataset.spot).hit || [.15, .12];
    button.style.width=`${width*hw}px`;
    button.style.height=`${height*hh}px`;
  });
}
// Hotspots, painting hit regions and dock buttons come from the current place's data.
function spotLabel(s) { return s.letter ? (place.id === 'garden' ? ui[lang].letterSpot : t('readLetter')) : spotText(s, 'label'); }
function makeButton(className, spot, icon, text) {
  const b = Object.assign(document.createElement('button'), { type: 'button', className });
  b.dataset.spot = spot.id;
  if (icon !== null) { const i = document.createElement('span'); i.setAttribute('aria-hidden', 'true'); if (icon) i.textContent = icon; else i.className = 'hotspot-dot'; b.append(i); }
  if (text !== null) { const l = document.createElement('span'); l.textContent = text; b.append(l); }
  if (visited.has(`${place.id}:${spot.id}`)) b.classList.add('is-visited');
  b.addEventListener('click', () => openSpot(spot.id));
  return b;
}
function renderSpots() {
  const hit = place.spots.map(s => { const b = makeButton('hit-region', s, null, null); b.setAttribute('aria-label', spotLabel(s)); return b; });
  const pins = place.spots.filter(s => !s.secret).map(s => makeButton('hotspot', s, '', spotLabel(s)));
  const order = place.spots.filter(s => !s.secret && !s.letter).concat(place.spots.filter(s => s.letter));
  const dock = order.map(s => makeButton(`spot-btn${s.letter ? ' spot-letter' : ''}`, s, s.icon, s.letter ? t('readLetter') : spotLabel(s)));
  $('#hotspots').replaceChildren(...hit, ...pins);
  $('.dock').replaceChildren(...dock);
  positionHotspots();
}
function renderPlaces() {
  $('#places').hidden = places.length < 2;
  const i = places.indexOf(place);
  $('#place-name').textContent = `${place.name[lang] || place.name.en} · ${i + 1}/${places.length}`;
  $('#place-prev').disabled = i === 0; $('#place-next').disabled = i === places.length - 1;
  $('#garden-title').textContent = place.id === 'garden' ? ui[lang].gardenTitle : (place.name[lang] || place.name.en);
  // On wide screens the bottom controls move aside from the place's key subjects.
  document.body.dataset.dock = place.dock || 'center';
  document.body.dataset.place = place.id;
  scheduleShootingStar();
  $('#note [data-close]').textContent = place.id === 'garden' ? ui[lang].backGarden : ui[lang].backPlace;
  requestAnimationFrame(positionHotspots);
}
// Places change by fading to the next painting.
let switching = false;
async function goPlace(step) {
  const next = places[places.indexOf(place) + step];
  if (!next || switching) return;
  switching = true;
  $('#note').close(); resetScene();
  document.body.classList.add('place-switching');
  if (!reduceMotion) await new Promise(r => setTimeout(r, 450));
  place = next;
  const img = $('#garden-art');
  const loaded = new Promise(r => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); setTimeout(r, 2500); });
  $('source', $('picture')).srcset = place.art.portrait;
  img.src = place.art.landscape;
  living?.setScene(place);
  setTime(place.night ? 'night' : timeMode === 'night' ? 'golden' : timeMode);
  $('#time-of-day').hidden = !!place.paintedNight;
  renderSpots(); renderPlaces(); updateProgress();
  await loaded;
  document.body.classList.remove('place-switching');
  switching = false;
  $('.dock button')?.focus({ preventScroll: true });
}
$('#open-gift').addEventListener('click', enterGarden);
$('#home').addEventListener('click', returnHome);
$('#place-prev').addEventListener('click', () => goPlace(-1));
$('#place-next').addEventListener('click', () => goPlace(1));
$('#note-letter').addEventListener('click', () => showDialog($('#letter')));
$('#song-btn').addEventListener('click', () => showDialog($('#song')));
$('#song-link').href = settings.songUrl;
$('#stay-btn').addEventListener('click', quiet);
$('#quiet-btn').addEventListener('click', quiet);
$('#return-btn').addEventListener('click', leaveQuiet);
$('#motion-btn').addEventListener('click', () => setMotion(!reduceMotion));
$$('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
$('#note').addEventListener('close',resetScene);
$$('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
}));
$$('[data-lang]').forEach(button => button.addEventListener('click', () => { lang = button.dataset.lang; store.set('gift-lang',lang); applyLanguage(); }));
addEventListener('keydown', event => { if (event.key !== 'Escape') return; if(document.body.classList.contains('staying')) leaveQuiet(); else if($('#note').open) $('#note').close(); });
addEventListener('resize', () => { positionHotspots(); });
portraitQuery.addEventListener('change', () => { positionHotspots(); living?.setOrientation(orientation()); });
motionQuery.addEventListener('change', () => setMotion(store.get('gift-motion') === 'less', false));
document.addEventListener('visibilitychange', () => { document.body.classList.toggle('page-hidden', document.hidden); syncLiving(); });
$('#experience').addEventListener('pointermove', event => {
  if (living?.ready && living.running && !activeSpot && !document.querySelector('dialog[open]')) {
    if (event.pointerType === 'mouse') { living.setParallax((event.clientX / innerWidth - .5) * 2, (event.clientY / innerHeight - .5) * 2); return; }
    if (drag) { living.setParallax(drag.x + (event.clientX - drag.cx) / innerWidth * 3, drag.y + (event.clientY - drag.cy) / innerHeight * 3); return; }
  }
  if (reduceMotion || activeSpot || event.pointerType !== 'mouse' || document.querySelector('dialog[open]')) return;
  cancelAnimationFrame(parallaxFrame);
  parallaxFrame = requestAnimationFrame(() => {
    $('#artwork').style.setProperty('--pan-x', `${(event.clientX / innerWidth - .5) * -5}px`);
    $('#artwork').style.setProperty('--pan-y', `${(event.clientY / innerHeight - .5) * -4}px`);
  });
});
$('#experience').addEventListener('pointerleave', () => { $('#artwork').style.removeProperty('--pan-x'); $('#artwork').style.removeProperty('--pan-y'); });
$('#garden-art').addEventListener('load', () => { $('#art-error').hidden = true; positionHotspots(); });
$('#garden-art').addEventListener('error', () => { $('#art-error').hidden = false; $('#hotspots').hidden = true; });
$('#retry-art').addEventListener('click', () => {
  const image = $('#garden-art');
  image.src = `${place.art.landscape}?retry=${Date.now()}`;
  $('source', $('picture')).srcset = `${place.art.portrait}?retry=${Date.now()}`;
  $('#hotspots').hidden = false;
});
const orientation = () => (portraitQuery.matches ? 'portrait' : 'landscape');
// Living light is an enhancement: never on in stillness mode, paused while the tab is hidden.
const living = params.has('still') ? null : createLivingLayer($('#artwork'), orientation, place);
function syncLiving() { if (!living) return; if (reduceMotion || document.hidden) living.pause(); else living.play(); }
window.__living = living;
// Time of day: golden hour (default), sunset glow, starry night.
let timeMode = 'golden';
function baseWarmth() { return timeMode === 'sunset' ? 1 : 0; }
function setTime(mode) {
  timeMode = mode;
  $$('[data-time]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.time === mode)));
  document.body.classList.toggle('time-night', mode === 'night');
  document.body.classList.toggle('time-sunset', mode === 'sunset');
  living?.setNight(mode === 'night' ? 1 : 0);
  living?.setWarmth(baseWarmth());
}
$$('[data-time]').forEach(b => b.addEventListener('click', () => setTime(b.dataset.time)));
// Touch: drag on the painting itself to look around; it eases back when released.
let drag = null;
$('#experience').addEventListener('pointerdown', event => { if (event.pointerType !== 'mouse' && !event.target.closest('button, a, dialog')) drag = { cx: event.clientX, cy: event.clientY, x: 0, y: 0 }; });
addEventListener('pointerup', () => { if (drag) { drag = null; living?.setParallax(0, 0); } });
addEventListener('pointercancel', () => { drag = null; });
if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
  addEventListener('deviceorientation', e => { if (e.gamma == null || drag || activeSpot || !living?.running) return; living.setParallax(e.gamma / 25, (e.beta - 45) / 30); });
}
setMotion(reduceMotion, false); applyLanguage(); positionHotspots();
availableArt().then(art => { places = art.places; closeups = art.closeups; renderPlaces(); updateProgress(); });
// Small surprises: fireflies at night, a shooting star under the stars, petal rain once everything is found.
(function buildFx() {
  const ff = $('.fireflies');
  for (let i = 0; i < 14; i++) {
    const f = document.createElement('i');
    f.style.cssText = `left:${6 + Math.random() * 88}%;top:${38 + Math.random() * 56}%;--dx:${(Math.random() - .5) * 90}px;--dy:${-20 - Math.random() * 60}px;animation-delay:${-Math.random() * 12}s;animation-duration:${9 + Math.random() * 9}s`;
    ff.append(f);
  }
})();
function scheduleShootingStar() {
  clearTimeout(starTimer);
  if (place.id !== 'starry-bench' || reduceMotion) return;
  starTimer = setTimeout(() => {
    if (!document.hidden && place.id === 'starry-bench' && !document.body.classList.contains('closeup-open')) {
      const s = $('.shoot');
      s.style.setProperty('--y', `${6 + Math.random() * 18}%`);
      s.classList.remove('go'); void s.offsetWidth; s.classList.add('go');
    }
    scheduleShootingStar();
  }, 7000 + Math.random() * 7000);
}
function startRain() {
  const rain = $('.rain');
  rain.replaceChildren();
  rainTimer = setInterval(() => {
    const p = document.createElement('i');
    p.style.cssText = `left:${Math.random() * 100}%;--sway:${(Math.random() - .5) * 120}px;animation-duration:${9 + Math.random() * 6}s;width:${6 + Math.random() * 6}px;height:${9 + Math.random() * 7}px`;
    rain.append(p);
    setTimeout(() => p.remove(), 16000);
  }, 650);
}
function stopRain() { clearInterval(rainTimer); $('.rain').replaceChildren(); }
window.__gardenVersion = 'anime-2d-v3-surprises';
