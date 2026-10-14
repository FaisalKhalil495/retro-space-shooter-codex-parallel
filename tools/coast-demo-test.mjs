// Tests the separate scenery demo without registering Level 4 in the game.
// PLAYWRIGHT_PATH follows the same convention as smoke-test.mjs.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { serve } from './serve.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const out = process.argv[2] || join(tmpdir(), 'ember-coast-demo');
await mkdir(out, { recursive: true });
const { server, base } = await serve();
let browser;
let checks = 0;
const check = (name, ok) => { assert.ok(ok, name); checks++; console.log('PASS  ' + name); };
const fixture = JSON.stringify({ reached: 3, finished: true, lastName: 'TEST',
  scores: [{ name: 'TEST', score: 7654, level: 3 }],
  settings: { music: 2, sound: 3, vibrate: false, blood: false } });

try {
  browser = await chromium.launch();
  for (const phone of [
    { name: 'android', width: 915, height: 412, dpr: 2.625, query: '' },
    { name: 'iphone', width: 874, height: 402, dpr: 3, query: '?safe=62' },
  ]) {
    const context = await browser.newContext({ viewport: { width: phone.width, height: phone.height },
      deviceScaleFactor: phone.dpr, isMobile: true, hasTouch: true });
    await context.addInitScript((fixture) => {
      localStorage.setItem('emberDrift.save.v1', fixture);
      const set = Storage.prototype.setItem;
      window.__writes = [];
      Storage.prototype.setItem = function (key, value) { window.__writes.push(key); return set.call(this, key, value); };
    }, fixture);
    const page = await context.newPage();
    const errors = [];
    const musicRequests = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('request', (req) => { if (/\/music\/.*\.mp3/.test(req.url())) musicRequests.push(req.url()); });
    await page.goto(base + 'demos/glacier-coast/' + phone.query);
    await page.waitForFunction(() => window.__coast);
    await page.evaluate(() => { window.__coast.frozen = true; });
    const tapButton = async (selector) => {
      const box = await page.locator(selector).boundingBox();
      assert.ok(box, selector + ' visible');
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    };
    check(phone.name + ': ready, waiting for a real start tap', await page.evaluate(() => window.__coast.mode === 'ready' && window.__coast.game.time === 0));
    await tapButton('#action');
    await page.waitForFunction(() => window.__coast.mode === 'playing');
    await page.evaluate(() => window.__coast.advance(.8));
    const L = await page.evaluate(() => window.__coast.layout);
    check(phone.name + ': existing layout respects safe areas', L.game.x >= (phone.query ? 62 : 0) && L.rightZone.x + L.rightZone.w <= phone.width - (phone.query ? 62 : 0));
    const cdp = await context.newCDPSession(page);
    const touch = (type, points) => cdp.send('Input.dispatchTouchEvent', {
      type, touchPoints: points.map(([x, y, id]) => ({ x, y, id })) });
    const fire = await page.evaluate(() => window.__coast.controls.buttons.fire);
    const pad = [L.leftZone.x + L.leftZone.w / 2, L.leftZone.y + L.leftZone.h * .6];
    const before = await page.evaluate(() => ({ x: window.__coast.game.player.x, y: window.__coast.game.player.y }));
    await touch('touchStart', [[...pad, 1], [fire.x, fire.y, 2]]);
    await touch('touchMove', [[pad[0] + 32, pad[1] - 32, 1], [fire.x, fire.y, 2]]);
    const movement = await page.evaluate(() => {
      const demo = window.__coast;
      demo.advance(.3);
      return { x: demo.game.player.x, y: demo.game.player.y, bullets: demo.game.bullets.length, dir: demo.controls.pad.dir };
    });
    check(phone.name + ': real simultaneous thumbs steer diagonally and fire', movement.x > before.x + 5 && movement.y < before.y - 5 && movement.bullets > 0 && movement.dir === 7);
    await touch('touchEnd', []);
    check(phone.name + ': release clears both thumbs', await page.evaluate(() => !window.__coast.controls.pad.active && !window.__coast.controls.buttons.fire.held));
    // Sample only the coastal scenery, excluding the timer, ship and controls:
    // a frozen backdrop must fail even if the HUD and engine flame animate.
    const pixels = () => page.evaluate(() => {
      const { game: world, scale } = window.__coast.layout;
      const dpr = Math.min(devicePixelRatio, 3);
      const data = document.getElementById('screen').getContext('2d').getImageData(
        Math.round(world.x * dpr), Math.round((world.y + 96 * scale) * dpr),
        Math.floor(208 * scale * dpr), Math.floor(30 * scale * dpr)).data;
      let hash = 0;
      for (const value of data) hash = (Math.imul(hash, 31) + value) | 0;
      return hash;
    });
    const sceneBefore = await pixels();
    await page.evaluate(() => window.__coast.advance(8.9)); // ten seconds total
    await page.waitForTimeout(100);
    check(phone.name + ': scenery changes as the coast scrolls', sceneBefore !== await pixels());
    await page.screenshot({ path: join(out, phone.name + '-coast.png') });
    const scene = await page.evaluate(() => {
      const { game } = window.__coast;
      return { t: game.time, background: game.bg.t, sharp: game.bg.layers.every((l) => l.image.hi && l.image.hi.width === l.image.width * 2),
        enemies: game.enemies.length, boss: game.boss, pickups: game.pickups.length, floor: game.terrain.floor };
    });
    check(phone.name + ': double-detail scenery, snow floor, no enemies or pickups', scene.sharp && scene.floor === 14 && scene.enemies === 0 && !scene.boss && scene.pickups === 0);
    await tapButton('#pause');
    await page.evaluate(() => window.__coast.advance(5));
    check(phone.name + ': pausing stops the flight and scenery', await page.evaluate((time) => window.__coast.mode === 'paused' && window.__coast.game.time === time && window.__coast.game.bg.t === time, scene.t));
    await tapButton('#action');
    await page.evaluate(() => window.__coast.advance(4, { dx: 0, dy: 1, fire: false }));
    check(phone.name + ': original ground boundary keeps the ship above snow', await page.evaluate(() => {
      const g = window.__coast.game; return g.player.y + g.player.h < g.terrain.floorY && g.health === 5 && g.lives === 3;
    }));
    await page.setViewportSize({ width: 412, height: 915 });
    await page.waitForFunction(() => !document.getElementById('rotate').hidden);
    check(phone.name + ': portrait pauses and asks for landscape', await page.evaluate(() => window.__coast.mode === 'paused'));
    await page.setViewportSize({ width: phone.width, height: phone.height });
    await page.waitForFunction(() => document.getElementById('rotate').hidden);
    await tapButton('#action');
    await page.evaluate(() => window.__coast.advance(29.9 - window.__coast.game.time));
    check(phone.name + ': still running before 30 seconds', await page.evaluate(() => window.__coast.mode === 'playing' && window.__coast.game.time < 30));
    await page.evaluate(() => window.__coast.advance(1));
    check(phone.name + ': completes at exactly 30 seconds', await page.evaluate(() => window.__coast.mode === 'done' && window.__coast.game.time === 30 && window.__coast.game.bg.t === 30 && !window.__coast.controls.enabled));
    await page.evaluate(() => window.__coast.advance(10));
    check(phone.name + ': completed flight stays frozen', await page.evaluate(() => window.__coast.game.time === 30 && window.__coast.game.bg.t === 30));
    await page.screenshot({ path: join(out, phone.name + '-complete.png') });
    await tapButton('#action');
    check(phone.name + ': replay resets the flight and scenery', await page.evaluate(() => window.__coast.mode === 'playing' && window.__coast.game.time === 0 && window.__coast.game.bg.t === 0));
    const preserved = await page.evaluate(async () => {
      const { LEVELS } = await import('/js/levels.js?v=0.29.0');
      const { musicPlaying } = await import('/js/music.js?v=0.29.0');
      return { raw: localStorage.getItem('emberDrift.save.v1'), writes: window.__writes, levels: LEVELS.length, music: musicPlaying() };
    });
    check(phone.name + ': saves untouched, campaign still three levels, no music loaded', preserved.raw === fixture && preserved.writes.length === 0 && preserved.levels === 3 && !preserved.music && musicRequests.length === 0);
    check(phone.name + ': no script or browser errors', errors.length === 0);
    await context.close();
  }
  // Exercise the actual clock as well as deterministic fixed-step checks.
  const context = await browser.newContext({ viewport: { width: 915, height: 412 } });
  const page = await context.newPage();
  await page.goto(base + 'demos/glacier-coast/');
  await page.locator('#action').click();
  await page.waitForFunction(() => window.__coast.mode === 'playing');
  const started = Date.now();
  await page.waitForFunction(() => window.__coast.mode === 'done', null, { timeout: 38000 });
  const elapsed = (Date.now() - started) / 1000;
  check('real animation clock finishes one flight in about 30 seconds', elapsed >= 28 && elapsed < 35);
  await context.close();
  console.log(`\nAll ${checks} coast demo checks passed`);
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
