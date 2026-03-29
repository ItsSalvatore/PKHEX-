import type { Pokemon } from './pokemon.js';
import type { TrainerInfo } from './trainer.js';
import type { InventoryPouch } from './inventory.js';

export enum GameGeneration {
  Gen1 = 1,
  Gen2 = 2,
  Gen3 = 3,
  Gen4 = 4,
  Gen5 = 5,
  Gen6 = 6,
  Gen7 = 7,
  Gen8 = 8,
  Gen9 = 9,
}

export enum GameVersion {
  Red = 1, Blue = 2, Yellow = 3,
  Gold = 4, Silver = 5, Crystal = 6,
  Ruby = 7, Sapphire = 8, Emerald = 9, FireRed = 10, LeafGreen = 11,
  Diamond = 12, Pearl = 13, Platinum = 14, HeartGold = 15, SoulSilver = 16,
  Black = 17, White = 18, Black2 = 19, White2 = 20,
  X = 21, Y = 22, OmegaRuby = 23, AlphaSapphire = 24,
  Sun = 25, Moon = 26, UltraSun = 27, UltraMoon = 28,
  LetsGoPikachu = 29, LetsGoEevee = 30,
  Sword = 31, Shield = 32,
  BrilliantDiamond = 33, ShiningPearl = 34,
  LegendsArceus = 35,
  Scarlet = 36, Violet = 37,
}

export const GAME_NAMES: Record<number, string> = {
  [GameVersion.Red]: 'Red', [GameVersion.Blue]: 'Blue', [GameVersion.Yellow]: 'Yellow',
  [GameVersion.Gold]: 'Gold', [GameVersion.Silver]: 'Silver', [GameVersion.Crystal]: 'Crystal',
  [GameVersion.Ruby]: 'Ruby', [GameVersion.Sapphire]: 'Sapphire', [GameVersion.Emerald]: 'Emerald',
  [GameVersion.FireRed]: 'FireRed', [GameVersion.LeafGreen]: 'LeafGreen',
  [GameVersion.Diamond]: 'Diamond', [GameVersion.Pearl]: 'Pearl', [GameVersion.Platinum]: 'Platinum',
  [GameVersion.HeartGold]: 'HeartGold', [GameVersion.SoulSilver]: 'SoulSilver',
  [GameVersion.Black]: 'Black', [GameVersion.White]: 'White',
  [GameVersion.Black2]: 'Black 2', [GameVersion.White2]: 'White 2',
  [GameVersion.X]: 'X', [GameVersion.Y]: 'Y',
  [GameVersion.OmegaRuby]: 'Omega Ruby', [GameVersion.AlphaSapphire]: 'Alpha Sapphire',
  [GameVersion.Sun]: 'Sun', [GameVersion.Moon]: 'Moon',
  [GameVersion.UltraSun]: 'Ultra Sun', [GameVersion.UltraMoon]: 'Ultra Moon',
  [GameVersion.LetsGoPikachu]: "Let's Go Pikachu", [GameVersion.LetsGoEevee]: "Let's Go Eevee",
  [GameVersion.Sword]: 'Sword', [GameVersion.Shield]: 'Shield',
  [GameVersion.BrilliantDiamond]: 'Brilliant Diamond', [GameVersion.ShiningPearl]: 'Shining Pearl',
  [GameVersion.LegendsArceus]: 'Legends: Arceus',
  [GameVersion.Scarlet]: 'Scarlet', [GameVersion.Violet]: 'Violet',
};

export function getGeneration(version: GameVersion): GameGeneration {
  if (version <= 3) return GameGeneration.Gen1;
  if (version <= 6) return GameGeneration.Gen2;
  if (version <= 11) return GameGeneration.Gen3;
  if (version <= 16) return GameGeneration.Gen4;
  if (version <= 20) return GameGeneration.Gen5;
  if (version <= 24) return GameGeneration.Gen6;
  if (version <= 28) return GameGeneration.Gen7;
  if (version <= 35) return GameGeneration.Gen8;
  return GameGeneration.Gen9;
}

export interface BoxData {
  name: string;
  wallpaper: number;
  pokemon: (Pokemon | null)[];
}

export interface SaveFile {
  fileName: string;
  fileSize: number;
  generation: GameGeneration;
  gameVersion: GameVersion;
  trainer: TrainerInfo;
  party: (Pokemon | null)[];
  boxes: BoxData[];
  boxCount: number;
  slotsPerBox: number;
  inventory: InventoryPouch[];
  rawData: Uint8Array;
  isDirty: boolean;
  checksum?: number;
}

export function getBoxPokemon(save: SaveFile, box: number, slot: number): Pokemon | null {
  if (box < 0 || box >= save.boxes.length) return null;
  if (slot < 0 || slot >= save.slotsPerBox) return null;
  return save.boxes[box].pokemon[slot];
}

export function setBoxPokemon(save: SaveFile, box: number, slot: number, pkm: Pokemon | null): SaveFile {
  if (box < 0 || box >= save.boxes.length) return save;
  if (slot < 0 || slot >= save.slotsPerBox) return save;
  const newBoxes = [...save.boxes];
  const newPokemon = [...newBoxes[box].pokemon];
  newPokemon[slot] = pkm;
  newBoxes[box] = { ...newBoxes[box], pokemon: newPokemon };
  return { ...save, boxes: newBoxes, isDirty: true };
}

export function swapBoxPokemon(
  save: SaveFile,
  fromBox: number, fromSlot: number,
  toBox: number, toSlot: number,
): SaveFile {
  const a = getBoxPokemon(save, fromBox, fromSlot);
  const b = getBoxPokemon(save, toBox, toSlot);
  let next = setBoxPokemon(save, fromBox, fromSlot, b);
  next = setBoxPokemon(next, toBox, toSlot, a);
  return next;
}
