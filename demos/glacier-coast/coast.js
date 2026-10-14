import { VIEW_W, VIEW_H } from '../../js/config.js?v=0.29.0';
import { detailCanvas, FINE, grit } from '../../js/detail.js?v=0.29.0';
import { seeded, fillDisc } from '../../js/util.js?v=0.29.0';
import { GROUND_SPEED } from '../../js/terrain.js?v=0.29.0';

export const COAST_FLOOR = 14;
const WIDTH = 832; // More than the entire 30-second foreground journey.
const FLOOR_Y = VIEW_H - COAST_FLOOR;

// All scenery is painted once at the same double detail as the game. Draw
// whole strips each frame; never repaint cliffs, snow, or gradients in flight.
function paint(w, h, fn) {
  const { canvas, ctx } = detailCanvas(w, h);
  fn(ctx);
  return canvas;
}

function sky() {
  return paint(VIEW_W, VIEW_H, (c) => {
    for (let y = 0; y < VIEW_H; y += FINE) {
      const k = Math.min(1, y / 90);
      c.fillStyle = `rgb(${Math.round(145 + 59 * k)}, ${Math.round(174 + 44 * k)}, ${Math.round(191 + 29 * k)})`;
      c.fillRect(0, y, VIEW_W, FINE);
    }
    c.fillStyle = '#ede4c8';
    fillDisc(c, 158, 29, 8);
    c.fillStyle = '#f1ead7';
    fillDisc(c, 156.5, 27.5, 5.5);
  });
}

function clouds() {
  const r = seeded(401);
  return paint(WIDTH, 30, (c) => {
    for (let x = 8; x < WIDTH - 40; x += 48 + Math.floor(r() * 38)) {
      const y = 3 + Math.floor(r() * 15);
      c.fillStyle = '#c6d5d8';
      c.fillRect(x, y + 4, 26, 2);
      c.fillStyle = '#dbe1da';
      fillDisc(c, x + 8, y + 3, 3);
      fillDisc(c, x + 14, y + 2, 4);
      fillDisc(c, x + 20, y + 3.5, 2.5);
      c.fillRect(x + 2, y + 3, 23, 2);
    }
  });
}

function mountains() {
  const r = seeded(402);
  return paint(WIDTH, 46, (c) => {
    for (let x = -16; x < WIDTH; x += 27) {
      const h = 14 + r() * 29;
      c.fillStyle = '#8cabbc';
      c.beginPath();
      c.moveTo(x - 18, 46);
      c.lineTo(x + 9, 46 - h);
      c.lineTo(x + 40, 46);
      c.fill();
      c.fillStyle = '#c7d7dc';
      c.beginPath();
      c.moveTo(x + 9, 46 - h);
      c.lineTo(x + 3, 46 - h + 13);
      c.lineTo(x + 8, 46 - h + 10);
      c.lineTo(x + 14, 46 - h + 15);
      c.lineTo(x + 12, 46 - h + 5);
      c.fill();
    }
  });
}

function sea() {
  const r = seeded(403);
  return paint(WIDTH, 43, (c) => {
    c.fillStyle = '#648690';
    c.fillRect(0, 0, WIDTH, 43);
    c.fillStyle = '#526f7c';
    c.fillRect(0, 12, WIDTH, 31);
    c.fillStyle = '#3f606d';
    c.fillRect(0, 29, WIDTH, 14);
    for (let i = 0; i < 260; i++) {
      const x = Math.floor(r() * WIDTH);
      const y = Math.floor(r() * 43);
      c.fillStyle = i % 4 ? '#86a1aa' : '#bccdd0';
      c.fillRect(x, y, 1 + Math.floor(r() * 7), FINE);
    }
  });
}

function cliffs(seed, h, near) {
  const r = seeded(seed);
  return paint(WIDTH, h, (c) => {
    // Groups of vertical glacier faces, separated by views over the sea.
    for (let x = 0; x < WIDTH - 55; x += 60 + Math.floor(r() * 49)) {
      const width = 34 + Math.floor(r() * 36);
      const top = 4 + Math.floor(r() * (h * .3));
      const ridges = Array.from({ length: width + 1 }, () => Math.floor(r() * 3));
      for (let xx = 0; xx < width; xx += FINE) {
        const edge = Math.min(xx, width - xx);
        const y0 = top + Math.max(0, 4 - edge) + ridges[Math.floor(xx / 3)];
        const foot = h - Math.max(0, 3 - edge) - (Math.floor(xx) % 9 === 0 ? 1 : 0);
        c.fillStyle = xx > width - 7 ? (near ? '#627f99' : '#819fb1') : (near ? '#8eafc1' : '#a5c0cc');
        c.fillRect(x + xx, y0 + 3, FINE, foot - y0 - 3);
        c.fillStyle = '#e8e5dc';
        c.fillRect(x + xx, y0, FINE, 2);
        c.fillStyle = '#c6d5db';
        c.fillRect(x + xx, y0 + 2, FINE, 1.5 + ridges[Math.floor(xx / 4)]);
        for (let yy = y0 + 5; yy < foot; yy += FINE) {
          const fold = Math.sin((xx + yy * .15) * 1.7);
          const g = grit(Math.round((x + xx) * 2), Math.round(yy * 2), seed);
          if (fold > .55 || g < .045) {
            c.fillStyle = near ? '#b2cbd5' : '#c0d4dc';
            c.fillRect(x + xx, yy, FINE, FINE);
          } else if (fold < -.82) {
            c.fillStyle = near ? '#7899af' : '#93b0c1';
            c.fillRect(x + xx, yy, FINE, FINE);
          }
        }
      }
      // Broken snow ledges and stepped blue facets instead of rectangular
      // pillars; sparse dark cracks read as ice rather than architecture.
      for (let xx = 7; xx < width - 5; xx += 12) {
        c.fillStyle = near ? '#607f99' : '#819fb4';
        const yy = top + 6 + Math.floor(r() * 5);
        c.fillRect(x + xx, yy, FINE, Math.max(2, h - yy - 3));
        c.fillStyle = '#dbe1de';
        c.fillRect(x + xx - 2, top + 1, 4, 2);
      }
    }
  });
}

function snow() {
  return paint(WIDTH, COAST_FLOOR, (c) => {
    c.fillStyle = '#dcded7';
    c.fillRect(0, 0, WIDTH, COAST_FLOOR);
    c.fillStyle = '#f0e9d9';
    c.fillRect(0, 0, WIDTH, 2);
    // Stones and wind-carved shadows stay below the solid ground line.
    for (let x = 0; x < WIDTH; x += FINE) {
      for (let y = 3; y < COAST_FLOOR; y += FINE) {
        const g = grit(x * 2, y * 2, 404);
        if (g < .08) {
          c.fillStyle = y > 9 ? '#a5b7c0' : '#c2ccd0';
          c.fillRect(x, y, FINE, FINE);
        }
      }
    }
    for (let x = 20; x < WIDTH; x += 58) {
      c.fillStyle = '#9cafba';
      c.fillRect(x, 9, 12, 1);
      c.fillStyle = '#667e8b';
      c.fillRect(x + 8, 7.5, 2.5, 2);
      c.fillStyle = '#efe8d8';
      c.fillRect(x + 8, 7, 2, FINE);
    }
  });
}

export class CoastBackground {
  constructor() {
    this.t = 0;
    this.sky = sky();
    this.layers = [
      { image: clouds(), y: 18, speed: 1 },
      { image: mountains(), y: 47, speed: 2 },
      { image: sea(), y: 87, speed: 4 },
      { image: cliffs(405, 38, false), y: 65, speed: 6 },
      { image: cliffs(406, 27, true), y: 96, speed: 11 },
      { image: snow(), y: FLOOR_Y, speed: GROUND_SPEED },
    ];
  }

  update(dt) { this.t += dt; }

  draw(ctx, snap) {
    ctx.drawImage(this.sky, 0, 0);
    for (const { image, y, speed } of this.layers) {
      const x = -snap((this.t * speed) % WIDTH);
      ctx.drawImage(image, x, y);
      // A second whole image keeps the shore continuous if the demo is replayed.
      if (x + WIDTH < VIEW_W) ctx.drawImage(image, x + WIDTH, y);
    }
  }
}
