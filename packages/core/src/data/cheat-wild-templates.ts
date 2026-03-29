import { GameVersion, GAME_NAMES } from '../structures/save-file.js';

/**
 * Action Replay wild encounter templates. Species ID is national Dex in hex
 * (Platinum / Gen4 NDS: 3 hex digits in the D5000000 line; Gen5 B/W: 3 hex digits per PokemonCoders).
 * Based on patterns published on PokemonCoders and common NDS cheat lists — verify on your emulator.
 */
export interface WildEncounterTemplate {
  game: GameVersion;
  /** Human label */
  gameName: string;
  dexMin: number;
  dexMax: number;
  activationNote: string;
  warning?: string;
  sourceUrl: string;
  /** Build 32-bit little-endian hex block for species (national Dex) */
  buildCompact: (nationalDex: number) => string;
}

function pad3(n: number): string {
  return n.toString(16).toUpperCase().padStart(3, '0');
}

/** Gen4: D5000000 00000XXX word (XXX = 3 hex digits of national Dex). */
function gen4Block(dex: number): string {
  return `00000${pad3(dex)}`;
}

/**
 * PokemonCoders Platinum wild modifier:
 * https://www.pokemoncoders.com/pokemon-platinum-cheats/
 * Hold SELECT before encounter.
 */
const gen4Suffix =
  'C00000000000000BD7000000000233ECDC00000000000006D200000000000000';

function gen4Platinum(dex: number): string {
  return `94000130FFFB0000D5000000${gen4Block(dex)}B2101D4000000000${gen4Suffix}`;
}

function gen4DiamondPearl(dex: number): string {
  return `94000130FFFB0000D5000000${gen4Block(dex)}B21C4D2800000000${gen4Suffix}`;
}

function gen4HeartGoldSoulSilver(dex: number): string {
  return `94000130FFFB0000D5000000${gen4Block(dex)}B211188000000000${gen4Suffix}`;
}

/**
 * Pokémon Black / White (PokemonCoders): replace species with 3 hex digits in the low word.
 * https://www.pokemoncoders.com/pokemon-black-cheats/
 */
function gen5BlackWhiteWild(dex: number): string {
  const s = pad3(dex);
  const w = (`00000${s}`).slice(-8);
  return `94000130FFFB0000C00000000000002F12250010${w}DC00000000000004D200000000000000`;
}

export const WILD_ENCOUNTER_TEMPLATES: WildEncounterTemplate[] = [
  {
    game: GameVersion.Platinum,
    gameName: GAME_NAMES[GameVersion.Platinum],
    dexMin: 1,
    dexMax: 493,
    activationNote: 'Hold SELECT while entering a wild encounter. Replace code after changing species.',
    warning: 'Do not use Dex 000. Some legendaries may not appear — run from battle if wrong species.',
    sourceUrl: 'https://www.pokemoncoders.com/pokemon-platinum-cheats/',
    buildCompact: gen4Platinum,
  },
  {
    game: GameVersion.Diamond,
    gameName: GAME_NAMES[GameVersion.Diamond],
    dexMin: 1,
    dexMax: 493,
    activationNote: 'Hold SELECT before the encounter (same pattern as Platinum; verify on emulator).',
    sourceUrl: 'https://www.pokemoncoders.com/pokemon-diamond-cheats/',
    buildCompact: gen4DiamondPearl,
  },
  {
    game: GameVersion.Pearl,
    gameName: GAME_NAMES[GameVersion.Pearl],
    dexMin: 1,
    dexMax: 493,
    activationNote: 'Hold SELECT before the encounter (same pattern as Diamond).',
    sourceUrl: 'https://www.pokemoncoders.com/pokemon-pearl-cheats/',
    buildCompact: gen4DiamondPearl,
  },
  {
    game: GameVersion.HeartGold,
    gameName: GAME_NAMES[GameVersion.HeartGold],
    dexMin: 1,
    dexMax: 493,
    activationNote: 'Hold SELECT before the encounter.',
    sourceUrl: 'https://www.pokemoncoders.com/pokemon-heartgold-cheats/',
    buildCompact: gen4HeartGoldSoulSilver,
  },
  {
    game: GameVersion.SoulSilver,
    gameName: GAME_NAMES[GameVersion.SoulSilver],
    dexMin: 1,
    dexMax: 493,
    activationNote: 'Hold SELECT before the encounter.',
    sourceUrl: 'https://www.pokemoncoders.com/pokemon-soulsilver-cheats/',
    buildCompact: gen4HeartGoldSoulSilver,
  },
  {
    game: GameVersion.Black,
    gameName: GAME_NAMES[GameVersion.Black],
    dexMin: 1,
    dexMax: 649,
    activationNote: 'Press SELECT to receive the encounter modifier on some emulators; verify for your ROM (US/EU).',
    warning: 'Gen 5 address bytes vary by region and revision — test before relying on saves.',
    sourceUrl: 'https://www.pokemoncoders.com/pokemon-black-cheats/',
    buildCompact: gen5BlackWhiteWild,
  },
  {
    game: GameVersion.White,
    gameName: GAME_NAMES[GameVersion.White],
    dexMin: 1,
    dexMax: 649,
    activationNote: 'Hold SELECT before the encounter. Same layout as Black (US/EU).',
    warning: 'ROM region matters — test on a copy first.',
    sourceUrl: 'https://www.pokemoncoders.com/pokemon-white-cheats/',
    buildCompact: gen5BlackWhiteWild,
  },
];

export function getWildTemplateForGame(game: GameVersion): WildEncounterTemplate | undefined {
  return WILD_ENCOUNTER_TEMPLATES.find(t => t.game === game);
}

/** Format compact hex (no spaces) into AR lines: XXXXXXXX YYYYYYYY */
export function formatActionReplayLines(compact: string): string[] {
  const c = compact.replace(/\s/g, '').toUpperCase();
  const lines: string[] = [];
  for (let i = 0; i < c.length; i += 16) {
    const chunk = c.slice(i, i + 16);
    if (chunk.length < 16) break;
    lines.push(`${chunk.slice(0, 8)} ${chunk.slice(8, 16)}`);
  }
  return lines;
}

export function buildWildEncounterLines(template: WildEncounterTemplate, nationalDex: number): string[] {
  if (nationalDex < template.dexMin || nationalDex > template.dexMax) return [];
  const compact = template.buildCompact(nationalDex);
  return formatActionReplayLines(compact);
}
