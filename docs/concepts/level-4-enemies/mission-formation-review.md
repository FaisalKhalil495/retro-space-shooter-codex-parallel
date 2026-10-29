# Glacier Coast preview 5 — smaller craft and group waves

The owner played Preview 4 on GitHub Pages and found it too easy, too large,
and unlike the earlier levels' group attacks. They directly requested a modest
size reduction, more waves and more aggressive groups, with a comparison of all
three shipped worlds. This authorizes feedback work in the existing mission;
campaign integration, new artwork, new music and other repositories remain out
of scope. Work only in FaisalKhalil495/retro-space-shooter-codex-parallel.

## What the comparison found

The earlier levels use rows, snakes, pincers, convoys and groups of gunships,
often 3–8 enemies together, alongside separate terrain/hazards. Preview 4
scheduled 80 individual machines, admitted them at least 0.9 seconds apart,
and allowed only two flyers/four regular machines. Heavy-craft isolation and
long hover waits made many encounters feel separate even after bullets sped up.

These are actual first-180-second seed-28 no-fire runs, with invulnerability
only to observe the whole timeline. Count craft separately from supply pods,
rocks, shells, mines and charges. They are not a claim about human difficulty.

| Run | Craft entering | Mean visible craft | Enemy rounds |
| --- | ---: | ---: | ---: |
| The Outer Belt | 284 | 6.84 | 500 |
| Rust Moon | 229 | 6.18 | 578 |
| Frostring | 193 | 6.22 | 620 |
| Delivered Preview 4 | 65 | 2.43 | 375 |
| Preview 5 | 190 | 5.62 | 574 |

Craft sizes in the earlier game are mostly 10–16 pixels wide. Keep the chosen
detailed ice-planet designs, but reduce mission widths by 17–19% rather than
substituting the earlier enemies. Current sizes: Skiff 25×9, Anchor 23×13,
Dart 20×10, Bomber 28×8, Roller 25×11, Needle 28×9, Hunter 26×11. Boss fighters
use the same compact Dart. Original PNG/JPEG source bytes remain unchanged;
quarter-pixel sampling, masks, muzzles, hit flashes and turns match the new size.

## The resulting waves

There are 54 formations: 18 per minute. Scheduled craft rise from 80 to 214,
in sections of 54/72/88. Each formation has 3–5 members. Seven combinations use
the existing roster: Dart flights, Skiff skirmishes, Needle formations, escorted
bombers, ground convoys, paired hunter dives and high/low pincers.

Members are scheduled 0.42 seconds apart, with at least 0.28 seconds between
actual admissions. Cap regular machines at eight, at most six flyers and two
ground units. Entry geometry and body-length separation defer occupied lanes;
queues still expire after 8 seconds, or 12 for bombers/hunters. No catch-up dump.
A waiting hunter group reserves the next clear sky opportunity instead of
being starved by newer Darts. The first minute includes the whole roster.

Group Darts advance at one shared 48 px/s through warnings, firing and exit,
with a bounded six-pixel height adjustment toward the player. Follow-up rests
are 0.4 seconds, with up to four fully warned shots before passing. Solitary
Darts retain their four-shot/0.75-second behavior. Horizontal spacing preserves
the formation instead of pushing followers into the same vertical lane. Paired
hunters commit their dives one at a time while the other keeps its full locked
warning. This avoids a real crossing found by the moving-player overlap audit.

Keep all existing warning durations, 0.28-second warning staggering and
0.18-second salvo staggering. Ordinary speeds remain 20/25/30% above the native
regular bases. Keep HP, damage, vulnerability, supplies and native player
weapons/defenses. Breakwater's attacks, phase selection, 250 HP and destruction
remain Preview 4's; only its Dart artwork/geometry follows the new scale.

## Review requirements

Compare the actual delivered Preview 4 (commit c766572) in the same browser,
including its own old geometry and behavior. Reject it with the new formation
checks. Run complete no-fire and armed timelines, plus full crowded timelines
with vertical, rectangular and far-right player movement. Check every machine
for overlap, ground/flight clearance, bounded admissions and safe boss handoff.

The crowded column check allows a full 11-pixel hero plus four pixels of room,
after already padding every actor by four pixels. This replaces the old
four-enemy demo's half-screen-sized free-space target for the explicitly
requested denser formations. It is only a crowding bound; prove real dodges too.
Twenty-one selected real formations (all seven recipes at all three speed tiers)
have complete normal-health, normal-input, no-fire escapes, with every member
attacking and all threats clearing. Retain the 17 paired/corner routes and all
29 complete boss routes; update routes when the new muzzle geometry changes
bullet paths, without weakening health or attack-completion requirements.

Normal-health ordinary-gun pilots use no specials, teleporting, invulnerability
or ongoing player edits. Preview 4 versus Preview 5 time to lose all lives:
vertical patrol 84.75 → 73.23 s; rectangular route 175.38 → 89.32 s; crossing
figure-eight survived 180 s → 66.73 s. The same crossing pilot loses in Frostring
at 69.61 s. Run all three earlier worlds too; terrain, loot and tactics differ,
so these pilots support review rather than certify identical human difficulty.

Use LEVEL 4 PREVIEW 5 and mission=5 import/image queries. Deliver the standalone
HTML and labeled normal-health touch clip, then update the existing allowed
feature branch used by Pages. Do not merge main, change Pages settings or touch
either forbidden repository. Await the owner's phone feedback before more work.

## Completed validation

All 1,190 checks pass: 74 formation + 96 pressure + 88 mission + 67 art +
78 mission-escort + 787 preserved boss/background/campaign checks. Running the
formation suite against the actual Preview 4 fails on the old size, as expected.
The new admission regression also checks that removing a selected queue entry
cannot expose a waiting hunter and change the chosen lane to null; compute
and retain the lane before mutating the queue. Whole moving-player timelines
check the lower sky bound as well as physical separation.

No-fire progression admits 196 of 214 slots (18 expire), peaks at eight regulars,
ten actors with hazards and 16 rounds, with no overlap or stuck-threat fallback.
The padded-column free-space minimum is 16.85 pixels. Armed invulnerable
progression admits all 214, reaches Breakwater at 185.37 s and clears at 272.21 s.
Both portable phone layouts embed all 46 modules and the three exact runtime
images, finish all entries/phases and test native retry/selection without
external requests, errors or saving. The 32-second selected-wave touch clip
starts with normal five health/three lives and ends with one life remaining;
there are no ongoing player edits. The eight-regular/one-charge/24-round render
fixture costs 108 calls/frame normally, 140 fully turned, versus 75 scenery;
earlier-game fixture counts remain unchanged. Real phone review remains next.
