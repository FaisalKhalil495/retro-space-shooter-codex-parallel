# Glacier Coast mission difficulty pass — approved 2026-10-29

The owner found full-mission Preview 3 too easy, asked for a plan based on
LESSONS.md, and explicitly approved the following pass. Work only in
FaisalKhalil495/retro-space-shooter-codex-parallel. No main merge, campaign
integration, new music, or changes to either other repository are authorized.

## Approved goals

- Keep the three-minute approach, four-regular-enemy limit, current health,
  useful supplies, artwork, ship, controls, audio and saving.
- Introduce all seven enemy types during the first minute.
- Start full warnings while entering, once a machine is fully visible,
  rather than waiting for it to reach its parked position.
- Boost ordinary bullet speeds by 20%, 25% and 30% over the three minutes.
- Skiffs fire three volleys; Darts fire four shots, with shorter idle waits.
- Pair a bomber with a supporting Dart, and a hunter with a ground attacker.
  Stagger warnings and preserve readable space between the larger bodies.
- In Breakwater phases 2–3, permit at most two other attacks between broadsides;
  make existing phase-3 combinations recur more often.
- Check camping, compare pressure with Level 3 using normal damage, and prove
  full escape routes with ordinary movement before handing it over.

## Implemented interpretation

Preview 4 changes only the mission. Shared combat/boss previews retain their
accepted behavior. `combat.js` owns mission-specific regular updates;
`boss.js` reuses Breakwater's original attack implementation with a local
selection policy. No new weapons, increased HP, shortened warnings or weakened
player defenses. Boss speeds do not inherit the ordinary-fire multiplier.

The 80 scheduled craft remain in sections of 20/26/34. Opening slots now include
bombers at 17.93 s, rollers 26.73, Needle Wings 29.67 and hunters 38.47. Occupied
lanes may defer them; all seven enter before wave second 60 in the no-fire audit.
A bomber may share the sky with one Dart in a separate lane. A hunter keeps its
committed dive corridor free of other flyers while ground enemies support it.
Queues retain their bounded expiry and 0.9-second minimum admission gap.

Skiff follow-ups wait 0.8 s, down from 1.2; Darts wait 0.75 s, down from
1.15 (and the initial parked wait is removed). Bombers keep two drops with
1.1-second waits; rollers keep two charges with 1.2-second waits. Needle Wings
keep two separately locked shots; Anchor Guns retain their 1.6-second opening.
Warning starts are separated by at least 0.28 s and regular projectile salvos
by 0.18 s. Entry, full body visibility, facing, respawn and death checks apply.
All warnings keep their full original duration; new ones follow interruptions.

Phase 1 and all phase introductions remain native. Later phases enforce the
broadside deadline; phase 3 has at most two ordinary attacks between the two
existing combinations after introductions. Transient threats clear before a
new pattern. Keep the full 1.05-second vulnerable recovery, 250 HP, all nine
patterns, persistent fighters and the exact ten-part destruction.

## Review evidence

The new 96 pressure checks include all seven early warning comparisons,
independent speed values, real mixed first-minute waves, attack counts, warning
duration, real boss selection and normal-health comparisons. Seventeen complete
no-hit mixed encounters cover all three speed tiers at both phone sizes.
The test rejects the actual delivered Preview 3, proving it detects the old
behavior. Existing full-mission, art, escort, boss and campaign checks remain.

Fixed-position shooting is punished sooner than in Preview 3. The same normal
input patrol loses all lives around 84.75 s, versus 108.01 s before and 136.03 s
in Frostring. These controlled pilots are review indicators, not a verdict on
human difficulty. The owner's Android/Safari phone review remains the final check.

Deliver LEVEL 4 PREVIEW 4 as a standalone playable copy and a labeled native-
touch clip. Preserve earlier artifacts. Await phone feedback after this pass.

## Final camping correction

The approved camping audit found that high/middle players could wait at the
far-right edge without taking any damage. Regular machines now turn visibly
between warnings and adjust hover room instead of remaining unable to fight.
The original source art is mirrored, together with muzzles, flash and alpha
collision masks. Full warnings follow a turn; the warning and leaving direction
remain locked. A turned hunter exits to the right and cannot reverse back from
off-screen. Turned rolling charges travel right and brake at x=200 so the whole
8-pixel body, native 0.65-second fuse warning and burst remain on-screen.

The new tests cover all seven real turns, per-pixel mirrored artwork, charge
motion/fuse/cancellation, fixed campers on both sides and two corner escapes
with 0.15 seconds to react. Normal-health right-edge campers now lose all lives
rather than bypassing the waves. This completes the approved camping check;
it adds no assets, health, weapons, controls or changes to earlier previews.
Final validation: 1,116 checks (96 pressure, 88 mission, 67 art, 78 escorts and
787 prior boss/background/campaign checks). Cached drawing: 93 normal, 109
fully turned calls/frame; these cloud samples are not phone FPS.
