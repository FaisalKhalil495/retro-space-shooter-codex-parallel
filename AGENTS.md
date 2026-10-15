# Ember Drift — agent instructions

## Repository boundary

- Work only in `FaisalKhalil495/retro-space-shooter-codex-parallel`.
- Never modify `FaisalKhalil495/retro-space-shooter`, push to it, open pull
  requests against it, merge into it, or change its settings or deployment.
- The same prohibition applies to `FaisalKhalil495/retro-space-shooter-codex`.
- Before any GitHub write, verify the remote identity and the explicit target
  repository and pull-request base are `FaisalKhalil495/retro-space-shooter-codex-parallel`.
  Directory names alone are insufficient. Preserve existing user changes.
- The original repository and Pages URLs in `CLAUDE.md`, `LESSONS.md`, and
  application metadata are historical references, not authorized destinations.
  Older release and merge instructions never override this boundary. Do not
  rewrite application metadata merely to enforce the boundary.
- Use the existing checkout. Cloud tasks are already isolated; create a Git
  worktree only if the user explicitly requests one.

## Read before working

Read all of [CLAUDE.md](CLAUDE.md) and [LESSONS.md](LESSONS.md) at the start of
each session. They remain the detailed sources for settled decisions, exact
values, stage history, and lessons. This file adds the repository boundary and
summarizes the rules; it does not replace those documents.

Follow the user's current instructions. Preserve settled decisions unless the
user approves a change. Where historical notes conflict, use the later explicit
decision: v0.29.0's recorded action music and store-app roadmap supersede the
older live-music and app-store exclusions. Do not resolve genuine uncertainty
by silently inventing a new decision.

## Current scope and approval

The user selected **B — Glacier Coast** for Level 4's visual direction after
reviewing all three concept images. Record and preserve this choice. Final
Level 4 tuning and campaign integration remain proposals. The user
approved the separate 30-second scenery demo; it is implemented under
`demos/glacier-coast/`. Keep the campaign, its shipped graphics, touchscreen
controls, audio, and saving unchanged. Approval of this demo does not authorize
building the full level or its enemies and boss.

The user rejected the first demo's simplified ice blocks and authorized a
more detailed world with glaciers, ice, and visible water. Demo revision 2
uses original generated landscape art with geological detail and water
shimmer. Preserve the exact existing hero, engine flame, and bullet artwork
and firing behavior; do not redraw or substitute them. The pixel comparison
in `tools/coast-demo-test.mjs` checks this explicitly.

The user approved revision 2's location and requested pictures of the enemies,
including the boss. The first visual concepts were Shelf
Skiff, Anchor Gun, Twin Darts, and Breakwater. Save them under
`docs/concepts/level-4-enemies/` and show them for review. This request does not
approve their final designs, mechanics, tuning, or campaign implementation;
the subsequent two-flight implementation approval is recorded below.

The user subsequently requested more enemies. Expand the visual roster with
Crest Bomber, Snow Roller, Needle Wing, and Wake Hunter: seven regular enemy
types plus Breakwater in total. These are additional concepts for review.
Revisit the earlier three-enemy combat-preview proposal after this expanded
art review; do not treat the request for more concepts as full-level approval.
The user now likes the new designs and requested the next-step plan. Preserve
that visual direction. The revised proposal is two selectable 30-second
combat flights covering all seven regular types; see
`docs/concepts/level-4-enemies/next-stage.md`. The user explicitly approved
this plan: both selectable 30-second combat flights and all seven local enemy
behaviors are authorized under `demos/glacier-combat/`. Complete this stage,
its tests, playable export, and videos without asking for approval again.
Both flights are implemented and verified: 101 combat checks plus the existing
49 smoke, 35 seeded-level, and 35 scenery-demo checks pass. See
`demos/glacier-combat/README.md` for initial tuning and phone review steps.
The separately approved Breakwater preview is implemented as described below;
campaign Level 4 remains a later stage.

The user requested smaller enemies after the first combat review, then asked
for a little more size and sharpness. Revision 3 uses a modest 9–17% width
increase over revision 2, with clean half-pixel dark outlines and lit armor
edges. Current sizes: skiff 14×9, anchor 12×8, dart 11×8, bomber 18×10,
roller 16×10, needle 16×8, hunter 15×10. Keep the roster compact; the latest
request supersedes revision 2's exact old-sprite-size rule. Collision silhouettes
and gun positions match the art. Check mixed waves with no kills, and preserve
the approved designs, landscape, and exact original hero/bullets.

The user accepted revision 3 and requested the next plan. The next proposal is
Breakwater's separate boss preview; see
`docs/concepts/level-4-enemies/boss-preview-plan.md`. The user explicitly
approved this separate boss-preview stage. It is implemented under
`demos/glacier-boss/`: 58×24 boss, three phases, five warned attacks, opening
chamber, supplies, damage, victory/loss, pause and replay. The stage includes
122 focused checks, the playable copy, scale image and fight video. See the
boss README for actual tuning. Do not ask for this approval again. Await the
owner's review before the next stage; new music and campaign integration remain
separate stages.

Before implementing a new stage, present a small, concrete plan for the user's
review and wait for approval. Separate proposals from approved decisions. Read
and investigate freely within the requested scope, and complete already
authorized work without repeatedly asking for the same permission.

## Game decisions to preserve

- **Story and roadmap:** the player defends occupied worlds from invaders.
  Nine worlds are planned, ending at the invaders' Hive World. Finish levels 4
  and 5, then the Android app; iPhone is optional, followed by levels 6–9.
- **Gameplay:** free movement in an automatically scrolling shooter, Hard
  difficulty with fair warnings, small player hitboxes, roughly three-minute
  levels, and increasing difficulty. Preserve existing tuning, damage, enemy
  behavior, collisions, scoring, and weapon rules.
- **Survival and rewards:** three starting lives with five health blocks;
  bombs, rockets, or laser carried one at a time; automatic shield, repair,
  spread, rapid-fire, and wingman power-ups. Preserve useful adaptive supplies,
  alternating boss supply pods, quiet stage bonuses, hidden loot without tells,
  and the existing pickup schedules and probabilities.
- **Bosses:** at least three phases and five warned attacks, movement, entrance,
  name card, roar, their own music, and a meaningful weak-point or armor rule.
  First-person speech bubbles occur only during pauses and never hide threats.
- **World logic:** every enemy and obstacle belongs to its setting. Ground
  units stay on the ground; flyers avoid terrain; enemies and pickups remain
  visible and reachable. Test these rules across whole levels. Each world has
  its own shapes and palette, including Dust Pirates and Ice Harvesters.
- **Art:** original modern pixel art, muted colors, no neon or neon glow.
  Double-detail pictures retain the 208×144 game grid, outline sizes, speeds,
  and hit areas. Preserve the selected detailed ship and squadron title badge.
  Explosions suit machines; blood is restricted to living creatures, with the
  existing adult content and blood option. Ask before adding blood elsewhere.
- **Touch controls:** landscape play, centered game, floating eight-direction
  pad on the left, large Fire and Special buttons on the right, oversized touch
  areas, and iPhone safe areas on both sides. Preserve Android vibration and
  iPhone visual/sound feedback. Target Android Chrome and iPhone Safari.
- **Audio:** preserve all six approved recorded action themes and their intro,
  seamless loop, volume, and transition behavior. Menus play The Outer Belt;
  boss warnings switch songs; Game Over is silent. Sound effects remain
  synthesized live. New music requires a separately approved stage.
- **Saving and menus:** preserve local-storage format and validation, top-ten
  scores with names up to eight letters, reached levels, options, practice
  rules, Continue, boss checkpoints, pause, and end-screen behavior. Practice
  scores do not enter the table. Do not expose unfinished content in promotion.
- **Technical approach:** plain JavaScript modules and HTML canvas, no engine
  or build step, fixed 1/120-second physics, and versioned imports. Avoid
  unrelated frameworks, dependencies, refactors, or save migrations. Never
  put secrets in code. Online multiplayer is out of scope; shared scores are
  postponed until the game is finished. Do not revive the rejected v0.5.0
  asteroid systems or currencies without approval.

## Progress and next candidate

At creation of this file, `js/config.js` reports **v0.29.0** and `js/levels.js`
contains three playable levels:

| Level | World | Boss |
| --- | --- | --- |
| 1 | The Outer Belt | Rockjaw |
| 2 | Rust Moon | Siege Crawler |
| 3 | Frostring | Glacier Warden |

Double detail, menus, local progress/scores/options, boss checkpoints,
home-screen support, title art, and recorded music are complete for these
levels. Level 4 (the ice planet) and level 5 (Ember Mines) remain planned.
There is no native app implementation yet.

**Selected direction:** B — Glacier Coast: daylight snow-covered coastal
shelves, distant blue ice cliffs, dark teal sea, and olive-and-cream invader
machines. See `docs/concepts/level-4-review.md` and the individual B image.
Breakwater, an armored vessel sliding on broad runners, is implemented in its
separately approved preview. Its phone review, the planet's final name and full
campaign tuning remain open.

**Completed first stage:** a separate 30-second scrolling coast scenery demo
using the existing ship and controls. It has pause, replay, a solid snow floor,
and no campaign registration or save writes. Revision 2 replaces the simple
cliffs with a glacier valley and fjord, and the user approved this location.
The approved combat-preview stage is now complete under `demos/glacier-combat/`:
two selectable 30-second flights, all seven regular enemy types, local hazards,
damage, replay and flight switching, with original hero/bullets and zero save
writes. The user accepted revision 3. See the combat README for tuning;
Breakwater's approved separate preview is now also implemented under
`demos/glacier-boss/` and awaits phone review. It adds no campaign level or
save writes. See the boss README and approved plan for scope and validation;
its own music and full Level 4 integration still need later stages.

## Validation and handover

For approved runtime changes, run the existing tests from the repository root:

```sh
node tools/smoke-test.mjs <screenshot-directory>
SEED=28 node tools/level-test.mjs <screenshot-directory>
node tools/coast-demo-test.mjs <screenshot-directory>
```

Use `PLAYWRIGHT_PATH` when Playwright is installed outside the checkout. In the
prepared cloud environment, source
`/workspace/.cloud-onboarding/retro-space-shooter/environment.sh` if present.
Put generated screenshots outside the checkout and run suites sequentially.
Both tests manage their own local servers. Use `tools/speed-test.mjs` for
drawing changes and compare performance on the same machine. Simulated iPhone
dimensions in Chromium do not establish real Safari compatibility.

Checks must exercise real behavior and fail when it is broken. Investigate
intermittent failures using their seed; do not weaken assertions. Re-read game
objects after resets, test every user of shared behavior, and inspect visual
results. Prepaint expensive art and keep drawing randomness separate from
simulation randomness. Confirm test completion and preserve exit status.

For documentation-only work, inspect the diff and whitespace and confirm that
runtime files are unchanged; a gameplay suite rerun is not required.

Communicate in short, plain English suitable for a phone-only user. Explain
choices, offer genuinely different visual concepts together, and ask one
decision at a time. Review each approved release before handover; update
`CLAUDE.md` and `LESSONS.md` together for actual new decisions and releases.
For releases, use `tools/set-version.sh` to keep cache versions aligned and
give phone test steps with expected results. Only claim saved, published, or
live status when verified for this allowed repository. Wait for the user's
stage review before starting the next stage.
