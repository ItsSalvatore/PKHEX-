export interface InventoryItem {
  id: number;
  count: number;
  isNew?: boolean;
  isFavorite?: boolean;
}

export enum InventoryType {
  Items = 'items',
  Medicine = 'medicine',
  TMs = 'tms',
  Berries = 'berries',
  KeyItems = 'keyItems',
  Balls = 'balls',
  BattleItems = 'battleItems',
  Treasures = 'treasures',
  Ingredients = 'ingredients',
}

export interface InventoryPouch {
  type: InventoryType;
  label: string;
  items: InventoryItem[];
  maxCount: number;
  maxSlots: number;
}

export function createInventoryPouch(
  type: InventoryType,
  label: string,
  maxCount: number,
  maxSlots: number,
): InventoryPouch {
  return { type, label, items: [], maxCount, maxSlots };
}

export function getTotalItemCount(pouches: InventoryPouch[]): number {
  return pouches.reduce((sum, p) => sum + p.items.reduce((s, i) => s + i.count, 0), 0);
}
