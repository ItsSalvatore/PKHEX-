import fs from 'fs';

const path = new URL('./StringConverter3.cs', import.meta.url);
const data = fs.readFileSync(path, 'utf8');

const HGM = '\u2642';
const HGF = '\u2640';
const Terminator = '\u00FF';

function parseTable(afterName) {
  const start = data.indexOf(afterName);
  if (start < 0) throw new Error('start');
  const i0 = data.indexOf('[', start);
  const i1 = data.indexOf('];', i0);
  const block = data.slice(i0 + 1, i1).replace(/\/\/.*$/gm, '');
  const re = /'((?:\\.|[^'\\])*)'|\b(HGM|HGF|FGM|FGF|Terminator)\b/g;
  const items = [];
  let m;
  while ((m = re.exec(block))) {
    if (m[1] !== undefined) {
      items.push(m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
    } else {
      const tok = m[2];
      if (tok === 'HGM' || tok === 'FGM') items.push(HGM);
      else if (tok === 'HGF' || tok === 'FGF') items.push(HGF);
      else if (tok === 'Terminator') items.push(Terminator);
    }
  }
  return items;
}

const G3_EN = parseTable('G3_EN =>');
const G3_JP = parseTable('G3_JP =>');
console.log('G3_EN', G3_EN.length, 'G3_JP', G3_JP.length);
if (G3_EN.length !== 256 || G3_JP.length !== 256) {
  throw new Error('expected 256 chars each');
}
const outPath = new URL('../src/data/gen3-char-tables.json', import.meta.url);
fs.writeFileSync(outPath, JSON.stringify({ G3_EN, G3_JP }));
