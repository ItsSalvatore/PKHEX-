import type { SaveFile, BoxData } from '../structures/save-file.js';
import type { Pokemon } from '../structures/pokemon.js';
import { GameGeneration, GameVersion } from '../structures/save-file.js';
import { writeU16LE, writeU32LE, writeString } from './detector.js';
import { writePK45Fields, writePK67Fields, writePK89Fields, isPKMEmpty } from './pkm-codec.js';
import { computeChecksum16 } from '../util/crypto.js';

export function exportModifiedSave(save: SaveFile): Uint8Array {
  const data = new Uint8Array(save.rawData);

  switch (save.generation) {
    case GameGeneration.Gen3: return writeGen3Save(data, save);
    case GameGeneration.Gen4: return writeGen4Save(data, save);
    case GameGeneration.Gen5: return writeGen5Save(data, save);
    case GameGeneration.Gen6: return writeGen6Save(data, save);
    case GameGeneration.Gen7: return writeGen7Save(data, save);
    case GameGeneration.Gen8: return writeGen8Save(data, save);
    case GameGeneration.Gen9: return writeGen9Save(data, save);
    default: return data;
  }
}

function writePokemonToSave(
  data: Uint8Array, offset: number, pkm: Pokemon | null,
  storedSize: number, gen: number,
): void {
  if (!pkm || pkm.species === 0) {
    for (let i = 0; i < storedSize; i++) data[offset + i] = 0;
    return;
  }

  let encoded: Uint8Array;
  if (gen <= 3) {
    encoded = pkm.rawData;
  } else if (gen <= 5) {
    encoded = writePK45Fields(pkm, gen);
  } else if (gen <= 7) {
    encoded = writePK67Fields(pkm);
  } else {
    encoded = writePK89Fields(pkm, gen);
  }

  const toCopy = Math.min(encoded.length, storedSize);
  data.set(encoded.subarray(0, toCopy), offset);
}

function writePartyToSave(
  data: Uint8Array, countOffset: number, dataOffset: number,
  party: (Pokemon | null)[], partySize: number, gen: number,
): void {
  let count = 0;
  for (const pkm of party) {
    if (pkm && pkm.species > 0) count++;
  }

  if (gen <= 3) {
    writeU32LE(data, countOffset, count);
  } else {
    data[countOffset] = count;
  }

  for (let i = 0; i < 6; i++) {
    writePokemonToSave(data, dataOffset + i * partySize, party[i], partySize, gen);
  }
}

function writeBoxesToSave(
  data: Uint8Array, boxOffset: number,
  boxes: BoxData[], storedSize: number, gen: number,
  /** Gen 5: 0x1000 bytes per box (30×136 + 0x10 padding). Omit for tight-packed boxes. */
  boxStrideBytes?: number,
): void {
  const slots = boxes[0]?.pokemon.length ?? 30;
  const stride = boxStrideBytes ?? slots * storedSize;
  for (let b = 0; b < boxes.length; b++) {
    for (let s = 0; s < boxes[b].pokemon.length; s++) {
      const off = boxOffset + b * stride + s * storedSize;
      if (off + storedSize <= data.length) {
        writePokemonToSave(data, off, boxes[b].pokemon[s], storedSize, gen);
      }
    }
  }
}

function writeGen3Save(data: Uint8Array, save: SaveFile): Uint8Array {
  return data;
}

function writeGen4Save(data: Uint8Array, save: SaveFile): Uint8Array {
  const PK4_STORED = 136;
  const PK4_PARTY = 236;
  const format =
    save.gameVersion === GameVersion.HeartGold || save.gameVersion === GameVersion.SoulSilver ? 'HGSS'
      : save.gameVersion === GameVersion.Platinum ? 'PT'
        : 'DP';
  const off = format === 'HGSS'
    ? { partyCount: 0x94, partyData: 0x98, boxData: 0xF700 }
    : format === 'PT'
      ? { partyCount: 0xA0, partyData: 0xA4, boxData: 0xCF30 }
      : { partyCount: 0xA0, partyData: 0xA4, boxData: 0xC104 };
  writePartyToSave(data, off.partyCount, off.partyData, save.party, PK4_PARTY, 4);
  writeBoxesToSave(data, off.boxData, save.boxes, PK4_STORED, 4);
  return data;
}

function writeGen5Save(data: Uint8Array, save: SaveFile): Uint8Array {
  const PK5_STORED = 136;
  const PK5_PARTY = 220;
  const partyBase = 0x18E00;
  writePartyToSave(data, partyBase + 4, partyBase + 8, save.party, PK5_PARTY, 5);
  writeBoxesToSave(data, 0x400, save.boxes, PK5_STORED, 5, 0x1000);
  return data;
}

function writeGen6Save(data: Uint8Array, save: SaveFile): Uint8Array {
  const PK6_STORED = 232;
  const PK6_PARTY = 260;
  const isXY = save.fileSize === 0x65600;
  const partyOff = 0x14200;
  const boxOff = isXY ? 0x22600 : 0x33000;
  writePartyToSave(data, partyOff, partyOff + 8, save.party, PK6_PARTY, 6);
  writeBoxesToSave(data, boxOff, save.boxes, PK6_STORED, 6);
  return data;
}

function writeGen7Save(data: Uint8Array, save: SaveFile): Uint8Array {
  const PK7_STORED = 232;
  const PK7_PARTY = 260;
  const partyOff = 0x14200;
  const boxOff = 0x04E00;
  writePartyToSave(data, partyOff, partyOff + 8, save.party, PK7_PARTY, 7);
  writeBoxesToSave(data, boxOff, save.boxes, PK7_STORED, 7);
  return data;
}

function writeGen8Save(data: Uint8Array, save: SaveFile): Uint8Array {
  const PK8_STORED = 344;
  const PK8_PARTY = 376;
  const partyOff = 0x450C4;
  const boxOff = 0x45000 + 0x10;
  writePartyToSave(data, partyOff, partyOff + 8, save.party, PK8_PARTY, 8);
  writeBoxesToSave(data, boxOff, save.boxes, PK8_STORED, 8);
  return data;
}

function writeGen9Save(data: Uint8Array, save: SaveFile): Uint8Array {
  const PK9_STORED = 344;
  const PK9_PARTY = 376;
  const partyOff = 0x4B2C4;
  const boxOff = 0x4C000 + 0x10;
  writePartyToSave(data, partyOff, partyOff + 8, save.party, PK9_PARTY, 9);
  writeBoxesToSave(data, boxOff, save.boxes, PK9_STORED, 9);
  return data;
}
