# Glacier Coast — 30-second scenery demo

Open `demos/glacier-coast/` on the same static server as the game. The demo is
separate from the campaign and reuses the actual ship, movement, firing, touch
controls, sound effects, and safe-area layout from Ember Drift v0.29.0.

## Phone review

1. Hold your phone sideways and tap **Start flight**.
2. Steer with your left thumb. Hold **Fire** with your right thumb.
3. Look at the blue ice cliffs, teal sea, and continuous snowy foreground.
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
The test's `window.__coast` hook freezes or steps the demo like the existing
game's `window.__ember` hook.

Both phone layouts were checked in Chromium. Actual Android Chrome and iPhone
Safari testing remains the user's review step.

## Optional single-file review copy

```sh
node tools/export-coast-demo.mjs /workspace/artifacts/glacier-coast-demo.html
```

The export embeds the unchanged JavaScript modules using browser import maps
and Blob URLs. It needs no separate images, audio files, package manager, or
remote resources. Use a current Chrome or Safari browser. This is an optional
review artifact; normal development still serves the source files directly.
The export was checked as a single served HTML file at both phone sizes with
no external requests. Direct `file:` navigation is blocked by the managed
cloud browser, so opening the downloaded file on a physical phone is unverified.

The scene artwork is painted once at double detail and reused on replay. The
local `CoastGame` subclass provides its own scene, background, snow floor drawing,
and countdown; it never changes shared `LEVELS` or the original `Game` class.
