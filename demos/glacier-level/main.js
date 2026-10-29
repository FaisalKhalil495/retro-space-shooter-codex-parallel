import { Controls } from '../../js/controls.js?v=0.29.0';
import { readSafeArea, computeLayout } from '../../js/layout.js?v=0.29.0';
import { useDetail } from '../../js/detail.js?v=0.29.0';
import { VIEW_W, VIEW_H, PAL } from '../../js/config.js?v=0.29.0';
import { unlockAudio, suspendAudio, setVolumes } from '../../js/audio.js?v=0.29.0';
import { setVibrate } from '../../js/feedback.js?v=0.29.0';
import { save } from '../../js/save.js?v=0.29.0';
import { MissionGame, battleReady } from './scene.js?mission=5';

const STEP = 1 / 120;
const canvas = document.getElementById('screen');
const ctx = useDetail(canvas.getContext('2d', { alpha: false }));
const game = new MissionGame();
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

const restart = document.getElementById('restart');
const checkpoint = document.getElementById('checkpoint');
message.textContent = 'Loading the icy battlefield…';
battleReady.then(() => {
  if (!game.bg.loaded) throw new Error('Landscape painting failed');
  artworkReady = true; action.disabled = false;
  message.textContent = 'Three minutes of invader formations, then Breakwater. Groups of three to five attack together. Steer left and hold Fire on the right. Shoot supply pods for weapons and power-ups. Your remaining health and equipment carry into the boss fight.';
}).catch(() => {
  message.textContent = 'The battlefield could not load. Reload this page to try again.';
  action.disabled = false; action.textContent = 'Reload battlefield';
  action.onclick = () => location.reload();
});

// Read the user's options; never write scores, progression, or settings.
setVolumes(save.settings.music, save.settings.sound);
setVibrate(save.settings.vibrate);

function changeMode(next) {
  mode = next;
  controls.releaseAll(); controls.enabled = next === 'playing';
  panel.hidden = next === 'playing'; pauseButton.hidden = next !== 'playing';
  action.hidden = next === 'playing'; restart.hidden = next !== 'paused';
  checkpoint.hidden = next !== 'lost' || !game.reachedBoss;
  if (next === 'paused') {
    heading.textContent = 'MISSION PAUSED'; message.textContent = game.boss?'Breakwater · Phase '+game.boss.phase:'Wave '+Math.min(3,Math.floor(game.runner.t/60)+1)+' · '+Math.floor(game.runner.t)+' seconds';
    action.textContent = 'Resume mission';
  } else if (next === 'won' || next === 'lost') {
    heading.textContent = next === 'won' ? 'COAST SECURED' : 'TRY AGAIN';
    message.textContent = 'Score '+game.score+' · '+Math.round(game.time)+' seconds';
    action.textContent = 'Replay whole mission';
  }
}
function pause() { if (mode === 'playing') changeMode('paused'); }
async function start(replay=false,bossRetry=false) {
  if (!artworkReady || innerHeight > innerWidth || document.hidden) return;
  unlockAudio();
  if (bossRetry) { if (!game.retryBoss()) return; }
  else if (replay || mode !== 'paused') game.reset();
  last = performance.now(); changeMode('playing');
  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen)
      await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    await screen.orientation?.lock?.('landscape');
  } catch { /* Native fullscreen is optional. */ }
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
  let remaining = seconds;
  while (remaining > 1e-9) {
    const dt = Math.min(STEP, remaining);
    game.update(dt, input); input.special=false; input.tap=false;remaining-=dt;
    if(game.state==='gameover'){changeMode('lost');return;}
    if(game.state==='clear'){changeMode('won');return;}
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
  ctx.fillText('LEVEL 4 PREVIEW 5', layout.leftZone.x + 8, layout.leftZone.y + layout.leftZone.h - 8);
}

function frame(now) {
  const dt = Math.min(.25, Math.max(0, (now - last) / 1000));
  last = now;
  if (!frozen) advance(dt);
  render(dt);
  requestAnimationFrame(frame);
}

action.addEventListener('click', () => start());
restart.addEventListener('click',()=>start(true));
checkpoint.addEventListener('click',()=>start(false,true));
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
window.__mission = { game, controls, start, pause, advance,
  get mode() { return mode; }, get layout() { return layout; },
  get artworkReady() { return artworkReady; },
  set frozen(value) { frozen = value; } };
