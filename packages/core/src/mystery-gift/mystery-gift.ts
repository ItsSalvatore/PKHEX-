import type { GameGeneration } from '../structures/save-file.js';

export enum MysteryGiftType {
  Pokemon = 'pokemon',
  Item = 'item',
  BerryPoke = 'berry',
  BP = 'bp',
  Clothing = 'clothing',
}

export interface MysteryGift {
  id: number;
  title: string;
  description: string;
  type: MysteryGiftType;
  species?: number;
  speciesName?: string;
  form?: number;
  isShiny?: boolean;
  level?: number;
  itemId?: number;
  itemName?: string;
  itemCount?: number;
  generation: GameGeneration;
  gameVersions: number[];
  region: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  serialCode?: string;
  rawData?: Uint8Array;
}

export interface MysteryGiftDatabase {
  gifts: MysteryGift[];
  lastUpdated: string;
  totalCount: number;
}

export function filterGiftsByGeneration(db: MysteryGiftDatabase, gen: GameGeneration): MysteryGift[] {
  return db.gifts.filter(g => g.generation === gen);
}

export function filterGiftsByType(db: MysteryGiftDatabase, type: MysteryGiftType): MysteryGift[] {
  return db.gifts.filter(g => g.type === type);
}

export function filterActiveGifts(db: MysteryGiftDatabase): MysteryGift[] {
  return db.gifts.filter(g => g.isActive);
}

export function searchGifts(db: MysteryGiftDatabase, query: string): MysteryGift[] {
  const q = query.toLowerCase();
  return db.gifts.filter(g =>
    g.title.toLowerCase().includes(q) ||
    g.description.toLowerCase().includes(q) ||
    (g.speciesName && g.speciesName.toLowerCase().includes(q)) ||
    (g.serialCode && g.serialCode.toLowerCase().includes(q))
  );
}

export function parseMysteryGiftFile(data: Uint8Array): MysteryGift | null {
  if (data.length < 4) return null;

  const size = data.length;

  if (size === 0x108) return parseWC6(data);
  if (size === 0x108) return parseWC7(data);
  if (size === 0x2D0) return parseWC8(data);
  if (size === 0x2C8) return parseWA8(data);
  if (size === 0x2C8) return parseWC9(data);

  return null;
}

function parseWC6(data: Uint8Array): MysteryGift {
  const id = data[0x00] | (data[0x01] << 8);
  return {
    id,
    title: `Wonder Card #${id}`,
    description: 'Gen 6 Mystery Gift',
    type: data[0x51] === 0 ? MysteryGiftType.Pokemon : MysteryGiftType.Item,
    generation: 6 as GameGeneration,
    gameVersions: [],
    region: 'Global',
    isActive: false,
    rawData: data,
  };
}

function parseWC7(data: Uint8Array): MysteryGift {
  const id = data[0x00] | (data[0x01] << 8);
  return {
    id,
    title: `Wonder Card #${id}`,
    description: 'Gen 7 Mystery Gift',
    type: MysteryGiftType.Pokemon,
    generation: 7 as GameGeneration,
    gameVersions: [],
    region: 'Global',
    isActive: false,
    rawData: data,
  };
}

function parseWC8(data: Uint8Array): MysteryGift {
  const id = data[0x08] | (data[0x09] << 8);
  return {
    id,
    title: `Wonder Card #${id}`,
    description: 'Gen 8 Mystery Gift',
    type: MysteryGiftType.Pokemon,
    generation: 8 as GameGeneration,
    gameVersions: [],
    region: 'Global',
    isActive: false,
    rawData: data,
  };
}

function parseWA8(data: Uint8Array): MysteryGift {
  return parseWC8(data);
}

function parseWC9(data: Uint8Array): MysteryGift {
  return parseWC8(data);
}
