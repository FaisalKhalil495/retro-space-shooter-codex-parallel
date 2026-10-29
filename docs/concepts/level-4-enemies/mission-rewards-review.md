# Glacier Coast preview 6 — smaller enemies and earned supplies

The owner played Preview 5 and directly requested a further size reduction and
kill rewards like the first three worlds: ammunition, spread shot and other
power-ups. This authorizes feedback in the existing mission and its current
Pages branch, not campaign integration or changes to either other repository.

## Why kills were unrewarding

All seven mission types reused the preview combat definitions, which had no
`dropChance` or `ammoLoot` fields. `Game.killEnemy` already called `maybeDrop`,
but the default chance was zero. Only the ten scheduled supply pods and boss
supplies could help. More regular kills meant more points, not more equipment.

The shipped worlds already provide the correct mechanism. Gunships drop loot
30% of the time; turrets/snipers 15%; Rust Raiders, Rime Guards and big rocks
35%, explicitly rising to 50% at low health. Other types use the native adaptive
formula. Successful rolls may give ammo or an automatic power-up. At full
health, Repair's weight moves to Spread Shot and Rapid Fire. With two health
blocks or fewer, drops become more frequent and favor Repair. Reuse this native
policy; do not add currencies, new weapon types, a loot meter or visual tells.

## Current size and regular-kill chances

| Machine | Preview 5 | Preview 6 | Base drop chance |
| --- | --- | --- | --- |
| Shelf Skiff | 25×9 | 18×7 | 30% |
| Anchor Gun | 23×13 | 17×10 | 15% |
| Twin Dart | 20×10 | 14×7 | 20% |
| Crest Bomber | 28×8 | 20×6 | 35% |
| Snow Roller | 25×11 | 18×8 | 35% |
| Needle Wing | 28×9 | 20×7 | 15% |
| Wake Hunter | 26×11 | 19×8 | 10% |

Widths fall another 26–30%; typical drawn area is roughly halved. Fighters are
now smaller than the unchanged 18×11 hero. Boss fighters use the same 14×7 Dart.
Keep original source images, sharp quarter-pixel sampling, matching masks,
muzzles, flashes, opening states and turns. Ground machines must remain hittable
by the normal gun from a legal flight height. The boss hull stays 58×24.

All seven regular types can drop ammo. Bombers/Rollers use the native heavy-
carrier 50% hurt chance; other types use the original `chance * 2.5 + 0.06`
low-health rule. A successful hurt roll favors Repair 60% of the time. Otherwise
ammo has its native 30% branch before the existing weighted automatic items.
Keep original quantities, caps and durations. More kills provide more chances,
not a guaranteed item from every kill. Score remains native too.

Ammo refills the special carried at collection, without swapping it. With no
special, the original random special-ammo behavior remains. If the special is
already full, use native `weaponPick` to give Rapid Fire or Spread Shot. Both
item drawing and collection call the same resolver. Spending ammo before grabbing
the pickup restores its ammo meaning, so its visible icon and actual reward agree.

Hazards and boss-created escorts keep the native no-random-loot policy. Escaping
or naturally expiring enemies cannot create rewards. Do not change the ten
scheduled pods, adaptive boss supplies or phase bonuses. Keep all 54 group
formations, 214 scheduled craft, enemy HP/attacks, warnings, defenses, hero,
controls, background, audio, saving and earlier previews/levels unchanged.

## Review requirements

Pin the actual delivered Preview 5 (01608d0) with its own artwork/behavior.
Test real damage/death through the native drop hook, every regular type at full
and low health, more kills/more drops, duplicate death prevention, boss/hazard
exclusions, all three carried specials and full-ammo fallback. Test actual
normal-gun kills followed by native movement and pickup collection for ammo,
Spread Shot and Rapid Fire. Confirm three bullets/half firing interval really
activate. Samples may clear cosmetic buffers after counting a drop; do not
mock loot creation or kill decisions. Pin only the random loot roll when testing
a specific gift, so unrelated effects cannot consume the intended roll.

Keep every whole-formation, paired/corner and boss escape requirement. New
muzzle geometry changes trajectories, so find new valid routes with five health,
three lives, complete expected attacks and no threat removal. Whole-run tests
still enforce all arrivals, body separation, clearance and boss handoff. Log
normal-health pilots, but stop requiring a fixed early death: earned repairs,
shields and stronger shooting are explicitly supposed to improve survival.
Keep independent no-fire pressure and aggression checks instead.

Look for LEVEL 4 PREVIEW 6, with mission=6 imports/image queries. Deliver a
standalone export, focused evidence and the update to the same allowed Pages
branch. Wait for the owner's phone feedback before another stage.

## Completed validation

All 1,278 checks pass: 88 rewards + 74 formation + 96 pressure + 88 mission +
67 art + 78 mission-escort + 787 preserved checks. Disabling only current kill
loot makes the new suite fail on zero item drops, as expected; exclude that
negative control from the passing total. All seven types have actual full-/
low-health kill samples, and real normal-gun encounters earn, move to, collect
and use ammo/spread/rapid with native five health/three lives. The same seeded
Dart sequence gives eight items after 40 kills, 37 after 200. Small ground targets
remain shootable in 0.83–1.08 s from legal height with no special or invulnerability.

All 21 formation, 17 paired/corner and 29 boss no-hit routes pass at both phone
sizes with complete attack counts; whole moving-player timelines remain separate
and within the sky bounds. No-fire runs retain 192 craft/614 rounds before
second 180 (Frostring 193/620). Complete no-fire progression admits 198 slots,
expires 16 and reaches the boss safely without fallback. Armed invulnerable
progression admits all 214, reaches the boss at 184.67 s and clears at 269.54 s.
Both standalone layouts embed 46 modules/two exact PNGs/one exact JPEG, finish
all entries/phases and test retry/selection without calls/errors/save writes.
The 32-second selected-wave native-touch clip starts with five health/three lives,
collects actual rapid/ammo drops and uses no ongoing player edits. Cached busy
rendering remains 108/140 calls normal/turned; prior-game counts are unchanged.
