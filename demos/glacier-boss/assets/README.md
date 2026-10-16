# Invasion battlefield artwork

The owner supplied `1000086541.jpg` and explicitly requested this icy world
with an animated invasion behind the playable fight. The supplied file is
preserved byte-for-byte as `invasion-reference.jpg` (1280×853).

`invasion-world.png` (1536×1024) is a clean landscape plate produced with
OpenAI image generation on 2026-10-16, editing that supplied reference. The
request preserved its daylight sky/sun, mountains, glacier cliff, frozen lake,
ice spires and four gun emplacements, removing the baked flying ships,
exhaust and smoke so moving scenery would not leave stationary duplicates.
The generated original is retained outside the checkout under
`/workspace/generated_images/exec-548d79ab-a948-43ad-8a25-94ed2d9ea44d.png`.

No ships or effects are baked into the clean sky. `../battlefield.js` paints
original separate pixel-art invaders, pale local defenders, engines, smoke,
fireballs and debris once into cached canvases, then animates them with the
game clock. Background combat is decorative, has no colliders or audio, and
never creates enemies/projectiles in the playable fight. The owner's source
image is a review reference only; the portable preview embeds just the plate.

SHA-256:

```
d6cf4972784daefd2863d2092b5be848551baafbd3bfa507a99bd66c54c21ea0  invasion-reference.jpg
ddb200bfa6a74f1180026ecb4ffacca2512d7af8eb064ecdacf19c21966de7d6  invasion-world.png
```

The plate retains its 3:2 aspect ratio at 225×150 game pixels and y=-8,
cropped by the viewport rather than stretched. A slow seven-pixel camera
drift explores it; the original safe floor remains y=130. Animation follows
fixed-step time, including pause and restart. All scenery renders before
the native hero, enemy machinery, bullets, warnings, pickups and screen
effects; the distant combat is clipped to y=11–71 to keep the lower fight clear.
