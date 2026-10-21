# Approved stage — one continuous Level 4 mission preview

Status: explicitly approved by the owner on 2026-10-21 and implemented as
LEVEL 4 PREVIEW 1 under `demos/glacier-level/`. See its README for actual
counts, timing, verification and phone review. Breakwater 7 and the other
previews remain unchanged. Campaign integration and new music stay separate.

## Result to review

Create a separate `demos/glacier-level/` preview: roughly three minutes of
regular combat, followed by Breakwater's entrance and the current three-phase
fight. The complete mission will therefore take longer than three minutes,
as in the earlier worlds. This joins the approved pieces into one playable
journey before campaign integration. Keep the existing coast, combat and
boss previews available as delivered.

Work only in `FaisalKhalil495/retro-space-shooter-codex-parallel`, using the
existing checkout and preview branch. Never modify, push, merge, open PRs,
or deploy against `retro-space-shooter` or `retro-space-shooter-codex`.

## Approved mission progression

| Section | Combat |
| --- | --- |
| Opening minute | Shelf Skiffs, Anchor Guns and Twin Darts. Start with readable encounters, then mix ground fire and separated fighter lanes. |
| Middle minute | Introduce Crest Bombers, Snow Rollers, Needle Wings and Wake Hunters individually before mixing them with earlier types. |
| Final minute | Stronger combinations using all seven types, with staggered entries and warnings rather than releasing every type together. |
| Boss approach | Stop regular arrivals, let remaining threats clear safely, show the boss warning, then bring in Breakwater with his existing entrance, speech and supplies. |

Start from a target of about 80 regular enemies across the three sections;
Twin Darts count as individual craft. This is initial wave tuning, not a
promise to force every arrival onto a crowded screen. Report actual counts,
delays and maximum density with the preview. Boss escorts, supply pods and
shootable bombs/charges are counted separately.

Start with at most four regular enemies alive at once, including incoming
ones. Count hazards and surviving shots in the density review as well.
Delay occupied lanes without accumulating a later simultaneous spawn burst.
Keep ground units on the floor and leave clear flight space at actual phone
scale. If the initial count/spacing fails these checks, tune the schedule
before delivery and report the final numbers. Do not silently weaken warnings,
shrink hit areas, or alter the seven accepted individual enemy behaviors.

## Preserve and connect

- Use the latest supplied icy battlefield, still smoke and distinct scrolling
  rock/ice shelf throughout the new mission. No new scenery redesign or solid
  terrain obstacles; the flat safe floor remains y=130.
- Reuse the accepted compact regular-enemy art and behaviors. Keep Breakwater
  revision 7's exact tuning, random reachable locked lance gaps, rear waves,
  nine patterns, 250 HP and ten-part destruction.
- Use the original hero, engine flame, bullets, movement, weapons, controls,
  damage, three lives and five health blocks. Start with the ordinary gun.
- Add the existing supply-pod schedule and original pickups used by earlier
  levels. Keep the native adaptive boss supplies and phase rewards. Do not
  add new currencies, power-ups, drop systems or weapon types.
- Carry the player's actual health, lives, score, weapons and remaining timed
  power-ups into the boss. Do not reset the player to a fresh boss-demo state
  or grant an automatic heal at the transition.
- Include pause/resume, orientation/app interruption, full-mission replay and
  an in-session boss retry once Breakwater is reached. Boss retry follows the
  existing checkpoint rule: score zero, three lives, five health and no carried
  special weapon. Ordinary life loss continues to use the normal respawn.
- Use existing synthesized effects. New level/boss recordings need their own
  listening-review stage. Do not replace any of the six approved music tracks.
- Keep preview scores/progress/checkpoint state in memory only. No local-storage
  writes, new campaign entry, level unlock, menu changes or save migration.
  Full campaign connections and permanent progress remain a later stage.

## Verification and delivery

Verify a complete regular-combat-to-boss run, all seven regular types, three
boss phases, preserved resources through the transition, supply contents,
defeat/victory, boss retry, pause and replay. Check no-fire/no-kill crowding,
occupied lanes, finite arrival delays, marked hazards, reachable targets and
a boss transition that cannot wait forever or overlap leftover regular fire.

Keep source art and hero/bullet pixels unchanged. Re-run the focused boss,
reinforcement, difficulty, battlefield, combat and earlier-content checks,
plus a same-machine drawing comparison. A full-playthrough fixture can use
invulnerability to prove progression, but must be labeled accordingly; it
does not establish human difficulty. Record normal-health native-touch play
and label any selected section or checkpoint fixture clearly.

Deliver one labeled portable playable mission and a short phone-friendly
video. Validate both phone layouts with no external requests, browser errors
or save writes. Update project memory with actual timing, counts, density,
checks and any schedule adjustments, save only to the allowed preview branch,
then stop for the owner's phone review before music or campaign integration.
