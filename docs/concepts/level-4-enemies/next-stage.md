# Next proposed stage — 30-second coast combat preview

**Status: proposal for review; implementation has not started.**

The glacier location is approved. The [three enemy designs and the boss](review.md)
are ready for review. This proposal covers the first playable enemy preview,
using the pictured Shelf Skiff, Anchor Gun, and Twin Darts.

## What you would play

A separate 30-second flight through the approved glacier coast. Steer and fire
with the existing controls. Enemies can be shot down, their warned attacks can
hurt you, and the existing lives and respawn rules apply. Pause and replay
remain available. Losing all lives offers replay; finishing the flight stops
the action at 30 seconds.

| Enemy | Proposed behavior |
| --- | --- |
| Shelf Skiff | Slides along the snow, brakes, flashes its front guns, and fires a short spread. It stays on the ground. |
| Anchor Gun | Arrives on a low rock base, opens its armor, warns, and fires a heavy shot. Its muzzle and exposed chamber stay reachable by the ordinary gun. |
| Twin Darts | Two drones fly in separate lanes and take turns warning and firing. They keep clear of each other and the ground. |

First appearances are spaced through the flight. Survivors can remain in play
while the next type arrives; shooting them quickly keeps the screen clear.
The closing wave combines all three types.

| Flight time | Proposed arrivals |
| --- | --- |
| 0–3 seconds | Original ship enters; room to steer. |
| 3 seconds | One Shelf Skiff. |
| 10 seconds | One Anchor Gun. |
| 17 seconds | One pair of Twin Darts. |
| 22 seconds | One Shelf Skiff, one Anchor Gun, and one pair of Twin Darts, with staggered entry and firing. |
| 30 seconds | Flight complete; replay available. |

That is eight individual enemies: two skiffs, two guns, and four darts.
This is a small behavior and readability review, not the final Level 4 wave
schedule or difficulty. Initial health and attack timings would be tuned in
this preview and reported with the playable result.

## What stays intact

- The approved glacier landscape and the existing scenery-only demo.
- The exact original hero, engine flame, bullets, movement, and firing rate.
- Touch controls, safe areas, sound effects, and the player's saved options.
- All three campaign levels, their graphics, music, menus, and save format.

Enemy art would adapt the concepts to the game's actual double-detail scale,
keeping the skis, anchor braces, and diamond wings recognizable. Warm warning
lamps, dark outlines, and clear shot paths must remain readable over the snow.
Machines use metal debris and explosions.

Breakwater remains a visual proposal in this stage. Its moving weak point,
three phases, five or more warned attacks, entrance, supplies, voice, and music
need a separate boss plan. The full campaign level also remains a later stage.

## Implementation boundary and checks

If approved, add an independent page under `demos/glacier-combat/`, reuse the
approved coast background, and keep enemy types local to that demo. Use the
existing Game behavior for the hero, weapons, damage, and effects; introduce
local enemy objects through the demo subclass rather than changing the shared
enemy registry or campaign level list. No new engine, packages, or save writes.

Verify actual touch movement and firing, warnings before every attack, correct
muzzle positions, ground contact, reachable guns, separated drone lanes,
damage and destruction, pause, death/replay, and exactly 30 seconds. Compare
hero and bullet pixels and firing emission with the original renderer. Check
that saves are unchanged and no new music is requested. Run the existing
smoke, seeded three-level, and scenery-demo suites, plus focused combat checks
and a same-machine drawing comparison. Inspect both phone layouts and provide
a fresh video and downloadable preview for the owner's physical-phone review.

## Decision needed

Approve using these three enemy designs in this 30-second combat preview, or
request visual changes first. Approval of this proposal would cover the local
enemy preview; Breakwater and the full campaign level remain separate stages.
