# Next proposed stage — two 30-second coast combat flights

**Status: explicitly approved, implemented, and verified; awaiting phone review.**

The working page is `demos/glacier-combat/`. Its README records final arrival
times, counts, initial tuning and review steps. All 89 focused combat checks,
49 existing smoke checks, 35 seeded level checks and 35 scenery checks pass.
The standalone export was verified at both phone sizes without external
resource requests. This document retains the approved scope below.

The user likes the expanded enemy concepts and asked to plan the next step.
The detailed glacier location remains approved. Liking the art does not settle
attack timings, health, wave counts, or full-level implementation.

## Recommendation

Create one separate combat-preview page with two selectable 30-second flights.
This gives all seven regular enemy types space to demonstrate their different
roles without crowding every introduction into a single short flight. Both
flights use the approved coast, the exact original hero and bullets, and the
existing movement, firing, sound effects, and touch controls.

The user's approval covers both preview flights and their local enemy
behaviors below. The Breakwater boss and campaign Level 4 remain later stages.

## Flight 1 — ground guns and paired fighters

| Enemy | Behavior to demonstrate |
| --- | --- |
| Shelf Skiff | Slides along the snow, brakes, flashes its front guns, then fires a short spread. |
| Anchor Gun | Travels with its low ground base, opens its armor, warns, then fires a heavy shot. Its muzzle and exposed chamber remain reachable by the ordinary gun. |
| Twin Darts | Two drones approach in separate lanes and take turns warning and firing. |

Allow the hero to enter first. Introduce a skiff around 3 seconds, a gun around
10 seconds, and a dart pair around 17 seconds. Around 23 seconds, introduce a
small mixed wave with staggered firing. Survivors may remain as later types
arrive; these are spaced introductions, not guaranteed empty-screen showcases.

## Flight 2 — the four new designs

| Enemy | Behavior to demonstrate |
| --- | --- |
| Crest Bomber | Opens its belly bay and warns before dropping bombs toward clearly marked positions. |
| Snow Roller | Stays on the snow and launches shootable rolling charges; each warns before bursting and expires quickly. |
| Needle Wing | Shows its aim, locks the direction, then fires one fast projectile with time to dodge. |
| Wake Hunter | Banks and warns before committing to a fast diving pass, then climbs away. It does not continually retarget during the dash. |

Introduce one type at roughly 3, 8, 13, and 18 seconds. Finish with a small
mixed encounter around 23 seconds, using only two types together initially.
The bomber and roller must threaten reachable flying space rather than produce
harmless floor effects. Their markers and charges must be easy to distinguish
from the scenery, pickups, and the hero's original shots.

Both schedules are starting proposals for a short behavior review, not final
Level 4 wave counts or difficulty. Report the implemented health, warning
lengths, attack speeds, and arrival counts with the playable result.

## What the player can do

Select either flight, steer, fire, destroy enemies, dodge, take damage, and
respawn using the existing lives and health rules. The preview must display
health and lives using the existing visual style. Pause, interruption handling,
portrait pause, replay, and returning to flight selection must work. Losing
all lives offers replay; reaching 30 seconds ends the flight and freezes play.
Scores, if shown, belong only to that attempt and never enter saved progress.

Adapt the liked concept shapes to the game's double-detail grid. Keep the
skis, anchor braces, diamond wings, bomb bay, drums, long gun, and curved wings
recognizable. Keep dark outlines, frost, olive-and-cream panels, and readable
warm warning lamps. Machines use explosions and metal debris.

## Preservation and implementation boundary

Add the independent page under `demos/glacier-combat/`. Keep enemy definitions
and preview arrivals local to that page, reusing Game behavior for the hero,
weapons, damage, and effects without changing the shared enemy registry or
campaign list. Reference the existing approved landscape asset explicitly from
the new page; keep the scenery-only demo intact. No new engine, packages,
main-menu entry, save format, music, or campaign level in this stage.

Preserve the original hero, engine flame, bullets, movement, firing rate, touch
controls, safe areas, sounds, saved options, all three campaign levels, and
the existing recorded themes. No permanent score or progress writes.

## Validation and handover

- Compare hero, flame, and bullet pixels and firing emission with the original.
- Exercise real simultaneous touches, safe areas, both flight choices, switching,
  pause, interruption, portrait mode, damage, death, replay, and exact 30-second
  completion. Reset enemy state and charges fully between flights.
- Verify warnings before attacks, on-screen firing, correct muzzle positions,
  grounded machines, reachable guns, separated flyers, avoidable locked attacks,
  visible bomb markers, shootable charges, and finite hazard lifetimes.
- Check destruction, scoring, specials against armor, pickups if any can drop,
  and unchanged raw saves with zero writes. No new music requests.
- Run focused combat checks, the existing scenery-demo suite, smoke checks,
  seeded three-level checks, and a same-machine drawing comparison. Inspect both
  phone layouts; Chromium phone dimensions do not establish Safari compatibility.
- Deliver a playable review copy, short video of each flight, and concise phone
  test steps. The user reviews combat feel and readability before the next stage.

## Later stages

After this preview review, plan Breakwater's separate boss test: a mobile
naval silhouette on ice runners, reachable opening weak point, three phases,
five or more warned attacks, entrance, voice, alternating supplies, stage
bonuses, and separately reviewed music. Then plan the full approximately
three-minute Level 4 timeline, terrain, pickups, difficulty, transitions, and
campaign integration. Each implementation stage needs its own review.

## Approved scope

The user approved building both short enemy-combat flights. Complete and
verify this stage, then hand it over for phone review. Preserve the current
campaign and scenery-only demo; later stages still need their own plans.
