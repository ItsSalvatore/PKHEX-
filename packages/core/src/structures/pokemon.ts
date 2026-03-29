import { getSpeciesName } from '../data/species.js';

export enum PokemonGender {
  Male = 0,
  Female = 1,
  Genderless = 2,
}

export enum PokemonNature {
  Hardy, Lonely, Brave, Adamant, Naughty,
  Bold, Docile, Relaxed, Impish, Lax,
  Timid, Hasty, Serious, Jolly, Naive,
  Modest, Mild, Quiet, Bashful, Rash,
  Calm, Gentle, Sassy, Careful, Quirky,
}

export interface IVs {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface EVs {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface Stats {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface PokemonMove {
  id: number;
  pp: number;
  ppUps: number;
}

export interface RibbonData {
  id: string;
  name: string;
  obtained: boolean;
}

export interface Pokemon {
  species: number;
  nickname: string;
  otName: string;
  otId: number;
  secretId: number;
  exp: number;
  level: number;
  nature: PokemonNature;
  mintedNature?: PokemonNature;
  ability: number;
  abilityNumber: number;
  heldItem: number;
  gender: PokemonGender;
  form: number;
  isShiny: boolean;
  isEgg: boolean;
  language: number;
  friendship: number;
  ivs: IVs;
  evs: EVs;
  stats: Stats;
  moves: [PokemonMove, PokemonMove, PokemonMove, PokemonMove];
  pid: number;
  encryptionConstant: number;
  markings: number[];
  ribbons: RibbonData[];
  metLocation: number;
  metLevel: number;
  metDate?: { year: number; month: number; day: number };
  ball: number;
  dynamaxLevel?: number;
  teraType?: number;
  rawData: Uint8Array;
}

export function createEmptyPokemon(): Pokemon {
  return {
    species: 0,
    nickname: '',
    otName: '',
    otId: 0,
    secretId: 0,
    exp: 0,
    level: 1,
    nature: PokemonNature.Hardy,
    ability: 0,
    abilityNumber: 0,
    heldItem: 0,
    gender: PokemonGender.Male,
    form: 0,
    isShiny: false,
    isEgg: false,
    language: 2,
    friendship: 0,
    ivs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    stats: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    moves: [
      { id: 0, pp: 0, ppUps: 0 },
      { id: 0, pp: 0, ppUps: 0 },
      { id: 0, pp: 0, ppUps: 0 },
      { id: 0, pp: 0, ppUps: 0 },
    ],
    pid: 0,
    encryptionConstant: 0,
    markings: [],
    ribbons: [],
    metLocation: 0,
    metLevel: 1,
    ball: 4,
    rawData: new Uint8Array(0),
  };
}

export function isSpeciesValid(species: number): boolean {
  return species > 0 && species <= 1025;
}

/** Nickname from save, or species name when unset / default (matches PKHeX-style display). */
export function getPokemonDisplayName(pkm: Pick<Pokemon, 'nickname' | 'species'>): string {
  const nick = (pkm.nickname ?? '').trim();
  const speciesName = getSpeciesName(pkm.species);
  if (pkm.species <= 0) return nick || '—';
  if (!nick || nick.toLowerCase() === speciesName.toLowerCase()) return speciesName;
  return nick;
}

export function calculateShiny(pid: number, tid: number, sid: number): boolean {
  const val = tid ^ sid ^ (pid >>> 16) ^ (pid & 0xFFFF);
  return val < 16;
}

export function getDisplaySID(sid: number, gen: number): number {
  return gen >= 7 ? sid : sid & 0xFFFF;
}
