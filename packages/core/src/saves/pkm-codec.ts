import { readU16LE, readU32LE, writeU16LE, writeU32LE, readString, writeString } from './detector.js';
import { type Pokemon, PokemonGender, PokemonNature, createEmptyPokemon } from '../structures/pokemon.js';
import { computeChecksum16, lcrnNext, decryptArray, encryptArray } from '../util/crypto.js';

const BLOCK_POSITION: number[][] = [
  [0, 1, 2, 3], [0, 1, 3, 2], [0, 2, 1, 3], [0, 3, 1, 2], [0, 2, 3, 1], [0, 3, 2, 1],
  [1, 0, 2, 3], [1, 0, 3, 2], [2, 0, 1, 3], [3, 0, 1, 2], [2, 0, 3, 1], [3, 0, 2, 1],
  [1, 2, 0, 3], [1, 3, 0, 2], [2, 1, 0, 3], [3, 1, 0, 2], [2, 3, 0, 1], [3, 2, 0, 1],
  [1, 2, 3, 0], [1, 3, 2, 0], [2, 1, 3, 0], [3, 1, 2, 0], [2, 3, 1, 0], [3, 2, 1, 0],
];

const BLOCK_POSITION_INVERT: number[][] = BLOCK_POSITION.map(order => {
  const inv = [0, 0, 0, 0];
  for (let i = 0; i < 4; i++) inv[order[i]] = i;
  return inv;
});

function getExperienceForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(Math.pow(level, 3));
}

function getLevelFromExp(exp: number): number {
  for (let l = 100; l >= 1; l--) {
    if (exp >= getExperienceForLevel(l)) return l;
  }
  return 1;
}

// -- Gen 3 PKM (80 bytes stored, 100 bytes party) --

export function decryptPK3(data: Uint8Array): Uint8Array {
  const result = new Uint8Array(data);
  const pid = readU32LE(data, 0);
  const otid = readU32LE(data, 4);
  const key = pid ^ otid;
  for (let i = 32; i < 80; i += 4) {
    const val = readU32LE(result, i) ^ key;
    writeU32LE(result, i, val);
  }
  const sv = pid % 24;
  const order = BLOCK_POSITION_INVERT[sv];
  const unshuffled = new Uint8Array(result);
  for (let i = 0; i < 4; i++) {
    const src = 32 + order[i] * 12;
    const dst = 32 + i * 12;
    unshuffled.set(result.subarray(src, src + 12), dst);
  }
  return unshuffled;
}

export function encryptPK3(data: Uint8Array): Uint8Array {
  const pid = readU32LE(data, 0);
  const sv = pid % 24;
  const order = BLOCK_POSITION[sv];
  const shuffled = new Uint8Array(data);
  for (let i = 0; i < 4; i++) {
    const src = 32 + order[i] * 12;
    const dst = 32 + i * 12;
    shuffled.set(data.subarray(src, src + 12), dst);
  }
  const otid = readU32LE(data, 4);
  const key = pid ^ otid;
  for (let i = 32; i < 80; i += 4) {
    const val = readU32LE(shuffled, i) ^ key;
    writeU32LE(shuffled, i, val);
  }
  const checksum = computeChecksum16(data, 32, 48);
  writeU16LE(shuffled, 28, checksum);
  return shuffled;
}

export function readPK3(encrypted: Uint8Array): Pokemon {
  const data = decryptPK3(encrypted);
  const pkm = createEmptyPokemon();
  pkm.rawData = new Uint8Array(encrypted);
  pkm.pid = readU32LE(data, 0);
  pkm.otId = readU16LE(data, 4);
  pkm.secretId = readU16LE(data, 6);
  pkm.species = readU16LE(data, 32);
  pkm.heldItem = readU16LE(data, 34);
  pkm.exp = readU32LE(data, 36);
  pkm.friendship = data[41];
  pkm.moves = [
    { id: readU16LE(data, 44), pp: data[52], ppUps: (data[56] >> 0) & 3 },
    { id: readU16LE(data, 46), pp: data[53], ppUps: (data[56] >> 2) & 3 },
    { id: readU16LE(data, 48), pp: data[54], ppUps: (data[56] >> 4) & 3 },
    { id: readU16LE(data, 50), pp: data[55], ppUps: (data[56] >> 6) & 3 },
  ];
  pkm.evs = {
    hp: data[57], atk: data[58], def: data[59],
    spe: data[60], spa: data[61], spd: data[62],
  };
  const misc = readU32LE(data, 72);
  pkm.metLevel = misc & 0x7F;
  pkm.ball = (misc >> 11) & 0xF;
  const ivbits = readU32LE(data, 76);
  pkm.ivs = {
    hp: ivbits & 0x1F, atk: (ivbits >> 5) & 0x1F,
    def: (ivbits >> 10) & 0x1F, spe: (ivbits >> 15) & 0x1F,
    spa: (ivbits >> 20) & 0x1F, spd: (ivbits >> 25) & 0x1F,
  };
  pkm.isEgg = !!((ivbits >> 30) & 1);
  pkm.nature = (pkm.pid % 25) as PokemonNature;
  pkm.ability = data[40] & 1;
  pkm.level = getLevelFromExp(pkm.exp);
  pkm.isShiny = ((pkm.otId ^ pkm.secretId ^ (pkm.pid >>> 16) ^ (pkm.pid & 0xFFFF)) < 8);
  pkm.language = data[18];
  return pkm;
}

// -- Gen 4/5 PKM (136 bytes stored, 236/220 bytes party) --

export function decryptPK45(data: Uint8Array): Uint8Array {
  const result = new Uint8Array(data);
  const pid = readU32LE(data, 0);
  const checksum = readU16LE(data, 6);

  let seed = checksum;
  for (let i = 8; i < 136; i += 2) {
    seed = (lcrnNext(seed) >>> 0);
    const val = (seed >>> 16) & 0xFFFF;
    const orig = readU16LE(result, i);
    writeU16LE(result, i, orig ^ val);
  }

  const sv = ((pid >>> 13) & 31) % 24;
  const order = BLOCK_POSITION_INVERT[sv];
  const unshuffled = new Uint8Array(result);
  for (let i = 0; i < 4; i++) {
    const src = 8 + order[i] * 32;
    const dst = 8 + i * 32;
    unshuffled.set(result.subarray(src, src + 32), dst);
  }

  if (data.length > 136) {
    let battleSeed = pid;
    for (let i = 136; i < data.length; i += 2) {
      battleSeed = (lcrnNext(battleSeed) >>> 0);
      const val = (battleSeed >>> 16) & 0xFFFF;
      const orig = readU16LE(unshuffled, i);
      writeU16LE(unshuffled, i, orig ^ val);
    }
  }

  return unshuffled;
}

export function encryptPK45(decrypted: Uint8Array, storedSize: number): Uint8Array {
  const data = new Uint8Array(decrypted);
  const pid = readU32LE(data, 0);

  const checksum = computeChecksum16(data, 8, 128);
  writeU16LE(data, 6, checksum);

  if (data.length > storedSize) {
    let battleSeed = pid;
    for (let i = storedSize; i < data.length; i += 2) {
      battleSeed = (lcrnNext(battleSeed) >>> 0);
      const val = (battleSeed >>> 16) & 0xFFFF;
      const orig = readU16LE(data, i);
      writeU16LE(data, i, orig ^ val);
    }
  }

  const sv = ((pid >>> 13) & 31) % 24;
  const order = BLOCK_POSITION[sv];
  const shuffled = new Uint8Array(data);
  for (let i = 0; i < 4; i++) {
    const src = 8 + order[i] * 32;
    const dst = 8 + i * 32;
    shuffled.set(data.subarray(src, src + 32), dst);
  }

  let seed = checksum;
  for (let i = 8; i < storedSize; i += 2) {
    seed = (lcrnNext(seed) >>> 0);
    const val = (seed >>> 16) & 0xFFFF;
    const orig = readU16LE(shuffled, i);
    writeU16LE(shuffled, i, orig ^ val);
  }

  return shuffled;
}

export function readPK45(encrypted: Uint8Array, gen: number): Pokemon {
  const data = decryptPK45(encrypted);
  const pkm = createEmptyPokemon();
  pkm.rawData = new Uint8Array(encrypted);
  pkm.pid = readU32LE(data, 0x00);
  pkm.species = readU16LE(data, 0x08);
  pkm.heldItem = readU16LE(data, 0x0A);
  pkm.otId = readU16LE(data, 0x0C);
  pkm.secretId = readU16LE(data, 0x0E);
  pkm.exp = readU32LE(data, 0x10);
  pkm.friendship = data[0x14];
  pkm.ability = data[0x15];
  pkm.markings = [data[0x16]];
  pkm.language = data[0x17];
  pkm.evs = {
    hp: data[0x18], atk: data[0x19], def: data[0x1A],
    spe: data[0x1B], spa: data[0x1C], spd: data[0x1D],
  };
  pkm.moves = [
    { id: readU16LE(data, 0x28), pp: data[0x30], ppUps: data[0x34] & 3 },
    { id: readU16LE(data, 0x2A), pp: data[0x31], ppUps: (data[0x34] >> 2) & 3 },
    { id: readU16LE(data, 0x2C), pp: data[0x32], ppUps: (data[0x34] >> 4) & 3 },
    { id: readU16LE(data, 0x2E), pp: data[0x33], ppUps: (data[0x34] >> 6) & 3 },
  ];
  const ivbits = readU32LE(data, 0x38);
  pkm.ivs = {
    hp: ivbits & 0x1F, atk: (ivbits >> 5) & 0x1F,
    def: (ivbits >> 10) & 0x1F, spe: (ivbits >> 15) & 0x1F,
    spa: (ivbits >> 20) & 0x1F, spd: (ivbits >> 25) & 0x1F,
  };
  pkm.isEgg = !!((ivbits >> 30) & 1);
  const formGender = data[0x40];
  pkm.form = (formGender >> 3) & 0x1F;
  pkm.gender = ((formGender >> 1) & 3) as PokemonGender;
  pkm.nature = (pkm.pid % 25) as PokemonNature;
  pkm.isShiny = ((pkm.otId ^ pkm.secretId ^ (pkm.pid >>> 16) ^ (pkm.pid & 0xFFFF)) < 8);
  pkm.nickname = readString(data, 0x48, 11);
  pkm.otName = readString(data, 0x68, 8);
  pkm.metLocation = readU16LE(data, 0x80);
  pkm.metLevel = data[0x84] & 0x7F;
  pkm.ball = data[0x83];
  pkm.level = getLevelFromExp(pkm.exp);

  if (encrypted.length >= 236) {
    pkm.stats = {
      hp: readU16LE(data, 0x8E), atk: readU16LE(data, 0x92),
      def: readU16LE(data, 0x94), spe: readU16LE(data, 0x96),
      spa: readU16LE(data, 0x98), spd: readU16LE(data, 0x9A),
    };
    pkm.level = data[0x8C];
  }

  return pkm;
}

export function writePK45Fields(pkm: Pokemon, gen: number): Uint8Array {
  const decrypted = decryptPK45(pkm.rawData);
  writeU16LE(decrypted, 0x08, pkm.species);
  writeU16LE(decrypted, 0x0A, pkm.heldItem);
  writeU32LE(decrypted, 0x10, pkm.exp);
  decrypted[0x14] = pkm.friendship;
  decrypted[0x18] = pkm.evs.hp;
  decrypted[0x19] = pkm.evs.atk;
  decrypted[0x1A] = pkm.evs.def;
  decrypted[0x1B] = pkm.evs.spe;
  decrypted[0x1C] = pkm.evs.spa;
  decrypted[0x1D] = pkm.evs.spd;
  for (let i = 0; i < 4; i++) {
    writeU16LE(decrypted, 0x28 + i * 2, pkm.moves[i].id);
    decrypted[0x30 + i] = pkm.moves[i].pp;
  }
  decrypted[0x34] = (pkm.moves[0].ppUps & 3)
    | ((pkm.moves[1].ppUps & 3) << 2)
    | ((pkm.moves[2].ppUps & 3) << 4)
    | ((pkm.moves[3].ppUps & 3) << 6);
  let ivbits = (pkm.ivs.hp & 0x1F)
    | ((pkm.ivs.atk & 0x1F) << 5)
    | ((pkm.ivs.def & 0x1F) << 10)
    | ((pkm.ivs.spe & 0x1F) << 15)
    | ((pkm.ivs.spa & 0x1F) << 20)
    | ((pkm.ivs.spd & 0x1F) << 25);
  if (pkm.isEgg) ivbits |= (1 << 30);
  writeU32LE(decrypted, 0x38, ivbits >>> 0);
  const formGender = ((pkm.form & 0x1F) << 3) | ((pkm.gender & 3) << 1);
  decrypted[0x40] = formGender;
  writeString(decrypted, 0x48, pkm.nickname, 11);
  decrypted[0x83] = pkm.ball;
  const storedSize = gen === 5 ? 136 : 136;
  return encryptPK45(decrypted, storedSize);
}

// -- Gen 6/7 PKM (232 bytes stored, 260 bytes party) --

export function decryptPK67(data: Uint8Array): Uint8Array {
  const result = new Uint8Array(data);
  const ec = readU32LE(data, 0);

  let seed = ec;
  for (let i = 8; i < 232; i += 2) {
    seed = (lcrnNext(seed) >>> 0);
    const val = (seed >>> 16) & 0xFFFF;
    const orig = readU16LE(result, i);
    writeU16LE(result, i, orig ^ val);
  }

  const sv = ((ec >>> 13) & 31) % 24;
  const order = BLOCK_POSITION_INVERT[sv];
  const unshuffled = new Uint8Array(result);
  for (let i = 0; i < 4; i++) {
    const src = 8 + order[i] * 56;
    const dst = 8 + i * 56;
    unshuffled.set(result.subarray(src, src + 56), dst);
  }

  if (data.length > 232) {
    let battleSeed = ec;
    for (let i = 232; i < data.length; i += 2) {
      battleSeed = (lcrnNext(battleSeed) >>> 0);
      const val = (battleSeed >>> 16) & 0xFFFF;
      const orig = readU16LE(unshuffled, i);
      writeU16LE(unshuffled, i, orig ^ val);
    }
  }

  return unshuffled;
}

export function encryptPK67(decrypted: Uint8Array): Uint8Array {
  const data = new Uint8Array(decrypted);
  const ec = readU32LE(data, 0);

  const checksum = computeChecksum16(data, 8, 224);
  writeU16LE(data, 6, checksum);

  if (data.length > 232) {
    let battleSeed = ec;
    for (let i = 232; i < data.length; i += 2) {
      battleSeed = (lcrnNext(battleSeed) >>> 0);
      const val = (battleSeed >>> 16) & 0xFFFF;
      const orig = readU16LE(data, i);
      writeU16LE(data, i, orig ^ val);
    }
  }

  const sv = ((ec >>> 13) & 31) % 24;
  const order = BLOCK_POSITION[sv];
  const shuffled = new Uint8Array(data);
  for (let i = 0; i < 4; i++) {
    const src = 8 + order[i] * 56;
    const dst = 8 + i * 56;
    shuffled.set(data.subarray(src, src + 56), dst);
  }

  let seed = ec;
  for (let i = 8; i < 232; i += 2) {
    seed = (lcrnNext(seed) >>> 0);
    const val = (seed >>> 16) & 0xFFFF;
    const orig = readU16LE(shuffled, i);
    writeU16LE(shuffled, i, orig ^ val);
  }

  return shuffled;
}

export function readPK67(encrypted: Uint8Array, gen: number): Pokemon {
  const data = decryptPK67(encrypted);
  const pkm = createEmptyPokemon();
  pkm.rawData = new Uint8Array(encrypted);
  pkm.encryptionConstant = readU32LE(data, 0x00);
  pkm.species = readU16LE(data, 0x08);
  pkm.heldItem = readU16LE(data, 0x0A);
  pkm.otId = readU16LE(data, 0x0C);
  pkm.secretId = readU16LE(data, 0x0E);
  pkm.exp = readU32LE(data, 0x10);
  pkm.ability = readU16LE(data, 0x14);
  pkm.abilityNumber = data[0x16] & 7;
  pkm.pid = readU32LE(data, 0x18);
  pkm.nature = data[0x1C] as PokemonNature;
  const fatefulGender = data[0x1D];
  pkm.gender = ((fatefulGender >> 1) & 3) as PokemonGender;
  pkm.form = data[0x1D] >> 3;
  pkm.evs = {
    hp: data[0x1E], atk: data[0x1F], def: data[0x20],
    spa: data[0x21], spd: data[0x22], spe: data[0x23],
  };
  pkm.friendship = data[0xCA];
  pkm.moves = [
    { id: readU16LE(data, 0x5A), pp: data[0x62], ppUps: data[0x66] },
    { id: readU16LE(data, 0x5C), pp: data[0x63], ppUps: data[0x67] },
    { id: readU16LE(data, 0x5E), pp: data[0x64], ppUps: data[0x68] },
    { id: readU16LE(data, 0x60), pp: data[0x65], ppUps: data[0x69] },
  ];
  const ivbits = readU32LE(data, 0x74);
  pkm.ivs = {
    hp: ivbits & 0x1F, atk: (ivbits >> 5) & 0x1F,
    def: (ivbits >> 10) & 0x1F, spe: (ivbits >> 15) & 0x1F,
    spa: (ivbits >> 20) & 0x1F, spd: (ivbits >> 25) & 0x1F,
  };
  pkm.isEgg = !!((ivbits >> 30) & 1);
  pkm.isShiny = ((pkm.otId ^ pkm.secretId ^ (pkm.pid >>> 16) ^ (pkm.pid & 0xFFFF)) < 16);
  pkm.nickname = readString(data, 0x40, 12);
  pkm.otName = readString(data, 0xB0, 12);
  pkm.ball = data[0xDC];
  pkm.metLevel = data[0xDD] & 0x7F;
  pkm.metLocation = readU16LE(data, 0xD2);
  pkm.language = data[0xE3];
  pkm.level = getLevelFromExp(pkm.exp);

  if (encrypted.length >= 260) {
    pkm.stats = {
      hp: readU16LE(data, 0xF2), atk: readU16LE(data, 0xF6),
      def: readU16LE(data, 0xF8), spe: readU16LE(data, 0xFA),
      spa: readU16LE(data, 0xFC), spd: readU16LE(data, 0xFE),
    };
    pkm.level = data[0xEC];
  }

  return pkm;
}

export function writePK67Fields(pkm: Pokemon): Uint8Array {
  const decrypted = decryptPK67(pkm.rawData);
  writeU16LE(decrypted, 0x08, pkm.species);
  writeU16LE(decrypted, 0x0A, pkm.heldItem);
  writeU32LE(decrypted, 0x10, pkm.exp);
  decrypted[0x1C] = pkm.nature;
  const fatefulGender = (decrypted[0x1D] & 1) | ((pkm.gender & 3) << 1) | ((pkm.form & 0x1F) << 3);
  decrypted[0x1D] = fatefulGender;
  decrypted[0x1E] = pkm.evs.hp;
  decrypted[0x1F] = pkm.evs.atk;
  decrypted[0x20] = pkm.evs.def;
  decrypted[0x21] = pkm.evs.spa;
  decrypted[0x22] = pkm.evs.spd;
  decrypted[0x23] = pkm.evs.spe;
  decrypted[0xCA] = pkm.friendship;
  for (let i = 0; i < 4; i++) {
    writeU16LE(decrypted, 0x5A + i * 2, pkm.moves[i].id);
    decrypted[0x62 + i] = pkm.moves[i].pp;
    decrypted[0x66 + i] = pkm.moves[i].ppUps;
  }
  let ivbits = (pkm.ivs.hp & 0x1F)
    | ((pkm.ivs.atk & 0x1F) << 5)
    | ((pkm.ivs.def & 0x1F) << 10)
    | ((pkm.ivs.spe & 0x1F) << 15)
    | ((pkm.ivs.spa & 0x1F) << 20)
    | ((pkm.ivs.spd & 0x1F) << 25);
  if (pkm.isEgg) ivbits |= (1 << 30);
  writeU32LE(decrypted, 0x74, ivbits >>> 0);
  writeString(decrypted, 0x40, pkm.nickname, 12);
  decrypted[0xDC] = pkm.ball;
  return encryptPK67(decrypted);
}

// -- Gen 8/9 PKM (344 bytes stored, 376 party) --

export function decryptPK89(data: Uint8Array): Uint8Array {
  const result = new Uint8Array(data);
  const ec = readU32LE(data, 0);

  let seed = ec;
  for (let i = 8; i < 344; i += 2) {
    seed = (lcrnNext(seed) >>> 0);
    const val = (seed >>> 16) & 0xFFFF;
    const orig = readU16LE(result, i);
    writeU16LE(result, i, orig ^ val);
  }

  const sv = ((ec >>> 13) & 31) % 24;
  const order = BLOCK_POSITION_INVERT[sv];
  const blockSize = 80;
  const unshuffled = new Uint8Array(result);
  for (let i = 0; i < 4; i++) {
    const src = 8 + order[i] * blockSize;
    const dst = 8 + i * blockSize;
    unshuffled.set(result.subarray(src, src + blockSize), dst);
  }

  if (data.length > 344) {
    let battleSeed = ec;
    for (let i = 344; i < data.length; i += 2) {
      battleSeed = (lcrnNext(battleSeed) >>> 0);
      const val = (battleSeed >>> 16) & 0xFFFF;
      const orig = readU16LE(unshuffled, i);
      writeU16LE(unshuffled, i, orig ^ val);
    }
  }

  return unshuffled;
}

export function encryptPK89(decrypted: Uint8Array): Uint8Array {
  const data = new Uint8Array(decrypted);
  const ec = readU32LE(data, 0);
  const checksum = computeChecksum16(data, 8, 336);
  writeU16LE(data, 6, checksum);

  if (data.length > 344) {
    let battleSeed = ec;
    for (let i = 344; i < data.length; i += 2) {
      battleSeed = (lcrnNext(battleSeed) >>> 0);
      const val = (battleSeed >>> 16) & 0xFFFF;
      const orig = readU16LE(data, i);
      writeU16LE(data, i, orig ^ val);
    }
  }

  const sv = ((ec >>> 13) & 31) % 24;
  const order = BLOCK_POSITION[sv];
  const blockSize = 80;
  const shuffled = new Uint8Array(data);
  for (let i = 0; i < 4; i++) {
    const src = 8 + order[i] * blockSize;
    const dst = 8 + i * blockSize;
    shuffled.set(data.subarray(src, src + blockSize), dst);
  }

  let seed = ec;
  for (let i = 8; i < 344; i += 2) {
    seed = (lcrnNext(seed) >>> 0);
    const val = (seed >>> 16) & 0xFFFF;
    const orig = readU16LE(shuffled, i);
    writeU16LE(shuffled, i, orig ^ val);
  }

  return shuffled;
}

export function readPK89(encrypted: Uint8Array, gen: number): Pokemon {
  const data = decryptPK89(encrypted);
  const pkm = createEmptyPokemon();
  pkm.rawData = new Uint8Array(encrypted);
  pkm.encryptionConstant = readU32LE(data, 0x00);
  pkm.species = readU16LE(data, 0x08);
  pkm.heldItem = readU16LE(data, 0x0A);
  pkm.otId = readU16LE(data, 0x0C);
  pkm.secretId = readU16LE(data, 0x0E);
  pkm.exp = readU32LE(data, 0x10);
  pkm.ability = readU16LE(data, 0x14);
  pkm.abilityNumber = data[0x16] & 7;
  pkm.pid = readU32LE(data, 0x1C);
  pkm.nature = data[0x20] as PokemonNature;
  pkm.mintedNature = data[0x21] !== data[0x20] ? data[0x21] as PokemonNature : undefined;
  pkm.gender = (data[0x22] & 3) as PokemonGender;
  pkm.form = readU16LE(data, 0x24);
  pkm.evs = {
    hp: data[0x26], atk: data[0x27], def: data[0x28],
    spa: data[0x29], spd: data[0x2A], spe: data[0x2B],
  };
  pkm.friendship = data[0xC8];
  pkm.moves = [
    { id: readU16LE(data, 0x72), pp: data[0x7A], ppUps: data[0x7E] },
    { id: readU16LE(data, 0x74), pp: data[0x7B], ppUps: data[0x7F] },
    { id: readU16LE(data, 0x76), pp: data[0x7C], ppUps: data[0x80] },
    { id: readU16LE(data, 0x78), pp: data[0x7D], ppUps: data[0x81] },
  ];
  const ivbits = readU32LE(data, 0x8C);
  pkm.ivs = {
    hp: ivbits & 0x1F, atk: (ivbits >> 5) & 0x1F,
    def: (ivbits >> 10) & 0x1F, spe: (ivbits >> 15) & 0x1F,
    spa: (ivbits >> 20) & 0x1F, spd: (ivbits >> 25) & 0x1F,
  };
  pkm.isEgg = !!((ivbits >> 30) & 1);
  pkm.isShiny = ((pkm.otId ^ pkm.secretId ^ (pkm.pid >>> 16) ^ (pkm.pid & 0xFFFF)) < 16);
  pkm.nickname = readString(data, 0x58, 12);
  pkm.otName = readString(data, 0xF8, 12);
  pkm.ball = data[0x124];
  pkm.metLevel = data[0x125] & 0x7F;
  pkm.metLocation = readU16LE(data, 0x126);
  pkm.language = data[0x135];
  pkm.level = getLevelFromExp(pkm.exp);

  if (gen >= 8) pkm.dynamaxLevel = data[0x144];
  if (gen >= 9) pkm.teraType = data[0x94];

  if (encrypted.length >= 376) {
    pkm.stats = {
      hp: readU16LE(data, 0x14A), atk: readU16LE(data, 0x14E),
      def: readU16LE(data, 0x150), spe: readU16LE(data, 0x152),
      spa: readU16LE(data, 0x154), spd: readU16LE(data, 0x156),
    };
    pkm.level = data[0x148];
  }

  return pkm;
}

export function writePK89Fields(pkm: Pokemon, gen: number): Uint8Array {
  const decrypted = decryptPK89(pkm.rawData);
  writeU16LE(decrypted, 0x08, pkm.species);
  writeU16LE(decrypted, 0x0A, pkm.heldItem);
  writeU32LE(decrypted, 0x10, pkm.exp);
  decrypted[0x20] = pkm.nature;
  if (pkm.mintedNature !== undefined) decrypted[0x21] = pkm.mintedNature;
  decrypted[0x22] = pkm.gender & 3;
  writeU16LE(decrypted, 0x24, pkm.form);
  decrypted[0x26] = pkm.evs.hp;
  decrypted[0x27] = pkm.evs.atk;
  decrypted[0x28] = pkm.evs.def;
  decrypted[0x29] = pkm.evs.spa;
  decrypted[0x2A] = pkm.evs.spd;
  decrypted[0x2B] = pkm.evs.spe;
  decrypted[0xC8] = pkm.friendship;
  for (let i = 0; i < 4; i++) {
    writeU16LE(decrypted, 0x72 + i * 2, pkm.moves[i].id);
    decrypted[0x7A + i] = pkm.moves[i].pp;
    decrypted[0x7E + i] = pkm.moves[i].ppUps;
  }
  let ivbits = (pkm.ivs.hp & 0x1F)
    | ((pkm.ivs.atk & 0x1F) << 5)
    | ((pkm.ivs.def & 0x1F) << 10)
    | ((pkm.ivs.spe & 0x1F) << 15)
    | ((pkm.ivs.spa & 0x1F) << 20)
    | ((pkm.ivs.spd & 0x1F) << 25);
  if (pkm.isEgg) ivbits |= (1 << 30);
  writeU32LE(decrypted, 0x8C, ivbits >>> 0);
  writeString(decrypted, 0x58, pkm.nickname, 12);
  decrypted[0x124] = pkm.ball;
  if (gen >= 8 && pkm.dynamaxLevel !== undefined) decrypted[0x144] = pkm.dynamaxLevel;
  if (gen >= 9 && pkm.teraType !== undefined) decrypted[0x94] = pkm.teraType;
  return encryptPK89(decrypted);
}

export function isPKMEmpty(data: Uint8Array, storedSize: number): boolean {
  for (let i = 0; i < Math.min(storedSize, data.length); i++) {
    if (data[i] !== 0) return false;
  }
  return true;
}
