export function decryptArray(data: Uint8Array, seed: number): Uint8Array {
  const result = new Uint8Array(data.length);
  let s = seed;
  for (let i = 0; i < data.length; i += 2) {
    s = lcrnNext(s);
    const val = (s >>> 16) & 0xFFFF;
    result[i] = data[i] ^ (val & 0xFF);
    if (i + 1 < data.length) {
      result[i + 1] = data[i + 1] ^ ((val >> 8) & 0xFF);
    }
  }
  return result;
}

export function encryptArray(data: Uint8Array, seed: number): Uint8Array {
  return decryptArray(data, seed);
}

export function lcrnNext(seed: number): number {
  return ((seed * 0x41C64E6D + 0x6073) & 0xFFFFFFFF) >>> 0;
}

export function lcrnPrev(seed: number): number {
  return ((seed * 0xEEB9EB65 + 0x0A3561A1) & 0xFFFFFFFF) >>> 0;
}

export function shuffleArray(data: Uint8Array, encryptionConstant: number, blockSize: number): Uint8Array {
  const sv = ((encryptionConstant >>> 13) & 31) % 24;
  const blockOrder = BLOCK_POSITION[sv];
  const result = new Uint8Array(data.length);

  const headerSize = 8;
  result.set(data.subarray(0, headerSize));

  for (let i = 0; i < 4; i++) {
    const srcOffset = headerSize + blockOrder[i] * blockSize;
    const dstOffset = headerSize + i * blockSize;
    result.set(data.subarray(srcOffset, srcOffset + blockSize), dstOffset);
  }

  const tail = headerSize + 4 * blockSize;
  if (tail < data.length) {
    result.set(data.subarray(tail), tail);
  }

  return result;
}

const BLOCK_POSITION: number[][] = [
  [0, 1, 2, 3], [0, 1, 3, 2], [0, 2, 1, 3], [0, 3, 1, 2], [0, 2, 3, 1], [0, 3, 2, 1],
  [1, 0, 2, 3], [1, 0, 3, 2], [2, 0, 1, 3], [3, 0, 1, 2], [2, 0, 3, 1], [3, 0, 2, 1],
  [1, 2, 0, 3], [1, 3, 0, 2], [2, 1, 0, 3], [3, 1, 0, 2], [2, 3, 0, 1], [3, 2, 0, 1],
  [1, 2, 3, 0], [1, 3, 2, 0], [2, 1, 3, 0], [3, 1, 2, 0], [2, 3, 1, 0], [3, 2, 1, 0],
];

export function computeChecksum16(data: Uint8Array, start: number, length: number): number {
  let sum = 0;
  for (let i = 0; i < length; i += 2) {
    sum += data[start + i] | (data[start + i + 1] << 8);
  }
  return sum & 0xFFFF;
}
