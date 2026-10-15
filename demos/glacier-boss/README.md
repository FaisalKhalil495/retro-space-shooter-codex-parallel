# Breakwater — separate boss preview, revision 2

The owner rejected revision 1's boxy design, weak fight and small death effect.
They selected **a sharp armored icebreaker with a huge split bow cannon**.
This revision implements that feedback within the approved separate preview.
Look for **BREAKWATER 2** below the left controls. Campaign Level 4 and new
music remain separate stages; the main game remains v0.29.0 with three levels.

## Phone review

1. Hold the phone sideways and tap **Start boss fight**. Hold Fire and steer
   with the original pad. You start with five health blocks, three lives and
   the normal gun; no extra test weapon or invulnerability.
2. Hit the forward cannon chamber when the prow splits open. Ordinary and
   special weapons both respect closed armor. Fire back during a cannon sweep
   if you can keep clear of it; collect the original adaptive supplies.
3. Move again when a broadside re-aims. Its next dotted direction locks before
   firing. For the sweeping beam, leave the slice between its two guide lines.
   For the flak barrage, fly between the two pale gap guides. Fly above a rush.
4. Defeat the boss to see the chain reaction: bridge, bow, engines, hull sections
   and runners tear away, spin, burn and fall onto the snow. The reactor bursts
   and the pieces bounce and settle. Wreckage cannot hurt the player.
5. Pause, resume, restart or replay as before. Turning upright or switching
   apps pauses the fight, including its destruction sequence.

Review the new design, how demanding the fight feels compared with the Glacier
Warden, and whether the destruction has enough weight. Physical Android Chrome
and Safari remain owner checks; Chromium phone sizes do not prove Safari support.

## Current tuning

Same 58×24 footprint and grounded runners, with swept armor, a split prow,
a wedge command bridge, diagonal drive pods and increasingly exposed machinery.
No legs, tracks, saw ring, neon or blood. Six hull pictures, flashes and exact
silhouette masks are prepainted at double detail before entry. The forward
opening leaves the original curved rockets a clear path to the weak point.

250 HP (240 in revision 1), 7,000 points, original phase rewards at 66%/33%,
alternating adaptive supply pods and safe speech. The modest HP change is not
the difficulty mechanism: re-aiming volleys, two new area attacks, shorter rests
and stronger forward movement replace the earlier passive rhythm.

| Attack | Behavior |
| --- | --- |
| Broadside | Five volleys of five rounds, each aimed again at the player's latest position. The next warning then stays locked until firing. Initial warning 0.95 s / 0.75 s in phase 3; repeat warnings 1.10 s / 0.95 s. Speed 98/107/116 px/s; central shell costs 2 blocks, outer shots 1. |
| Sweeping cannon | Two guide lines mark a fixed 0.56-radian slice. Warns 0.90 s / 0.70 s in phase 3, then sweeps for 1.10 s. Beam costs 2 blocks. The chamber stays open while firing. |
| Flak barrage | A vertical row of icicles travels left at 92/98/104 px/s, with a marked 32-pixel gap. The gap is offset from the player's height, clamped to remain reachable, and fixed during its 1.15 s warning. |
| Skipping shell | 1.00 s warning, fixed two-hop path, shootable 6×6 shell; after 2.10 s it bursts into three upward rounds. Shooting it prevents the burst, including on its final pending frame. |
| Twin Darts | Phase 2+: two accepted compact darts rise from the bay into separate lanes, 0.45 s apart, then use their original warned behavior. They cannot ram or be targeted while behind the hull. |
| Ice bursts | Phase 2+: two visible marks at least 44 px apart and outside the hull halo. After 0.95/0.75 s, three upward icicles emerge from each. |
| Sliding rush | Phase 3: 1.00 s warning before a 112 px/s low pass to x=30–72. A separate 0.75 s warning precedes the 68 px/s return. Contact costs 3 blocks; fly above it. |

Phase 1: broadside, beam, flak and skipping shell. Phase 2 introduces ice and
darts before cycling the existing attacks. Phase 3 adds rushes and faster rounds.
Patrol movement reaches x=90–144 at 28/32/36 px/s, rather than x=104–144 at
21/24/27. The opening lasts the final 0.40 s of a warning, the final 0.30 s
before repeat volleys, throughout beam firing, and 1.05 s of recovery. Rests
last 0.45 s, or 0.25 s in phase 3. Different patterns finish before the next
begins; repeat rounds from the same broadside can coexist. At most two darts
and twenty projectiles are allowed by the encounter checks.

## Destruction

`wreck.js` partitions the actual last visible hull picture into ten sections;
it does not substitute generic rectangles. The original double-detail drawing
is reused directly. Pieces release in stages from 0.40–2.80 s, with individual
velocities, gravity, angular motion, flame trails and two snow impacts before
settling. The reactor ruptures at 2.80 s. At 6.40 s the normal boss finish awards
points once; wreckage stays visible through the quiet victory delay. All parts
and effects reset on replay. Physics follows the same fixed game clock and
pauses with the game. No new collision hazards, gore, save state or recorded
music are introduced.

## Checks and limitations

`tools/boss-demo-test.mjs` covers real simultaneous thumbs, safe areas, all
seven warned patterns, each re-aimed volley's locked direction, tested escapes,
weak-point reachability with all original specials, exact collision masks,
phase rewards and supplies, native damage/lives, full victory, loss races,
interruption handling, replay and save preservation. Breakup checks reconstruct
the complete picture pixel-for-pixel, verify staged release/rotation/gravity,
floor impacts, harmlessness, retained wreckage and a single score award. A raster check also verifies that a diagonal beam
visibly covers its complete contact area.

Revision 2 passes **164 focused checks** plus the existing 101 combat, 49 smoke,
35 seeded-level and 35 scenery checks: **384 checks in total**. Both portable
phone layouts complete a full fight with zero external resource requests.
The normal-input recording is a combat excerpt; the destruction clip stages
the finishing hit and labels that explicitly.

`tools/boss-benchmark.mjs` compares against the unchanged Glacier Warden. The
stationary pilot measures duration and incoming damage with a large health
pool. The separate reactive helper (`tools/boss-review-pilot.js`) uses only
normal movement, Fire and Special with normal health/lives; it reacts to visible
warnings and shots. It is not a human skill model and does not handle every
Warden mechanic equally well. Neither metric establishes how the owner will
rank the bosses. Compare the owner's phone feedback before settling difficulty.
It also measures cached drawing and an active destruction frame on the same
cloud browser; these samples are not phone FPS claims.

All runtime changes stay under `demos/glacier-boss/`. The approved landscape,
regular enemies, original hero/flame/bullets, campaign levels, controls, saves,
menus and music files remain unchanged. The preview uses original sound effects
and reads existing options without writing them.

## Reproduce checks and delivery

```sh
source /workspace/.cloud-onboarding/retro-space-shooter/environment.sh
node tools/boss-demo-test.mjs /tmp/ember-boss-v2-checks
node tools/boss-benchmark.mjs /tmp/ember-boss-v2-benchmark
node tools/combat-demo-test.mjs /tmp/ember-combat-checks
node tools/smoke-test.mjs /tmp/ember-smoke
SEED=28 node tools/level-test.mjs /tmp/ember-levels
node tools/coast-demo-test.mjs /tmp/ember-coast
node tools/speed-test.mjs
node tools/export-boss-demo.mjs /workspace/artifacts/glacier-coast-boss-v2.html
```

Create smoke/level screenshot directories first and run suites sequentially.
The single-file export embeds the exact modules and approved landscape PNG;
it is a review copy, not a build requirement. Verify both phone-size exports
through an internal server with zero external resource requests. Physical-phone
opening remains an owner check; do not give localhost links. The destruction
video stages the finishing hit to show that animation promptly; a fight video
uses normal health, lives, weapons and original touchscreen inputs. Videos are
silent; the playable preview retains the sound effects.
