# Glacier Coast — 30-second scenery demo

**Revision 2** replaces the first demo's simple ice blocks with a detailed
glacier valley and fjord. Look for **COAST DEMO 2** below the controls.
The user approved this location. Enemy and boss concepts are the next review
in [the visual proposal](../../docs/concepts/level-4-enemies/review.md).

Open `demos/glacier-coast/` on the same static server as the game. The demo is
separate from the campaign and reuses the actual ship, movement, firing, touch
controls, sound effects, and safe-area layout from Ember Drift v0.29.0.

## Phone review

1. Hold your phone sideways and tap **Start flight**.
2. Steer with your left thumb. Hold **Fire** with your right thumb.
3. Look at the layered peaks, deep glacier cracks, fractured ice shelves,
   floating ice, teal water and reflections, and continuous snowy foreground.
   The distant scenery should drift more slowly than the foreground.
4. Tap the pause button at the upper right, then **Resume flight**. Turning
   the phone upright or switching apps pauses the flight as well.
5. After 30 seconds, **Flight complete** appears. Tap **Fly again** to replay.

Judge the scenery, contrast, and feeling of movement. The demo adds no enemies,
boss, pickups, music, scores, or saved progress. The Special button remains the
original control; there is no special weapon equipped in this scenery flight.
The three campaign levels and their assets are unchanged.

## Development and validation

There is no installation or build step for the served demo. From the repository
root, run the existing static server or start it through `tools/serve.mjs`.
Use its current loopback address only for internal checks, not as a phone link.

```sh
# In the prepared cloud environment:
source /workspace/.cloud-onboarding/retro-space-shooter/environment.sh
node tools/coast-demo-test.mjs /tmp/ember-coast-demo
node tools/smoke-test.mjs /tmp/ember-smoke
SEED=28 node tools/level-test.mjs /tmp/ember-levels
```

Create the screenshot directories before running the existing smoke/level
scripts. The demo test creates its own output directory. Run suites sequentially.
The new suite checks actual simultaneous touches, terrain bounds, visual
scrolling, 30-second completion, pauses, orientation, replay, zero save writes,
no music fetches, and a three-level campaign. It also runs a real-time flight.
It independently compares the hero, engine flame, and bullet pixels with the
original renderer and checks unchanged firing emission. All 35 demo checks,
49 smoke checks, and 35 seeded playthrough checks passed for revision 2.
The test's `window.__coast` hook freezes or steps the demo like the existing
game's `window.__ember` hook.

The existing five-scene drawing benchmark completed. A same-machine comparison
of 120 background draws (median of five alternating samples) measured about
777 ms for the first demo and 633 ms for revision 2. This is a cloud-browser
comparison, not a measured phone frame rate; physical-device review is still
needed.

Both phone layouts were checked in Chromium. Actual Android Chrome and iPhone
Safari testing remains the user's review step.

## Optional single-file review copy

```sh
node tools/export-coast-demo.mjs /workspace/artifacts/glacier-coast-demo-v2.html
```

The export embeds the JavaScript modules using browser import maps and Blob
URLs, and embeds the landscape PNG as a data URL. It needs no separate images,
audio files, package manager, or remote resources. Use a current Chrome or
Safari browser. This is an optional
review artifact; normal development still serves the source files directly.
The export was checked as a single served HTML file at both phone sizes with
no external requests. Direct `file:` navigation is blocked by the managed
cloud browser, so opening the downloaded file on a physical phone is unverified.

The original generated landscape is resampled once at double detail. Water
shimmer and foreground snow are prepainted and reused on replay. The source
PNG, exact prompt, reference image, hash, and generation record are in
`assets/`; the painting contains no ships or bullets. The original game draws
the hero, engine flame, and shots above it. The local `CoastGame` subclass
provides its own scene, background, snow floor drawing, and countdown; it never
changes shared `LEVELS` or the original `Game` class.
