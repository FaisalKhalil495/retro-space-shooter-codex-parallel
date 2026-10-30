# Glacier Coast — full mission preview 7

The owner requested slightly slower enemies and bombers staying longer for
additional bombing runs after playing Preview 6. Look for **LEVEL 4 PREVIEW 7**.
[Pacing review](../../docs/concepts/level-4-enemies/mission-pacing-review.md).
The small artwork and earned loot from Preview 6 remain.
The three-level campaign and earlier previews remain intact.

## Phone review

Open:
https://faisalkhalil495.github.io/retro-space-shooter-codex-parallel/demos/glacier-level/index.html?preview=7

Turn sideways and tap **Start full mission**. The original pad, Fire and Special
remain. Groups of 3–5 attack together through a three-minute approach, followed
by Breakwater. All seven types appear early. Regular approaches and passing
movement are now 15% slower. Surviving bombers
make five warned drops instead of two. Small fighters remain narrower than your
ship; heavy machines keep the Preview 6 reduction.

Kills now have a chance to drop ammo, spread, rapid fire, shields, repairs and
wingmen, using the original game's loot system. Pick items up by flying into
them. Spread and rapid activate automatically; use Special for ammunition.
Ammo refills your carried special; full ammo gives a shooting power-up instead.
More kills mean more chances for useful equipment. At low health drops become
more frequent and favor repairs; at full health repair odds become spread/rapid.
The ten scheduled supply pods still provide their usual help.

Remaining health, lives, score, ammo and power-up time carry into the boss.
Pause, portrait and interruptions work as before. Restart begins the mission;
boss defeat offers **Retry boss · score from 0** with native fresh-start values.
The checkpoint is only in memory; scores/progress/options are never written.

## Sizes and rewards

| Enemy | Current size | Preview 5 size | Base kill-drop chance |
| --- | --- | --- | --- |
| Shelf Skiff | 18×7 | 25×9 | 30% |
| Anchor Gun | 17×10 | 23×13 | 15% |
| Twin Dart | 14×7 | 20×10 | 20% |
| Crest Bomber | 20×6 | 28×8 | 35% |
| Snow Roller | 18×8 | 25×11 | 35% |
| Needle Wing | 20×7 | 28×9 | 15% |
| Wake Hunter | 19×8 | 26×11 | 10% |

Boss fighters share the 14×7 Dart. Widths shrink 26–30%, roughly halving occupied
picture area. The same PNG source pictures and both weapon states are retained.
Quarter-pixel detail, alpha masks, hit flashes, muzzle points and turns scale
together. The hero remains 18×11 with its selected sharp interior, silhouette,
flame, bullets, firing, controls and hitbox. Ground machines remain shootable
with the normal gun. See [asset provenance](assets/README.md).

Mission types now declare loot chances instead of silently defaulting to zero.
Native `maybeDrop`, item placement, collection, weapon quantities and power-up
durations are reused. Heavy carriers use 50% hurt chance; other rates use the
native adaptive formula. Ammo uses the native 30% branch on successful rolls.
Full-special fallback uses `weaponPick` through the same resolver for drawing
and collection, and changes back to ammo if you spend some before grabbing it.
No rewards for natural departures, no duplicate death rewards, and no random
loot from hazards/boss escorts. No new currency, upgrade system or loot tell.

## Preserved pressure

Keep all **54 formations/214 scheduled craft**, sections of 54/72/88, maximum
eight regulars/six flyers/two ground units, 0.42-second member scheduling and
at least 0.28-second admissions. Occupied lanes defer entries; slots still
expire after 8 seconds, or 12 for bombers/hunters, without late catch-up dumps.

Group Darts advance at 40.8 px/s and rest 0.4 seconds between up to four warned
shots, with their bounded height adjustment. Other regular tactics, HP, score
and damage remain. Entry, passing and hunter dive movement are 15% slower;
stationary ground machines still follow the 20 px/s scrolling land. Bombers
make up to five drops with the original 0.8-second warnings and 1.1-second rests.
Each re-aims before locking its target; shooting the bomber stops future drops.
Horizontal spacing, staggered hunter dives and full warning
locks remain; warning starts stay 0.28 seconds apart and salvos 0.18 seconds
apart. Ordinary shot boosts remain 20/25/30% by minute, never applied to the boss.
Passed machines still turn visibly; exit directions stay locked; rightward
charges brake on-screen for their full fuse warning.

The battlefield, still smoke, rocky ice shelf and floor y=130 remain. Ground
machines stay on the floor, flyers retain 19 pixels of clearance. Breakwater
keeps nine patterns, all phase/broadside deadlines, 1.05-second recovery, 250 HP,
rear reinforcements, defenses and exact ten-part breakup. New music and campaign
integration remain separate stages.

Ten native pods remain: rockets 20 s, shield 36, bombs 49, spread 64, life 77,
repair 90, rapid 110, laser 126, repair 140 and wingman 154. Boss supplies and
quiet phase rewards are unchanged. The new help is earned through kills.

## Verification

All **1,330 checks pass**: 52 pacing, 88 reward, 74 formation, 96 pressure,
88 mission, 67 art, 78 escort and 787 earlier-content checks. Actual Preview 6
fails the new slower-movement test, as expected. Both standalone phone layouts
complete all 214 entries/three phases and verify retry/selection without errors,
external requests or save writes. Surviving standalone bombers retire at 13.8 s
instead of 7.25 s, with five full warned/re-aimed drops rather than two.

Complete no-fire progression admits 161 slots and expires 53, with at most
eight regulars/ten actors including hazards/17 rounds, no overlap and a safe
boss arrival at 200.22 s without fallback. The padded-column minimum is 18.94
pixels. Armed invulnerable progression admits all 214 with no skips, reaches
the boss at 184.24 s and clears at 274.87 s. These are progression/crowding
fixtures; phone play remains the final feel check.

The pacing suite pins actual Preview 6 and measures each movement phase,
observes five separately warned drops, locks/reacquires targets, checks longer
residence and verifies that killing the bomber cancels remaining drops. Wave
and pod data plus ordinary/boss projectile speeds remain exact. The full armed
progression check still requires all 214 entries; no-fire crowding may expire
more slots because slow surviving machines occupy lanes longer. Keep bounded
queues, caps and a safe boss handoff rather than catching up in a burst.

The reward suite compares actual Preview 5 and exercises real kills, drop
weights, native health adaptation, more kills/more items, ammo preservation,
full-ammo fallback, and normal movement to collect bullet-kill rewards. Spread
must actually fire three bullets; rapid must halve the original interval.
Smaller ground targets must remain killable from legal flight height.

Retain all 21 whole-formation no-hit routes, 17 paired/corner routes and 29 boss
routes at both phone sizes, including actual expected attacks and complete
threat clearance. Longer sequences use 20-second fixtures and newly verified
complete routes, including all five drops in each full bomber escape. Moving
pilots still face damage, but earned help may extend survival; old fixed death
deadlines are historical evidence rather than a reason to remove the requested
rewards. No-fire runs independently check sustained group pressure.

```sh
source /workspace/.cloud-onboarding/ember-drift/environment.sh
node tools/mission-pacing-test.mjs /tmp/ember-mission-pacing
node tools/mission-rewards-test.mjs /tmp/ember-mission-rewards
node tools/mission-formation-test.mjs /tmp/ember-mission-formations
node tools/mission-pressure-test.mjs /tmp/ember-mission-pressure
node tools/mission-demo-test.mjs /tmp/ember-mission
node tools/mission-art-test.mjs /tmp/ember-mission-art
node tools/mission-escort-test.mjs /tmp/ember-mission-escorts
node tools/mission-benchmark.mjs /tmp/ember-mission-benchmark
node tools/export-mission-demo.mjs /workspace/artifacts/glacier-coast-mission-v7.html
```

Run boss/reinforcement/difficulty/background/combat/smoke/seed-28 level/coast
checks sequentially. Both portable phone layouts must finish all entries/phases
and verify retry/selection with no external requests, errors or save writes.
Earlier previews and shared source remain unchanged. Update only the allowed
`codex/glacier-coast-demo` branch already used by Pages, then await phone review.
