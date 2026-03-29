import { PokemonNature } from '../structures/pokemon.js';

export interface NatureInfo {
  name: string;
  increased?: string;
  decreased?: string;
}

export const NATURE_DATA: Record<PokemonNature, NatureInfo> = {
  [PokemonNature.Hardy]: { name: 'Hardy' },
  [PokemonNature.Lonely]: { name: 'Lonely', increased: 'Atk', decreased: 'Def' },
  [PokemonNature.Brave]: { name: 'Brave', increased: 'Atk', decreased: 'Spe' },
  [PokemonNature.Adamant]: { name: 'Adamant', increased: 'Atk', decreased: 'SpA' },
  [PokemonNature.Naughty]: { name: 'Naughty', increased: 'Atk', decreased: 'SpD' },
  [PokemonNature.Bold]: { name: 'Bold', increased: 'Def', decreased: 'Atk' },
  [PokemonNature.Docile]: { name: 'Docile' },
  [PokemonNature.Relaxed]: { name: 'Relaxed', increased: 'Def', decreased: 'Spe' },
  [PokemonNature.Impish]: { name: 'Impish', increased: 'Def', decreased: 'SpA' },
  [PokemonNature.Lax]: { name: 'Lax', increased: 'Def', decreased: 'SpD' },
  [PokemonNature.Timid]: { name: 'Timid', increased: 'Spe', decreased: 'Atk' },
  [PokemonNature.Hasty]: { name: 'Hasty', increased: 'Spe', decreased: 'Def' },
  [PokemonNature.Serious]: { name: 'Serious' },
  [PokemonNature.Jolly]: { name: 'Jolly', increased: 'Spe', decreased: 'SpA' },
  [PokemonNature.Naive]: { name: 'Naive', increased: 'Spe', decreased: 'SpD' },
  [PokemonNature.Modest]: { name: 'Modest', increased: 'SpA', decreased: 'Atk' },
  [PokemonNature.Mild]: { name: 'Mild', increased: 'SpA', decreased: 'Def' },
  [PokemonNature.Quiet]: { name: 'Quiet', increased: 'SpA', decreased: 'Spe' },
  [PokemonNature.Bashful]: { name: 'Bashful' },
  [PokemonNature.Rash]: { name: 'Rash', increased: 'SpA', decreased: 'SpD' },
  [PokemonNature.Calm]: { name: 'Calm', increased: 'SpD', decreased: 'Atk' },
  [PokemonNature.Gentle]: { name: 'Gentle', increased: 'SpD', decreased: 'Def' },
  [PokemonNature.Sassy]: { name: 'Sassy', increased: 'SpD', decreased: 'Spe' },
  [PokemonNature.Careful]: { name: 'Careful', increased: 'SpD', decreased: 'SpA' },
  [PokemonNature.Quirky]: { name: 'Quirky' },
};

export function getNatureName(nature: PokemonNature): string {
  return NATURE_DATA[nature]?.name ?? 'Unknown';
}

export function getNatureStatModifier(nature: PokemonNature, stat: string): number {
  const info = NATURE_DATA[nature];
  if (!info) return 1;
  if (info.increased === stat) return 1.1;
  if (info.decreased === stat) return 0.9;
  return 1;
}
