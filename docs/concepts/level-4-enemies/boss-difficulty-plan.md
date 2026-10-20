# Breakwater — proposed difficulty pass

Status: proposed for owner review. The request is to make the current fight
harder. This document does not record approval of these particular values;
no runtime tuning changes are included.

Scope: the separate Breakwater preview in
`FaisalKhalil495/retro-space-shooter-codex-parallel` only. Never modify or
publish against `retro-space-shooter` or `retro-space-shooter-codex`.
The campaign, earlier levels and both other glacier demos stay unchanged.

## Proposed changes

Each slash-separated group below means phase 1 / phase 2 / phase 3.

| Attack | Current | Proposed |
| --- | --- | --- |
| Broadside | 6 / 7 / 8 volleys; 98 / 107 / 116 pixels per second | 7 / 8 / 10 volleys; 106 / 118 / 130 pixels per second |
| Hunter Torpedoes | Tracking speed 120 / 138 / 156; turning limit 5.5 / 6.3 / 7.2 radians per second | Tracking speed 132 / 152 / 172; turning limit 6.1 / 7.0 / 8.1 radians per second |
| Ice Lance walls | Speed 120 / 132 / 144 pixels per second | Speed 132 / 148 / 164 pixels per second |
| Persistent fighters | Shots at 82 pixels per second | Shots at 94 in phase 2 and 104 in phase 3 |

The goal is a clear increase in maneuvering pressure, growing through the
three phases. Broadsides fire for longer and travel faster; torpedoes turn
faster as their speed rises; lance walls and fighter shots leave less time
to react after their warnings. Keep all nine existing attack patterns.

## Preserve

- 250 boss HP; current damage values, armor and opening-chamber rules.
- Every existing warning duration and locked target; no hidden re-aiming.
- The full 1.05-second vulnerable recovery for native rockets to arrive.
- Torpedo counts, two-hit shootdown, roof launcher, finite guidance periods,
  straight-flight speeds, emergence protection and maximum lifetime.
- Lance counts and escape gaps: 28 / 26 / 24 pixels. Keep the overhead rush gap.
- Mortar and rupture rules, including shootdown counters, safe warning locks,
  damage guards and waiting for torpedo guidance to finish in the combination.
- Three/four compact rear-arriving fighters, survivor HP, replacement only of
  vacancies, one full warning at a time and at most two escort shots. Keep
  their firing suppression during dangerous boss patterns and all safe pauses.
- Existing attack-selection deadlines/cooldowns, broadside spread and five
  rounds per volley. Do not introduce arbitrary simultaneous attacks.
- The supplied background, static smoke, revision-6.4 rock/ice platform,
  exact original hero/flame/bullets, controls, audio, saving and ten-part breakup.

## Review and delivery after approval

Run complete normal-movement no-hit routes for every affected attack and
combination, with all four fighters alive and at several boss positions.
Check actual torpedo guidance and gun counters, locked warnings, projectile
limits, native defenses and phase/death cleanup. If a proposed speed closes
the existing escape routes, adjust that speed and report the final value;
do not remove warnings or silently weaken the checks.

Run the required background, boss, reinforcement, earlier-content and drawing
checks. Export a labeled portable preview; verify both phone layouts, full
three-phase progression and four-fighter rear arrivals without save writes,
external requests or browser errors. Record native-touch play with normal
health/lives and label any selected-phase fixture explicitly. Save only to
the allowed repository's preview branch, then stop for the owner's phone
difficulty review. No campaign integration or new music in this stage.
