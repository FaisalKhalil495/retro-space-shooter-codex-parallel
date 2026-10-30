# Glacier Coast preview 7 — gentler approach, longer bomber salvos

On 2026-10-30 the owner directly requested slightly slower enemy approaches and
bombers staying longer to drop more bombs. This authorizes a mission feedback
pass on the existing allowed Pages branch. Keep the small Preview 6 artwork,
kill rewards, group waves, player, controls, boss, earlier content and repository
boundary intact. No new campaign stage or deployment settings are authorized.

## Change

Scale regular machines' own movement by 0.85: entry, passing/departure and the
hunter's committed dive. Group Darts use one 40.8 px/s speed throughout entry,
warning, shooting and exit, preserving formation spacing. Other flyer entry
speeds become Bomber 32.3, Needle 39.1, Hunter 44.2; solo Darts 40.8. Hunter
committed dives become 123.25 instead of 145, with the original 0.8-second
warning and 0.9-second commitment. Driving Skiff/Roller entry becomes 44.2/35.7.
Anchored guns and idle ground machines keep the world's 20 px/s ground scroll;
slowing a planted gun relative to the land would make it slide. Departures of
moving regular machines also scale by 0.85. Do not scale simulation dt: warnings,
rests, bobbing, projectile motion and the world clock must retain native timing.

Surviving bombers now attempt five drops, up from two. Each keeps a full
0.8-second warning, locks a newly chosen target and waits 1.1 seconds before
warning again. Bomb fall time, shootdown, fragments and damage remain native.
Destroying the bomber cancels its remaining drops. Do not increase HP or force
it to survive the player's gun. Keep its normal hover position and departure
behavior; finishing three additional bombing cycles naturally extends its stay.
In the moving-player observation it retires around 14 s rather than 7 s.

All 54 formations/214 scheduled craft and ten pod times/contents remain exact.
Longer uncleared survivors occupy lanes longer, so no-fire audits may expire
more of the original bounded queue. Keep the caps and expiry limits, and require
all 214 entries in armed progression. Compare visible density and actual firing
separately; do not speed machines back up or let queues dump late arrivals merely
to preserve a historical no-fire-throughput threshold. The crowding audit still
requires many arrivals, five average visible craft and real formation groups.

## Review requirements

Compare actual Preview 6 (de14968), including observed movement rather than just
a configured multiplier. Check each type's approach/exit, every group-Dart mode,
hunter speed/full warning, five actual bomb releases, target locks, reacquisition,
rests, departure and destruction cancellation. Preserve ordinary/boss projectile
speed and ownership, all wave/supply data and kill rewards. Run a negative
control against the previous fast/two-drop behavior.

Extend complete dodge fixtures to 20 seconds for the longer bomb sequence.
Keep five health/three lives, no invulnerability or firing, complete attack
counts and threat clearance. Verify all five drops in the bomber/Dart, bomber/
Anchor, right-corner and three full bomber-formation escapes. Keep all other
paired/formation/boss routes. Check the full crowded timeline with moving and
right-edge players, all arrivals during armed progression and safe boss handoff.
Deliver LEVEL 4 PREVIEW 7 and mission=7 cache queries, then await phone feedback.

## Completed validation

All 1,330 checks pass (52 pacing, 88 rewards, 74 formation, 96 pressure,
88 mission, 67 art, 78 escort and 787 preserved). Actual Preview 6 fails the
new movement assertion, as expected; exclude this negative control from the
passing total. Observed bomber retirement is 7.25 → 13.8 s, with 2 → 5 actual
releases. All full bomber/escort, bomber/Anchor, right-corner and bomber-group
routes include all five drops and clear their fragments with native movement,
five health and three lives. All 29 boss routes remain intact too.

No-fire progression admits 161 slots/53 expired, at most eight regulars/ten
actors including hazards/17 rounds, no body overlap or approach fallback, and
boss arrival 200.22 s. Minimum padded-column space is 18.94 pixels. Armed
invulnerable progression admits all 214 without skips and clears at 274.87 s.
Both portable layouts embed 46 modules/two exact PNGs/one exact JPEG, finish
all entries/phases and test native retry/selection without requests/errors/saving.

An initial campaign menu smoke run missed a Continue tap in its fixed 3.6-second
wall-clock wait. The native loop caps frame dt, so wall time is not a readiness
condition under cloud rendering load. The test now waits for the actual clear
state/timer at all three Continue steps, preserving every assertion. All 49
smoke checks pass with that state-based wait. Shared game/menu runtime is
unchanged; keep this test timing fix rather than altering shipped gameplay.
