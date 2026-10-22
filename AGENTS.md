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

The owner rejected boss preview revision 1's design, small death effect and
low difficulty, explicitly requesting revisions. They chose **a sharp armored
icebreaker with a huge split bow cannon**. Revision 2 is authorized feedback
work, not a new campaign stage: same 58×24 footprint, seven warned attacks
(including a sweeping cannon and a flak gap), re-aimed repeat volleys, stronger
movement, and a long mechanical breakup with recognizable spinning parts and
snow impacts. Preserve compact regular enemies and all earlier content.
See the boss README for current values; its revision 2 rules supersede the
revision 1 tuning above. Review actual dodging, not only stationary damage
rates. Revision 2 passes 164 focused plus 220 existing checks; both portable
phone layouts complete with no external requests. Await phone review after
completing these revisions.

The owner requested removing **Breakwater's laser** and making each phase
more aggressive with new attacks and tactics, then explicitly approved the
plan at `docs/concepts/level-4-enemies/boss-escalation-plan.md`. Revision 3 is
authorized: Hunter Torpedoes (2/3/4 per salvo), position-aware phase-2 ice/darts,
phase-3 rush-with-flak and torpedoes-then-ice, varied selection with cooldowns,
and rests of 0.45/0.30/0.18 s. Keep 250 HP, the same 58×24 hull art and exact
ten-part destruction. The **player's laser must remain available**. Preserve
all original player weapons, hero/bullets, controls, supplies, saves and earlier
levels. Complete this approved revision without asking again, then await phone
review. Its current tuning supersedes revision 2 above. Campaign integration
and new boss music remain separate stages.
Revision 3 passes 214 focused and 220 existing checks (434 total), including
complete no-hit routes through the new combined patterns at three boss positions.

The owner likes the broadside exactly as it is and explicitly approved
**revision 4**, recorded in `docs/concepts/level-4-enemies/boss-pursuit-plan.md`.
Keep broadside shot counts, speed, damage and warning timing unchanged. Hunter
Torpedoes gain sharper turns, slight movement prediction and 1.2/1.4/1.6 s
tracking, keeping size, speed, HP and salvo counts. A compact roof launcher
raises and releases them from its visible tubes, within the 58×24 footprint
and ten-part breakup. Boss-only Twin Darts persist until killed, with 2 HP,
separate lanes, at most two alive and replacement only of missing fighters.
Survivors keep HP across phases and respawns, holding harmless during dialogue
and respawn. Breakwater keeps attacking; stagger escort fire around dangerous
patterns and test actual no-hit routes with both alive. This revision is
authorized: finish delivery and preservation checks, then await phone review.
Earlier levels, regular combat flights and all player systems stay unchanged.
Revision 4 passes 256 focused plus 220 existing checks (476 total), including
no-hit routes with both persistent fighters alive at three boss positions.

The owner rejected the easy skipping shell and underwhelming icicles and
explicitly approved **revision 5**; see
`docs/concepts/level-4-enemies/boss-heavy-weapons-plan.md`. Replace the shell
with rear-gun Cluster Mortars: 3 HP, six fast fragments, three-block direct/core
damage and 2/3/4 staggered shots. Upgrade flak to two-block Ice Lances in 1/2/3
separately warned walls with changing gaps. Replace small upward ice shots with
three-block tall temporary Glacier Ruptures: 2/3 strikes in phases 2/3, each
reacquiring only at a new warning. The torpedo combination uses two ruptures
after guidance ends. Preserve broadside, torpedo guidance/roof launcher,
persistent fighters, 250 HP, hull scale and exact destruction. Respect native
shields, hit protection, respawn and phase cleanup; test no-hit routes with both
fighters alive. Finish this approved revision, checks, playable copy and video
without asking again, then await phone review. Earlier content and campaign
integration boundaries remain unchanged.
Revision 5 passes 312 focused plus 220 existing checks (532 total), including
21 complete no-hit scenarios with both fighters alive and native-defense checks.

The owner requested a Breakwater review and improvements where needed.
Review fix **5.1** preserves all revision-5 attack tuning and art, moving the
lance and retained-wreck drawing into the native world/ship draw hook. Both
layers must follow screen shake and remain beneath the original hero, bullets
and screen effects. Full-scene pixel tests reproduce the old bugs and verify
the fixes. Current validation: 320 focused plus 220 existing checks (540 total).
The preview label and local module queries are 5.1; the campaign stays v0.29.0.
Review fix 5.1 is complete; await phone feedback before a new stage.

The owner explicitly approved **revision 6**, recorded in
`docs/concepts/level-4-enemies/boss-reinforcements-plan.md`: materially faster,
tighter torpedo pursuit lasting 2/2.3/2.6 seconds; 6/7/8 broadside volleys and
no more than three other attacks between broadsides after introductions;
visible retreat before fighters arrive from off-screen right behind the boss,
with three phase-2 positions and four phase-3 positions. This supersedes the
older exact torpedo-speed, five-volley and two-fighter limits. Retain survivors,
their HP and compact art; fill only missing positions. Preserve phase tactics,
native defenses, original content and exact destruction. Finish this approved
work, tests, playable copy and labeled demonstration without asking again,
then await phone review. Campaign integration and new music remain separate.
Revision 6 is complete: 320 boss checks, 124 reinforcement checks and 220
existing checks pass (664 total), including 29 complete no-hit scenarios.
Portable full wins and explicit four-fighter waves pass at both phone sizes
without save writes, browser errors or external requests. The normal-health
touch video shows selected phase-3 rear arrivals, torpedoes and broadside.
Look for BREAKWATER 6; await the owner's phone review before another stage.

The owner then supplied `1000086541.jpg`, requested that icy background,
and explicitly asked to see an animated invasion: invaders fighting the
local army, burning/falling local ships, explosions and smoke behind the
playable foreground fight. This directly authorizes the separate preview's
background revision **6.1**. `demos/glacier-boss/battlefield.js` uses a clean
plate edited from the supplied image, with separate cached original pixel
ships/effects. Preserve its recognizable daylight mountains, glacier cliff,
frozen lake and defensive batteries. Dark triangular warships are invaders;
pale fighters are local defenders. The background battle is scenery only,
clipped to the distant sky/horizon, drawn before gameplay, with no collisions,
game RNG, damage, rewards, audio or save writes. Use the fixed-step clock for
pause/restart, and prepaint artwork before play. Keep all revision-6 attack
values, player systems, exact breakup and floor y=130 unchanged. This replaces
the boss preview background only; the accepted coast/combat demos and the
three-level campaign stay unchanged. Look for **BREAKWATER 6.1** and await
phone review after delivery; campaign integration and new music remain later
stages. Asset reference/provenance: `demos/glacier-boss/assets/README.md`.
Revision 6.1 passes 32 battlefield checks and all previous 664 checks (696
total), including complete matching three-phase fights with active/inert
scenery. Earlier-game drawing-call counts remain unchanged. Phone layouts
do not establish real Android/Safari performance; await the owner's review.

The owner rejected revision 6.1's aerial animation as ghostlike and requested
less motion or buildings/bases with smoke. This directly authorizes revision
**6.2**: replace the moving background fleets, tracers and sky blasts with
three solid arctic base clusters planted on the glacier rim. Keep the chosen
icy landscape; two damaged roofs emit restrained billowing smoke and small
fires, with one brief roof flare every 18 seconds. The sky and world camera
stay still. Bases are fully opaque scenery in a new plate edited from the
previous landscape; smoke alone fades naturally. These directions supersede
6.1's hazed aerial battle. Preserve all revision-6 fight mechanics, original
hero/flame/bullets, audio/saving, the safe floor and exact destruction. Keep
the coast/combat demos and three-level campaign unchanged. Look for
**BREAKWATER 6.2**, then await the owner's phone review.
Revision 6.2 passes 32 updated background checks plus the 664 preserved
checks (696 total). Raster checks at six times, including a roof flare,
allow movement only within the two roof regions above the scrolling floor.
Full active/inert three-phase simulations match on both phone layouts.

On 2026-10-20 the owner supplied three new pictures and requested them as
the background, explicitly allowing the smoke to stay still if realistic
animation is difficult. Revision **6.3** uses the finished `1000086584.jpg`
as the intact battlefield, including its detailed baked smoke, ringed planet,
defenses and crashed ships. Use `1000086605.jpg` for the scrolling foreground
snow strip. Preserve `1000086606.jpg` as the supplied green-screen reference;
do not display its green backing or key it over the already finished composite.
All three original JPEG files are preserved byte-for-byte in boss assets.
The smoke overlaps the wrecks/cliff, so preserve it as pictured rather than
warp those objects or add artificial plumes. Remove 6.2's roof-smoke/fire/flare
effects. This directly authorized background feedback supersedes the earlier
boss scenery only. Keep every fight value, hero/flame/bullet, control, save,
audio and destruction rule unchanged, with the same solid floor at y=130.
Earlier campaign/coast/combat demos remain unchanged. Look for **BREAKWATER
6.3**; await phone review after this correction. Full Level 4 integration
and new music remain separate unapproved stages.
Revision 6.3 passes 35 picture/background checks and the 664 preserved checks
(699 total). Both portable phone layouts embed the two exact runtime JPEGs,
complete all phases and show the four-fighter wave without external requests,
errors or save writes. A 14-second video uses a fresh start and native touches,
with normal health/lives and no skipped entrance or fixture edits.

The owner found revision 6.3's foreground platform too similar to the picture
and directly requested rocks and ice. Revision **6.4** replaces only that
scrolling strip with original cached double-detail art: a flat snow cap,
snow-covered grey slate, fractured blue ice and small hanging ice teeth.
Every detail stays in y=130–144, beneath the unchanged flat safe floor;
there are no new obstacles or hazards. Preserve the finished battlefield
and baked smoke pixel-for-pixel, all three original JPEGs, every combat
value and original player system. The clean snowfield remains a reference,
not a runtime dependency; portable review needs only the finished JPEG.
Look for **BREAKWATER 6.4**, then await phone review. This is authorized
visual feedback, not full Level 4 integration or new music.
All 35 background checks and 664 combat/earlier-content checks pass (699 total),
including intact picture pixels and identical three-phase fights at both phone
layouts. Original campaign/coast/combat runtime files remain unchanged.

The owner explicitly approved **revision 7**, including their amendment for
unpredictable Ice Lance gaps; see
`docs/concepts/level-4-enemies/boss-difficulty-plan.md`. Complete this difficulty
pass without asking again. Broadside becomes 7/8/10 volleys at 106/118/130 px/s;
torpedoes track at 132/152/172 with turn limits 6.1/7.0/8.1 rad/s; lances travel
at 132/148/164; fighter rounds travel at 94/104 in phases 2/3. These approved
values supersede earlier exact values. All other attack values, cooldowns,
250 HP, warnings, 1.05-second vulnerable recovery and native defenses remain.
Each lance wall chooses a seeded random reachable gap at warning start, with
no fixed alternation, avoiding recent gaps where alternatives exist. Keep
28/26/24 widths and full 1.15-second warnings; lock the gap afterward. Rush
choices must keep the overhead route clear. Select from centers reachable
even diagonally, reserving 0.15 seconds of warning time for reaction. Rendering
never rolls these dice; pause preserves the marked gap. A thin dark lip on
the existing gap markers keeps them readable against bright snow. Keep all nine patterns,
compact rear waves and exact breakup. Preserve the supplied battlefield,
static smoke, revision-6.4 rock/ice shelf, original hero/flame/bullets, controls,
audio/saving and earlier content. Look for **BREAKWATER 7**, deliver verified
phone previews and await owner review. Full Level 4 and new music stay separate.
Revision 7 passes 787 checks: 320 boss, 124 reinforcements, 88 difficulty,
35 background and 220 earlier-content checks. The new suite includes 216
seeded lance/rush routes per phone; 29 full-pattern four-fighter routes retain
follow-up fire. The old gap rule fails the new checks. Both portable phone
layouts finish all phases and form four-fighter waves with no external
requests, browser errors or save writes. The selected-phase-3 video uses
normal health/lives and labeled native automated touches.

The owner explicitly approved the continuous full-mission preview on
2026-10-21; see `docs/concepts/level-4-enemies/full-mission-plan.md`. It is
implemented in **`demos/glacier-level/`**, labeled **LEVEL 4 PREVIEW 1**.
Reuse all seven accepted regular types and exact Breakwater 7. Schedule
20/26/34 individual craft over roughly three minutes, then safely drain
regular threats, warn and bring in the boss. Four regular actors maximum,
including incoming ones; crowded lanes defer entries and expire stale slots
rather than creating a catch-up burst. Heavy flyers reserve their turn so
all seven types appear. Preserve individual art/behaviors and the supplied
picture, static smoke, rocky ice floor, original hero/flame/bullets and controls.
Use the ten original level supply pods. Carry actual health/lives/score,
weapons and remaining timed powers into the boss without a reset or free heal.
Boss retry is in-session only: score 0, five health, three lives, ordinary gun,
cleared powers/hazards and no replay of regular waves. Full restart clears the
checkpoint. This preview performs no storage writes, campaign/menu changes,
new music or deployment. A mission-local kill hook immediately removes shot-down
regular hazards to prevent a final-frame bomb/charge burst; the delivered
combat/boss previews and shared runtime files remain untouched. Deliver the
portable mission/video and await phone review before campaign integration.
Full mission preview 1 passes 88 focused checks plus the 787 preservation
checks (875 total). The controlled armed fixture admits all 80; the no-fire
fixture admits 60 and expires 20 crowded slots, with all seven types, no
visible regular overlap and over 43.65 pixels of padded actor clearance.
Both portable phone layouts complete all three boss phases with no external
calls, browser errors or storage writes. The labeled final-wave video uses
native reset health/equipment and automated touches, without ongoing edits.
Earlier-game drawing-call counts remain unchanged; physical phone review is next.

The owner explicitly requested **mission preview 2** on 2026-10-22: larger,
sharper regular enemies matching their five supplied original pictures, and a
sharper player ship. This is authorized visual feedback, superseding the old
compact dimensions and exact interior hero-color rule for this mission only.
Keep the original hero silhouette, footprint, hitbox, engine flame, bullets,
firing and all player systems. Use private quarter-pixel art and types under
`demos/glacier-level/`; do not mutate shared sprites or earlier previews.
Regular sizes are skiff 30×10, anchor 18×12, dart 17×11, bomber 34×9,
roller 30×13, needle 34×11, hunter 32×13. Five reference-derived transparent
cutouts retain their distinctive machinery; the other two retain their accepted
art with added detail. Match collision masks, warning lines and muzzles to the
larger bodies. Space departing ground units and keep flyers 17 pixels above
the floor to accommodate the taller machines. Preserve HP, scoring, attacks,
timeline, supplies, background, exact Breakwater 7 and compact boss escorts.
Look for LEVEL 4 PREVIEW 2. All 88 mission, 40 art and 787 preservation
checks pass (915). Both portable phone layouts complete all 80 arrivals and
three boss phases with no external calls, errors or save writes. Earlier-game
drawing calls remain unchanged; cached busy mission drawing stays at 93 calls
per frame. The selected-wave touch clip shows all seven types with normal
health/lives. Await phone review; this does not authorize campaign integration
or new music.

The owner reported remaining old/small enemies after preview 2 and explicitly
requested a correction. **Mission preview 3** replaces the missed Anchor Gun
and Twin Dart legacy drawings with detailed reference-derived closed/open
states. Sizes are now anchor 28×15 and dart 24×12; the other five retain their
preview-2 art and sizes. All mission boss reinforcements also use that same
24×12 Dart art, replacing the earlier 11×8 fallback. This supersedes preview
2's compact-escort exception for this mission. Preserve the player, boss hull,
attacks, HP/points, persistent-fighter tactics and all earlier previews. Keep
alpha masks, muzzles, hit flashes and both weapon states consistent. Reserve
19 pixels above the floor for enlarged ground machines, and limit the lower
escort pair's vertical sway to keep all four wings separated above the hull.
Audit actual spawns through the boss call, not only the regular wave table.
Look for LEVEL 4 PREVIEW 3. All 1,006 checks pass: 88 mission, 53 art,
78 mission-escort and 787 preservation checks. The 29 complete no-hit boss
routes pass with larger escorts at both phone sizes. Both portable layouts
finish all 80 arrivals and all three boss phases, verify the corrected sizes
and retry UI, and make no external requests or save writes. Cached drawing
stays at 93 calls/frame; physical phone review remains next. The labeled
selected-wave/phase-3 clip shows four corrected rear fighters with native
health/lives and automated touches. Await phone review.

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
node tools/mission-demo-test.mjs <screenshot-directory>
```

Use `PLAYWRIGHT_PATH` when Playwright is installed outside the checkout. In the
prepared cloud environment, source
`/workspace/.cloud-onboarding/ember-drift/environment.sh` if present (older
machines used `/workspace/.cloud-onboarding/retro-space-shooter/environment.sh`).
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
