import { VIEW_W, VIEW_H } from '../../js/config.js?v=0.29.0';
import { detailCanvas, FINE, grit } from '../../js/detail.js?v=0.29.0';
import { GROUND_SPEED } from '../../js/terrain.js?v=0.29.0';

export const COAST_FLOOR = 14;
const FLOOR_Y = VIEW_H - COAST_FLOOR;
const WIDTH = 832;
const WORLD_W = 250;
const WORLD_H = 167;
const WORLD_Y = -12; // Show the glacier meeting water, not just the high peaks.

// Only the backdrop is an image asset. The hero, flame and bolts are still
// drawn by the unchanged Game class with the original game sprites.
const artwork = new Image();
export const coastReady = new Promise((resolve, reject) => {
  artwork.onload = resolve;
  artwork.onerror = () => reject(new Error('Glacier landscape could not be loaded'));
});
artwork.src = globalThis.__coastEmbeddedArt || new URL('assets/glacier-world.png?demo=2', document.baseURI).href;

function paint(w, h, fn) {
  const { canvas, ctx } = detailCanvas(w, h);
  fn(ctx);
  return canvas;
}

function landscape() {
  // Resample once to the half-pixel grid, retaining the source aspect ratio.
  // A slow camera pan explores the world without repeating ice pillars.
  return paint(WORLD_W, WORLD_H, (c) => {
    c.imageSmoothingEnabled = true;
    c.imageSmoothingQuality = 'high';
    c.drawImage(artwork, 0, 0, WORLD_W, WORLD_H);
  });
}

function waterFrames(world) {
  const { data, width } = world.hi.getContext('2d').getImageData(0, 0, WORLD_W * 2, WORLD_H * 2);
  // Shimmer is clipped to actual dark teal water in the painting; pale ice
  // stays still. These eight transparent frames are also painted just once.
  return Array.from({ length: 8 }, (_, frame) => paint(WORLD_W, WORLD_H, (c) => {
    for (let y = 87; y < FLOOR_Y - WORLD_Y; y += FINE) {
      for (let x = 0; x < WORLD_W; x += FINE) {
        const i = (Math.round(y * 2) * width + Math.round(x * 2)) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const water = g > r * 1.16 && b > r * 1.12 && b < g * 1.3 && g > 45 && g < 160;
        const ripple = Math.sin(x * .4 + y * 2 + frame * Math.PI / 4);
        if (water && ripple > .92 && grit(x * 2, y * 2, 604) > .58) {
          c.fillStyle = 'rgba(193, 220, 224, .23)';
          c.fillRect(x, y, FINE, FINE);
        }
      }
    }
  }));
}

function shore() {
  return paint(WIDTH, COAST_FLOOR, (c) => {
    // Continuous snowy floor: wind-carved snow above a blue cut ice edge.
    for (let x = 0; x < WIDTH; x += FINE) {
      const drift = 5 + Math.sin(x / 18) * 1.3 + Math.sin(x / 6) * .7;
      const seam = 8 + Math.sin(x / 27) + Math.sin(x / 8) * .5;
      for (let y = 0; y < COAST_FLOOR; y += FINE) {
        const grain = grit(x * 2, y * 2, 605);
        let color = y < 1 ? '#e9eee6' : y < drift ? '#dce8e5' : y < seam ? '#b3cdd6' : '#7ba9be';
        if (y > drift && grain < .17) color = '#6592ac';
        else if (y < drift && grain > .85) color = '#edf0e5';
        else if (y > seam && grain > .82) color = '#a6c9d5';
        c.fillStyle = color;
        c.fillRect(x, y, FINE, FINE);
      }
    }
    // Cracks and shallow snow hollows stay below the true collision edge.
    for (let x = 18; x < WIDTH; x += 35) {
      const y = 4 + (Math.floor(x / 35) % 3);
      c.fillStyle = '#92b8c8';
      c.fillRect(x - 5, y, 9, FINE);
      c.fillStyle = '#4e819f';
      for (let row = 8; row < COAST_FLOOR; row += FINE) {
        c.fillRect(x + Math.floor((row - 8) / 2) * FINE, row, FINE, FINE);
      }
      c.fillStyle = '#e9eee6';
      c.fillRect(x - 4, y - FINE, 7, FINE);
    }
  });
}

export class CoastBackground {
  constructor() {
    this.t = 0;
    this.loaded = false;
    this.layers = [];
    coastReady.then(() => {
      const world = landscape();
      this.world = world;
      this.water = waterFrames(world);
      this.layers = [
        { image: world, y: WORLD_Y, speed: 1.2 },
        { image: shore(), y: FLOOR_Y, speed: GROUND_SPEED },
      ];
      this.loaded = true;
    }).catch(() => {}); // The page shows a useful load error and offers reload.
  }

  update(dt) { this.t += dt; }

  draw(ctx, snap) {
    ctx.fillStyle = '#9aafb9';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    if (!this.loaded) return;
    const camera = snap(Math.min(this.t * 1.2, WORLD_W - VIEW_W));
    ctx.drawImage(this.world, -camera, WORLD_Y);
    ctx.drawImage(this.water[Math.floor(this.t * 5) % this.water.length], -camera, WORLD_Y);
    const snow = this.layers[1].image;
    const x = -snap((this.t * GROUND_SPEED) % WIDTH);
    ctx.drawImage(snow, x, FLOOR_Y);
    if (x + WIDTH < VIEW_W) ctx.drawImage(snow, x + WIDTH, FLOOR_Y);
  }
}
