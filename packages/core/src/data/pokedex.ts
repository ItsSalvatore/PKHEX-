import { PokemonType } from './types.js';
import raw from './pokedex-data.json';

/** Compact entry from PokeAPI: types, base stats [hp,atk,def,spa,spd,spe], abilities [1,2,hidden], intro generation */
export interface SpeciesPokedexEntry {
  t: [number, number | null];
  s: [number, number, number, number, number, number];
  a: [number, number, number];
  g: number;
}

const DATA = raw as unknown as Record<string, SpeciesPokedexEntry>;

export function getPokedexEntry(species: number): SpeciesPokedexEntry | null {
  if (species <= 0) return null;
  return DATA[String(species)] ?? null;
}

export function getSpeciesTypes(species: number): [PokemonType, PokemonType | null] {
  const e = getPokedexEntry(species);
  if (!e) return [PokemonType.Normal, null];
  const t1 = e.t[0] as PokemonType;
  const t2 = e.t[1] !== null ? (e.t[1] as PokemonType) : null;
  return [t1, t2];
}

export function getSpeciesBaseStats(species: number): SpeciesPokedexEntry['s'] | null {
  return getPokedexEntry(species)?.s ?? null;
}

export function getSpeciesAbilityIds(species: number): { first: number; second: number; hidden: number } {
  const e = getPokedexEntry(species);
  if (!e) return { first: 0, second: 0, hidden: 0 };
  return { first: e.a[0], second: e.a[1], hidden: e.a[2] };
}

/** Generation the species first appeared (national dex context; not form-aware). */
export function getSpeciesIntroGeneration(species: number): number | null {
  return getPokedexEntry(species)?.g ?? null;
}

export function getDocumentedSpeciesIds(): number[] {
  return Object.keys(DATA).map(Number).sort((a, b) => a - b);
}

export const POKEDEX_SPECIES_COUNT = Object.keys(DATA).length;
