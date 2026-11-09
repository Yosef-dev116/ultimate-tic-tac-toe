// Renders the icon and splash source PNGs in resources/ from the vector marks below.
// Run: node scripts/build-resources.mjs, then: npm run cap:assets
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const PURPLE = '#7c3aed';
const ORANGE = '#fb923c';
const LAVENDER = '#a78bfa';
const PAPER = '#f7f6f3';
const NIGHT = '#121218';

/**
 * The mark: a bold tic-tac-toe grid with an X, an O, and a second X.
 * Drawn in a 1024 box. `scale` shrinks it around the centre for the Android adaptive safe zone and splash.
 */
function mark({ grid, x, o, scale = 1 }) {
  const cell = 270;
  const start = 107; // grid spans 107..917, centred in 1024
  const c = (i) => start + cell * i + cell / 2;
  const cross = (cx, cy) =>
    `<line x1="${cx - 58}" y1="${cy - 58}" x2="${cx + 58}" y2="${cy + 58}"/><line x1="${cx + 58}" y1="${cy - 58}" x2="${cx - 58}" y2="${cy + 58}"/>`;
  return `
  <g transform="translate(512 512) scale(${scale}) translate(-512 -512)" stroke-linecap="round" fill="none">
    <g stroke="${grid}" stroke-width="46">
      <line x1="${start + cell}" y1="${start}" x2="${start + cell}" y2="${start + 3 * cell}"/>
      <line x1="${start + 2 * cell}" y1="${start}" x2="${start + 2 * cell}" y2="${start + 3 * cell}"/>
      <line x1="${start}" y1="${start + cell}" x2="${start + 3 * cell}" y2="${start + cell}"/>
      <line x1="${start}" y1="${start + 2 * cell}" x2="${start + 3 * cell}" y2="${start + 2 * cell}"/>
    </g>
    <g stroke="${x}" stroke-width="64">${cross(c(0), c(0))}${cross(c(2), c(2))}</g>
    <circle cx="${c(1)}" cy="${c(1)}" r="66" stroke="${o}" stroke-width="64"/>
  </g>`;
}

const svg = (size, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${body}</svg>`;

const iconMark = mark({ grid: '#b89cf5', x: '#ffffff', o: ORANGE });
const files = {
  // Full-bleed square, opaque, no baked-in rounded corners. The OS applies its own mask.
  'icon-only': svg(1024, `<rect width="1024" height="1024" fill="${PURPLE}"/>${iconMark}`),
  'icon-background': svg(1024, `<rect width="1024" height="1024" fill="${PURPLE}"/>`),
  // Android adaptive icons crop to the inner ~66%, so the foreground mark is scaled down.
  'icon-foreground': svg(1024, mark({ grid: '#b89cf5', x: '#ffffff', o: ORANGE, scale: 0.78 })),
  splash: svg(2732, `<rect width="2732" height="2732" fill="${PAPER}"/><g transform="translate(982 982) scale(0.75)">${mark({ grid: '#d9d3e6', x: PURPLE, o: '#ea580c' })}</g>`),
  'splash-dark': svg(2732, `<rect width="2732" height="2732" fill="${NIGHT}"/><g transform="translate(982 982) scale(0.75)">${mark({ grid: '#3a3a4a', x: LAVENDER, o: ORANGE })}</g>`),
};

mkdirSync('resources/src', { recursive: true });
for (const [name, markup] of Object.entries(files)) {
  writeFileSync(`resources/src/${name}.svg`, markup);
  const image = sharp(Buffer.from(markup));
  // Only the Android foreground layer keeps transparency. Everything else is flattened to opaque RGB.
  await (name === 'icon-foreground' ? image : image.flatten({ background: PURPLE })).png().toFile(`resources/${name}.png`);
}
console.log('Wrote', Object.keys(files).join(', '));
