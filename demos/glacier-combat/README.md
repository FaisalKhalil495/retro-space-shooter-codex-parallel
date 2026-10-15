# Glacier Coast — two 30-second combat flights

The user approved this separate preview. Open `demos/glacier-combat/` through
the game's static server. Look for **COAST COMBAT 3** below the left controls.
The main game remains v0.29.0 with three campaign levels.

## Phone review

1. Hold the phone sideways. Choose **Flight 1 · Coast Patrol** or
   **Flight 2 · Coast Assault**.
2. Steer with the original left thumb pad and hold **Fire** on the right.
   Your original ship, flame, bullets, speed, and firing rate are unchanged.
3. Watch the amber warning flashes and aim lines. Bomb landing rings and
   flashing rolling charges show where danger is coming. Shoot the bombs and
   charges to destroy them safely.
4. Five original health blocks and three lives appear at the top. Damage,
   death, and respawn use the original rules. The Special button is unchanged;
   no special weapon is equipped or supplied in these short flights.
5. Pause using the upper-right button. Resume, replay, and **Choose another
   flight** are available. Turning upright or switching apps pauses play.
6. Each flight stops at 30 seconds. Losing all lives offers replay, including
   a last-life death just before the deadline. Switching flights resets health,
   lives, score, enemies, warnings, bombs, charges, and the scenery clock.

Judge whether the enemies resemble the concept pictures at actual play size,
stand out from the snow, telegraph their attacks, and feel fair to dodge.
Android/iPhone dimensions are checked in Chromium; physical Android Chrome
and iPhone Safari review is still needed.

## Arrivals

Flight 1: skiff at 3 s, anchor at 10 s, darts at 17/17.4 s; mixed arrivals at
23 s (skiff), 23.7/24.2 s (darts), and 24.8 s (anchor). Eight regular enemies:
two skiffs, two anchors, four darts. Twin Darts are one enemy type.

Flight 2: bomber at 3 s, roller at 8 s, needle at 13 s, hunter at 18 s; final
bomber at 23 s and hunter at 24 s. Six regular enemies: two bombers, one roller,
one needle, two hunters. Bombs and charges are separate shootable hazards.
Survivors may still be present when the next type enters.

## Scale and sharpness revision 3

After requesting smaller enemies, the owner asked for a little more size and
sharpness. Widths are 9–17% larger than revision 2; heights are 11–14% larger.
This supersedes exact matching to the earlier sprite dimensions while keeping
the coast roster comparable in scale.

The approved paintings are sampled without smoothing onto the final double-detail
grid. A continuous half-pixel dark outline and restrained lit armor bevels make
the silhouettes clearer. Neither refinement changes alpha. Real collision masks
and gun/warning positions follow the final size, including open hatches. Normal
fire still reaches all three ground types. Arrivals, attacks, HP and hazard sizes
are unchanged.

A no-fire audit of every physics step includes surviving enemies and hazards.
Flight 1 peaks at four visible objects and 398 square game pixels of bounding
boxes; flight 2 peaks at three and 404 (under 1.7% of the playable area each).
Every 24-pixel column retains at least 41/47 pixels of vertical space between
padded enemy boxes. This measures enemy crowding, not bullet-free paths or final
difficulty. Tests require three ship heights of clearance, under 2% occupied area,
and a small enlargement bounded against the earlier sprites. Pixel checks verify
opaque, continuous dark edges without blurred pixels.

## Current tuning

| Type | HP | Size in game pixels | Warning | Attack |
| --- | --- | --- | --- | --- |
| Shelf Skiff | 4 | 14 × 9 | 0.60 s | Two three-round spreads at 72 px/s. Brakes on the floor. |
| Anchor Gun | 4 | 12 × 8 | 0.75 s | Heavy aimed shell at 70 px/s, 2 damage. Open during warning and 1.60 s venting; armor also blocks specials and ramming. |
| Twin Dart | 2 each | 11 × 8 | 0.45 s | Two aimed rounds at 82 px/s per drone, staggered between lanes. |
| Crest Bomber | 5 | 18 × 10 | 0.80 s before release | Two marked bombs; 1.10 s descent to a fixed target, then six fragments at 58 px/s. |
| Snow Roller | 5 | 16 × 10 | 0.80 s before launch | Two shootable rolling charges at 54 px/s. Charges live 1.50 s, flash for the last 0.65 s, then burst upward at 62 px/s. |
| Needle Wing | 3 | 16 × 8 | 0.50 s tracking, then 0.65 s locked | Two precision rounds at 110 px/s. Changing height after lock does not retarget the shot. |
| Wake Hunter | 3 | 15 × 10 | 0.80 s locked | A 145 px/s diving pass for 0.90 s, then climbs out. No retargeting during the dash. |

Ordinary rounds, fragments and hazard contact cost one block; machine contact
costs two. Bomb impact also costs one if the ship is inside its marked area.
Bombs and charges have 1 HP and award 10 points when shot. Rockets ignore them.
No pickups, new music, or permanent scores/progress are added in this preview.
These are review values, not final Level 4 difficulty.

## Implementation and preservation

`scene.js` subclasses the original `Game`, supplies local arrivals, and spawns
local type objects. `enemies.js` implements their behavior without registering
anything in shared `ENEMY_TYPES` or `LEVELS`. `main.js` supplies flight choice,
completion, replay and interruption handling using the original `Controls`
and safe-area layout. It reads settings but never calls save-writing functions.

`art.js` contains new original pixel paintings based on the seven reviewed
concepts in `docs/concepts/level-4-enemies/`. It rasterizes half-pixel outlines,
armor panels, gun rails, hinges, vents, frost and wear once, and caches normal,
open and flash images. Hit tests use the opaque silhouette rather than empty
spaces around the wings. Drawing texture uses deterministic grit, not game
simulation randomness. No concept PNG was edited or installed as a sprite.

The existing coast background and its original PNG are reused from
`demos/glacier-coast/`, with an explicit image URL supplied by this page.
The campaign, shared game modules, scenery-only demo, recorded themes, icons,
menus, save format, and original hero/bullet code remain unchanged.
Breakwater and campaign Level 4 are outside this stage.

## Checks and review export

```sh
source /workspace/.cloud-onboarding/retro-space-shooter/environment.sh
node tools/combat-demo-test.mjs /tmp/ember-combat-checks
node tools/smoke-test.mjs /tmp/ember-smoke
SEED=28 node tools/level-test.mjs /tmp/ember-levels
node tools/coast-demo-test.mjs /tmp/ember-coast
node tools/speed-test.mjs
node tools/export-combat-demo.mjs /workspace/artifacts/glacier-coast-combat-v3.html
```

Create screenshot directories before the existing smoke and level tests; the
combat and coast suites create their own. Run suites sequentially. The optional
export embeds the exact module sources and existing landscape PNG in one HTML
file with import maps and Blob URLs. It is not a build step for the served game.
Validation: 101 focused combat checks, 49 smoke checks, 35 seeded level checks,
and 35 scenery checks passed. Both phone-size exports ran both flights with
zero external resource requests. The original five-scene drawing benchmark
completed with unchanged drawing-call counts. The preview also runs a
same-machine comparison of 60 draws with and without enemies (median of three alternating samples). These cloud-browser samples do
not establish phone frame rates.
The managed browser blocks direct `file:` navigation; validate the single-file
copy through an internal server and separately review physical-phone opening.
Use local server URLs only for internal checks, not as phone links.
