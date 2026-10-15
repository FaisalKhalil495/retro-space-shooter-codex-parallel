# Breakwater — separate boss preview, revision 5

The owner approved replacing the weak skipping shell and icicle attacks with
Cluster Mortars, Ice Lances and Glacier Ruptures. See the approved
[plan](../../docs/concepts/level-4-enemies/boss-heavy-weapons-plan.md).
Look for **BREAKWATER 5**. The campaign remains v0.29.0 with three levels.

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
6. Roof torpedoes still track briefly, lead your movement, then commit straight.
   Two hits destroy one. Twin Darts stay until killed, with two fighters maximum.
   Surviving fighters retain damage across phases and respawns.
7. Defeat the boss for the same ten spinning hull sections, chain reaction,
   reactor blast and snow impacts. Pause, replay and loss handling remain.

Review whether the new attacks require repeated maneuvers without becoming
unavoidable with both fighters alive. Physical Android Chrome and Safari
performance still needs owner review; Chromium phone layouts do not establish it.

## Phase rules

250 HP, 7,000 points, breaks at 66% and 33%, native quiet stage rewards, safe
speech, alternating survival/weapon supplies. Patrol limits x=104/90/76 to 144;
speeds 28/36/44 pixels/s. Low players draw the vessel forward from phase 2.
Positions hold during warnings and attacks. Recovery stays 1.05 s for original
curved rockets to reach the chamber; additional rests are 0.45/0.30/0.18 s.

| Phase | Attack progression |
| --- | --- |
| 1 | Broadside, two torpedoes, one lance wall, two Cluster Mortars. |
| 2 | Introduce two ruptures and persistent Twin Darts; three torpedoes, two lance walls and three mortars. |
| 3 | Introduce rush with lances and torpedoes then two ruptures; four standalone torpedoes, three lance walls, four mortars and three standalone ruptures. |

After introductions, selection excludes the last two attacks, reacts to high/low
positions and gives combinations a three-attack cooldown. A combination recurs
after at most four ordinary attacks. The two phase-3 introductions are an
exception to that cooldown. Occupied fighter slots select another attack.

## New weapons

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
- **Torpedoes then ruptures:** two missiles with the unchanged phase-3 guidance.
  Wait for every surviving missile to commit before marking the first column.
  Each of two ruptures gets a separate 0.90 s warning. The second reacquires
  after the first collapses. Missiles cannot home into the newly warned route.

Transient patterns clear before the next; persistent fighters and at most two
escort rounds do not block boss selection. Limits: four torpedoes, two fighters,
one mortar, twelve cluster fragments, one rupture and twenty boss-pattern
rounds plus two escort rounds. Different transient patterns only overlap inside
explicit combinations. Phase dialogue/player deaths clear transient hazards
and retain harmless fighters. Boss defeat and restart clear all fighters too.

## Preserved attacks and art

**Broadside is unchanged:** five volleys of five rounds, with new aim then a
locked warning for each. Initial warnings 0.95/0.85/0.75 s; subsequent warnings
1.10/1.00/0.95 s. Speeds 98/107/116 pixels/s. Center costs two blocks, others one.
The chamber opens 0.30 s before repeat volleys. Its original escape cases remain.

**Hunter Torpedoes are unchanged:** 7×4, 2 HP, 15 points, two-block contact;
2/3/4 standalone missiles, two in the linked pattern, 0.38 s apart after warnings
of 1.00/0.85/0.70 s. Roof tubes rise before launch. Emerging missiles are
shootable but cannot ram for 0.22 s. Guidance lasts another 1.2/1.4/1.6 s, with
2.6/2.9/3.2 rad/s turn limits and 0.10/0.13/0.16 s motion lead. Hunt speeds
74/80/86, committed speeds 112/120/128 pixels/s; lifetime at most 3.6 s.

**Twin Darts are unchanged:** 11×8, 2 HP, 30 points, two separated patrol lanes,
missing-slot replacement and retained damage across phases/respawns. Their
0.45 s locked warnings take turns during recovery, idle or deployment, at
82 pixels/s, with at least 1.15 s rest per fighter and 1.10 s between shots.
At most two escort rounds survive. Pending warnings cancel during dangerous
boss patterns and restart fully. Dialogue/respawn hold fighters harmless;
emerging fighters cannot ram or be shot until clear of the hull.

Standalone rush remains a warned low pass at 124 pixels/s, with a separate
0.75 s return warning and 82 pixels/s return. Rush with lances uses 140/100;
contact costs three blocks during either pass. Fly above the hull.

The 58×24 icebreaker and eighteen cached hull/launcher poses remain unchanged.
The same masks, original hero/flame/bullets, coast and compact enemies remain.
`wreck.js` retains the exact ten-part physics: staged release 0.40–2.80 s,
reactor rupture at 2.80 s, falling/spinning pieces and two snow impacts, one
score award at 6.40 s and harmless wreckage through victory. No blood or new
recorded music. Existing synthesized effects and option settings are reused.

## Validation and delivery

All **312 focused and 220 existing checks pass (532 total)**: 101 combat,
49 smoke, 35 seeded-level (seed 28) and 35 scenery checks. Twenty-one complete
no-hit scenarios cover seven attack patterns at three boss positions, with
both persistent fighters alive and two seconds of follow-up escort fire.
The portable HTML completes full wins at 915×412 and 874×412 with embedded
artwork, zero external requests and no browser errors. The five earlier-game
speed scenarios retain their drawing-call counts.

Focused checks cover real thumbs, safe areas, pause/replay, armor and all player
specials, supplies, warning locks, phase escalation, bounded threats, native
counters and complete no-hit routes with both persistent fighters alive. New
checks cover 3-HP mortar counters, target locks, 2/3/4 counts, six-fragment
bursts and fatal-burst cancellation; 1/2/3 lance walls, speed/damage/changed
gaps; 2/3 ruptures, retargeting, one-hit/shield rules, ceiling coverage, lifetime,
phase cleanup and visible contact pixels. Existing hero/save/audio preservation,
all launcher masks, exact destruction, loss races and earlier suites remain.

`tools/boss-benchmark.mjs` compares stationary and reactive samples against the
unchanged Glacier Warden and samples cached drawing with active hazards and
wreckage. The review helper uses native inputs and normal health/lives; it now
knows the new warning shapes, so comparisons with old helper results are limited.
Neither helper survival nor stationary damage establishes human difficulty or
physical-phone FPS. The owner's phone review decides.

```sh
source /workspace/.cloud-onboarding/retro-space-shooter/environment.sh
node tools/boss-demo-test.mjs /tmp/ember-boss-v5-checks
node tools/boss-benchmark.mjs /tmp/ember-boss-v5-benchmark
node tools/combat-demo-test.mjs /tmp/ember-combat-checks
node tools/smoke-test.mjs /tmp/ember-smoke
SEED=28 node tools/level-test.mjs /tmp/ember-levels
node tools/coast-demo-test.mjs /tmp/ember-coast
node tools/speed-test.mjs
node tools/export-boss-demo.mjs /workspace/artifacts/glacier-coast-boss-v5.html
```

Create smoke/level screenshot directories first and run suites sequentially.
The portable HTML embeds the modules and approved PNG; verify full wins on both
phone layouts without external resource requests or browser errors. Review
video fixtures are labeled as selected phase/attacks with normal health and
actual touch inputs, not earned full playthroughs. Videos are silent; the
playable preview retains the original sound effects.

All runtime changes are local to `demos/glacier-boss/`. Shared ENEMY_TYPES,
LEVELS, player weapons, controls, saves, menus, audio files, accepted coast and
regular-enemy demos remain untouched. New music and campaign Level 4 remain
separate stages after phone review.
