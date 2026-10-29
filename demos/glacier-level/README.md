# Glacier Coast — full mission preview 5

The owner played Preview 4 on their phone and directly requested slightly
smaller enemies, more waves, more aggression and groups like levels 1–3.
Look for **LEVEL 4 PREVIEW 5**.
[Comparison and implementation review](../../docs/concepts/level-4-enemies/mission-formation-review.md).
The three-level campaign and earlier separate previews remain intact.

## Play on a phone

Open the existing allowed repository's Pages address:
https://faisalkhalil495.github.io/retro-space-shooter-codex-parallel/demos/glacier-level/index.html?preview=5

Turn sideways and tap **Start full mission**. Use the original pad, Fire and
Special. Expect groups of 3–5 craft from the opening minute, with successive
flights of Darts, Skiff support, Needles, escorted bombers, ground convoys,
paired hunters and high/low pincers. All seven enemy types appear early.

Shoot the original supply pods. Actual health, lives, score, ammo and remaining
powers carry into Breakwater without a refill. Pause, portrait and interruptions
work as before. Restart begins the whole mission; a boss defeat offers
**Retry boss · score from 0**, with native five health/three lives/no powers.
The checkpoint stays in memory. The preview never writes scores or progress.

## Wave pressure and size

There are **54 formations and 214 scheduled craft**, in minute sections of
54/72/88. This replaces Preview 4's 80 mostly individual craft. Members arrive
0.42 seconds apart where clear; actual admissions remain at least 0.28 seconds
apart. Cap regulars at eight, with at most six flyers and two ground machines.
Occupied lanes defer entries; slots expire after 8 seconds (12 for bombers and
hunters) rather than causing a late catch-up burst. The three-minute wave clock
pauses during death/entry, and the boss follows after live threats clear.

Widths are 17–19% smaller, using the same detailed source pictures:

| Enemy | Current size | Preview 4 |
| --- | --- | --- |
| Shelf Skiff | 25×9 | 30×10 |
| Anchor Gun | 23×13 | 28×15 |
| Twin Dart | 20×10 | 24×12 |
| Crest Bomber | 28×8 | 34×9 |
| Snow Roller | 25×11 | 30×13 |
| Needle Wing | 28×9 | 34×11 |
| Wake Hunter | 26×11 | 32×13 |

Boss escorts use the same 20×10 Dart. Source PNGs/JPEGs are unchanged. Body,
quarter-pixel detail, alpha collision masks, muzzles, opening states, turns and
hit flashes scale together. The hero remains 18×11, with the exact selected
silhouette, sharp interior, flame, bullets, firing, motion and hitbox.
See [asset provenance](assets/README.md).

Group Darts advance at 48 pixels/second throughout the whole flight, follow the
player's height within a six-pixel band, and rest 0.4 seconds between up to four
warned shots. A common forward speed and horizontal keep-apart rule prevent
followers catching or stacking into each other. Solitary Darts keep their
four-shot/0.75-second behavior. Paired hunters stagger committed dives while
the second retains its full locked warning. Other flyers follow after their
corridor clears; ground machines support the dive.

Keep existing HP, damage, score and all full warning durations. Warning starts
remain 0.28 seconds apart and projectile salvos 0.18 seconds apart. Skiffs keep
three spreads; bombers/rollers two drops/charges; Needles two locked shots;
Anchors their 1.6-second exposed opening. Each respawn interruption gets a new
warning. Passed machines turn visibly between warnings, with mirrored masks and
muzzles. Exit direction stays locked; rightward charges brake visibly for the
full fuse warning. Ordinary bullet boosts remain 20/25/30% by wave minute;
boss rounds never inherit that multiplier.

The supplied battlefield, still smoke and scrolling rocky ice shelf remain.
The floor stays y=130. Ground units sit on it, and flyers keep 19 pixels of
clearance above ground machines. Breakwater retains all nine patterns, later
broadside/combination deadlines, full warnings, 1.05-second recovery, 250 HP,
rear reinforcements, defenses and the exact ten-part breakup. New music and
campaign integration remain separate stages.

Ten native supply pods remain: rockets 20 s, shield 36, bombs 49, spread 64,
life 77, repair 90, rapid 110, laser 126, repair 140 and wingman 154. Native
adaptive boss pods and quiet rewards remain. Difficulty does not come from
inflated HP or removing useful help.

## Comparison and validation

All **1,190 checks pass**: 74 formation, 96 pressure, 88 mission, 67 art,
78 mission-escort and 787 boss/background/earlier-content checks. The actual
Preview 4 fails the new size/formation suite, as expected. Both standalone
phone layouts finish all 214 entries/all three phases, retain later attack
selection deadlines and exercise retry, with no external requests, errors or
save writes. The 32-second silent review clip uses native automated touches,
normal health/lives and a clearly labeled selected final-wave start.

Full no-fire progression admits 196 craft and expires 18 crowded slots, with
no overlapping bodies, at most eight regulars/ten actors including hazards,
16 rounds and at least 16.85 pixels between four-pixel-padded body bands in
each 24-pixel column. Boss arrival is 194.01 s; no stuck-threat fallback.
Invulnerable auto-aim progression admits all 214 with no skips, maximum delay
0.71 s, boss arrival 185.37 s and victory 272.21 s. This is a functional
progression fixture, not human play. Vertical, crossing and far-right crowded
runs also retain clear, separate machines throughout the entire approach.

A seed-28 no-fire observation of the first 180 seconds, counting craft apart
from supplies/rocks/mines/shells, gives 284/229/193 craft for levels 1/2/3.
Preview 4 admitted 65; Preview 5 admits 190 before second 180, with more
finishing their queued entry afterward. Mean visible craft rises from 2.43 to
5.62, versus 6.18/6.22 in Rust Moon/Frostring. Ordinary rounds rise from 375 to
574, versus 578/620. These observation runs use invulnerability to see the whole
timeline; they are not human survival or difficulty claims.

The separate normal-health ordinary-gun pilots show stronger pressure too:
vertical patrol 84.75 → 73.23 s; rectangular flight 175.38 → 89.32 s; crossing
figure-eight survived all 180 s before, now loses at 66.73 s (Frostring 69.61 s).
No ongoing health, invulnerability or position edits, and no special weapons.
Phone feedback remains the deciding check.

The formation suite pins the actual delivered Preview 4, tests all three
shipped worlds, and rejects the old size/wave behavior. Twenty-one selected
real formations have complete no-hit routes with native input, five health,
three lives, every member attacking and all threats clearing. Full moving and
right-edge timelines check physical separation. Retain the 17 paired/corner
escapes, all 29 boss routes, original player pixel checks and earlier suites.

```sh
source /workspace/.cloud-onboarding/ember-drift/environment.sh
node tools/mission-formation-test.mjs /tmp/ember-mission-formations
node tools/mission-pressure-test.mjs /tmp/ember-mission-pressure
node tools/mission-demo-test.mjs /tmp/ember-mission
node tools/mission-art-test.mjs /tmp/ember-mission-art
node tools/mission-escort-test.mjs /tmp/ember-mission-escorts
node tools/mission-benchmark.mjs /tmp/ember-mission-benchmark
node tools/export-mission-demo.mjs /workspace/artifacts/glacier-coast-mission-v5.html
```

Run existing boss/reinforcement/difficulty/background/combat/smoke/seed-28 level/
coast checks sequentially. The standalone export embeds all 46 modules, both
original atlases and the battlefield JPEG. Check both phone layouts and retry
without external requests, browser errors or save writes. Label selected-section
video fixtures honestly; cloud timings do not establish real-phone FPS.

The deliberately busy cached rendering fixture (eight regulars, one charge,
24 rounds) uses 108 draw calls/frame, or 140 with all machines turned. The
scenery baseline is 75. Original-game counts remain 304/356/298/347/589 in the
same five fixtures. These are cloud rendering samples, not real-phone FPS.

Everything stays in FaisalKhalil495/retro-space-shooter-codex-parallel. The owner
enabled Pages from codex/glacier-coast-demo and confirmed the link works.
Update only that branch for the requested preview; never publish to either
forbidden repository or merge the campaign. Await phone review after delivery.
