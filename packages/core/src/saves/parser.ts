import type { SaveFile, BoxData } from '../structures/save-file.js';
import type { Pokemon } from '../structures/pokemon.js';
import type { TrainerInfo } from '../structures/trainer.js';
import { GameGeneration, GameVersion } from '../structures/save-file.js';
import { InventoryType, createInventoryPouch } from '../structures/inventory.js';
import { createEmptyPokemon } from '../structures/pokemon.js';
import { formatTID } from '../structures/trainer.js';
import { detectSaveFile, readU16LE, readU32LE, readString, readU8 } from './detector.js';
import {
  readPK3, readPK45, readPK67, readPK89,
  isPKMEmpty,
} from './pkm-codec.js';
import { readGen3EncodedString } from './gen3-string.js';

export function parseSaveFile(data: Uint8Array, fileName: string): SaveFile {
  const detection = detectSaveFile(data);
  let saveData = detection.data;
  if (detection.format === 'SAV4_PT' && saveData.length === 0xB0000) {
    saveData = saveData.subarray(0, 0x80000);
  }

  if (!detection.valid) {
    return createFallbackSave(saveData, fileName, detection.generation, detection.version);
  }

  switch (detection.format) {
    case 'SAV1': return parseGen1(saveData, fileName);
    case 'SAV2': return parseGen2(saveData, fileName);
    case 'SAV3': return parseGen3(saveData, fileName, detection.version);
    case 'SAV4_DP': return parseGen4(saveData, fileName, detection.version, 'DP');
    case 'SAV4_PT': return parseGen4(saveData, fileName, GameVersion.Platinum, 'PT');
    case 'SAV4_HGSS': return parseGen4(saveData, fileName, detection.version, 'HGSS');
    case 'SAV5_BW': return parseGen5(saveData, fileName, detection.version, 'BW');
    case 'SAV5_B2W2': return parseGen5(saveData, fileName, detection.version, 'B2W2');
    case 'SAV6_XY': return parseGen6(saveData, fileName, detection.version, 'XY');
    case 'SAV6_ORAS': return parseGen6(saveData, fileName, detection.version, 'ORAS');
    case 'SAV7_SM': return parseGen7(saveData, fileName, detection.version, 'SM');
    case 'SAV7_USUM': return parseGen7(saveData, fileName, detection.version, 'USUM');
    case 'SAV7_LGPE': return parseGen7LGPE(saveData, fileName);
    case 'SAV8_SWSH': return parseGen8(saveData, fileName, detection.version);
    case 'SAV8_BDSP': return parseGen8BDSP(saveData, fileName);
    case 'SAV8_PLA': return parseGen8PLA(saveData, fileName);
    case 'SAV9_SV': return parseGen9(saveData, fileName, detection.version);
    default:
      return createFallbackSave(saveData, fileName, detection.generation, detection.version);
  }
}

// ===== Gen 1 =====

function parseGen1(data: Uint8Array, fileName: string): SaveFile {
  const trainerName = readGen1String(data, 0x2598, 7);
  const tid = readU16LE(data, 0x2605);
  const { displayTID, displaySID } = formatTID(tid, 0, 1);
  const partyCount = data[0x2F2C];
  const party = parseGen1Party(data, 0x2F2C, Math.min(partyCount, 6));
  const boxes = parseGen1Boxes(data);
  const trainer: TrainerInfo = {
    name: trainerName || 'RED', tid, sid: 0, displayTID, displaySID: '0',
    gender: 0, money: decodeBCD(data, 0x25F3, 3), region: 'Kanto',
    language: 2, gameVersion: GameVersion.Red,
    badges: Array.from({ length: 8 }, (_, i) => !!(data[0x2602] & (1 << i))),
    playTime: { hours: data[0x2CED], minutes: data[0x2CEF], seconds: data[0x2CF0] },
  };
  return {
    fileName, fileSize: data.length, generation: GameGeneration.Gen1,
    gameVersion: GameVersion.Red, trainer, party, boxes,
    boxCount: 12, slotsPerBox: 20,
    inventory: createDefaultInventory(GameGeneration.Gen1),
    rawData: data, isDirty: false,
  };
}

function parseGen1Party(data: Uint8Array, offset: number, count: number): (Pokemon | null)[] {
  const result: (Pokemon | null)[] = [];
  const speciesListOffset = offset + 1;
  const dataOffset = offset + 8;
  const pkmSize = 44;
  for (let i = 0; i < 6; i++) {
    if (i < count) {
      const species = data[speciesListOffset + i];
      if (species > 0 && species !== 0xFF) {
        const pkm = createEmptyPokemon();
        const pkmOff = dataOffset + i * pkmSize;
        pkm.species = gen1SpeciesIndex(data[pkmOff]);
        pkm.level = data[pkmOff + 33];
        pkm.moves = [
          { id: data[pkmOff + 8], pp: data[pkmOff + 29] & 0x3F, ppUps: (data[pkmOff + 29] >> 6) & 3 },
          { id: data[pkmOff + 9], pp: data[pkmOff + 30] & 0x3F, ppUps: (data[pkmOff + 30] >> 6) & 3 },
          { id: data[pkmOff + 10], pp: data[pkmOff + 31] & 0x3F, ppUps: (data[pkmOff + 31] >> 6) & 3 },
          { id: data[pkmOff + 11], pp: data[pkmOff + 32] & 0x3F, ppUps: (data[pkmOff + 32] >> 6) & 3 },
        ];
        pkm.stats = {
          hp: readU16LE(data, pkmOff + 34),
          atk: readU16LE(data, pkmOff + 36),
          def: readU16LE(data, pkmOff + 38),
          spe: readU16LE(data, pkmOff + 40),
          spa: readU16LE(data, pkmOff + 42),
          spd: readU16LE(data, pkmOff + 42),
        };
        const dvs = readU16LE(data, pkmOff + 27);
        pkm.ivs = {
          hp: ((dvs >> 4) & 8) | ((dvs >> 1) & 4) | ((dvs >> 6) & 2) | ((dvs >> 3) & 1),
          atk: (dvs >> 12) & 0xF, def: (dvs >> 8) & 0xF,
          spe: (dvs >> 4) & 0xF, spa: dvs & 0xF, spd: dvs & 0xF,
        };
        pkm.rawData = new Uint8Array(data.subarray(pkmOff, pkmOff + pkmSize));
        result.push(pkm);
      } else {
        result.push(null);
      }
    } else {
      result.push(null);
    }
  }
  return result;
}

function parseGen1Boxes(data: Uint8Array): BoxData[] {
  const boxes: BoxData[] = [];
  for (let b = 0; b < 12; b++) {
    boxes.push({ name: `Box ${b + 1}`, wallpaper: 0, pokemon: Array(20).fill(null) });
  }
  return boxes;
}

// ===== Gen 2 =====

function parseGen2(data: Uint8Array, fileName: string): SaveFile {
  const trainerName = readGen1String(data, 0x200B, 7);
  const tid = readU16LE(data, 0x2009);
  const { displayTID, displaySID } = formatTID(tid, 0, 2);
  const trainer: TrainerInfo = {
    name: trainerName || 'GOLD', tid, sid: 0, displayTID, displaySID: '0',
    gender: data[0x3E3D] & 1, money: decodeBCD(data, 0x23DB, 3), region: 'Johto',
    language: 2, gameVersion: GameVersion.Gold,
    badges: Array.from({ length: 8 }, (_, i) => !!(data[0x23E5] & (1 << i))),
    playTime: { hours: readU16LE(data, 0x2053), minutes: data[0x2055], seconds: data[0x2056] },
  };
  const boxes: BoxData[] = [];
  for (let b = 0; b < 14; b++) {
    boxes.push({ name: `Box ${b + 1}`, wallpaper: 0, pokemon: Array(20).fill(null) });
  }
  return {
    fileName, fileSize: data.length, generation: GameGeneration.Gen2,
    gameVersion: GameVersion.Gold, trainer, party: Array(6).fill(null), boxes,
    boxCount: 14, slotsPerBox: 20,
    inventory: createDefaultInventory(GameGeneration.Gen2), rawData: data, isDirty: false,
  };
}

// ===== Gen 3 =====

function parseGen3(data: Uint8Array, fileName: string, version: GameVersion): SaveFile {
  const sections = loadGen3Sections(data);
  const sectionData = assembleGen3Sections(sections);
  const trainerLang = inferGen3CartridgeLanguage(data);
  const trainerName = readGen3EncodedString(sectionData, 0, 7, trainerLang);
  const tid = readU16LE(sectionData, 0x000A);
  const sid = readU16LE(sectionData, 0x000C);
  const { displayTID, displaySID } = formatTID(tid, sid, 3);
  const trainer: TrainerInfo = {
    name: trainerName || 'RUBY', tid, sid, displayTID, displaySID,
    gender: sectionData[8], money: readU32LE(sectionData, 0x0490), region: 'Hoenn',
    language: 2, gameVersion: version,
    badges: Array.from({ length: 8 }, (_, i) => !!(readU16LE(sectionData, 0x0EFC) & (1 << i))),
    playTime: { hours: readU16LE(sectionData, 0x000E), minutes: sectionData[0x0010], seconds: sectionData[0x0011] },
  };
  const party = parseGen3Party(sectionData);
  const boxes = parseGen3Boxes(sectionData);
  return {
    fileName, fileSize: data.length, generation: GameGeneration.Gen3,
    gameVersion: version, trainer, party, boxes,
    boxCount: 14, slotsPerBox: 30,
    inventory: createDefaultInventory(GameGeneration.Gen3), rawData: data, isDirty: false,
  };
}

function loadGen3Sections(data: Uint8Array): Map<number, Uint8Array> {
  const sections = new Map<number, Uint8Array>();
  const SECTION_SIZE = 0x1000;
  let newerSaveOff = 0;
  const idxA = readU32LE(data, 0x0FFC);
  const idxB = readU32LE(data, 0xEFFC);
  if (idxB > idxA) newerSaveOff = 0xE000;
  for (let i = 0; i < 14; i++) {
    const off = newerSaveOff + i * SECTION_SIZE;
    const sectionId = readU16LE(data, off + 0xFF4);
    sections.set(sectionId, new Uint8Array(data.subarray(off, off + SECTION_SIZE)));
  }
  return sections;
}

function assembleGen3Sections(sections: Map<number, Uint8Array>): Uint8Array {
  const assembled = new Uint8Array(14 * 0x1000);
  for (let i = 0; i < 14; i++) {
    const sec = sections.get(i);
    if (sec) assembled.set(sec, i * 0x1000);
  }
  return assembled;
}

function parseGen3Party(sectionData: Uint8Array): (Pokemon | null)[] {
  const partyOffset = 0x0238;
  const partyCount = readU32LE(sectionData, partyOffset);
  const result: (Pokemon | null)[] = [];
  const PK3_PARTY_SIZE = 100;
  for (let i = 0; i < 6; i++) {
    if (i < partyCount) {
      const off = partyOffset + 4 + i * PK3_PARTY_SIZE;
      const raw = sectionData.subarray(off, off + PK3_PARTY_SIZE);
      if (!isPKMEmpty(raw, 80)) {
        result.push(readPK3(raw));
      } else {
        result.push(null);
      }
    } else {
      result.push(null);
    }
  }
  return result;
}

function parseGen3Boxes(sectionData: Uint8Array): BoxData[] {
  const boxes: BoxData[] = [];
  const PK3_STORED_SIZE = 80;
  const boxDataOffset = 0x5000;
  for (let b = 0; b < 14; b++) {
    const pokemon: (Pokemon | null)[] = [];
    for (let s = 0; s < 30; s++) {
      const off = boxDataOffset + (b * 30 + s) * PK3_STORED_SIZE;
      if (off + PK3_STORED_SIZE <= sectionData.length) {
        const raw = sectionData.subarray(off, off + PK3_STORED_SIZE);
        if (!isPKMEmpty(raw, PK3_STORED_SIZE)) {
          pokemon.push(readPK3(raw));
        } else {
          pokemon.push(null);
        }
      } else {
        pokemon.push(null);
      }
    }
    boxes.push({ name: `Box ${b + 1}`, wallpaper: 0, pokemon });
  }
  return boxes;
}

// ===== Gen 4 =====

interface Gen4Offsets {
  trainerName: number; tid: number; sid: number; gender: number;
  money: number; badges: number; playTime: number;
  partyCount: number; partyData: number;
  boxData: number; boxNames: number;
}

const GEN4_OFFSETS: Record<string, Gen4Offsets> = {
  DP: {
    trainerName: 0x68, tid: 0x74, sid: 0x76, gender: 0x80,
    money: 0x78, badges: 0x82, playTime: 0x86,
    partyCount: 0xA0, partyData: 0xA4,
    boxData: 0xC104, boxNames: 0x21708,
  },
  PT: {
    trainerName: 0x68, tid: 0x74, sid: 0x76, gender: 0x80,
    money: 0x78, badges: 0x82, playTime: 0x86,
    partyCount: 0xA0, partyData: 0xA4,
    boxData: 0xCF30, boxNames: 0x2253C,
  },
  HGSS: {
    trainerName: 0x64, tid: 0x74, sid: 0x76, gender: 0x80,
    money: 0x78, badges: 0x82, playTime: 0x86,
    partyCount: 0x94, partyData: 0x98,
    boxData: 0xF700, boxNames: 0x24D04,
  },
};

function parseGen4(data: Uint8Array, fileName: string, version: GameVersion, sub: string): SaveFile {
  const off = GEN4_OFFSETS[sub] ?? GEN4_OFFSETS['DP'];
  const trainerName = readString(data, off.trainerName, 8, true);
  const tid = readU16LE(data, off.tid);
  const sid = readU16LE(data, off.sid);
  const { displayTID, displaySID } = formatTID(tid, sid, 4);
  const trainer: TrainerInfo = {
    name: trainerName || 'Dawn', tid, sid, displayTID, displaySID,
    gender: data[off.gender] & 1,
    money: readU32LE(data, off.money),
    region: sub === 'HGSS' ? 'Johto' : 'Sinnoh',
    language: data[off.gender + 1], gameVersion: version,
    badges: Array.from({ length: 8 }, (_, i) => !!(data[off.badges] & (1 << i))),
    playTime: { hours: readU16LE(data, off.playTime), minutes: data[off.playTime + 2], seconds: data[off.playTime + 3] },
  };
  const PK4_PARTY = 236;
  const PK4_STORED = 136;
  const partyCount = Math.min(data[off.partyCount], 6);
  const party: (Pokemon | null)[] = [];
  for (let i = 0; i < 6; i++) {
    if (i < partyCount) {
      const raw = data.subarray(off.partyData + i * PK4_PARTY, off.partyData + (i + 1) * PK4_PARTY);
      if (!isPKMEmpty(raw, PK4_STORED)) {
        party.push(readPK45(new Uint8Array(raw), 4));
      } else party.push(null);
    } else party.push(null);
  }
  const boxes: BoxData[] = [];
  for (let b = 0; b < 18; b++) {
    const pokemon: (Pokemon | null)[] = [];
    for (let s = 0; s < 30; s++) {
      const pkmOff = off.boxData + (b * 30 + s) * PK4_STORED;
      if (pkmOff + PK4_STORED <= data.length) {
        const raw = new Uint8Array(data.subarray(pkmOff, pkmOff + PK4_STORED));
        if (!isPKMEmpty(raw, PK4_STORED)) {
          pokemon.push(readPK45(raw, 4));
        } else pokemon.push(null);
      } else pokemon.push(null);
    }
    const nameOff = off.boxNames + b * 0x28;
    const boxName = nameOff + 0x28 <= data.length ? readString(data, nameOff, 20, true) : '';
    boxes.push({ name: boxName || `Box ${b + 1}`, wallpaper: 0, pokemon });
  }
  return {
    fileName, fileSize: data.length, generation: GameGeneration.Gen4,
    gameVersion: version, trainer, party, boxes,
    boxCount: 18, slotsPerBox: 30,
    inventory: createDefaultInventory(GameGeneration.Gen4), rawData: data, isDirty: false,
  };
}

// ===== Gen 5 =====

function parseGen5(data: Uint8Array, fileName: string, version: GameVersion, sub: string): SaveFile {
  const isBW = sub === 'BW';
  const playerBlock = 0x19400;
  const trainerName = readString(data, playerBlock + 4, 8, true);
  const tid = readU16LE(data, playerBlock + 0x14);
  const sid = readU16LE(data, playerBlock + 0x16);
  const { displayTID, displaySID } = formatTID(tid, sid, 5);
  const moneyOff = isBW ? 0x21D88 : 0x21F08;
  const trainer: TrainerInfo = {
    name: trainerName || 'Hilbert', tid, sid, displayTID, displaySID,
    gender: data[playerBlock + 0x21]! & 1,
    money: readU32LE(data, moneyOff),
    region: 'Unova', language: data[playerBlock + 0x1E] ?? 2, gameVersion: version,
    badges: Array.from({ length: 8 }, () => false),
    playTime: {
      hours: readU16LE(data, playerBlock + 0x24),
      minutes: data[playerBlock + 0x26]!,
      seconds: data[playerBlock + 0x27]!,
    },
  };
  const PK5_PARTY = 220;
  const PK5_STORED = 136;
  const partyOff = 0x18E00;
  const partyCount = Math.min(data[partyOff + 4]!, 6);
  const party: (Pokemon | null)[] = [];
  for (let i = 0; i < 6; i++) {
    if (i < partyCount) {
      const raw = data.subarray(partyOff + 8 + i * PK5_PARTY, partyOff + 8 + (i + 1) * PK5_PARTY);
      if (!isPKMEmpty(raw, PK5_STORED)) {
        party.push(readPK45(new Uint8Array(raw), 5));
      } else party.push(null);
    } else party.push(null);
  }
  const boxBase = 0x400;
  const boxStride = 30 * PK5_STORED + 0x10;
  const boxes: BoxData[] = [];
  for (let b = 0; b < 24; b++) {
    const pokemon: (Pokemon | null)[] = [];
    for (let s = 0; s < 30; s++) {
      const pkmOff = boxBase + b * boxStride + s * PK5_STORED;
      if (pkmOff + PK5_STORED <= data.length) {
        const raw = new Uint8Array(data.subarray(pkmOff, pkmOff + PK5_STORED));
        if (!isPKMEmpty(raw, PK5_STORED)) {
          pokemon.push(readPK45(raw, 5));
        } else pokemon.push(null);
      } else pokemon.push(null);
    }
    boxes.push({ name: `Box ${b + 1}`, wallpaper: 0, pokemon });
  }
  return {
    fileName, fileSize: data.length, generation: GameGeneration.Gen5,
    gameVersion: version, trainer, party, boxes,
    boxCount: 24, slotsPerBox: 30,
    inventory: createDefaultInventory(GameGeneration.Gen5), rawData: data, isDirty: false,
  };
}

// ===== Gen 6 =====

function parseGen6(data: Uint8Array, fileName: string, version: GameVersion, sub: string): SaveFile {
  const isXY = sub === 'XY';
  const nameOff = isXY ? 0x14000 : 0x14000;
  const trainerName = readString(data, nameOff, 12, true);
  const tidOff = nameOff + 0x10;
  const tid = readU16LE(data, tidOff);
  const sid = readU16LE(data, tidOff + 2);
  const { displayTID, displaySID } = formatTID(tid, sid, 6);
  const trainer: TrainerInfo = {
    name: trainerName || 'Calem', tid, sid, displayTID, displaySID,
    gender: data[nameOff + 5] & 1, money: readU32LE(data, tidOff + 0x20),
    region: 'Kalos', language: data[nameOff + 0x2D], gameVersion: version,
    badges: Array.from({ length: 8 }, () => false),
    playTime: { hours: readU16LE(data, nameOff + 0x24), minutes: data[nameOff + 0x26], seconds: data[nameOff + 0x27] },
  };
  const PK6_PARTY = 260;
  const PK6_STORED = 232;
  const partyOff = isXY ? 0x14200 : 0x14200;
  const partyCount = Math.min(readU8(data, partyOff), 6);
  const party: (Pokemon | null)[] = [];
  for (let i = 0; i < 6; i++) {
    if (i < partyCount) {
      const raw = data.subarray(partyOff + 8 + i * PK6_PARTY, partyOff + 8 + (i + 1) * PK6_PARTY);
      if (!isPKMEmpty(raw, PK6_STORED)) {
        party.push(readPK67(new Uint8Array(raw), 6));
      } else party.push(null);
    } else party.push(null);
  }
  const boxOff = isXY ? 0x22600 : 0x33000;
  const boxes: BoxData[] = [];
  for (let b = 0; b < 31; b++) {
    const pokemon: (Pokemon | null)[] = [];
    for (let s = 0; s < 30; s++) {
      const pkmOff = boxOff + (b * 30 + s) * PK6_STORED;
      if (pkmOff + PK6_STORED <= data.length) {
        const raw = new Uint8Array(data.subarray(pkmOff, pkmOff + PK6_STORED));
        if (!isPKMEmpty(raw, PK6_STORED)) {
          pokemon.push(readPK67(raw, 6));
        } else pokemon.push(null);
      } else pokemon.push(null);
    }
    boxes.push({ name: `Box ${b + 1}`, wallpaper: 0, pokemon });
  }
  return {
    fileName, fileSize: data.length, generation: GameGeneration.Gen6,
    gameVersion: version, trainer, party, boxes,
    boxCount: 31, slotsPerBox: 30,
    inventory: createDefaultInventory(GameGeneration.Gen6), rawData: data, isDirty: false,
  };
}

// ===== Gen 7 =====

function parseGen7(data: Uint8Array, fileName: string, version: GameVersion, sub: string): SaveFile {
  const isSM = sub === 'SM';
  const nameOff = isSM ? 0x01200 : 0x01200;
  const trainerName = readString(data, nameOff, 12, true);
  const tidOff = nameOff + 0x10;
  const tid = readU16LE(data, tidOff);
  const sid = readU16LE(data, tidOff + 2);
  const { displayTID, displaySID } = formatTID(tid, sid, 7);
  const trainer: TrainerInfo = {
    name: trainerName || 'Sun', tid, sid, displayTID, displaySID,
    gender: data[nameOff + 5] & 1, money: readU32LE(data, tidOff + 0x20),
    region: 'Alola', language: data[nameOff + 0x2D], gameVersion: version,
    badges: Array.from({ length: 8 }, () => false),
    playTime: { hours: readU16LE(data, nameOff + 0x28), minutes: data[nameOff + 0x2A], seconds: data[nameOff + 0x2B] },
  };
  const PK7_PARTY = 260;
  const PK7_STORED = 232;
  const partyOff = isSM ? 0x14200 : 0x14200;
  const partyCount = Math.min(readU8(data, partyOff), 6);
  const party: (Pokemon | null)[] = [];
  for (let i = 0; i < 6; i++) {
    if (i < partyCount) {
      const raw = data.subarray(partyOff + 8 + i * PK7_PARTY, partyOff + 8 + (i + 1) * PK7_PARTY);
      if (!isPKMEmpty(raw, PK7_STORED)) {
        party.push(readPK67(new Uint8Array(raw), 7));
      } else party.push(null);
    } else party.push(null);
  }
  const boxOff = isSM ? 0x04E00 : 0x04E00;
  const boxes: BoxData[] = [];
  for (let b = 0; b < 32; b++) {
    const pokemon: (Pokemon | null)[] = [];
    for (let s = 0; s < 30; s++) {
      const pkmOff = boxOff + (b * 30 + s) * PK7_STORED;
      if (pkmOff + PK7_STORED <= data.length) {
        const raw = new Uint8Array(data.subarray(pkmOff, pkmOff + PK7_STORED));
        if (!isPKMEmpty(raw, PK7_STORED)) {
          pokemon.push(readPK67(raw, 7));
        } else pokemon.push(null);
      } else pokemon.push(null);
    }
    boxes.push({ name: `Box ${b + 1}`, wallpaper: 0, pokemon });
  }
  return {
    fileName, fileSize: data.length, generation: GameGeneration.Gen7,
    gameVersion: version, trainer, party, boxes,
    boxCount: 32, slotsPerBox: 30,
    inventory: createDefaultInventory(GameGeneration.Gen7), rawData: data, isDirty: false,
  };
}

function parseGen7LGPE(data: Uint8Array, fileName: string): SaveFile {
  return createFallbackSave(data, fileName, GameGeneration.Gen7, GameVersion.LetsGoPikachu);
}

// ===== Gen 8 =====

function parseGen8(data: Uint8Array, fileName: string, version: GameVersion): SaveFile {
  const PK8_STORED = 344;
  const PK8_PARTY = 376;
  const trainer = parseGen8Trainer(data, version);
  const partyOff = 0x450C4;
  const partyCount = Math.min(readU8(data, partyOff), 6);
  const party: (Pokemon | null)[] = [];
  for (let i = 0; i < 6; i++) {
    if (i < partyCount) {
      const raw = data.subarray(partyOff + 8 + i * PK8_PARTY, partyOff + 8 + (i + 1) * PK8_PARTY);
      if (!isPKMEmpty(raw, PK8_STORED)) {
        party.push(readPK89(new Uint8Array(raw), 8));
      } else party.push(null);
    } else party.push(null);
  }
  const boxOff = 0x45000 + 0x10;
  const boxes: BoxData[] = [];
  for (let b = 0; b < 32; b++) {
    const pokemon: (Pokemon | null)[] = [];
    for (let s = 0; s < 30; s++) {
      const pkmOff = boxOff + (b * 30 + s) * PK8_STORED;
      if (pkmOff + PK8_STORED <= data.length) {
        const raw = new Uint8Array(data.subarray(pkmOff, pkmOff + PK8_STORED));
        if (!isPKMEmpty(raw, PK8_STORED)) {
          pokemon.push(readPK89(raw, 8));
        } else pokemon.push(null);
      } else pokemon.push(null);
    }
    boxes.push({ name: `Box ${b + 1}`, wallpaper: 0, pokemon });
  }
  return {
    fileName, fileSize: data.length, generation: GameGeneration.Gen8,
    gameVersion: version, trainer, party, boxes,
    boxCount: 32, slotsPerBox: 30,
    inventory: createDefaultInventory(GameGeneration.Gen8), rawData: data, isDirty: false,
  };
}

function parseGen8Trainer(data: Uint8Array, version: GameVersion): TrainerInfo {
  const nameOff = 0x0B0;
  const trainerName = readString(data, nameOff, 12, true);
  const tid = readU16LE(data, nameOff + 0x18);
  const sid = readU16LE(data, nameOff + 0x1A);
  const { displayTID, displaySID } = formatTID(tid, sid, 8);
  return {
    name: trainerName || 'Victor', tid, sid, displayTID, displaySID,
    gender: data[nameOff + 0x1C] & 1, money: readU32LE(data, nameOff + 0x20),
    region: 'Galar', language: data[nameOff + 0x2D], gameVersion: version,
    badges: Array.from({ length: 8 }, () => false),
    playTime: { hours: readU16LE(data, nameOff + 0x28), minutes: data[nameOff + 0x2A], seconds: data[nameOff + 0x2B] },
  };
}

function parseGen8BDSP(data: Uint8Array, fileName: string): SaveFile {
  return createFallbackSave(data, fileName, GameGeneration.Gen8, GameVersion.BrilliantDiamond);
}

function parseGen8PLA(data: Uint8Array, fileName: string): SaveFile {
  return createFallbackSave(data, fileName, GameGeneration.Gen8, GameVersion.LegendsArceus);
}

// ===== Gen 9 =====

function parseGen9(data: Uint8Array, fileName: string, version: GameVersion): SaveFile {
  const PK9_STORED = 344;
  const PK9_PARTY = 376;
  const trainer = parseGen9Trainer(data, version);
  const party: (Pokemon | null)[] = [];
  const partyOff = 0x4B2C4;
  const partyCount = Math.min(readU8(data, partyOff), 6);
  for (let i = 0; i < 6; i++) {
    if (i < partyCount) {
      const raw = data.subarray(partyOff + 8 + i * PK9_PARTY, partyOff + 8 + (i + 1) * PK9_PARTY);
      if (!isPKMEmpty(raw, PK9_STORED)) {
        party.push(readPK89(new Uint8Array(raw), 9));
      } else party.push(null);
    } else party.push(null);
  }
  const boxOff = 0x4C000 + 0x10;
  const boxes: BoxData[] = [];
  for (let b = 0; b < 32; b++) {
    const pokemon: (Pokemon | null)[] = [];
    for (let s = 0; s < 30; s++) {
      const pkmOff = boxOff + (b * 30 + s) * PK9_STORED;
      if (pkmOff + PK9_STORED <= data.length) {
        const raw = new Uint8Array(data.subarray(pkmOff, pkmOff + PK9_STORED));
        if (!isPKMEmpty(raw, PK9_STORED)) {
          pokemon.push(readPK89(raw, 9));
        } else pokemon.push(null);
      } else pokemon.push(null);
    }
    boxes.push({ name: `Box ${b + 1}`, wallpaper: 0, pokemon });
  }
  return {
    fileName, fileSize: data.length, generation: GameGeneration.Gen9,
    gameVersion: version, trainer, party, boxes,
    boxCount: 32, slotsPerBox: 30,
    inventory: createDefaultInventory(GameGeneration.Gen9), rawData: data, isDirty: false,
  };
}

function parseGen9Trainer(data: Uint8Array, version: GameVersion): TrainerInfo {
  const nameOff = 0x0B0;
  const trainerName = readString(data, nameOff, 12, true);
  const tid = readU16LE(data, nameOff + 0x18);
  const sid = readU16LE(data, nameOff + 0x1A);
  const { displayTID, displaySID } = formatTID(tid, sid, 9);
  return {
    name: trainerName || 'Florian', tid, sid, displayTID, displaySID,
    gender: data[nameOff + 0x1C] & 1, money: readU32LE(data, nameOff + 0x20),
    region: 'Paldea', language: data[nameOff + 0x2D], gameVersion: version,
    badges: Array.from({ length: 8 }, () => false),
    playTime: { hours: readU16LE(data, nameOff + 0x28), minutes: data[nameOff + 0x2A], seconds: data[nameOff + 0x2B] },
  };
}

// ===== Utilities =====

/** Gen 3 cartridge game code at 0xAC: Japanese carts use a trailing `J` (PKHeX / retail naming). */
function inferGen3CartridgeLanguage(data: Uint8Array): number {
  if (data.length < 0xB0) return 2;
  const code = String.fromCharCode(data[0xAC]!, data[0xAD]!, data[0xAE]!, data[0xAF]!).toUpperCase();
  return code.endsWith('J') ? 1 : 2;
}

function readGen1String(data: Uint8Array, offset: number, maxLen: number): string {
  const GEN1_CHARS: Record<number, string> = {
    0x80: 'A', 0x81: 'B', 0x82: 'C', 0x83: 'D', 0x84: 'E', 0x85: 'F', 0x86: 'G', 0x87: 'H',
    0x88: 'I', 0x89: 'J', 0x8A: 'K', 0x8B: 'L', 0x8C: 'M', 0x8D: 'N', 0x8E: 'O', 0x8F: 'P',
    0x90: 'Q', 0x91: 'R', 0x92: 'S', 0x93: 'T', 0x94: 'U', 0x95: 'V', 0x96: 'W', 0x97: 'X',
    0x98: 'Y', 0x99: 'Z', 0xA0: 'a', 0xA1: 'b', 0xA2: 'c', 0xA3: 'd', 0xA4: 'e', 0xA5: 'f',
    0xA6: 'g', 0xA7: 'h', 0xA8: 'i', 0xA9: 'j', 0xAA: 'k', 0xAB: 'l', 0xAC: 'm', 0xAD: 'n',
    0xAE: 'o', 0xAF: 'p', 0xB0: 'q', 0xB1: 'r', 0xB2: 's', 0xB3: 't', 0xB4: 'u', 0xB5: 'v',
    0xB6: 'w', 0xB7: 'x', 0xB8: 'y', 0xB9: 'z', 0x7F: ' ', 0xF6: '0', 0xF7: '1', 0xF8: '2',
    0xF9: '3', 0xFA: '4', 0xFB: '5', 0xFC: '6', 0xFD: '7', 0xFE: '8', 0xFF: '9',
  };
  const chars: string[] = [];
  for (let i = 0; i < maxLen; i++) {
    const b = data[offset + i];
    if (b === 0x50 || b === 0x00) break;
    chars.push(GEN1_CHARS[b] ?? '?');
  }
  return chars.join('');
}

function gen1SpeciesIndex(internalId: number): number {
  const GEN1_SPECIES: Record<number, number> = {
    0x01: 112, 0x02: 115, 0x03: 32, 0x04: 35, 0x05: 21, 0x06: 100, 0x07: 34, 0x08: 80,
    0x09: 2, 0x0A: 103, 0x0B: 108, 0x0C: 102, 0x0D: 88, 0x0E: 94, 0x0F: 29, 0x10: 31,
    0x11: 104, 0x12: 111, 0x13: 131, 0x14: 59, 0x15: 151, 0x16: 130, 0x17: 90, 0x18: 72,
    0x19: 92, 0x1A: 123, 0x1B: 120, 0x1C: 9, 0x1D: 127, 0x1E: 114, 0x21: 58, 0x22: 95,
    0x23: 22, 0x24: 16, 0x25: 79, 0x26: 64, 0x27: 75, 0x28: 113, 0x29: 67, 0x2A: 122,
    0x2B: 106, 0x2C: 107, 0x2D: 24, 0x2E: 47, 0x2F: 54, 0x30: 96, 0x31: 76, 0x33: 126,
    0x35: 65, 0x36: 83, 0x37: 109, 0x39: 86, 0x3A: 36, 0x3B: 124, 0x3C: 125, 0x3D: 52,
    0x3E: 23, 0x40: 150, 0x46: 129, 0x47: 141, 0x48: 116, 0x49: 1, 0x4A: 3, 0x4B: 73,
    0x4C: 118, 0x4D: 119, 0x4E: 132, 0x52: 55, 0x53: 128, 0x54: 62, 0x55: 105, 0x58: 39,
    0x59: 40, 0x5A: 41, 0x5B: 42, 0x5C: 43, 0x5D: 44, 0x5E: 45, 0x5F: 46, 0x60: 48,
    0x61: 49, 0x62: 50, 0x63: 51, 0x65: 10, 0x66: 11, 0x67: 12, 0x69: 68, 0x6A: 69,
    0x6B: 70, 0x6C: 71, 0x6D: 56, 0x6E: 57, 0x70: 60, 0x71: 61, 0x74: 74, 0x75: 77,
    0x76: 78, 0x77: 81, 0x78: 82, 0x7B: 84, 0x7C: 85, 0x7D: 87, 0x7E: 89, 0x80: 99,
    0x81: 91, 0x82: 101, 0x83: 93, 0x84: 14, 0x85: 15, 0x88: 4, 0x8A: 7, 0x8B: 5,
    0x8C: 8, 0x8D: 6, 0x91: 19, 0x92: 20, 0x93: 97, 0x94: 98, 0x96: 25, 0x97: 26,
    0x98: 27, 0x99: 28, 0x9D: 33, 0x9E: 30, 0xA3: 37, 0xA4: 38, 0xA5: 53, 0xA6: 63,
    0xA7: 66, 0xA8: 110, 0xA9: 117, 0xAA: 121, 0xAB: 133, 0xAD: 134, 0xB0: 135, 0xB1: 136,
    0xB2: 137, 0xB3: 138, 0xB4: 139, 0xB5: 140, 0xB6: 13, 0xB7: 142, 0xB8: 143, 0xB9: 144,
    0xBA: 145, 0xBB: 146, 0xBC: 147, 0xBD: 148, 0xBE: 149, 0xBF: 17, 0xC0: 18,
  };
  return GEN1_SPECIES[internalId] ?? internalId;
}

function decodeBCD(data: Uint8Array, offset: number, bytes: number): number {
  let result = 0;
  for (let i = 0; i < bytes; i++) {
    result = result * 100 + ((data[offset + i] >> 4) * 10 + (data[offset + i] & 0xF));
  }
  return result;
}

function createFallbackSave(data: Uint8Array, fileName: string, generation: GameGeneration, version: GameVersion): SaveFile {
  const { displayTID, displaySID } = formatTID(0, 0, generation >= 7 ? 7 : 4);
  const trainer: TrainerInfo = {
    name: 'Unknown', tid: 0, sid: 0, displayTID, displaySID,
    gender: 0, money: 0, region: 'Unknown', language: 2, gameVersion: version,
    badges: Array(8).fill(false), playTime: { hours: 0, minutes: 0, seconds: 0 },
  };
  const slotsPerBox = 30;
  const boxCount = generation >= 7 ? 32 : generation >= 5 ? 24 : 18;
  const boxes: BoxData[] = Array.from({ length: boxCount }, (_, i) => ({
    name: `Box ${i + 1}`, wallpaper: 0, pokemon: Array(slotsPerBox).fill(null),
  }));
  return {
    fileName, fileSize: data.length, generation, gameVersion: version,
    trainer, party: Array(6).fill(null), boxes, boxCount, slotsPerBox,
    inventory: createDefaultInventory(generation), rawData: data, isDirty: false,
  };
}

function createDefaultInventory(gen: GameGeneration) {
  const maxCount = gen >= 5 ? 999 : 99;
  return [
    createInventoryPouch(InventoryType.Items, 'Items', maxCount, 999),
    createInventoryPouch(InventoryType.Medicine, 'Medicine', maxCount, 999),
    createInventoryPouch(InventoryType.Balls, 'Poké Balls', maxCount, 999),
    createInventoryPouch(InventoryType.TMs, 'TMs & HMs', maxCount, 999),
    createInventoryPouch(InventoryType.Berries, 'Berries', maxCount, 999),
    createInventoryPouch(InventoryType.KeyItems, 'Key Items', 1, 999),
    createInventoryPouch(InventoryType.BattleItems, 'Battle Items', maxCount, 999),
    createInventoryPouch(InventoryType.Treasures, 'Treasures', maxCount, 999),
  ];
}

export function exportSaveFile(save: SaveFile): Uint8Array {
  return new Uint8Array(save.rawData);
}

export function parsePKMFile(data: Uint8Array): Pokemon {
  const size = data.length;
  if (size === 80 || size === 100) return readPK3(data);
  if (size === 136 || size === 236 || size === 220) return readPK45(data, size === 220 ? 5 : 4);
  if (size === 232 || size === 260) return readPK67(data, 6);
  if (size === 344 || size === 376) return readPK89(data, 8);
  return createEmptyPokemon();
}
