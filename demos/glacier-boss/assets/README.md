# Owner-supplied icy battlefield — revision 6.3

On 2026-10-20 the owner supplied three JPEG pictures and asked to use them
as the background, allowing smoke to remain still if realistic animation
was difficult. All three files are preserved byte-for-byte:

| Upload | Repository file | Size | Use |
| --- | --- | --- | --- |
| 1000086584.jpg | icy-battlefield.jpg | 1280×720 | Finished battlefield: ringed planet, mountains, defenses, wrecks, smoke and fires. |
| 1000086605.jpg | icy-snowfield.jpg | 1280×720 | Clean landscape, supplying the scrolling foreground snow strip. |
| 1000086606.jpg | icy-wrecks-greenscreen-reference.jpg | 1280×853 | Source/reference only; its wrecks already appear in the finished composite. Never display the green backing. |

No generative image editing, recoloring, crop, warping, replacement smoke or
extra overlays are applied to the finished picture. The full 16:9 view is
resampled once at 208×117 game pixels (double-detail canvas), starting y=11.
Its last snow row extends by two pixels to meet the native solid floor at
130. The foreground snow strip comes from the bottom of the clean snowfield,
keeping the source strip's aspect ratio, and scrolls at the native speed.
Shared cached canvases avoid live painting and decoding during combat.

The smoke is baked over wrecks/cliff in the supplied stills, not a separate
animation sequence. Preserve its original realistic appearance rather than
move parts of ships/cliffs or add artificial plumes. The owner explicitly
allowed this static fallback. The pictured fires/smoke, buildings and wrecks
are scenery only: no collisions, damage, new shots/enemies, scores, audio or
save writes. The entire backdrop stays still, including at the old flare
schedule; foreground gameplay draws afterward. Native camera shake remains.

SHA-256:

```
cbb6d87aa95f04d556dc2591878b6ece9def01d44b85e275cf504265ecf17630  icy-battlefield.jpg
6fae3b133c7db43ff95946e940da341023d6c917090f10a851dc336d59c2862f  icy-snowfield.jpg
ff8c05d5eb67254b0841959c5fcd26ff893f567722b49163a94566433ff665de  icy-wrecks-greenscreen-reference.jpg
```

## Earlier preserved art

Revision 6.2's generated `glacier-bases.png` and revision 6.1's generated
`invasion-world.png` remain as historical assets; neither is loaded by current
play/export. `invasion-reference.jpg` is the owner's earlier 1000086541.jpg.
The generated sources were produced on 2026-10-16. Their recorded original
paths were `/workspace/generated_images/exec-ae80b2b3-5077-4828-808a-36eef947c564.png`
and `/workspace/generated_images/exec-548d79ab-a948-43ad-8a25-94ed2d9ea44d.png`;
those external paths may not survive a new cloud machine. The tracked PNGs
retain the originals:

```
d6cf4972784daefd2863d2092b5be848551baafbd3bfa507a99bd66c54c21ea0  invasion-reference.jpg
ddb200bfa6a74f1180026ecb4ffacca2512d7af8eb064ecdacf19c21966de7d6  invasion-world.png
2675ef24d7b36479f8534930af8b619e1ffbff3694ee752b04ec48b67f7a4116  glacier-bases.png
```
