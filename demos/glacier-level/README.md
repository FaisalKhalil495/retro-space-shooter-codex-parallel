# Glacier Coast — full mission preview 3

The owner explicitly approved this separate full mission on 2026-10-21.
The owner requested larger, sharper ships on 2026-10-22, then reported
remaining old/small enemies. Preview 3 completes the missed conversions.
Look for **LEVEL 4 PREVIEW 3**. Three sections of regular combat lead into
the Breakwater 7 fight with updated reinforcement art. The campaign still has three levels;
the scenery, combat and boss previews remain available as delivered.

## Phone review

1. Hold the phone sideways and tap **Start full mission**. Use the original
   direction pad, Fire and Special. Start with five health, three lives and
   the ordinary gun. Shoot supply pods and collect their original pickups.
2. W1 introduces skiffs, anchor guns and darts; W2 brings bombers, rollers,
   precision ships and diving hunters; W3 mixes the roster. Larger enemies
   follow the supplied original pictures. Gun positions and
   silhouette collisions match their bodies; locked warnings and individual
   attacks retain their original timing and damage.
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

## Larger, sharper mission artwork

| Regular enemy | Original combat size | Preview 3 size |
| --- | --- | --- |
| Shelf Skiff | 14×9 | 30×10 |
| Anchor Gun | 12×8 | 28×15 |
| Twin Dart | 11×8 | 24×12 |
| Crest Bomber | 18×10 | 34×9 |
| Snow Roller | 16×10 | 30×13 |
| Needle Wing | 16×8 | 34×11 |
| Wake Hunter | 15×10 | 32×13 |

Sizes are game pixels on the unchanged 208×144 world.
Source proportions keep long ships and wide bombers distinct rather than
stretching every vehicle into the same box. All seven detailed transparent
cutouts derive from the owner's original references; drum wheels, swept fins,
crescent wings, exposed bombs and twin skis remain recognizable. Anchor/Dart
now use their detailed concepts in closed/open weapon states, replacing the
old enlarged paintings. Cached pictures use four source pixels per game pixel.
The hero retains its original 18×11 outline;
quarter-pixel shading, seams and canopy highlights sharpen its interior.

Actual alpha silhouettes determine collisions and hit flashes. Enlarged gun
positions drive warnings and shots. Ground followers keep four pixels behind
an older machine and flyers reserve 19 pixels above the floor, accommodating
the taller anchor during dives. No-fire overlap checks caught the need for
this spacing. Existing HP, scoring, attack timings/speeds/damage, pod schedule,
player motion and defenses stay unchanged. The boss retains its hull, attacks
and breakup. Its persistent escorts now use the same new 24×12 Dart as regular
waves, with matching alpha
collisions and firing points. Their 2 HP, 30 points, rear arrivals, warnings,
survivor health and firing scheduler remain unchanged. The lower pair have
bounded vertical sway so all four wider fighters stay separated above the
boss hull. The older separate boss preview retains its original compact art.

See [asset provenance](assets/README.md). Cached art is prepared before Start
becomes available; the portable copy embeds it and makes no external requests.

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

In the three seeded no-fire checks at both phone sizes, **59 craft enter and
21 crowded slots expire**, with all seven types represented. The worst delay
is 7.85 seconds. Four regular craft, five visible actors including hazards,
and 13 regular rounds are the observed peaks. No visible regular sprites
overlap; ground machines stay on the floor. Every sampled 24-pixel column has
at least 38.85 pixels between padded actor/hazard boxes. This measures physical
crowding, not bullet-free routes or phone difficulty.

The invulnerable auto-aim progression fixtures admit all 80 craft with no
expired slots, max delay 0.76 seconds, boss arrival at 183.51 seconds and
victory around 282.14 seconds. No-fire boss arrival is 195.13 seconds. These
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
new `LEVELS` entry, save format, menu integration or music recording. All shared modules, accepted campaign sprites, older picture assets
and earlier demos remain unchanged. Private mission art refines the player
interior while preserving its outline, size, hitbox, flame and bullets. The native floor stays y=130 with no new solid obstacles.

The mission preserves native ownership for regular rounds; boss patterns
still explicitly tag their shots. A local `killEnemy` hook removes a killed
actor immediately after native scoring/effects. That prevents reused bombs
and charges from updating once more and bursting after a last-frame shootdown.
Both counter checks failed before this hook and pass afterward. No shared
or delivered-preview behavior was edited to fix this new mission.

## Validation and delivery

**1,006 checks pass:** 88 mission, 53 art, 78 escort and 787 existing checks. The new
checks cover real simultaneous touch inputs, safe areas, pause/app interruption,
six seeded wave runs per phone (including three full victories), no-fire
crowding, finite queues, all seven
types, the safe boss handoff, complete three-phase victories, original supplies,
resource identity and carryover, native shot ownership, checkpoint eligibility,
fresh retry values, full replay, stuck hazards, last-frame shootdown counters,
original hero silhouette and geometry, exact pixels outside its body
(flame/bullets), refined interior colors and original firing, no save writes and no new music.

The standalone export embeds all 43 modules, both reference-derived invader
atlases and the exact supplied battlefield JPEG. Both phone layouts complete
all 80 arrivals and three boss phases, then
exercise the retry UI with no external resource requests, browser errors or
save writes. Its progression fixture is invulnerable and auto-aims.

The short video selects the final-wave section and a phase-3 reinforcement call
with native reset health/lives, ordinary equipment and normal entry protection in waves (no invulnerability
in the selected boss fixture). Native automated touches steer and fire; health, position and invulnerability are not edited during play.
The visible captions identify the selected sections; this is not an earned
full run. Four new reinforcements enter before ordinary native fire starts.
The video is silent; the playable preview retains native sound effects.

`tools/mission-benchmark.mjs` samples cached drawing in the same browser, with
four regular craft, one charge and thirteen rounds versus the same scene with
no threats. Cloud samples are not physical-phone FPS. Earlier-game drawing-call
counts remain 304/356/298/347/589. Review real Android Chrome and Safari on phones.

```sh
source /workspace/.cloud-onboarding/ember-drift/environment.sh
node tools/mission-art-test.mjs /tmp/ember-mission-art
node tools/mission-escort-test.mjs /tmp/ember-mission-escorts
node tools/mission-demo-test.mjs /tmp/ember-mission
node tools/mission-benchmark.mjs /tmp/ember-mission-benchmark
node tools/export-mission-demo.mjs /workspace/artifacts/glacier-coast-mission-v3.html
```

Run the existing boss/reinforcement/difficulty/battlefield/combat/smoke/seed-28
level/coast checks sequentially as well. Stop for phone review before new music,
permanent progress or campaign integration. Work only in the allowed parallel
repository; do not publish, merge or deploy this preview to the other repositories.
