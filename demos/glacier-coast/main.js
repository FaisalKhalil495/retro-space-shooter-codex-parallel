import { Game } from '../../js/game.js?v=0.29.0';
import { Controls } from '../../js/controls.js?v=0.29.0';
import { Terrain } from '../../js/terrain.js?v=0.29.0';
import { readSafeArea, computeLayout } from '../../js/layout.js?v=0.29.0';
import { useDetail } from '../../js/detail.js?v=0.29.0';
import { VIEW_W, VIEW_H, PAL } from '../../js/config.js?v=0.29.0';
import { drawText } from '../../js/font.js?v=0.29.0';
import { unlockAudio, suspendAudio, setVolumes } from '../../js/audio.js?v=0.29.0';
import { setVibrate } from '../../js/feedback.js?v=0.29.0';
import { save } from '../../js/save.js?v=0.29.0';
import { CoastBackground, COAST_FLOOR, coastReady } from './coast.js?demo=2';

const DURATION = 30;
const STEP = 1 / 120;
// Local to this page: never append this scene to LEVELS or call reachLevel.
const SCENE = { number: 4, name: 'GLACIER COAST', floor: COAST_FLOOR,
  background: { sun: false, dust: false }, events: [[Number.MAX_SAFE_INTEGER, 'end']] };

class CoastGame extends Game {
  get level() { return SCENE; }
  reset() {
    super.reset();
    this.bg = this.coast || (this.coast = new CoastBackground());
    this.bg.t = 0;
    // Terrain keeps the existing floor collisions. The snow is painted by
    // the coast background instead of the normal canyon floor picture.
    this.terrain = new Terrain(COAST_FLOOR);
    this.terrain.draw = () => {};
    this.banner = null;
  }
  drawHud(ctx) {
    ctx.fillStyle = PAL.void;
    ctx.fillRect(0, 0, VIEW_W, 10);
    drawText(ctx, 'COAST DEMO', 4, 2, PAL.cream);
    drawText(ctx, String(Math.ceil(Math.max(0, DURATION - this.time))).padStart(2, '0') + 'S', 184, 2, PAL.amberLight);
  }
}

const canvas = document.getElementById('screen');
const ctx = useDetail(canvas.getContext('2d', { alpha: false }));
const game = new CoastGame();
const controls = new Controls(canvas);
const panel = document.getElementById('panel');
const heading = document.getElementById('heading');
const message = document.getElementById('message');
const action = document.getElementById('action');
const pauseButton = document.getElementById('pause');
const rotate = document.getElementById('rotate');
let mode = 'ready';
let layout;
let dpr = 1;
let last = performance.now();
let frozen = false;
let artworkReady = false;

action.disabled = true;
action.textContent = 'Loading coast…';
coastReady.then(() => {
  artworkReady = game.bg.loaded;
  action.disabled = !artworkReady;
  action.textContent = 'Start flight';
}).catch(() => {
  message.textContent = 'The coast could not load. Reload this page to try again.';
  action.textContent = 'Reload coast';
  action.disabled = false;
  action.onclick = () => location.reload();
});

// Read the user's options; never write scores, progression, or settings.
setVolumes(save.settings.music, save.settings.sound);
setVibrate(save.settings.vibrate);

function changeMode(next) {
  mode = next;
  controls.releaseAll();
  controls.enabled = next === 'playing';
  panel.hidden = next === 'playing';
  pauseButton.hidden = next !== 'playing';
  if (next === 'paused') {
    heading.textContent = 'FLIGHT PAUSED';
    message.textContent = 'Your flight will continue from here.';
    action.textContent = 'Resume flight';
  } else if (next === 'done') {
    heading.textContent = 'FLIGHT COMPLETE';
    message.textContent = 'That was Glacier Coast. Ready for another look?';
    action.textContent = 'Fly again';
  }
}

function pause() {
  if (mode === 'playing') changeMode('paused');
}

async function start() {
  if (!artworkReady || innerHeight > innerWidth || document.hidden) return;
  unlockAudio();
  if (mode !== 'paused') game.reset();
  last = performance.now();
  changeMode('playing');
  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    }
    await screen.orientation?.lock?.('landscape');
  } catch { /* The demo also works when fullscreen is unavailable. */ }
}

function resize() {
  dpr = Math.min(devicePixelRatio || 1, 3);
  canvas.width = Math.round(innerWidth * dpr);
  canvas.height = Math.round(innerHeight * dpr);
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  layout = computeLayout(innerWidth, innerHeight, readSafeArea());
  controls.releaseAll();
  controls.setLayout(layout);
  pauseButton.style.left = layout.rightZone.x + layout.rightZone.w - 48 + 'px';
  pauseButton.style.top = layout.rightZone.y + 10 + 'px';
  rotate.hidden = innerWidth >= innerHeight;
  if (!rotate.hidden) pause();
}

// Use exactly the existing ship motion, firing, world update and fixed step.
function advance(seconds, input = controls.read()) {
  if (mode !== 'playing') return;
  let remaining = Math.min(seconds, DURATION - game.time);
  while (remaining > 1e-9) {
    const dt = Math.min(STEP, remaining);
    game.update(dt, input);
    input.special = false;
    input.tap = false;
    remaining -= dt;
  }
  if (game.time >= DURATION - 1e-8) {
    game.time = DURATION;
    game.bg.t = DURATION;
    changeMode('done');
  }
}

function render(dt) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = PAL.void;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const g = layout.game;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = PAL.bezel;
  ctx.fillRect(g.x - 5, g.y - 5, g.w + 10, g.h + 10);
  const k = layout.scale * dpr;
  ctx.save();
  ctx.setTransform(k, 0, 0, k, Math.round(g.x * dpr), Math.round(g.y * dpr));
  ctx.beginPath();
  ctx.rect(0, 0, VIEW_W, VIEW_H);
  ctx.clip();
  game.draw(ctx, (v) => Math.round(v * k) / k);
  ctx.restore();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (mode === 'playing') controls.draw(ctx, dt);
  ctx.fillStyle = PAL.textDim;
  ctx.font = '10px ui-monospace, Menlo, monospace';
  ctx.fillText('COAST DEMO 2', layout.leftZone.x + 8, layout.leftZone.y + layout.leftZone.h - 8);
}

function frame(now) {
  const dt = Math.min(.25, Math.max(0, (now - last) / 1000));
  last = now;
  if (!frozen) advance(dt);
  render(dt);
  requestAnimationFrame(frame);
}

action.addEventListener('click', start);
pauseButton.addEventListener('click', pause);
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 150));
window.visualViewport?.addEventListener('resize', resize);
window.addEventListener('blur', pause);
window.addEventListener('pagehide', pause);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { pause(); suspendAudio(); }
});
for (const type of ['touchstart', 'touchmove', 'gesturestart', 'dblclick', 'contextmenu']) {
  canvas.addEventListener(type, (e) => e.cancelable && e.preventDefault(), { passive: false });
}

resize();
controls.enabled = false;
requestAnimationFrame(frame);
// Same style of test hooks as the existing game; no effect on normal play.
window.__coast = { game, controls, start, pause, advance,
  get mode() { return mode; }, get layout() { return layout; },
  get artworkReady() { return artworkReady; },
  set frozen(value) { frozen = value; } };
