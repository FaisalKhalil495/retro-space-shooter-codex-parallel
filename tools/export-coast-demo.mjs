// Optional review export, not a build step for the game or served demo.
// Usage: node tools/export-coast-demo.mjs /path/to/glacier-coast-demo.html
// Embeds the unchanged module sources using browser import maps and Blob URLs.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = process.argv[2];
if (!output) throw new Error('Provide the destination HTML file');
const sources = {};
const idOf = (path) => 'ember/' + relative(root, path).split(sep).join('/');
async function collect(path) {
  const id = idOf(path);
  if (id in sources) return;
  sources[id] = ''; // Allows module cycles without recursing forever.
  const source = await readFile(path, 'utf8');
  const imports = [...source.matchAll(/^((?:import|export)\s+[^;]*?\bfrom\s+)(['"])([^'"]+)\2/gm)];
  let bundled = source;
  for (const match of imports) {
    const specifier = match[3];
    if (!specifier.startsWith('.')) throw new Error('Unexpected external module: ' + specifier);
    const dependency = resolve(dirname(path), specifier.split('?')[0]);
    if (!dependency.startsWith(root + sep)) throw new Error('Module escapes repository');
    await collect(dependency);
    bundled = bundled.replace(match[0], match[1] + JSON.stringify(idOf(dependency)));
  }
  sources[id] = bundled;
}
const entry = resolve(root, 'demos/glacier-coast/main.js');
await collect(entry);
let html = await readFile(resolve(root, 'demos/glacier-coast/index.html'), 'utf8');
const payload = JSON.stringify(sources).replace(/</g, '\\u003c');
const art = await readFile(resolve(root, 'demos/glacier-coast/assets/glacier-world.png'));
const bootstrap = `<script>
globalThis.__coastEmbeddedArt = 'data:image/png;base64,${art.toString('base64')}';
const sources = ${payload};
const imports = {};
for (const [name, source] of Object.entries(sources)) {
  imports[name] = URL.createObjectURL(new Blob([source], {type: 'text/javascript'}));
}
const map = document.createElement('script');
map.type = 'importmap';
map.textContent = JSON.stringify({imports});
document.head.appendChild(map);
const entry = document.createElement('script');
entry.type = 'module';
entry.textContent = 'import "${idOf(entry)}";';
document.body.appendChild(entry);
</script>`;
html = html.replace(/\s*<link rel="icon"[^>]*>/, '');
html = html.replace('<a class="back" href="../../">Back to Ember Drift</a>', '');
html = html.replace('<script type="module" src="main.js?demo=2"></script>', bootstrap);
await mkdir(dirname(resolve(output)), { recursive: true });
await writeFile(output, html);
console.log(`Exported ${Object.keys(sources).length} modules in one HTML file: ${resolve(output)}`);
