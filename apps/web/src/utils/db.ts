import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'pkhex-db';
const DB_VERSION = 1;

interface PKHeXDB {
  saves: {
    key: string;
    value: {
      id: string;
      name: string;
      data: Uint8Array;
      lastModified: string;
      generation: number;
      gameVersion: number;
      trainerName: string;
    };
  };
  settings: {
    key: string;
    value: unknown;
  };
  mysteryGifts: {
    key: number;
    value: {
      id: number;
      data: Uint8Array;
      title: string;
      generation: number;
      dateAdded: string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<PKHeXDB>> | null = null;

function getDB(): Promise<IDBPDatabase<PKHeXDB>> {
  if (!dbPromise) {
    dbPromise = openDB<PKHeXDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('saves')) {
          db.createObjectStore('saves', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
        if (!db.objectStoreNames.contains('mysteryGifts')) {
          db.createObjectStore('mysteryGifts', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveSaveFile(
  id: string, name: string, data: Uint8Array,
  generation: number, gameVersion: number, trainerName: string,
): Promise<void> {
  const db = await getDB();
  await db.put('saves', {
    id, name, data,
    lastModified: new Date().toISOString(),
    generation, gameVersion, trainerName,
  });
}

export async function getSaveFile(id: string) {
  const db = await getDB();
  return db.get('saves', id);
}

export async function listSaveFiles() {
  const db = await getDB();
  return db.getAll('saves');
}

export async function deleteSaveFile(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('saves', id);
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const db = await getDB();
  await db.put('settings', value, key);
}

export async function getSetting<T>(key: string): Promise<T | undefined> {
  const db = await getDB();
  return db.get('settings', key) as Promise<T | undefined>;
}

export async function saveMysteryGift(
  id: number, data: Uint8Array, title: string, generation: number,
): Promise<void> {
  const db = await getDB();
  await db.put('mysteryGifts', {
    id, data, title, generation,
    dateAdded: new Date().toISOString(),
  });
}

export async function listMysteryGifts() {
  const db = await getDB();
  return db.getAll('mysteryGifts');
}

export async function deleteMysteryGift(id: number): Promise<void> {
  const db = await getDB();
  await db.delete('mysteryGifts', id);
}
