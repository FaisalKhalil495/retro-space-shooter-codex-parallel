# Mission invader artwork

The owner supplied five original enemy concepts on 2026-10-22 and explicitly
requested larger, sharper game enemies matching them. `invaders.png` is an
image-tool-generated transparent atlas derived from those references, preserving
olive/cream armor, snow, weapons and distinctive silhouettes. It is an adapted
game asset, not an exact pixel copy of each photograph. No external asset pack,
paid-provider job, third-party license or runtime service is involved.

| Supplied filename | Enemy | SHA-256 of supplied JPEG |
| --- | --- | --- |
| 1000086536.jpg | Snow Roller | 096bbba93503cce3af1fe76c12b1003d5f1c6ad663dc3caed3722a09cf44578c |
| 1000086537.jpg | Needle Wing | a14ac1d9daeb327d41ab9f7513b7eb05d644c8c5216ca82166efa88666ed7871 |
| 1000086538.jpg | Wake Hunter | f0790cacb2bc91a1bac002e2f24f55664f0f9eba177165cfc8877106d574652c |
| 1000086535.jpg | Crest Bomber | 0ab1d08da2b1dd25d9f6be2a2095c3188fa87a3b927e83ed1a4906de9ba73f30 |
| 1000086534.jpg | Shelf Skiff | 70254f6187bced09910b04191322fcf7d7228727509bc92e47ac556f6334b33e |

Atlas: 1024×1536 RGBA, SHA-256
`987c5d6d8c1a2854fa6083bc82d702dbd98fd96d8df2ab08fdfffb07110ddca7`.
The tool's source output is
`/workspace/generated_images/exec-3ec972e3-17a0-4aaf-a27c-648daa9b17cf.png`.
The original remains there. The preceding tool draft also remains outside the
checkout; no scenery/background from it is used in the game.

The five vertically packed vehicles use source cells defined in `../art.js`.
Two long fins share y coordinates at different x positions; separate cell clip
paths keep each fin with its own ship. The browser finds each cell's opaque
bounds once, samples a cached quarter-pixel picture, alpha-tests edges, and
creates matching collision masks and hit-flash copies. No image processing
runs in the frame loop. The unchanged supplied battlefield JPEG remains owned
by the earlier boss-preview module. The player remains a private refinement of the game's original sprite; no
shared sprite changes. Anchor/Dart replacements are documented below.

## Preview 3: remaining enemy conversion

The owner reported remaining old/small enemies after Preview 2. The missed
Anchor Gun and Twin Dart legacy upscales have now been replaced. All mission
boss reinforcements use the same detailed Dart artwork as regular waves.

`anchor-darts.png` is a generated transparent 1774×887 RGBA state atlas,
SHA-256 `1fb1d26d7f6fa9efdd5ddaa753bc48d54fee8afe03b565729d11eba612423c6f`.
It derives from the existing original concept illustrations and uses
`invaders.png` as a faction-material reference. Top row: closed armor/weapons;
bottom row: open armor/weapons. Anchor on the left, one Dart on the right.
The final source remains at
`/workspace/generated_images/exec-603e30b8-d2d9-4bdd-957e-71592ce83f3c.png`.

| Existing concept source | SHA-256 |
| --- | --- |
| docs/concepts/level-4-enemies/anchor-gun.png | c991366fa4f285912980d2c64e4af22c241e207f0422474ff5fb164bc32fe5cb |
| docs/concepts/level-4-enemies/twin-darts.png | 3ade8a1ecde84c5405aabb38001cd2d34fe2b21cc2a18795e189313306c8dbb3 |

Cell bounds and registration offsets in `../art.js` align anchor feet across
states and keep a stable gun frame. Both states are cached at quarter-pixel
detail with their own alpha masks and flash copies. No legacy-art import or
fallback remains in the mission art module. Earlier demo/campaign art is intact.
