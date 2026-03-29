import { GameGeneration, GameVersion } from '../structures/save-file.js';

export interface SaveDetectionResult {
  generation: GameGeneration;
  version: GameVersion;
  valid: boolean;
  format: string;
  headerOffset: number;
  data: Uint8Array;
}

const DESMUME_FOOTER = 122;
const GBA_HEADER_SIZES = [0, 0x100, 0x200];

export function detectSaveFile(rawData: Uint8Array): SaveDetectionResult {
  const stripped = stripEmulatorHeaders(rawData);
  const data = stripped.data;
  const size = data.length;

  const gen1 = tryDetectGen1(data, size);
  if (gen1) return { ...gen1, data };
  const gen2 = tryDetectGen2(data, size);
  if (gen2) return { ...gen2, data };
  const gen3 = tryDetectGen3(data, size);
  if (gen3) return { ...gen3, data };
  const gen4 = tryDetectGen4(data, size);
  if (gen4) return { ...gen4, data };
  const gen5 = tryDetectGen5(data, size);
  if (gen5) return { ...gen5, data };
  const gen6 = tryDetectGen6(data, size);
  if (gen6) return { ...gen6, data };
  const gen7 = tryDetectGen7(data, size);
  if (gen7) return { ...gen7, data };
  const gen8 = tryDetectGen8(data, size);
  if (gen8) return { ...gen8, data };
  const gen9 = tryDetectGen9(data, size);
  if (gen9) return { ...gen9, data };

  return {
    generation: GameGeneration.Gen1,
    version: GameVersion.Red,
    valid: false,
    format: 'UNKNOWN',
    headerOffset: 0,
    data,
  };
}

function stripEmulatorHeaders(raw: Uint8Array): { data: Uint8Array; stripped: string } {
  const size = raw.length;

  if (size === 0x20000 + DESMUME_FOOTER || size === 0x40000 + DESMUME_FOOTER ||
      size === 0x80000 + DESMUME_FOOTER || size === 0x100000 + DESMUME_FOOTER ||
      size === 0x80100 + DESMUME_FOOTER) {
    return { data: raw.subarray(0, size - DESMUME_FOOTER), stripped: 'DeSmuME' };
  }

  if (size === 0x20000 + 0x100 || size === 0x20000 + 0x200) {
    const header = size - 0x20000;
    return { data: raw.subarray(header), stripped: `GBA_header_${header}` };
  }

  for (const hs of GBA_HEADER_SIZES) {
    const inner = size - hs;
    if (inner === 0x8000 || inner === 0x10000 || inner === 0x20000) {
      if (hs > 0) return { data: raw.subarray(hs), stripped: `header_${hs}` };
    }
  }

  return { data: raw, stripped: 'none' };
}

function tryDetectGen1(data: Uint8Array, size: number): Omit<SaveDetectionResult, 'data'> | null {
  if (size !== 0x8000 && size !== 0x802C) return null;
  const pokemon_count = data[0x2F2C];
  if (pokemon_count <= 6) {
    return { generation: GameGeneration.Gen1, version: GameVersion.Red, valid: true, format: 'SAV1', headerOffset: 0 };
  }
  return null;
}

function tryDetectGen2(data: Uint8Array, size: number): Omit<SaveDetectionResult, 'data'> | null {
  if (size !== 0x8000 && size !== 0x8010 && size !== 0x10000) return null;
  const effectiveData = size === 0x10000 ? data : data;
  const pokemon_count = effectiveData[0x2865];
  if (pokemon_count <= 6) {
    return { generation: GameGeneration.Gen2, version: GameVersion.Gold, valid: true, format: 'SAV2', headerOffset: 0 };
  }
  return null;
}

function tryDetectGen3(data: Uint8Array, size: number): Omit<SaveDetectionResult, 'data'> | null {
  if (size !== 0x20000) return null;
  const sectionId0 = readU16LE(data, 0x0FF4);
  const magic0 = readU32LE(data, 0x0FF8);
  if (magic0 === 0x08012025) {
    const version = detectGen3Version(data);
    return { generation: GameGeneration.Gen3, version, valid: true, format: 'SAV3', headerOffset: 0 };
  }
  const sectionIdB = readU16LE(data, 0xEFF4);
  const magicB = readU32LE(data, 0xEFF8);
  if (magicB === 0x08012025) {
    return { generation: GameGeneration.Gen3, version: GameVersion.Ruby, valid: true, format: 'SAV3', headerOffset: 0 };
  }
  return { generation: GameGeneration.Gen3, version: GameVersion.Ruby, valid: true, format: 'SAV3', headerOffset: 0 };
}

function detectGen3Version(data: Uint8Array): GameVersion {
  const gameCode = readU32LE(data, 0xAC);
  return GameVersion.Emerald;
}

function tryDetectGen4(data: Uint8Array, size: number): Omit<SaveDetectionResult, 'data'> | null {
  if (size === 0x80000) {
    const footer = readU32LE(data, 0x0000CFC0 + 0x1F100);
    return { generation: GameGeneration.Gen4, version: GameVersion.Diamond, valid: true, format: 'SAV4_DP', headerOffset: 0 };
  }
  if (size === 0x80100) {
    return { generation: GameGeneration.Gen4, version: GameVersion.HeartGold, valid: true, format: 'SAV4_HGSS', headerOffset: 0 };
  }
  if (size === 0xB0000) {
    return { generation: GameGeneration.Gen4, version: GameVersion.Platinum, valid: true, format: 'SAV4_PT', headerOffset: 0 };
  }
  return null;
}

function tryDetectGen5(data: Uint8Array, size: number): Omit<SaveDetectionResult, 'data'> | null {
  if (size === 0x80000) {
    const c = readU16LE(data, 0x1941A);
    if (c !== 0) {
      return { generation: GameGeneration.Gen5, version: GameVersion.Black, valid: true, format: 'SAV5_BW', headerOffset: 0 };
    }
  }
  if (size === 0x100000) {
    return { generation: GameGeneration.Gen5, version: GameVersion.Black2, valid: true, format: 'SAV5_B2W2', headerOffset: 0 };
  }
  return null;
}

function tryDetectGen6(data: Uint8Array, size: number): Omit<SaveDetectionResult, 'data'> | null {
  if (size === 0x65600) {
    return { generation: GameGeneration.Gen6, version: GameVersion.X, valid: true, format: 'SAV6_XY', headerOffset: 0 };
  }
  if (size === 0x76000) {
    return { generation: GameGeneration.Gen6, version: GameVersion.OmegaRuby, valid: true, format: 'SAV6_ORAS', headerOffset: 0 };
  }
  return null;
}

function tryDetectGen7(data: Uint8Array, size: number): Omit<SaveDetectionResult, 'data'> | null {
  if (size === 0x6BE00) {
    return { generation: GameGeneration.Gen7, version: GameVersion.Sun, valid: true, format: 'SAV7_SM', headerOffset: 0 };
  }
  if (size === 0x6CC00) {
    return { generation: GameGeneration.Gen7, version: GameVersion.UltraSun, valid: true, format: 'SAV7_USUM', headerOffset: 0 };
  }
  if (size >= 0x30000 && size <= 0x50000) {
    return { generation: GameGeneration.Gen7, version: GameVersion.LetsGoPikachu, valid: true, format: 'SAV7_LGPE', headerOffset: 0 };
  }
  return null;
}

function tryDetectGen8(data: Uint8Array, size: number): Omit<SaveDetectionResult, 'data'> | null {
  if (size >= 0x100000 && size <= 0x200000) {
    return { generation: GameGeneration.Gen8, version: GameVersion.Sword, valid: true, format: 'SAV8_SWSH', headerOffset: 0 };
  }
  if (size === 0xE9C28 || size === 0xE9C30) {
    return { generation: GameGeneration.Gen8, version: GameVersion.BrilliantDiamond, valid: true, format: 'SAV8_BDSP', headerOffset: 0 };
  }
  if (size === 0x136DDE || size === 0x13AD06) {
    return { generation: GameGeneration.Gen8, version: GameVersion.LegendsArceus, valid: true, format: 'SAV8_PLA', headerOffset: 0 };
  }
  return null;
}

function tryDetectGen9(data: Uint8Array, size: number): Omit<SaveDetectionResult, 'data'> | null {
  if (size >= 0x200000) {
    return { generation: GameGeneration.Gen9, version: GameVersion.Scarlet, valid: true, format: 'SAV9_SV', headerOffset: 0 };
  }
  return null;
}

export function readU8(data: Uint8Array, offset: number): number {
  return data[offset];
}

export function readU16LE(data: Uint8Array, offset: number): number {
  return data[offset] | (data[offset + 1] << 8);
}

export function readU32LE(data: Uint8Array, offset: number): number {
  return (data[offset] | (data[offset + 1] << 8) | (data[offset + 2] << 16) | (data[offset + 3] << 24)) >>> 0;
}

export function writeU8(data: Uint8Array, offset: number, value: number): void {
  data[offset] = value & 0xFF;
}

export function writeU16LE(data: Uint8Array, offset: number, value: number): void {
  data[offset] = value & 0xFF;
  data[offset + 1] = (value >> 8) & 0xFF;
}

export function writeU32LE(data: Uint8Array, offset: number, value: number): void {
  data[offset] = value & 0xFF;
  data[offset + 1] = (value >> 8) & 0xFF;
  data[offset + 2] = (value >> 16) & 0xFF;
  data[offset + 3] = (value >> 24) & 0xFF;
}

export function readString(data: Uint8Array, offset: number, maxLen: number, unicode = true): string {
  const chars: string[] = [];
  const step = unicode ? 2 : 1;
  for (let i = 0; i < maxLen; i++) {
    const pos = offset + i * step;
    if (pos + step > data.length) break;
    const code = unicode ? readU16LE(data, pos) : data[pos];
    if (code === 0 || code === 0xFFFF) break;
    chars.push(String.fromCharCode(code));
  }
  return chars.join('');
}

export function writeString(data: Uint8Array, offset: number, value: string, maxLen: number, unicode = true): void {
  const step = unicode ? 2 : 1;
  for (let i = 0; i < maxLen; i++) {
    const pos = offset + i * step;
    if (i < value.length) {
      const code = value.charCodeAt(i);
      if (unicode) writeU16LE(data, pos, code);
      else data[pos] = code & 0xFF;
    } else {
      if (unicode) writeU16LE(data, pos, 0xFFFF);
      else data[pos] = 0xFF;
      if (i === value.length) {
        if (unicode) writeU16LE(data, pos, 0x0000);
        else data[pos] = 0x00;
      }
    }
  }
}

export function getSaveFileExtensions(): string[] {
  return ['.sav', '.dsv', '.bin', '.dat', '.gci', '.sa1', '.sa2', '.main', '.bak'];
}
