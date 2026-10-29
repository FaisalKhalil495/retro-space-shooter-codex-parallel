# Glacier Coast — full mission preview 4

The owner approved this difficulty pass on 2026-10-29 after finding Preview 3
too easy and asking for a plan based on LESSONS.md. Look for **LEVEL 4 PREVIEW 4**.
The three-minute approach now applies sustained mixed-enemy pressure before
Breakwater. The three-level campaign and earlier separate previews are intact.
[Approved plan and implementation notes](../../docs/concepts/level-4-enemies/mission-difficulty-plan.md).

## Phone review

1. Turn sideways and tap **Start full mission**. Use the original pad, Fire
   and Special. Start with five health blocks, three lives and the normal gun.
2. Expect all seven enemy types during the first minute. Enemies warn while
   entering once their whole body is visible. Skiffs fire three spreads and
   Darts four shots; a bomber can fly with a supporting Dart. Hunters have a
   clear diving corridor with ground attackers firing beneath them.
3. Ordinary bullets are 20%, 25%, then 30% faster over the three wave minutes.
   Full warnings remain. Staying at one height holding Fire should be dangerous;
   changing height and making angled maneuvers should give workable escapes.
4. Shoot the original supply pods for weapons, shields, repairs and other
   useful pickups. Your actual health, lives, score, ammo and remaining timed
   powers carry into the boss without a free refill.
5. Breakwater retains its nine weapons/tactics, 250 HP, warned reachable lance
   gaps, roof torpedoes and exact ten-part breakup. Phases 2–3 allow at most
   two other attacks between broadsides; phase 3 uses its existing combinations
   after at most two ordinary attacks once introductions finish. Its shots do
   not inherit the ordinary-bullet speed boost. The larger persistent fighters
   still arrive from behind, retain damage and fill only missing slots.
6. Pause/resume, turning upright and app interruptions work as before. Restart
   begins a fresh mission. After losing at the boss, **Retry boss · score from
   0** offers a fresh attempt with five health, three lives and no special or
   timed powers. The checkpoint stays in memory only; nothing writes scores,
   progress or options. New recorded music remains a separate review stage.

## Current combat rules

All ordinary health, contact/shot damage, score and artwork remain unchanged.
Skiff follow-up waits fall from 1.2 to 0.8 seconds; Dart waits from 1.15 to 0.75.
Bombers keep two bombs with 1.1-second waits; rollers keep two charges with
1.2-second waits. Needle Wings retain two separately aimed/locked shots.
Anchor Guns retain their 1.6-second vulnerable opening.

Regular weapon warnings begin at least 0.28 seconds apart; regular projectile
salvos stay at least 0.18 seconds apart. Each warning keeps its original duration.
Respawn interruptions get a fresh warning. No fire originates off-screen or
backwards from a gun. Passed machines turn visibly between warnings and leave
room to face the player; each turn gets a new full warning. Their original
pictures, muzzles and hit masks mirror together. Warning/exit direction locks
prevent unannounced hunter reversals. Rightward rolling charges brake on-screen
for the original full fuse warning. The boss retains its full 1.05-second
vulnerable recovery, original phase introductions, attack speeds, warning times,
native defenses and rewards.

| Ordinary shot | Minute 1 | Minute 2 | Minute 3 |
| --- | --- | --- | --- |
| Skiff spread | 86.4 | 90 | 93.6 |
| Dart round | 98.4 | 102.5 | 106.6 |
| Needle shot | 132 | 137.5 | 143 |
| Anchor shell | 84 | 87.5 | 91 |

Speeds are game pixels/second. The multiplier also applies to ordinary hazard
fragments, not boss-owned rounds. There is no global `shotSpeed` change that
would accidentally multiply the boss's already-tuned attacks.

The final camping audit also tested the far-right boundary. Preview 3 let
high/middle right-edge campers finish without damage. Preview 4 makes them
fight: normal fixed-position shooters now lose all lives around 55.66/37.69 s.
Two no-hit corner exits allow 0.15 seconds to react before an ordinary-input
retreat. Outflanking remains a useful counter; standing past an enemy no longer
silences it for the whole level. The actor count, source artwork and player
movement stay unchanged.

## Timeline and actual counts

Eighty craft remain scheduled in 20/26/34 sections over 180 wave seconds.
The clock pauses during death/entry; the approach can take longer while
surviving enemies and shots leave. The boss adds its own fight duration.

| Scheduled type | Individual craft |
| --- | --- |
| Shelf Skiff | 10 |
| Anchor Gun | 10 |
| Twin Dart | 20 |
| Crest Bomber | 11 |
| Snow Roller | 9 |
| Needle Wing | 11 |
| Wake Hunter | 9 |
| Total | 80 |

Pods, bombs/charges and boss fighters are separate. First opening heavy slots
are bomber 17.93 s, roller 26.73, Needle Wing 29.67 and hunter 38.47. All seven
actually enter before wave second 60 in the no-fire audit, not just on paper.

Regular actors are capped at four including incoming craft. Admissions stay
0.9 seconds apart; busy lanes defer entries, and stale slots expire after
8 seconds (12 for bombers/hunters) instead of producing a late catch-up burst.
Two ground machines stay widely spaced. At most two flyers share the sky;
only one Dart can accompany a bomber, and hunters keep other flyers out of
their committed dive corridor. Ground support still fits underneath.

Seeded no-fire runs admit **67 craft and expire 13 crowded slots**. Observed
peaks: four regular machines, five actors including hazards, thirteen rounds,
no visible regular overlap, and at least 38.60 pixels between padded boxes
per 24-pixel column. The longest admitted delay is 9.01 seconds. This measures
body crowding, not bullet-free routes. Boss arrival is about 197.64 seconds.

Invulnerable auto-aim progression admits all 80 with no skips, at most 0.01 s
admission delay, boss arrival 183.51 s and victory 282.14 s. This fixture proves
progression, not human difficulty. A 24-second stuck-threat retirement guard
bounds approach; normal runs do not use that fallback.

Ten native pods retain their schedule: rockets 20 s, shield 36, bombs 49,
spread 64, life 77, repair 90, rapid 110, laser 126, repair 140 and wingman 154.
Native adaptive boss pods and quiet phase rewards remain. The mission neither
removes useful help nor inflates enemy HP to extend the fight.

## Preserved artwork and implementation

Preview 3's seven detailed enemy designs and both weapon states are unchanged.
Sizes: Skiff 30×10, Anchor 28×15, Dart 24×12, Bomber 34×9, Roller 30×13,
Needle 34×11, Hunter 32×13 on the 208×144 game grid. Boss fighters use the
same 24×12 Dart. Quarter-pixel pictures, alpha masks, warning muzzles and hit
flashes remain consistent. Hero outline, 18×11 footprint, hitbox, interior
sharpening, flame, bullets and firing are preserved. See [asset provenance](assets/README.md).

The supplied battlefield, still smoke and scrolling rocky ice shelf stay intact.
The solid floor remains y=130; ground machines stay on it, flyers retain
19 pixels of overhead clearance, and lower escort sway remains bounded.

`MissionGame` extends the unchanged boss preview. `combat.js` owns the private
regular tactics; `boss.js` wraps native patrol/selection timing and reuses the
native attacks/destruction. Neither shared game code nor earlier preview
behavior changes. The local kill hook still retires shot-down bombs/charges
immediately so their last-frame update cannot release fragments.

## Validation and delivery

**1,116 checks pass:** 96 new pressure, 88 mission, 67 art, 78 mission-escort
and 787 boss/background/earlier-content checks. The pressure suite checks real
first warnings, speed ownership, full warning durations, all seven early types,
mixed waves, attack counts, new boss selection at the native warning start,
and 17 complete no-hit paired encounters at both phone sizes. The suite fails
on the actual delivered Preview 3, proving it catches the old behavior.

Normal-health/native-input comparisons use the ordinary gun and no specials,
teleports or hidden assistance. Fixed-height shooters lose all lives at about
31.43/31.22/46.15 s (high/middle/low), versus 43.55/43.57/73.83 s in Preview 3.
The same simple moving patrol lasts 84.75 s versus 108.01 s before and 136.03 s
in Frostring. These are bounded review pilots, not human difficulty or survival
claims; the owner's Android/Safari phone play remains the deciding check.

The standalone HTML embeds all modules, both exact invader atlases and the exact
battlefield JPEG. Verify full wins and retry UI at both phone sizes with no
external requests, browser errors or save writes. The short review clip uses
normal health and native touches, clearly labeling any selected wave/phase.
Its purpose is to show the changes, not claim an earned full playthrough.

Cached drawing uses 93 calls/frame normally and 109 with all four actors
turned. Original-game call counts remain unchanged on the same machine;
cloud timing is not physical-phone FPS. No music, menu, campaign or permanent
progress changes are included. Await phone review after delivery.

```sh
source /workspace/.cloud-onboarding/ember-drift/environment.sh
node tools/mission-pressure-test.mjs /tmp/ember-mission-pressure
node tools/mission-demo-test.mjs /tmp/ember-mission
node tools/mission-art-test.mjs /tmp/ember-mission-art
node tools/mission-escort-test.mjs /tmp/ember-mission-escorts
node tools/mission-benchmark.mjs /tmp/ember-mission-benchmark
node tools/export-mission-demo.mjs /workspace/artifacts/glacier-coast-mission-v4.html
```

Run existing boss/reinforcement/difficulty/background/combat/smoke/seed-28 level/
coast checks sequentially. Work only in the allowed parallel repository; no
publication or deployment to either other repository is authorized.
