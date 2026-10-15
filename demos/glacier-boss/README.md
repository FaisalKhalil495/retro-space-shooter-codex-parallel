# Breakwater — separate boss preview

The owner approved this stage after accepting coast combat revision 3. This
preview is implemented under `demos/glacier-boss/`. Look for **BREAKWATER 1**
below the left controls. The campaign remains v0.29.0 with three levels.

## Phone review

1. Hold the phone sideways and tap **Start boss fight**.
2. Steer with the original left pad and hold **Fire**. Aim at the front gun
   chamber when the bow opens. Closed armor blocks ordinary and special shots.
3. Watch the aim dots, hopping-shell trail, snow markers and flashing lamps.
   Move above the hull when it winds up for a sliding rush; the return pass
   has its own pause, rev and warning lamps.
4. Shoot supply pods and collect their drops. The **Special** button uses the
   weapon you carry. You start with the normal gun, five health blocks, three
   lives and no special; existing adaptive supply rules apply.
5. Pause/resume or restart the whole fight. Turning upright or switching apps
   pauses it. Victory and losing all lives offer replay. There is no fixed
   30-second finish: this preview ends on victory or loss.

Review size, readability, warning time, the opening chamber and the feel of
sliding movement. All three phases should be distinct. Android/iPhone sizes
are checked in Chromium; physical Android Chrome and Safari remain phone checks.

## Implemented tuning

Breakwater is a 58×24-pixel low naval vessel with three smooth runners, a
wedge bow, bridge, side bay, stern gun and exhaust towers. It has no legs,
tracks or saw ring. Art is prepainted at double detail before the first frame:
three damage states, closed/open chamber states, flashes and silhouette masks.
The chamber has a visible, unobstructed forward opening. Its plates fold back
far enough to let the existing curved rockets reach it; closed armor still
blocks them. Contact follows the displayed opaque silhouette.

- 240 HP, 7,000 kill points; original 1,000/2,000 phase bonuses and survival/
  weapon rewards at 66% and 33% HP. Original surviving-life bonus on victory.
- Enters after 2.5 seconds, slides in, shows its name card, roars and speaks.
  Speech happens during safe pauses; dying cancels pending attacks/hazards.
- Phase 1: broadside and skipping shells. Phase 2 adds ice bursts and darts.
  Phase 3 adds the sliding rush, shorter rests and faster broadside rounds.
- Regular movement stays between x=104 and 144 at 21/24/27 px/s. A committed
  rush reaches x=30–72 at 112 px/s, warns again for 0.75 s, then returns at
  68 px/s. Contact costs 2 health blocks, or 3 during either sliding pass.
- The chamber opens in the final 0.40 s of an attack warning, before repeat
  broadside volleys, and for 1.15 s of recovery. Breaking armor does not leave
  it permanently open. Bombs, rockets and laser obey the opening rule.

| Attack | Warning and behavior |
| --- | --- |
| Broadside | 1.00 s initially, 0.85 s in phase 3; five rounds per volley at 77/82/87 px/s. Three volleys, each subsequent one warned 1.20 s ahead along the same locked angle. Central heavy shell costs 2; four ordinary rounds cost 1 each. |
| Skipping shell | 1.10 s warning and a fixed dotted two-hop path. A 6×6 shootable shell travels for 2.10 s, then bursts into three upward rounds at 58 px/s. Shooting it destroys it safely, even immediately before expiry. 1 HP, 10 points, rockets ignore it. |
| Dart launch | 1.00/0.85 s warning. Two accepted 11×8 Twin Darts launch from the side bay, 0.45 s apart, rising for 0.65 s into separate lanes. They cannot ram or be targeted while emerging behind the hull. Then they use the accepted original dart behavior, warning and art. |
| Ice bursts | 1.00/0.85 s warning. Two fixed visible marks, at least 44 px apart and clear of the hull, release three upward icicles each at 76/79 px/s. No lasting solid terrain. |
| Sliding rush | 1.15 s warning before a committed low pass; separate 0.75 s warning before returning. Fly above it. It opens to recover after returning home. |

Patterns resolve before the next begins; no simultaneous different patterns in
this first review. Repeated broadside volleys keep their locked direction and
escape lanes. Limits are two darts and at most ten enemy projectiles at once.
Drones, shots and shells must clear before the next pattern promises a new gap.

Boss supplies use the existing alternating survival/weapon pods: first after
3 s of fighting, then every 20 s. They stay high and visible. Drops still adapt
to current health, shield and weapon, so a weapon-role pod may give repair when
hurt. Existing machine explosions, metal debris and sound effects are reused.
There is no blood or new recorded music. Breakwater's own song needs a separate
listening review before campaign Level 4 is released.

## Validation and preservation

122 focused checks exercise both phone layouts, real simultaneous touches,
weak-point reachability, all specials against armor, every volley's warning,
locked paths, separated launch lanes, mark placement across hull positions,
projectile caps, actual dodges, five common hiding positions, knockback from
all sides, supplies, a full win, native damage/lives, losses during phase changes
and simultaneous boss/player deaths, pause, replay and interruption handling.
Exact original hero/flame/bullet pixels and firing match. Saves have zero writes,
and no recorded music is requested. Both standalone exports complete a full
fight with zero external resource requests. Existing 101 combat, 49 smoke,
35 seeded-level and 35 scenery checks pass: **342 checks in total**.

`tools/boss-benchmark.mjs` uses the same controlled pilot for this boss and the
Glacier Warden: fixed simulation dice, normal starting gun, no pre-equipped
special, a ship held at x=26 tracking each aim point’s height without dodging,
normal hit invulnerability,
and a large health pool to count damage without deaths. It compares normal-gun
runs and runs using the special weapons received from phase rewards. This
measures encounter duration and stationary pressure, not human difficulty.
Exact results are written to the selected output directory's `metrics.json`.
Current controlled results (seconds include entrance and victory):

| Pilot | Breakwater | Glacier Warden |
| --- | --- | --- |
| Normal gun | 131.1 s, 21.8 damage blocks/min | 159.6 s, 22.0 blocks/min |
| Uses phase-reward specials | 96.4 s, 23.6 blocks/min | 117.7 s, 18.2 blocks/min |

These samples show comparable normal-gun pressure and higher pressure when using
phase-reward weapons; they are not a substitute for the owner's difficulty review.
A separate alternating 60-draw comparison uses the loaded coast background and
cached phase-3 art; cloud-browser samples do not establish phone frame rates.
The existing five-scene benchmark also retains its original drawing-call counts.

`scene.js` extends the original Game; boss, shell and preview definitions stay
local. Neither shared ENEMY_TYPES nor LEVELS is changed. `main.js` reuses original
controls and layout, with no score/progress/option writes or campaign navigation.
The approved coast and enemy demos, hero/bullets, existing levels, menus, saves,
recorded themes and shipped assets remain unchanged. Boss music and full Level 4
integration remain separate stages after this review.

## Reproduce checks and delivery

```sh
source /workspace/.cloud-onboarding/retro-space-shooter/environment.sh
node tools/boss-demo-test.mjs /tmp/ember-boss-checks
node tools/boss-benchmark.mjs /tmp/ember-boss-benchmark
node tools/combat-demo-test.mjs /tmp/ember-combat-checks
node tools/smoke-test.mjs /tmp/ember-smoke
SEED=28 node tools/level-test.mjs /tmp/ember-levels
node tools/coast-demo-test.mjs /tmp/ember-coast
node tools/speed-test.mjs
node tools/export-boss-demo.mjs /workspace/artifacts/glacier-coast-boss.html
```

Create smoke/level screenshot directories first and run suites sequentially.
The single-file export embeds the exact modules and approved landscape PNG;
it is a review copy, not a build requirement. The managed browser blocks direct
`file:` navigation, so the export is verified through an internal server.
Physical-phone opening remains a user check; do not give localhost phone links.
The fight video uses an automated touch pilot with normal health, lives and
weapons, without invulnerability or boss-health edits. It demonstrates the
fight; its duration depends on dodging and firing opportunities. The MP4 is
silent; the playable preview retains the original sound effects.
