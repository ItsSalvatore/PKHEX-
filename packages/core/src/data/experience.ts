import raw from './exp-growth-tables.json';

/** PokeAPI growth-rate id 1..6 → cumulative exp to reach levels 1..100 (index 0 = level 1). */
const TABLES = raw as unknown as Record<string, number[]>;

/**
 * Current total experience → level, using official curve for the species' growth group
 * (PokeAPI growth-rate id 1..6, stored as `e` in pokedex-data).
 */
export function getLevelFromTotalExperience(totalExp: number, pokeapiGrowthId: number): number {
  const id = Math.max(1, Math.min(6, pokeapiGrowthId | 0));
  const arr = TABLES[String(id)] ?? TABLES['2'];
  const exp = Math.max(0, totalExp);
  for (let L = 100; L >= 1; L--) {
    const need = arr[L - 1] ?? 0;
    if (exp >= need) return L;
  }
  return 1;
}
