# Breakwater — separate boss preview, revision 4

The owner approved stronger Hunter Torpedo pursuit, a separate roof launcher
and persistent Twin Darts, while keeping the broadside exactly unchanged. See
the approved
[plan](../../docs/concepts/level-4-enemies/boss-pursuit-plan.md).
Look for **BREAKWATER 4**. The campaign remains v0.29.0 with three levels.

## Phone review

1. Hold the phone sideways and tap **Start boss fight**. Use the original pad,
   Fire and Special. Start with five health blocks, three lives and the normal
   gun. Collect the original adaptive supplies.
2. Shoot the front chamber when the prow opens. It opens during missile
   launches, the end of warnings and short recoveries. Closed armor blocks
   ordinary and special weapons. Your own laser pickup still works.
3. Watch the roof launcher rise and release the little torpedoes: their lamp
   blinks while they turn towards you,
   then holds steady when they commit to flying straight. They turn more sharply,
   track longer and lead your movement slightly: use angled flight and changes
   of direction, or destroy one with two ordinary hits.
4. Phase 2 responds to your position. Move sideways from marked ice eruptions;
   deal with the compact Twin Darts when flying high. Fighters stay until killed
   and keep their health across phases. At most two patrol separate lanes;
   Breakwater keeps attacking while they survive.
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
  Aim leads observed player movement by 0.10/0.13/0.16 s, clamped to the play
  area and native ship speed. They are shootable immediately but cannot ram for
  the first 0.22 s while emerging. Guidance lasts another 1.20/1.40/1.60 s,
  with turns limited to 2.6/2.9/3.2 radians/s; then the angle locks.
  Hunt speeds are 74/80/86 pixels/s;
  committed speeds 112/120/128. Expire harmlessly after 3.6 s or at the bounds.
  Both tubes on the command-cabin roof release missiles upward before guidance
  turns them towards the ship. The split bow remains the broadside cannon.
- **Broadside:** five volleys of five rounds. Each volley acquires a new aim,
  then holds its warning direction. Initial warning 0.95/0.85/0.75 s; repeat
  warning 1.10/1.00/0.95 s. Speeds 98/107/116 pixels/s. Center shell costs
  2 blocks, outer shots 1. The chamber opens for 0.30 s before repeat volleys.
- **Flak:** a vertical row of icicles travels left at 92/98/104 pixels/s,
  leaving a fixed marked 32-pixel gap after a 1.15 s warning.
- **Skipping shell:** 1.00 s warning, fixed two-hop path, shootable 6×6 shell;
  after 2.10 s it bursts into three upward rounds. Destroying it cancels the
  burst, including on its final pending update.
- **Twin Darts:** phase 2+, the same 11×8, 2-HP, 30-point fighters rise from
  the bay 0.45 s apart, then patrol x=148/176 and y=80/52 with small oscillations.
  They remain until destroyed, retain damage across phases and player respawns,
  and never stack. Later deployments replace only missing lanes; full slots
  cause the boss to select another attack. Each uses a locked 0.45 s warning
  and an 82 pixels/s aimed shot, then at least 1.15 s rest. Fighters take turns
  warning; shot spacing is at least 1.10 s, with at most two escort rounds alive.
  New warnings occur during boss recovery, idle or fighter deployment. Starting
  another boss pattern cancels a pending fighter warning; the next shot needs
  a fresh full warning. Existing rounds can travel into the next boss warning.
  Dialogue and respawn hold fighters harmless without resetting HP. Emerging
  fighters cannot ram or be shot until above the hull. These rules are boss-only;
  the two regular-enemy combat flights retain their original behavior.
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
- **Torpedoes then ice:** phase 3, only two missiles, with 1.60 s guidance
  after emergence. Wait until all surviving missiles have committed, then
  mark the player's current column and a separate column for 0.90 s before
  the ice erupts. Surviving missiles cannot home into the newly warned escape
  route. Shooting them down earns a simpler follow-up.

Transient boss patterns resolve before the next one; persistent fighters and
at most two escort rounds do not block boss recovery or selection. Encounters
are bounded to four missiles, two fighters, twenty boss-pattern rounds plus two
escort rounds. Phase dialogue and player deaths cancel pending boss attacks,
missiles and projectiles while retaining harmless fighters. Boss defeat and
restart clear the fighters too.

## Art and destruction preservation

The 58×24 icebreaker, split bow and reachable chamber retain their scale and
design, with a compact twin-cell roof launcher. Eighteen cached hulls cover
three phases, open/closed armor and three launcher heights; masks and flashes
match every frame. The raised launcher is cut into the bridge wreck section.
Missile art remains cached at double detail; its circular hit area stays inside
the visible body while rotating. The original
hero, flame, bullets, coast and compact regular enemies are unchanged.

`wreck.js` retains the exact revision-2 destruction physics: ten sections of
the actual last hull frame release from 0.40–2.80 s; a reactor rupture at
2.80 s; spinning, falling and two snow impacts per section; score awarded once
at 6.40 s; harmless wreckage stays through the victory delay. No blood or new
recorded music. Original synthesized effects and option settings are reused.

## Validation

All **256 focused and 220 existing checks pass (476 total)**: 101 combat,
49 smoke, 35 seeded-level (seed 28) and 35 scenery checks.
Both portable phone layouts (915×412 and 874×412) complete a full victory with
embedded artwork, zero external requests and no browser errors. The five
existing speed scenarios retain their drawing-call counts.

The focused suite covers native touches, safe areas, pause/replay, all attacks,
per-volley warnings and locks, 2/3/4 missile salvos, bounded homing, straight
commitment, expiry, two-hit counters, real gun counters, rotating hit-area
visibility, responsive selection, cooldowns and actual rest intervals.
It tests complete no-hit flights through torpedoes, both combined patterns and
the broadside at x=76, 110 and 144 with both fighters alive and two seconds of
follow-up fighter shots, plus the broadside's existing escape cases. Ice warnings
in the linked sequence begin only after homing ends. It also checks pending-salvo
cleanup at phase change, player death and boss death, all original special
weapons against armor, rewards and supplies, loss races and exact destruction.
Revision-4 checks also verify longer guidance, limited turns, motion prediction,
roof origins/raising, all eighteen masks and exact ten-part reconstruction,
unchanged broadside counts/speeds/damage/warnings, 60-second persistent patrols,
repeated warned and staggered shots, occupied-slot selection, partial replacement,
HP persistence through phases, safe respawns and interrupted deployments.
Original hero/flame/bullet pixels and firing match, saves receive zero writes,
and no recorded music is requested.

`tools/boss-benchmark.mjs` compares duration and stationary pressure against
unchanged Glacier Warden, records controlled pressure in each phase, and runs
a reactive pilot with normal health/lives and original movement/fire inputs.
The helper does not handle every Warden mechanic equally well; it is not proof
of human difficulty. Drawing comparisons include scenery, cached hull, active
missiles/fighters/projectiles and destruction on the same cloud browser,
not phone FPS.
With simulation dice held at 0.25/0.45/0.75, the reactive pilot loses its three
lives to Breakwater after 87.8–116.0 s, reaching phase 2. Stationary phase samples
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
node tools/boss-demo-test.mjs /tmp/ember-boss-v4-checks
node tools/boss-benchmark.mjs /tmp/ember-boss-v4-benchmark
node tools/combat-demo-test.mjs /tmp/ember-combat-checks
node tools/smoke-test.mjs /tmp/ember-smoke
SEED=28 node tools/level-test.mjs /tmp/ember-levels
node tools/coast-demo-test.mjs /tmp/ember-coast
node tools/speed-test.mjs
node tools/export-boss-demo.mjs /workspace/artifacts/glacier-coast-boss-v4.html
```

Create smoke/level screenshot directories first; run suites sequentially.
Portable HTML embeds all modules and the approved PNG; verify full wins at both
phone sizes with zero external resource requests. Physical-phone opening still
needs owner review; do not give localhost links. A phase-3 video selects that
phase and starts two fighters for a short preview, then uses normal health/lives
and actual touch inputs.
It is labeled as selected phase 3, rather than a full earned playthrough. Videos
are silent; the playable preview retains its original sound effects.
