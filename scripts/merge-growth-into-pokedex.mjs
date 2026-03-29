/**
 * Adds PokeAPI growth-rate id (1..6) as `e` on each pokedex-data.json entry.
 * Run: node scripts/merge-growth-into-pokedex.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEX = path.join(__dirname, '../packages/core/src/data/pokedex-data.json');
const DELAY_MS = 40;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const dex = JSON.parse(fs.readFileSync(DEX, 'utf8'));
  for (let id = 1; id <= 1025; id++) {
    const key = String(id);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
      if (!res.ok) throw new Error(String(res.status));
      const sp = await res.json();
      const url = sp.growth_rate?.url;
      const gid = url ? parseInt(url.split('/').filter(Boolean).pop(), 10) : 2;
      if (dex[key]) dex[key].e = gid >= 1 && gid <= 6 ? gid : 2;
    } catch {
      if (dex[key]) dex[key].e = 2;
    }
    if (id % 100 === 0) console.error('growth', id);
    await sleep(DELAY_MS);
  }
  fs.writeFileSync(DEX, JSON.stringify(dex), 'utf8');
  console.error('wrote', DEX);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
