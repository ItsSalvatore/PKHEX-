export type { Pokemon, IVs, EVs, Stats, PokemonMove } from '@pkhex/core';
export type { SaveFile, BoxData } from '@pkhex/core';
export type { TrainerInfo } from '@pkhex/core';
export type { InventoryPouch, InventoryItem } from '@pkhex/core';
export type { MysteryGift, MysteryGiftDatabase } from '@pkhex/core';
export type { LegalityResult, LegalityIssue } from '@pkhex/core';

export const APP_NAME = 'PKHeX';
export const APP_VERSION = '1.0.0';
export const SUPPORTED_GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export type Generation = (typeof SUPPORTED_GENERATIONS)[number];

export interface AppConfig {
  theme: 'dark' | 'light';
  autoSave: boolean;
  spritesQuality: 'low' | 'high';
  showLegalityByDefault: boolean;
  defaultGeneration: Generation;
}

export const DEFAULT_CONFIG: AppConfig = {
  theme: 'dark',
  autoSave: true,
  spritesQuality: 'high',
  showLegalityByDefault: true,
  defaultGeneration: 9,
};
