# Glacier Coast — full mission preview 1

The owner explicitly approved this separate full mission on 2026-10-21.
Look for **LEVEL 4 PREVIEW 1**. Three sections of regular combat lead into
the unchanged Breakwater 7 fight. The campaign still has three levels;
the scenery, combat and boss previews remain available as delivered.

## Phone review

1. Hold the phone sideways and tap **Start full mission**. Use the original
   direction pad, Fire and Special. Start with five health, three lives and
   the ordinary gun. Shoot supply pods and collect their original pickups.
2. W1 introduces skiffs, anchor guns and darts; W2 brings bombers, rollers,
   precision ships and diving hunters; W3 mixes the roster. Small sprites,
   gun positions, locked warnings and individual attacks are unchanged.
3. Remaining enemies and regular fire clear before the boss warning. Keep
   your actual health, lives, score, weapons and remaining timed powers when
   Breakwater arrives. There is no free refill or fresh-player reset here.
4. Fight the exact revision-7 boss: 7/8/10 faster broadsides, aggressive roof
   torpedoes, random reachable lance gaps, rear fighters and the same breakup.
5. Pause/resume, turning upright and switching apps work as before. Restart
   mission begins a fresh run. After a defeat at the boss, **Retry boss · score
   from 0** starts its warning with five health, three lives and no special
   weapon or timed powers. This checkpoint exists only in the current run.
6. Victory offers **Replay whole mission**. Nothing is saved to scores,
   reached levels or options. Sound effects play; new recorded music still
   needs a separate listening review.

## Timeline and actual counts

The wave clock lasts 180 seconds and pauses while dead or entering after a
respawn. The boss approach can take longer if enemies survive. The boss fight
then adds its own duration; three minutes is the regular-combat section.

| Scheduled type | Individual craft |
| --- | --- |
| Shelf Skiff | 13 |
| Anchor Gun | 11 |
| Twin Dart | 24 |
| Crest Bomber | 9 |
| Snow Roller | 7 |
| Needle Wing | 9 |
| Wake Hunter | 7 |
| Total | 80 |

The sections schedule 20/26/34 craft. Pods, shootable bombs/charges and boss
reinforcements are counted separately. Counts are a schedule, not a forced
backlog: occupied lanes delay arrivals; stale slots expire after 8 seconds,
or 12 for bombers/hunters. Admissions stay at least 0.9 seconds apart, with
four regular craft maximum including incoming ones. Two ground actors need
wide horizontal spacing. Ordinary flyers use lanes at y=32/94; a bomber or
hunter reserves the sky and flies without another flyer crowding its attack.

In the three seeded no-fire checks at both phone sizes, **60 craft enter and
20 crowded slots expire**, with all seven types represented. The worst delay
is 8.99 seconds. Four regular craft, five visible actors including hazards,
and thirteen regular rounds are the observed peaks. No visible regular sprites
overlap; ground machines stay on the floor. Every sampled 24-pixel column has
at least 43.65 pixels between padded actor/hazard boxes. This measures physical
crowding, not bullet-free routes or phone difficulty.

The invulnerable auto-aim progression fixtures admit all 80 craft with no
expired slots, max delay 0.76 seconds, boss arrival at 183.51 seconds and
victory around 282.14 seconds. No-fire boss arrival is 199.13 seconds. These
fixtures prove progression; they do not represent a human player's survival.
An unexpected stuck threat has a 24-second retirement guard before the boss
warning; that fallback is not used in the normal seeded runs.

Ten native supply pods retain the existing level schedule: rockets at 20 s,
shield 36, bombs 49, spread 64, life 77, repair 90, rapid 110, laser 126,
repair 140 and wingman 154. Native boss survival/weapon pods and phase rewards
remain unchanged. Timed powers continue counting down during the transition.

## Implementation boundary

`MissionGame` extends the unchanged boss-preview class and replaces its
2.5-second boss-start runner with `MissionRunner`. The runner owns only local
wave arrivals, pod scheduling, threat draining and the warning. There is no
new `LEVELS` entry, save format, menu integration or music recording. All
original modules, accepted sprites, picture assets and earlier demos remain
unchanged. The native floor stays y=130 with no new solid obstacles.

The mission preserves native ownership for regular rounds; boss patterns
still explicitly tag their shots. A local `killEnemy` hook removes a killed
actor immediately after native scoring/effects. That prevents reused bombs
and charges from updating once more and bursting after a last-frame shootdown.
Both counter checks failed before this hook and pass afterward. No shared
or delivered-preview behavior was edited to fix this new mission.

## Validation and delivery

**875 checks pass:** 88 mission checks plus the 787 existing checks. The new
checks cover real simultaneous touch inputs, safe areas, pause/app interruption,
six seeded wave runs per phone (including three full victories), no-fire
crowding, finite queues, all seven
types, the safe boss handoff, complete three-phase victories, original supplies,
resource identity and carryover, native shot ownership, checkpoint eligibility,
fresh retry values, full replay, stuck hazards, last-frame shootdown counters,
exact hero/flame/bullet pixels and firing, no save writes and no new music.

The standalone export embeds all 41 modules and the exact supplied battlefield
JPEG. Both phone layouts complete all 80 arrivals and three boss phases, then
exercise the retry UI with no external resource requests, browser errors or
save writes. Its progression fixture is invulnerable and auto-aims.

The short video selects the final-wave section with native reset health/lives,
ordinary equipment and normal entry protection. Native automated touches steer
and fire; health, position and invulnerability are not edited during play.
The visible caption states that this is a selected section, not an earned full
run. The video is silent; the playable preview retains native sound effects.

`tools/mission-benchmark.mjs` samples cached drawing in the same browser, with
four regular craft, one charge and thirteen rounds versus the same scene with
no threats. Cloud samples are not physical-phone FPS. Earlier-game drawing-call
counts remain 304/356/298/347/589. Review real Android Chrome and Safari on phones.

```sh
source /workspace/.cloud-onboarding/ember-drift/environment.sh
node tools/mission-demo-test.mjs /tmp/ember-mission
node tools/mission-benchmark.mjs /tmp/ember-mission-benchmark
node tools/export-mission-demo.mjs /workspace/artifacts/glacier-coast-mission-v1.html
```

Run the existing boss/reinforcement/difficulty/battlefield/combat/smoke/seed-28
level/coast checks sequentially as well. Stop for phone review before new music,
permanent progress or campaign integration. Work only in the allowed parallel
repository; do not publish, merge or deploy this preview to the other repositories.
