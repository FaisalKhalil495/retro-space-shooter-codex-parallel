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
by the earlier boss-preview module. Anchor/dart and the player are private
refinements of the game's existing original sprites; no shared sprite changes.
