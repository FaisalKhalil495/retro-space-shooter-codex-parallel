# Breakwater — separate boss preview, revision 6.4

The owner supplied a finished icy battlefield, a clean snowfield and a
matching green-screen wreck layer. Since revision 6.3 the finished picture stays
intact: ringed planet, mountains, defenses, wrecks, fires and detailed smoke.
Revision 6.4 replaces the matching snowfield strip with an original rocky ice
shelf: a flat snow cap, grey slate outcrops, fractured blue ice, small hanging
ice teeth and surface cracks. Both other uploads remain unchanged references;
no green backing is rendered in play.
See [asset provenance](assets/README.md) for the three original uploads.
The accepted coast/combat demos and original campaign keep their own worlds.

Look for **BREAKWATER 6.4**. The owner allowed smoke to stay still if realistic
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

All revision-6 combat rules, original hero/flame/bullets, compact enemies,
controls, defenses, floor y=130 and exact ten-part destruction are unchanged.

The owner approved much stronger torpedo pursuit, more broadsides and larger
fighter groups arriving from behind the boss after a visible retreat. See the
[approved plan](../../docs/concepts/level-4-enemies/boss-reinforcements-plan.md).
These revision-6 mechanics remain in 6.4. The campaign stays v0.29.0 with three levels.
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
4. Follow the marked gaps through the faster lance walls. Later walls change
   the gap; a lance costs two blocks. The rush sequence leaves an overhead gap.
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
| 1 | Six-volley broadside, two torpedoes, one lance wall, two Cluster Mortars. |
| 2 | Introduce two ruptures and a three-fighter rear wave; seven-volley broadside, three torpedoes, two lance walls and three mortars. |
| 3 | Introduce rush with lances and torpedoes then two ruptures; eight-volley broadside, up to four fighters, four standalone torpedoes, three lance walls, four mortars and three standalone ruptures. |

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
  their original 3×3 contact square. Speeds 120/132/144 pixels/s, two blocks.
  Standalone patterns fire 1/2/3 walls; rush-with-lances fires one phase-3 wall.
  Every wall gets 1.15 s warning, with a fixed 28/26/24-pixel marked gap.
  Reacquire and shift the next gap at least 20 pixels after the old wall clears.
  Rush gaps remain above the hull (center no lower than y=88). Native bombs
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

## Revised pursuit, broadsides and reinforcements

**Broadside:** 6/7/8 volleys of five rounds, with a new aim and locked warning
for each. Preserve initial warnings 0.95/0.85/0.75 s, subsequent warnings
1.10/1.00/0.95 s, speeds 98/107/116 pixels/s, 0.22-radian spread and center/outer
damage of two/one blocks. The chamber opens 0.30 s before repeat volleys.

**Hunter Torpedoes:** unchanged 7×4, 2 HP, 15 points and two-block contact;
2/3/4 standalone missiles, two in the linked pattern, 0.38 s apart after warnings
of 1.00/0.85/0.70 s. Keep the roof launcher. Shootable immediately, no contact
for the first 0.12 s while clearing the roof. Then use these guidance values:

| Phase | Tracking speed | Turn limit | Tracking duration | Prediction | Straight speed |
| --- | --- | --- | --- | --- | --- |
| 1 | 120 px/s | 5.5 rad/s | 2.0 s | 0.14 s | 148 px/s |
| 2 | 138 px/s | 6.3 rad/s | 2.3 s | 0.17 s | 166 px/s |
| 3 | 156 px/s | 7.2 rad/s | 2.6 s | 0.20 s | 184 px/s |

This raises tracking speed by 62/73/81% and more than doubles turning strength.
Guidance remains finite; afterward the missile commits straight. Lifetime is
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
launch from the ship. The 0.45 s locked firing warnings, 82 px/s rounds, 1.15 s
individual rest, minimum 1.10 s between shots and two-round escort cap remain.
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

Revision 6.4 retains the background checks introduced for the supplied picture: three
independent original-file SHA-256 checks, a full source-to-render pixel
comparison at the native detail scale, fixed backdrop/smoke at six times,
no green-screen pixels, foreground shelf scrolling, shared cached artwork,
canvas-state restoration, and no live painting/readbacks or combat RNG calls.
Original opaque hero pixels stay unchanged over the image. Complete matching
three-phase fights with active/inert scenery verify gameplay isolation on
both phone layouts, along with pause/resume/restart and no extra save/audio/
external-network activity. The 664 combat and earlier-content checks remain.
Same-browser drawing samples are cloud measurements, not physical phone FPS.
All **699 checks pass**: 35 picture/background checks plus those 664 existing
checks. The portable copy embeds the exact battlefield JPEG and cached shelf
painter, completes every phase and exercises a four-fighter rear wave on both phone layouts, with no
external resource requests, browser errors or save writes. Its progression
fixture is invulnerable and proves function, not human difficulty. The new
14-second video is a fresh start using native touch controls and normal
health/lives, with no skipped entrance or selected-phase/HP/position edits.

Revision 6's **444 boss and 220 existing checks (664 total)** cover 101 combat,
49 smoke, 35 seeded-level (seed 28) and 35 scenery checks. Twenty-nine complete
no-hit scenarios cover eight patterns: seven attacks with all four fighters,
extra broadside positions and first/replacement rear waves. Each includes two
seconds of follow-up escort fire.
The portable HTML completes full wins at 915×412 and 874×402 with embedded
artwork, zero external requests and no browser errors or save writes. Separately
select a native phase-3 rear wave and verify all four fighters in the same copy:
the fast laser fixture can win before that wave is chosen. The five earlier-game
speed scenarios are sampled separately from the new background.

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
node tools/boss-demo-test.mjs /tmp/ember-boss-v6-checks
node tools/boss-reinforcements-test.mjs /tmp/ember-boss-v6-reinforcements
node tools/battlefield-test.mjs /tmp/ember-invasion-checks
node tools/boss-benchmark.mjs /tmp/ember-boss-v6-benchmark
node tools/combat-demo-test.mjs /tmp/ember-combat-checks
node tools/smoke-test.mjs /tmp/ember-smoke
SEED=28 node tools/level-test.mjs /tmp/ember-levels
node tools/coast-demo-test.mjs /tmp/ember-coast
node tools/speed-test.mjs
node tools/export-boss-demo.mjs /workspace/artifacts/glacier-coast-boss-v6.4.html
```

Create smoke/level screenshot directories first and run suites sequentially.
The portable HTML embeds the modules and the finished battlefield JPEG; verify
full wins on both phone layouts without external resource requests or browser errors. Review
older video fixtures are labeled as selected phase/attacks with normal health
and actual touch inputs; the current preview records a fresh start. Videos
are silent; the playable preview retains the original sound effects.

All runtime changes are local to `demos/glacier-boss/`. Shared ENEMY_TYPES,
LEVELS, player weapons, controls, saves, menus, audio files, accepted coast and
regular-enemy demos remain untouched. New music and campaign Level 4 remain
separate stages after phone review.
