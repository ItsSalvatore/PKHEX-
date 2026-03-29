/**
 * Fetches species 1..MAX from PokeAPI and writes compact pokedex-data.json for @pkhex/core.
 * Run: node scripts/generate-pokedex.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../packages/core/src/data/pokedex-data.json');
const MAX = 1025;
const DELAY_MS = 35;

const TYPE_MAP = {
  normal: 0, fighting: 1, flying: 2, poison: 3, ground: 4,
  rock: 5, bug: 6, ghost: 7, steel: 8, fire: 9,
  water: 10, grass: 11, electric: 12, psychic: 13, ice: 14,
  dragon: 15, dark: 16, fairy: 17,
};

const GEN_MAP = {
  'generation-i': 1, 'generation-ii': 2, 'generation-iii': 3, 'generation-iv': 4,
  'generation-v': 5, 'generation-vi': 6, 'generation-vii': 7, 'generation-viii': 8,
  'generation-ix': 9,
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function main() {
  const out = {};
  for (let id = 1; id <= MAX; id++) {
    try {
      const [pk, sp] = await Promise.all([
        fetchJson(`https://pokeapi.co/api/v2/pokemon/${id}`),
        fetchJson(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
      ]);

      const types = pk.types.sort((a, b) => a.slot - b.slot).map((x) => TYPE_MAP[x.type.name]);
      const t1 = types[0] ?? 0;
      const t2 = types.length > 1 ? types[1] : null;

      const statOrder = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
      const byStat = Object.fromEntries(pk.stats.map((s) => [s.stat.name, s.base_stat]));
      const s = statOrder.map((k) => byStat[k] ?? 0);

      const abilities = [[], [], []]; // slot 1, 2, hidden
      for (const ab of pk.abilities) {
        const aid = parseInt(ab.ability.url.split('/').filter(Boolean).pop(), 10);
        if (ab.is_hidden) abilities[2].push(aid);
        else if (abilities[0].length === 0) abilities[0].push(aid);
        else abilities[1].push(aid);
      }
      const a = [
        abilities[0][0] ?? 0,
        abilities[1][0] ?? 0,
        abilities[2][0] ?? 0,
      ];

      const genName = sp.generation?.name;
      const g = GEN_MAP[genName] ?? 1;

      out[String(id)] = { t: [t1, t2], s, a, g };
      if (id % 50 === 0) console.error('ok', id);
    } catch (e) {
      console.error('fail', id, e.message);
      out[String(id)] = { t: [0, null], s: [1, 1, 1, 1, 1, 1], a: [0, 0, 0], g: 1 };
    }
    await sleep(DELAY_MS);
  }

  fs.writeFileSync(OUT, JSON.stringify(out), 'utf8');
  console.error('wrote', OUT, Object.keys(out).length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
