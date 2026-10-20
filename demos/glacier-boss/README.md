# Breakwater — separate boss preview, revision 7

The owner supplied a finished icy battlefield, a clean snowfield and a
matching green-screen wreck layer. Since revision 6.3 the finished picture stays
intact: ringed planet, mountains, defenses, wrecks, fires and detailed smoke.
Revision 6.4 replaces the matching snowfield strip with an original rocky ice
shelf: a flat snow cap, grey slate outcrops, fractured blue ice, small hanging
ice teeth and surface cracks. Both other uploads remain unchanged references;
no green backing is rendered in play.
See [asset provenance](assets/README.md) for the three original uploads.
The accepted coast/combat demos and original campaign keep their own worlds.

Look for **BREAKWATER 7**. The owner allowed smoke to stay still if realistic
animation is difficult. It overlaps wrecks/cliff in these still pictures, so
it remains exactly as pictured. No procedural plumes, roof flares, added
flying scenery, tint, camera drift or distortion remain. The 16:9 finished
picture fits at 208×117 without cropping/stretching, then extends its last
snow row by two pixels to meet the floor. The distinct foreground ledge scrolls
at the native speed. Every rock and ice detail stays within its existing
14-pixel strip, at or below the flat collision surface y=130; these details
add no obstacles, damage or changes to movement. Its double-detail artwork
is painted once and shared across resets, with continuous strata at the
scrolling tile boundary.
Everything renders behind gameplay, with no new damage, targets, points,
projectiles, audio or save writes. Shared pictures are prepared before play.

Revision 7 implements the approved harder fight and unpredictable Ice Lance
gaps. Broadsides last longer and travel faster, torpedoes track faster and
turn faster, lance walls move faster and fighters fire faster rounds. See the
[approved difficulty plan](../../docs/concepts/level-4-enemies/boss-difficulty-plan.md).
Preserve 250 HP, all nine patterns, damage, warning times, vulnerable recovery,
compact enemies, original hero/flame/bullets, controls, native defenses,
floor y=130 and exact ten-part destruction.

The owner approved much stronger torpedo pursuit, more broadsides and larger
fighter groups arriving from behind the boss after a visible retreat. See the
[approved plan](../../docs/concepts/level-4-enemies/boss-reinforcements-plan.md).
Its rear-wave maneuver and persistent fighters remain in revision 7. The
campaign stays v0.29.0 with three levels.
Revision 5.1's camera and ship-visibility fixes remain in place: Ice Lances and
retained wreckage follow screen shake beneath the original hero and bullets.

## Phone review

1. Hold the phone sideways and tap **Start boss fight**. Use the original pad,
   Fire and Special. Begin with five health blocks, three lives and the normal
   gun; collect the original adaptive supplies.
2. Shoot the front chamber when it opens. Closed armor blocks ordinary and
   special weapons. Your own laser pickup remains available.
3. Watch the rear gun's mortar arcs and marked circles. Destroy a shell with
   three hits or maneuver away before it splits into six fragments. Blast
   centers and direct shell contact cost three blocks.
4. Follow each marked gap through the faster lance walls. Every wall chooses
   a random reachable gap; once marked it stays fixed. A lance costs two
   blocks. The rush sequence leaves a random overhead gap clear of the hull.
5. Move sideways away from each marked ice crack. Ruptures reach the top of
   the flight area and cost three blocks. They collapse quickly; shooting
   cannot break them. Each later strike acquires a new position, then locks it.
6. Roof torpedoes now travel much faster, turn sharply and track longer before
   committing straight. Two hits destroy one; use angled dodges and reversals.
7. When Breakwater reverses, watch for a group arriving from the right edge
   behind it. Three fighters can stay in phase 2, four in phase 3. They remain
   until killed, keep their damage across phases/respawns and fill only vacancies.
8. Defeat the boss for the same ten spinning hull sections, chain reaction,
   reactor blast and snow impacts. Pause, replay and loss handling remain.

Review whether the new attacks require repeated maneuvers without becoming
unavoidable with all four fighters alive. Physical Android Chrome and Safari
performance still needs owner review; Chromium phone layouts do not establish it.

## Phase rules

250 HP, 7,000 points, breaks at 66% and 33%, native quiet stage rewards, safe
speech, alternating survival/weapon supplies. Patrol limits x=104/90/76 to 144;
speeds 28/36/44 pixels/s. Low players draw the vessel forward from phase 2.
Positions hold during stationary warnings and attacks; reinforcement calls use
the warned retreat/return described below. Recovery stays 1.05 s for original
curved rockets to reach the chamber; additional rests are 0.45/0.30/0.18 s.

| Phase | Attack progression |
| --- | --- |
| 1 | Seven-volley broadside, two torpedoes, one lance wall, two Cluster Mortars. |
| 2 | Introduce two ruptures and a three-fighter rear wave; eight-volley broadside, three torpedoes, two lance walls and three mortars. |
| 3 | Introduce rush with lances and torpedoes then two ruptures; ten-volley broadside, up to four fighters, four standalone torpedoes, three lance walls, four mortars and three standalone ruptures. |

After introductions, selection excludes the last two attacks, reacts to high/low
positions and gives combinations a three-attack cooldown. A combination recurs
after at most four ordinary attacks. The two phase-3 introductions are an
exception to that cooldown. Occupied fighter slots select another attack.
After introductions, broadside has extra selection weight and is forced after
three other attacks. Schedule a phase-3 combination early when necessary so
neither its existing recurrence guarantee nor the broadside deadline is starved.

## Heavy weapons retained from revision 5

- **Cluster Mortars:** 8×6, 3 HP, 10 points, ignored by homing rockets as hazards.
  The rear gun at x=boss.x+56, y=boss.y+8 marks a target and quadratic flight arc.
  Each shell gets a 0.95/0.85/0.75 s warning and 0.85 s flight. Targets clamp to
  x=14–194, y=24–111, stay fixed after warning starts and reacquire between shells.
  Fire 2/3/4 shells. Each explodes into six radial one-block fragments moving at
  106/112/118 pixels/s; its radius-8 center and native contact cost three blocks.
  At most one shell flies at a time. The next warning waits until the shell is
  gone and no more than six old fragments remain, bounding fragments to twelve.
  Ordinary shots, bombs and the player's laser can destroy shells and cancel
  the burst. Destroyed shells, phase changes and fatal impacts never release
  a delayed burst. Blast centers respect native shields, hit protection and entry.
- **Ice Lances:** native enemy projectiles with cached 16×6 ice artwork around
  their original 3×3 contact square. Speeds 132/148/164 pixels/s, two blocks.
  Standalone patterns fire 1/2/3 walls; rush-with-lances fires one phase-3 wall.
  Every wall gets 1.15 s warning, with a fixed 28/26/24-pixel marked gap.
  Choose a fresh random reachable center for every wall, including the first,
  after the old wall clears. Centers run from y=30 to 110 in two-pixel steps;
  rush choices stop at 88 to clear the hull. Prefer centers at least 20 pixels
  from both recent gaps; fall back to avoiding the last gap, then all reachable
  centers if needed. Use one seeded gameplay roll at warning start. Bound the
  center using the player's actual hitbox and diagonal speed, with 0.15 seconds
  reserved for reaction during the 1.15-second warning. Mark and lock the gap;
  never change it in response to later movement, drawing or pause. The existing
  pale boundary lines have thin dark edges for contrast over bright snow. Native bombs
  clear the projectiles. They use the original projectile movement/defense rules;
  local cached artwork overlays the existing ice drawing without shared changes.
- **Glacier Ruptures:** one warned column at a time, outside the hull's halo.
  Standalone warnings last 0.85/0.75 s in phases 2/3; strikes repeat twice/three
  times, reacquiring only for a new warning. Each 10-pixel-wide drawing rises
  from snow y=130 to y=11 over 0.12 s, holds until age 0.46 s, then shrinks
  harmlessly and disappears at 0.66 s. A visible central three-pixel strip,
  beginning five pixels below the growing tip, costs three blocks once per
  eruption, including only one shield charge. Native hit protection, state
  and entry guards apply. These are temporary unshootable hazards, not solid
  terrain, and never leave persistent obstacles.
- **Torpedoes then ruptures:** two missiles with the stronger phase-3 guidance.
  Wait for every surviving missile to commit before marking the first column.
  Each of two ruptures gets a separate 0.90 s warning. The second reacquires
  after the first collapses. Missiles cannot home into the newly warned route.

Transient patterns clear before the next; persistent fighters and at most two
escort rounds do not block boss selection. Limits: four torpedoes, four fighters,
one mortar, twelve cluster fragments, one rupture and twenty boss-pattern
rounds plus two escort rounds. Different transient patterns only overlap inside
explicit combinations. Phase dialogue/player deaths clear transient hazards
and retain harmless fighters. Boss defeat and restart clear all fighters too.

## Current pursuit, broadsides and reinforcements

**Broadside:** 7/8/10 volleys of five rounds, with a new aim and locked warning
for each. Preserve initial warnings 0.95/0.85/0.75 s, subsequent warnings
1.10/1.00/0.95 s, speeds 106/118/130 pixels/s, 0.22-radian spread and center/outer
damage of two/one blocks. The chamber opens 0.30 s before repeat volleys.

**Hunter Torpedoes:** unchanged 7×4, 2 HP, 15 points and two-block contact;
2/3/4 standalone missiles, two in the linked pattern, 0.38 s apart after warnings
of 1.00/0.85/0.70 s. Keep the roof launcher. Shootable immediately, no contact
for the first 0.12 s while clearing the roof. Then use these guidance values:

| Phase | Tracking speed | Turn limit | Tracking duration | Prediction | Straight speed |
| --- | --- | --- | --- | --- | --- |
| 1 | 132 px/s | 6.1 rad/s | 2.0 s | 0.14 s | 148 px/s |
| 2 | 152 px/s | 7.0 rad/s | 2.3 s | 0.17 s | 166 px/s |
| 3 | 172 px/s | 8.1 rad/s | 2.6 s | 0.20 s | 184 px/s |

Revision 7 raises tracking speed about 10% from revision 6 and increases
turning strength with it. Guidance remains finite; afterward the missile commits straight. Lifetime is
at most 4.5 s; leaving the flight area or shooting one down ends it earlier.
Rupture follow-up warnings still wait for every surviving missile to commit.

**Rear reinforcements:** 11×8, 2 HP, 30 points, three slots in phase 2 and four
in phase 3. Warn 0.85 s with right-edge arrival arrows and a ground movement
mark. Reverse at 60 px/s to x=170, leaving 38 pixels of bow visible. Only then
spawn missing lanes together at x=216, flying left at 72 px/s above the hull.
Patrol centers are (148,80), (176,52), (146,26), (176,94); bob 6 px horizontally
and 3 vertically. Arrival motion has no contact damage, becomes shootable once
fully on-screen and pauses during safe dialogue/respawn. Settle before warning
and firing. Never create more than the current phase cap, including arrivals.
After the group settles, warn 0.75 s, then return to the starting patrol position
at the phase's normal speed before opening the chamber for recovery.

Surviving fighters keep their HP across phases and respawns. Every replacement
uses the same retreat and rear approach and fills only missing lanes. No fighters
launch from the ship. Round speeds are now 94/104 px/s in phases 2/3. The 0.45 s locked firing
warnings, 1.15 s individual rest, minimum 1.10 s between shots and two-round
escort cap remain.
Give the longest-waiting ready fighter its turn so all four get to fire. Cancel
warnings through dangerous boss patterns and restart them fully afterward.

## Preserved art and systems

Standalone rush remains a warned low pass at 124 pixels/s, with a separate
0.75 s return warning and 82 pixels/s return. Rush with lances uses 140/100;
contact costs three blocks during either pass. Fly above the hull.

The 58×24 icebreaker and eighteen cached hull/launcher poses remain unchanged.
The same masks, original hero/flame/bullets and compact enemies remain.
`wreck.js` retains the exact ten-part physics: staged release 0.40–2.80 s,
reactor rupture at 2.80 s, falling/spinning pieces and two snow impacts, one
score award at 6.40 s and harmless wreckage through victory. No blood or new
recorded music. Existing synthesized effects and option settings are reused.

## Validation and delivery

All **787 checks pass**: 320 boss, 124 reinforcement, 88 new difficulty,
35 battlefield, 101 regular-combat, 49 smoke, 35 seeded-level (seed 28) and
35 scenery checks. The new suite exercises 216 seeded complete lance/rush
routes per phone across all phases, three boss positions and top/middle/bottom
player heights, with persistent fighters in phases 2/3. It checks random first
walls, varied direction/jump distances without simple alternation, exact
seed replay independent of drawing, one gameplay roll per selection, full
warnings, fixed marked positions, high-contrast boundary pixels, normal-input
no-hit movement, overhead rush clearance and higher fighter shot speeds.
Restoring only the old gap rule makes these functional checks fail.

The 29 complete full-pattern no-hit scenarios retain all four fighters and
two seconds of follow-up fire, including five broadside positions and first/
replacement rear waves. Several old routes take hits at the new speeds; the
verified replacements use ordinary movement without shooting, invulnerability,
health edits or teleporting. All approved target speeds and counts were kept.

The picture checks retain three independent original-file SHA-256 checks,
full source-to-render pixels, fixed backdrop/smoke at six times, no green
backing, scrolling shelf, shared cached artwork and no live painting/readbacks
or scenery RNG calls. Original opaque hero pixels remain unchanged. Complete
matching three-phase fights with active/inert scenery pass at both phone
layouts, alongside pause/restart and no extra save/audio/external activity.
Earlier-game drawing-call counts remain 304/356/298/347/589, unchanged from
the preceding revision. Cloud drawing samples do not establish phone FPS.

The portable copy embeds the exact battlefield JPEG and all required modules,
completes every phase and forms a selected four-fighter rear wave on both phone
layouts without external requests, browser errors or save writes. Its
invulnerable progression fixture proves function, not human difficulty.
The revision-7 video selects phase 3 and its attack order for immediate review,
with four fighters, normal health/lives and native automated touch inputs.
It is labeled accordingly and does not claim an earned full playthrough.

Focused checks cover real thumbs, safe areas, pause/replay, armor and all player
specials, supplies, warning locks, phase escalation, bounded threats, native
counters and complete no-hit routes with all four persistent fighters alive.
Heavy-weapon checks cover 3-HP mortar counters, target locks, 2/3/4 counts, six-fragment
bursts and fatal-burst cancellation; 1/2/3 lance walls, speed/damage/changed
gaps; 2/3 ruptures, retargeting, one-hit/shield rules, ceiling coverage, lifetime,
phase cleanup and visible contact pixels. Existing hero/save/audio preservation,
all launcher masks, exact destruction, loss races and earlier suites remain.
The 124 reinforcement checks cover independent guidance/velocity values,
actual gun counters, three/four-slot caps, six full retreat/arrival cases,
separation, all four firing turns, replacement HP, cancellation at each maneuver
stage, real pause/restart, frequency guarantees and phase-3 combination scheduling.
Replacing only the missile module with the prior source makes the new speed
check fail, proving it detects the old behavior.
Full-scene checks also verify that lances and retained wreckage translate with
the camera and cannot paint over opaque hero pixels.

`tools/boss-benchmark.mjs` compares stationary and reactive samples against the
unchanged Glacier Warden and samples cached drawing with active hazards and
wreckage. The review helper uses native inputs and normal health/lives; it now
knows the new warning shapes, so comparisons with old helper results are limited.
Neither helper survival nor stationary damage establishes human difficulty or
physical-phone FPS. The owner's phone review decides.

```sh
source /workspace/.cloud-onboarding/ember-drift/environment.sh
node tools/boss-demo-test.mjs /tmp/ember-boss-v7-checks
node tools/boss-reinforcements-test.mjs /tmp/ember-boss-v7-reinforcements
node tools/boss-difficulty-test.mjs /tmp/ember-boss-v7-difficulty
node tools/battlefield-test.mjs /tmp/ember-invasion-checks
node tools/boss-benchmark.mjs /tmp/ember-boss-v7-benchmark
node tools/combat-demo-test.mjs /tmp/ember-combat-checks
node tools/smoke-test.mjs /tmp/ember-smoke
SEED=28 node tools/level-test.mjs /tmp/ember-levels
node tools/coast-demo-test.mjs /tmp/ember-coast
node tools/speed-test.mjs
node tools/export-boss-demo.mjs /workspace/artifacts/glacier-coast-boss-v7.html
```

Create smoke/level screenshot directories first and run suites sequentially.
The portable HTML embeds the modules and the finished battlefield JPEG; verify
full wins on both phone layouts without external resource requests or browser errors. Review
older video fixtures are labeled as selected phase/attacks with normal health
and actual touch inputs. Revision 7 selects phase 3 and its attack order with
four fighters; the visible label states this. Videos are silent; the playable
preview retains the original sound effects.

All runtime changes are local to `demos/glacier-boss/`. Shared ENEMY_TYPES,
LEVELS, player weapons, controls, saves, menus, audio files, accepted coast and
regular-enemy demos remain untouched. New music and campaign Level 4 remain
separate stages after phone review.
