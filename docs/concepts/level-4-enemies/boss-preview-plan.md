# Proposed next stage — Breakwater boss preview

**Status: proposal awaiting approval. No boss implementation is authorized yet.**

The owner accepted combat revision 3 (slightly larger, sharper enemies) and
requested the next plan. Preserve that regular-enemy scale and the approved
Glacier Coast location. The seven-type combat preview is complete.

## Recommendation and result to review

Build a separate, replayable Breakwater fight under `demos/glacier-boss/`,
with a short recording and a portable playable copy. Target about 90–120 seconds
for a successful fight, then tune against the Glacier Warden using the same
measurement method. It ends on victory or loss, not a forced 30-second cutoff.
This tests the boss before committing to the full Level 4 timeline.

## Look, scale and movement

Use the existing Breakwater concept: a low olive-and-cream armored vessel,
wedge bow, side launch doors, rear exhaust tower and three smooth ice runners.
No legs, tracks or saw ring. Start near 58×24 game pixels, roughly 28% of the
208-pixel screen width. Check its real-size silhouette beside the original hero
and the accepted regular roster. Keep open flight space above and ahead of it;
size is a proposed starting value, not a settled requirement.

The vessel slides, brakes and changes position along the snow. A warned
forward rush makes its naval sliding movement central to the fight. It should
feel different from the Siege Crawler's walking fortress and stomping attacks.
The sea remains background scenery, with no new water hazard system.

## Weak point and phases

The front gun chamber opens while braking for an attack and remains open for
a short recovery. Ordinary fire must reach it from the front without an armor
pixel shielding the opening. Bombs, rockets and laser respect the same armor
rule. Breaking external armor does not leave the core permanently vulnerable.

1. **Armored bow:** learn the sliding movement, broadside spread and skipping
   shells. Clear openings after attacks let the player shoot back.
2. **Damaged bow:** side launch doors become exposed and add a small drone pair
   and marked ice bursts. Doors and broken bow armor visibly change.
3. **Cracked gun housing:** shorter rests and warned sliding rushes; selected
   attack combinations retain clear escape space and bounded hazard counts.

All five attacks below are demonstrated across the complete fight.

| Attack | Warning and dodge |
| --- | --- |
| Broadside spread | Gun lamps flash before a fan of rounds; a clear flight lane remains. |
| Skipping shells | A fixed visible trail marks a shell's hops and final burst; move away or shoot it down. |
| Dart launch | Doors open before at most two of the accepted small drones emerge in separate lanes. |
| Sliding rush | Braking spray, engine rev and a clear wind-up precede the committed pass; fly above the low hull. |
| Ice-fragment bursts | Marks appear at fixed snow positions before short upward bursts; move between them. No persistent blocking terrain. |

Attack directions lock when their warnings finish. Later attacks cannot erase
an earlier promised safe gap. Surviving drones and hazards count toward limits;
no offscreen shots or unavoidable combined walls. Specific HP, warning lengths,
projectile speeds and damage remain tuning values to report with the preview.

## Presentation and player support

Entrance from the right with snow spray, name card and mechanical roar; three
visible damage states; speech only during safe pauses; existing quiet stage
bonuses and alternating survival/weapon supply pods. Include the original
health, lives, damage, death, respawn, special weapons, pause and replay rules.
Shootable shells and fragments remain distinct from the hero's unchanged shots.
Use machine explosions and metal debris, no blood.

Use existing sound effects for this preview. Breakwater's own recorded music
needs a separate listening review before the finished Level 4 release. Do not
change or replace any of the six existing tracks.

## Boundary and checks

Keep definitions, preview arrivals and UI local to the new demo; preserve both
existing coast demos and all shared campaign files. Do not register Level 4,
add a main-menu entry or write scores, progress or options. Work only in
`FaisalKhalil495/retro-space-shooter-codex-parallel`.

Verify the ordinary-shot path to the opening, special-weapon armor rules,
phase transitions, every attack's warnings, recovery openings, no permanent
safe hiding pocket, bounded overlap/density, collision knockback from every
side, and hazards clearing on death/replay. Test a complete win and loss, last
life during transitions, supplies without pre-equipped test weapons, and zero
save writes. Compare fight duration and pressure with the Warden. Prepaint
boss art before entry and check drawing cost. Exercise both phone layouts and
real simultaneous touches, then run the existing regression checks.

Deliver a real-size scale image, a fight recording, the playable review copy,
implemented tuning and simple phone test steps. Stop for the owner's review.
The full roughly three-minute Level 4, its music, campaign connections and
saving integration remain separate planned stages.
