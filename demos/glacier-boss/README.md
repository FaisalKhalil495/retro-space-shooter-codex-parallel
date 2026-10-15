# Breakwater — separate boss preview, revision 3

The owner approved replacing Breakwater's laser with Hunter Torpedoes and
stronger phase escalation. See the approved
[plan](../../docs/concepts/level-4-enemies/boss-escalation-plan.md).
Look for **BREAKWATER 3**. The campaign remains v0.29.0 with three levels.

## Phone review

1. Hold the phone sideways and tap **Start boss fight**. Use the original pad,
   Fire and Special. Start with five health blocks, three lives and the normal
   gun. Collect the original adaptive supplies.
2. Shoot the front chamber when the prow opens. It opens during missile
   launches, the end of warnings and short recoveries. Closed armor blocks
   ordinary and special weapons. Your own laser pickup still works.
3. Watch the little torpedoes: their lamp blinks while they turn towards you,
   then holds steady when they commit to flying straight. Two ordinary hits
   destroy one safely. You can also bait them into missing.
4. Phase 2 responds to your position. Move sideways from marked ice eruptions;
   deal with the compact Twin Darts when flying high.
5. Phase 3 introduces two linked attacks. For rush-with-flak, fly above the
   charging hull into the marked gap. For torpedoes-then-ice, dodge or destroy
   the missiles, then move away from the newly marked eruption columns.
6. Defeat the boss for the same chain reaction, reactor blast and ten spinning
   ship sections falling onto the snow. Pause, interruption handling, restart,
   victory/loss and replay remain available.

Review whether each phase feels more demanding and tactically different,
compared with the Glacier Warden. Chromium phone layouts do not establish
physical Android Chrome or Safari performance; the owner's phone review decides.

## Phase rules

250 HP, 7,000 points, phase breaks at 66% and 33%, native quiet stage rewards,
safe speech and alternating survival/weapon supplies. Difficulty comes from
tracking threats, responsive selection, new combinations and shorter rests.

| Phase | Newly introduced attacks and tactics | Torpedoes per salvo | Rest |
| --- | --- | --- | --- |
| 1 | Broadside, torpedoes, flak and skipping shells, introduced in order. | 2 | 0.45 s |
| 2 | Ice eruptions and Twin Darts first; then position-aware selection. High flyers attract darts, low flyers attract ice. | 3 | 0.30 s |
| 3 | Rush-with-flak and torpedoes-then-ice first; then all seven base attacks and both combined sequences. | 4 alone / 2 in the linked ice sequence | 0.18 s |

After phase introductions, selection excludes the last two attacks. Combined
attacks have a three-attack cooldown and recur after at most four ordinary
attacks, preventing an easy random sequence from starving them. Otherwise
selection varies, with extra weight for missiles/flak against the far-left
corner and rushes at close range.
Choices are made before warning, rather than changing a committed target at
the last instant. Torpedoes explicitly announce their limited tracking period.
The first two phase-3 introductions are an exception to the combination cooldown.

Patrol limits are x=104/90/76 to 144; speeds are 28/36/44 pixels/s. From phase 2,
a low player draws the vessel forward towards x=player.x+65, clamped to its
patrol range. Position is stable during warnings and attacks, keeping gun origins
and ground markers reliable. Shorter rests do not shorten the 1.05 s recovery
needed for the original curved rockets to reach the open chamber.

## Attacks

- **Hunter Torpedoes:** replace the boss laser completely. A 1.00/0.85/0.70 s
  warning precedes 2/3/4 missiles launched 0.38 s apart. Each is 7×4 pixels,
  has 2 HP, gives 15 points and costs 2 health blocks on contact. Rockets ignore
  them as hazards; normal shots, bombs and the player's laser can destroy them.
  They are shootable immediately but cannot ram for the first 0.22 s while
  emerging. Guidance lasts another 0.80/0.85/0.90 s, with turns limited to
  1.8 radians/s; then the angle locks. Hunt speeds are 74/80/86 pixels/s;
  committed speeds 112/120/128. Expire harmlessly after 3.6 s or at the bounds.
  Front shots leave the split cannon; rear shots lift from the stern gun.
- **Broadside:** five volleys of five rounds. Each volley acquires a new aim,
  then holds its warning direction. Initial warning 0.95/0.85/0.75 s; repeat
  warning 1.10/1.00/0.95 s. Speeds 98/107/116 pixels/s. Center shell costs
  2 blocks, outer shots 1. The chamber opens for 0.30 s before repeat volleys.
- **Flak:** a vertical row of icicles travels left at 92/98/104 pixels/s,
  leaving a fixed marked 32-pixel gap after a 1.15 s warning.
- **Skipping shell:** 1.00 s warning, fixed two-hop path, shootable 6×6 shell;
  after 2.10 s it bursts into three upward rounds. Destroying it cancels the
  burst, including on its final pending update.
- **Twin Darts:** phase 2+, accepted 11×8 craft rise from the bay into separate
  lanes, 0.45 s apart, then use their original warned behavior. They cannot
  ram or be targeted while emerging behind the hull.
- **Ice eruptions:** phase 2+, two visible columns at least 44 pixels apart,
  outside the hull halo. Warning 0.85/0.75 s, then three upward icicles per
  column. Marks stay fixed and never become persistent solid terrain.
- **Rush:** phase 3, 1.00 s warning, 124 pixels/s low pass to x=30–72,
  separate 0.75 s return warning, then 82 pixels/s back to x=144. Contact
  costs 3 blocks during either pass; fly above it.
- **Rush with flak:** phase 3, a shared 1.15 s warning shows both the low rush
  and a 32-pixel flak gap entirely above the hull. Flak launches as the rush
  starts. Rush/return speeds are 140/100 pixels/s, with the same separate
  0.75 s return warning. The gap guides remain visible throughout the sequence.
- **Torpedoes then ice:** phase 3, only two missiles, with 0.55 s guidance
  after emergence. Wait until all surviving missiles have committed, then
  mark the player's current column and a separate column for 0.90 s before
  the ice erupts. Surviving missiles cannot home into the newly warned escape
  route. Shooting them down earns a simpler follow-up.

Complete patterns resolve before starting another; overlap is limited to the
specified combined sequences and repeat rounds within a broadside. Tests bound
encounters to four missiles, two darts and twenty ordinary enemy projectiles.
Speech, stage changes, loss, death and replay cancel pending launches safely.

## Art and destruction preservation

The same six prepainted 58×24 icebreaker hulls, masks, flashes, split bow and
reachable chamber are retained. New missile art is cached at double detail;
its circular hit area stays inside the visible body while rotating. The original
hero, flame, bullets, coast and compact regular enemies are unchanged.

`wreck.js` retains the exact revision-2 destruction physics: ten sections of
the actual last hull frame release from 0.40–2.80 s; a reactor rupture at
2.80 s; spinning, falling and two snow impacts per section; score awarded once
at 6.40 s; harmless wreckage stays through the victory delay. No blood or new
recorded music. Original synthesized effects and option settings are reused.

## Validation

All **214 focused checks and 220 existing checks pass (434 total)**: 101 combat,
49 smoke, 35 seeded-level (seed 28) and 35 scenery checks.
The exported revision-3 HTML completes full wins in both 915×412 and 874×412
phone layouts, with embedded artwork, zero external requests and no browser
errors. Existing speed scenarios keep their drawing-call counts unchanged.

The focused suite covers native touches, safe areas, pause/replay, all attacks,
per-volley warnings and locks, 2/3/4 missile salvos, bounded homing, straight
commitment, expiry, two-hit counters, real gun counters, rotating hit-area
visibility, responsive selection, cooldowns and actual rest intervals.
It tests complete no-hit flights through all three new patterns at x=76,
110 and 144, plus the broadside's existing escape cases. Ice warnings in the
linked sequence begin only after homing ends. It also checks pending-salvo
cleanup at phase change, player death and boss death, all original special
weapons against armor, rewards and supplies, loss races and exact destruction.
Original hero/flame/bullet pixels and firing match, saves receive zero writes,
and no recorded music is requested.

`tools/boss-benchmark.mjs` compares duration and stationary pressure against
unchanged Glacier Warden, records controlled pressure in each phase, and runs
a reactive pilot with normal health/lives and original movement/fire inputs.
The helper does not handle every Warden mechanic equally well; it is not proof
of human difficulty. Drawing comparisons include scenery, cached hull, active
missiles/projectiles and destruction on the same cloud browser, not phone FPS.
With simulation dice held at 0.25/0.45/0.75, the reactive pilot loses its three
lives to Breakwater after 93.4–124.0 s, reaching phase 2. Stationary phase samples
do not show monotonically increasing damage: knockback, invulnerability and
the chosen patterns affect the count. Escalation is established by the new
tactics, larger salvos and shorter rests; phone play decides the felt difficulty.

All gameplay changes remain local to `demos/glacier-boss/`. Shared ENEMY_TYPES,
LEVELS, player weapons, controls, audio files, menus, saves and approved coast
and regular-enemy demos are untouched. New music and campaign Level 4 remain
separate stages after the owner's review.

## Reproduce checks and delivery

```sh
source /workspace/.cloud-onboarding/retro-space-shooter/environment.sh
node tools/boss-demo-test.mjs /tmp/ember-boss-v3-checks
node tools/boss-benchmark.mjs /tmp/ember-boss-v3-benchmark
node tools/combat-demo-test.mjs /tmp/ember-combat-checks
node tools/smoke-test.mjs /tmp/ember-smoke
SEED=28 node tools/level-test.mjs /tmp/ember-levels
node tools/coast-demo-test.mjs /tmp/ember-coast
node tools/speed-test.mjs
node tools/export-boss-demo.mjs /workspace/artifacts/glacier-coast-boss-v3.html
```

Create smoke/level screenshot directories first; run suites sequentially.
Portable HTML embeds all modules and the approved PNG; verify full wins at both
phone sizes with zero external resource requests. Physical-phone opening still
needs owner review; do not give localhost links. A phase-3 video selects that
phase for a short preview, then uses normal health/lives and actual touch inputs.
It is labeled as selected phase 3, rather than a full earned playthrough. Videos
are silent; the playable preview retains its original sound effects.
