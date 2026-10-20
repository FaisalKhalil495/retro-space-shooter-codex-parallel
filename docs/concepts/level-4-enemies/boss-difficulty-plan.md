# Breakwater — approved difficulty pass, revision 7

Status: the owner explicitly approved this complete plan, including the random
Ice Lance gap amendment, and instructed us to build it. Implemented in the
separate preview as BREAKWATER 7. All approved target values below were kept;
validation and portable delivery are recorded in the boss README.

Scope: the separate Breakwater preview in
`FaisalKhalil495/retro-space-shooter-codex-parallel` only. Never modify or
publish against `retro-space-shooter` or `retro-space-shooter-codex`.
The campaign, earlier levels and both other glacier demos stay unchanged.

## Approved changes

Each slash-separated group below means phase 1 / phase 2 / phase 3.

| Attack | Before revision 7 | Revision 7 |
| --- | --- | --- |
| Broadside | 6 / 7 / 8 volleys; 98 / 107 / 116 pixels per second | 7 / 8 / 10 volleys; 106 / 118 / 130 pixels per second |
| Hunter Torpedoes | Tracking speed 120 / 138 / 156; turning limit 5.5 / 6.3 / 7.2 radians per second | Tracking speed 132 / 152 / 172; turning limit 6.1 / 7.0 / 8.1 radians per second |
| Ice Lance walls | Speed 120 / 132 / 144 pixels per second; gap chosen from player height with a predictable opposite-side shift | Speed 132 / 148 / 164 pixels per second; each wall chooses a fresh random reachable gap |
| Persistent fighters | Shots at 82 pixels per second | Shots at 94 in phase 2 and 104 in phase 3 |

The goal is a clear increase in maneuvering pressure, growing through the
three phases. Broadsides fire for longer and travel faster; torpedoes turn
faster as their speed rises; lance walls and fighter shots leave less time
to react after their warnings. Keep all nine existing attack patterns.

## Requested amendment: unpredictable Ice Lance gaps

- Choose each wall's gap randomly from valid reachable heights when its
  warning starts, including the first wall of a sequence. Remove the fixed
  opposite-side rule and predictable high/low alternation.
- Avoid repeating a recent gap where other reachable choices exist. Vary the
  jump distance and direction; do not substitute a new fixed cycling pattern.
- Keep the entire 1.15-second visible warning. Once marked, the gap stays
  locked through firing and passage of that wall; no last-second relocation
  or tracking the player after the warning starts.
- Preserve the phase-dependent 28 / 26 / 24-pixel gap widths and normal player
  speed. Limit the random choices to gaps reachable from the player's current
  position with their actual hitbox and sufficient clearance. Fairness takes
  priority over forcing a minimum change from the previous gap.
- Apply random selection to rush-with-lances too, but only among reachable
  overhead gaps that clear the moving hull. Keep the overhead route safe.
- Use the seeded gameplay dice once when choosing a gap. Rendering must never
  affect the selection, and pause/resume must preserve the warned position.

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

## Required review and delivery

Run complete normal-movement no-hit routes for every affected attack and
combination, with all four fighters alive and at several boss positions.
For the gap amendment, sample many reproducible seeds and player heights,
including ceiling/floor and close-to-hull cases. Check variation across and
within sequences, reachable paths, full warnings, locked rendered gaps and
the overhead route during the combined rush. A helper must react to the
actual warning rather than assume the next gap from the previous wall.
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
