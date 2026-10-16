# Glacier bases — background revision 6.2

The owner rejected revision 6.1's aerial battle as ghostlike and requested
less motion or buildings/bases with smoke. `glacier-bases.png` (1536×1024)
is the current runtime plate, edited from `invasion-world.png` with OpenAI
image generation on 2026-10-16. It preserves the daylight glacier landscape
and replaces isolated guns with three opaque, grounded arctic base clusters:
communications/radar bunker, damaged generator station, and damaged hangar/
control tower. Roof damage and foundations are baked in; moving smoke and
fire are separate. No flying craft, tracers or sky explosions are in the art.
The generated original is retained at
`/workspace/generated_images/exec-ae80b2b3-5077-4828-808a-36eef947c564.png`.

The runtime retains the 3:2 ratio at 225×150 game pixels, y=-8, with a fixed
8-pixel horizontal crop. The bases stand on the image's snowy cliff rim.
`../battlefield.js` caches 24 merged-billow smoke frames at four frames/s,
four small fire frames, and eight localized flare frames before play. Two
roof anchors stay at world (114,56.5) and (164,55.5); only the top of the smoke
thins out. One 0.4-second flare occurs every 18 seconds at the generator.
No aircraft or projectiles animate. The sky, lake and world camera stay still;
the unchanged snow floor scrolls at the native speed, with collision y=130.
All drawing stays behind gameplay, with no colliders, audio, damage, scores,
extra enemies, save writes or combat RNG calls. Pause/restart use game time.

## Preserved reference and previous plate

The owner supplied `1000086541.jpg`, preserved byte-for-byte as
`invasion-reference.jpg` (1280×853). Revision 6.1's `invasion-world.png`
(1536×1024) was generated from that reference on 2026-10-16 by removing baked
flying ships, exhaust and smoke. It is retained as the source of the new
base edit and for history; current play/export loads `glacier-bases.png`.
Its generated original remains outside the checkout at
`/workspace/generated_images/exec-548d79ab-a948-43ad-8a25-94ed2d9ea44d.png`.
Older portable previews remain unchanged outside the repository.

SHA-256:

```
d6cf4972784daefd2863d2092b5be848551baafbd3bfa507a99bd66c54c21ea0  invasion-reference.jpg
ddb200bfa6a74f1180026ecb4ffacca2512d7af8eb064ecdacf19c21966de7d6  invasion-world.png
2675ef24d7b36479f8534930af8b619e1ffbff3694ee752b04ec48b67f7a4116  glacier-bases.png
```
