/**
 * Fetches PokeAPI growth-rate 1..6 and writes exp-growth-tables.json
 * (cumulative exp to reach each level 1..100). Run: node scripts/fetch-exp-tables.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../packages/core/src/data/exp-growth-tables.json');

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function main() {
  const tables = {};
  for (let id = 1; id <= 6; id++) {
    const j = await fetchJson(`https://pokeapi.co/api/v2/growth-rate/${id}/`);
    const sorted = [...j.levels].sort((a, b) => a.level - b.level);
    tables[String(id)] = sorted.map((x) => x.experience);
    console.error('growth-rate', id, j.name, tables[String(id)].length);
  }
  fs.writeFileSync(OUT, JSON.stringify(tables), 'utf8');
  console.error('wrote', OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
