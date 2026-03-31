import type { BoxData, SaveFile } from '../structures/save-file.js';
import type { Pokemon } from '../structures/pokemon.js';
import type { TrainerInfo } from '../structures/trainer.js';
import { GameGeneration, GameVersion, getGeneration } from '../structures/save-file.js';
import { createDefaultInventoryForGeneration, parsePKMFile, parseSaveFile } from './parser.js';

/** PKHeX.Core `GameVersion` byte values (stable IDs in PKHeX). */
const PKH = {
  S: 1, R: 2, E: 3, FR: 4, LG: 5,
  HG: 7, SS: 8,
  D: 10, P: 11, Pt: 12,
  W: 20, B: 21, W2: 22, B2: 23,
  X: 24, Y: 25, AS: 26, OR: 27,
  SN: 30, MN: 31, US: 32, UM: 33,
  GP: 42, GE: 43,
  SW: 44, SH: 45, PLA: 47, BD: 48, SP: 49, SL: 50, VL: 51,
} as const;

export interface PkhexBridgeParseOptions {
  /**
   * Bridge POST target. Omit to auto-resolve: `VITE_PKHEX_BRIDGE_URL` if set, else in Vite dev `/api/pkhex-parse`.
   * Pass `null` or `''` to force in-browser parsing only (no PKHeX.Core).
   */
  bridgeUrl?: string | null;
  /** Abort load if the bridge is set but unreachable (default: fall back to TS parser). */
  requireBridge?: boolean;
  /**
   * If the bridge responds with PKHeX `SaveUtil` rejection (`ok: false`), still try the TS parser.
   * Default false: trust PKHeX.Core the same way PKHeX.Everywhere does and do not second-guess with TS heuristics.
   */
  allowParserFallbackOnPkhexReject?: boolean;
}

/**
 * URL for `tools/pkhex-save-bridge` (PKHeX.Core `SaveUtil.GetSaveFile`), same entry point as PKHeX.Everywhere.
 * - Explicit `VITE_PKHEX_BRIDGE_URL` wins (any environment).
 * - In Vite dev, defaults to `/api/pkhex-parse` (see `apps/web/vite.config.ts` proxy).
 */
export function resolvePkhexBridgeUrl(): string | undefined {
  if (typeof import.meta === 'undefined') return undefined;
  const env = import.meta.env;
  if (!env) return undefined;
  const explicit = env.VITE_PKHEX_BRIDGE_URL != null ? String(env.VITE_PKHEX_BRIDGE_URL).trim() : '';
  if (explicit) return explicit;
  if (env.DEV === true) return '/api/pkhex-parse';
  return undefined;
}

function effectiveBridgeUrl(options?: PkhexBridgeParseOptions): string | undefined {
  if (options?.bridgeUrl === null) return undefined;
  if (options?.bridgeUrl !== undefined) {
    const t = String(options.bridgeUrl).trim();
    return t || undefined;
  }
  return resolvePkhexBridgeUrl();
}

interface BridgeTrainerJson {
  name: string;
  tid16: number;
  sid16: number;
  displayTid: string;
  displaySid: string;
  gender: number;
  money: number;
  language: number;
  rival?: string | null;
  playedHours: number;
  playedMinutes: number;
  playedSeconds: number;
}

interface BridgeBoxJson {
  name: string;
  wallpaper: number;
  slots: (string | null)[];
}

interface BridgeOkJson {
  ok: true;
  saveType: string;
  pkhexVersion: number;
  generation: number;
  checksumsValid: boolean;
  trainer: BridgeTrainerJson;
  partyBase64: (string | null)[];
  boxes: BridgeBoxJson[];
  boxCount: number;
  slotsPerBox: number;
}

function b64ToU8(b64: string): Uint8Array {
  if (typeof atob === 'function') {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      out[i] = bin.charCodeAt(i);
    }
    return out;
  }
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(b64, 'base64'));
  }
  throw new Error('No base64 decoder available');
}

function decodePartySlot(b64: string | null | undefined): Pokemon | null {
  if (b64 == null || b64 === '') return null;
  try {
    return parsePKMFile(b64ToU8(b64));
  } catch {
    return null;
  }
}

/** Map PKHeX `SaveFile` CLR type + PKHeX `Version` byte to this app's `GameVersion`. */
export function gameVersionFromPkhexBridge(saveType: string, pkhexVersion: number): GameVersion {
  const v = pkhexVersion & 0xff;
  switch (saveType) {
    case 'SAV1':
    case 'SAV1Stadium':
    case 'SAV1StadiumJ':
      return GameVersion.Red;
    case 'SAV2':
    case 'SAV2Stadium':
      if (v === 41) return GameVersion.Crystal; // C (VC / stored)
      if (v === 40) return GameVersion.Silver; // SI
      if (v === 39) return GameVersion.Gold; // GD
      return GameVersion.Gold;
    case 'SAV3RS':
      if (v === PKH.S) return GameVersion.Sapphire;
      return GameVersion.Ruby;
    case 'SAV3E':
      return GameVersion.Emerald;
    case 'SAV3FRLG':
      if (v === PKH.LG) return GameVersion.LeafGreen;
      return GameVersion.FireRed;
    case 'SAV3Colosseum':
    case 'SAV3XD':
    case 'SAV3GCMemoryCard':
    case 'SAV3RSBox':
      return GameVersion.Emerald;
    case 'SAV4DP':
      if (v === PKH.P) return GameVersion.Pearl;
      return GameVersion.Diamond;
    case 'SAV4Pt':
      return GameVersion.Platinum;
    case 'SAV4HGSS':
      if (v === PKH.SS) return GameVersion.SoulSilver;
      return GameVersion.HeartGold;
    case 'SAV4BR':
    case 'SAV4Sinnoh':
      return GameVersion.Diamond;
    case 'SAV4Ranch':
      return GameVersion.Diamond;
    case 'SAV5BW':
      if (v === PKH.W) return GameVersion.White;
      return GameVersion.Black;
    case 'SAV5B2W2':
      if (v === PKH.W2) return GameVersion.White2;
      return GameVersion.Black2;
    case 'SAV5':
      return GameVersion.Black;
    case 'SAV6XY':
      if (v === PKH.Y) return GameVersion.Y;
      return GameVersion.X;
    case 'SAV6AO':
    case 'SAV6AODemo':
      if (v === PKH.AS) return GameVersion.AlphaSapphire;
      return GameVersion.OmegaRuby;
    case 'SAV6':
      return GameVersion.X;
    case 'SAV7SM':
      if (v === PKH.MN) return GameVersion.Moon;
      return GameVersion.Sun;
    case 'SAV7USUM':
      if (v === PKH.UM) return GameVersion.UltraMoon;
      return GameVersion.UltraSun;
    case 'SAV7':
      return GameVersion.Sun;
    case 'SAV7b':
      if (v === PKH.GE) return GameVersion.LetsGoEevee;
      return GameVersion.LetsGoPikachu;
    case 'SAV8SWSH':
      if (v === PKH.SH) return GameVersion.Shield;
      return GameVersion.Sword;
    case 'SAV8BS':
      if (v === PKH.SP) return GameVersion.ShiningPearl;
      return GameVersion.BrilliantDiamond;
    case 'SAV8LA':
      return GameVersion.LegendsArceus;
    case 'SAV9SV':
      if (v === PKH.VL) return GameVersion.Violet;
      return GameVersion.Scarlet;
    case 'SAV9ZA':
      return GameVersion.Scarlet;
    default:
      return GameVersion.Red;
  }
}

function regionForGameVersion(version: GameVersion): string {
  switch (getGeneration(version)) {
    case GameGeneration.Gen1: return 'Kanto';
    case GameGeneration.Gen2: return 'Johto';
    case GameGeneration.Gen3: return 'Hoenn';
    case GameGeneration.Gen4: return 'Sinnoh';
    case GameGeneration.Gen5: return 'Unova';
    case GameGeneration.Gen6: return 'Kalos';
    case GameGeneration.Gen7:
      if (version === GameVersion.LetsGoPikachu || version === GameVersion.LetsGoEevee) return 'Kanto';
      return 'Alola';
    case GameGeneration.Gen8:
      if (version === GameVersion.LegendsArceus) return 'Hisui';
      if (version === GameVersion.BrilliantDiamond || version === GameVersion.ShiningPearl) return 'Sinnoh';
      return 'Galar';
    case GameGeneration.Gen9: return 'Paldea';
    default: return 'Unknown';
  }
}

function buildTrainer(t: BridgeTrainerJson, gameVersion: GameVersion): TrainerInfo {
  const gen = getGeneration(gameVersion);
  return {
    name: t.name || 'Trainer',
    tid: t.tid16,
    sid: t.sid16,
    displayTID: t.displayTid,
    displaySID: t.displaySid,
    gender: t.gender,
    money: t.money,
    region: regionForGameVersion(gameVersion),
    language: t.language >= 0 ? t.language : 2,
    gameVersion,
    badges: Array(8).fill(false),
    playTime: {
      hours: t.playedHours,
      minutes: t.playedMinutes,
      seconds: t.playedSeconds,
    },
    rival: t.rival ?? undefined,
  };
}

export function saveFileFromPkhexBridgePayload(
  rawData: Uint8Array,
  fileName: string,
  payload: BridgeOkJson,
): SaveFile {
  const gameVersion = gameVersionFromPkhexBridge(payload.saveType, payload.pkhexVersion);
  const generation = payload.generation as GameGeneration;
  const trainer = buildTrainer(payload.trainer, gameVersion);

  const party: (Pokemon | null)[] = [];
  for (let i = 0; i < 6; i++) {
    party.push(decodePartySlot(payload.partyBase64[i] ?? null));
  }

  const boxes: BoxData[] = payload.boxes.map((b) => ({
    name: b.name,
    wallpaper: b.wallpaper,
    pokemon: b.slots.map((s) => decodePartySlot(s)),
  }));

  return {
    fileName,
    fileSize: rawData.length,
    generation: generation >= 1 && generation <= 9 ? generation : getGeneration(gameVersion),
    gameVersion,
    trainer,
    party,
    boxes,
    boxCount: payload.boxCount,
    slotsPerBox: payload.slotsPerBox,
    inventory: createDefaultInventoryForGeneration(
      generation >= 1 && generation <= 9 ? generation : getGeneration(gameVersion),
    ),
    rawData,
    isDirty: false,
  };
}

/**
 * Load a save using PKHeX.Core (PKHeX.Everywhere stack) when `bridgeUrl` points at the
 * `tools/pkhex-save-bridge` service; otherwise uses the in-browser TypeScript parser.
 */
export async function loadSaveFileWithOptionalPkhexBridge(
  data: Uint8Array,
  fileName: string,
  options?: PkhexBridgeParseOptions,
): Promise<SaveFile> {
  const url = effectiveBridgeUrl(options);
  if (!url) {
    return parseSaveFile(data, fileName);
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'X-File-Name': fileName },
      body: new Blob([new Uint8Array(data)]),
    });

    if (!res.ok) {
      let pkhexMessage: string | undefined;
      try {
        const errBody = await res.json() as { ok?: boolean; error?: string };
        if (typeof errBody?.error === 'string' && errBody.error.length > 0) {
          pkhexMessage = errBody.error;
        }
      } catch {
        /* e.g. HTML 502 from proxy when bridge is down */
      }

      if (pkhexMessage != null) {
        if (options?.allowParserFallbackOnPkhexReject) {
          return parseSaveFile(data, fileName);
        }
        throw new Error(pkhexMessage);
      }

      if (options?.requireBridge) {
        throw new Error(`PKHeX bridge returned ${res.status}`);
      }
      return parseSaveFile(data, fileName);
    }

    const json = await res.json() as { ok?: boolean } & Record<string, unknown>;
    if (json?.ok === true && Array.isArray(json.partyBase64)) {
      return saveFileFromPkhexBridgePayload(data, fileName, json as unknown as BridgeOkJson);
    }

    if (options?.requireBridge) {
      throw new Error('PKHeX bridge response was not a successful parse payload');
    }
  } catch (e) {
    if (options?.requireBridge) {
      throw e instanceof Error ? e : new Error(String(e));
    }
    /* Bridge unreachable or non-JSON failure: optional TS fallback */
  }

  return parseSaveFile(data, fileName);
}
