export const ITEM_NAMES: Record<number, string> = {
  0: '(None)', 1: 'Master Ball', 2: 'Ultra Ball', 3: 'Great Ball', 4: 'Poké Ball',
  5: 'Safari Ball', 6: 'Net Ball', 7: 'Dive Ball', 8: 'Nest Ball', 9: 'Repeat Ball',
  10: 'Timer Ball', 11: 'Luxury Ball', 12: 'Premier Ball', 13: 'Dusk Ball', 14: 'Heal Ball',
  15: 'Quick Ball', 16: 'Cherish Ball',
  17: 'Potion', 18: 'Antidote', 19: 'Burn Heal', 20: 'Ice Heal',
  21: 'Awakening', 22: 'Paralyze Heal', 23: 'Full Restore', 24: 'Max Potion',
  25: 'Hyper Potion', 26: 'Super Potion', 27: 'Full Heal', 28: 'Revive',
  29: 'Max Revive', 30: 'Fresh Water', 31: 'Soda Pop', 32: 'Lemonade',
  33: 'Moomoo Milk', 34: 'Energy Powder', 35: 'Energy Root', 36: 'Heal Powder',
  37: 'Revival Herb', 38: 'Ether', 39: 'Max Ether', 40: 'Elixir', 41: 'Max Elixir',
  42: 'Lava Cookie', 44: 'Old Gateau',
  45: 'Guard Spec.', 46: 'Dire Hit', 47: 'X Attack', 48: 'X Defense',
  49: 'X Speed', 50: 'X Accuracy', 51: 'X Sp. Atk', 52: 'X Sp. Def',
  55: 'HP Up', 56: 'Protein', 57: 'Iron', 58: 'Carbos', 59: 'Calcium',
  60: 'Rare Candy', 61: 'PP Up', 62: 'Zinc', 63: 'PP Max',
  64: 'Old Amber',
  80: 'Sun Stone', 81: 'Moon Stone', 82: 'Fire Stone', 83: 'Thunder Stone',
  84: 'Water Stone', 85: 'Leaf Stone', 86: 'Shiny Stone', 87: 'Dusk Stone', 88: 'Dawn Stone', 89: 'Oval Stone',
  100: 'Bright Powder', 103: 'Leftovers', 104: 'Shell Bell',
  112: 'Soothe Bell', 197: 'Choice Band', 203: 'Flame Orb', 204: 'Toxic Orb',
  208: 'King\'s Rock', 209: 'Silk Scarf', 210: 'Amulet Coin',
  220: 'Lucky Egg', 221: 'Focus Sash', 222: 'Choice Scarf', 223: 'Choice Specs',
  229: 'Destiny Knot',
  233: 'Metal Coat', 234: 'Dragon Scale', 235: 'Upgrade',
  252: 'Dubious Disc', 253: 'Protector', 254: 'Electirizer', 255: 'Magmarizer',
  256: 'Reaper Cloth',
  275: 'Ability Capsule',
  645: 'Ability Patch',
  1606: 'Ability Patch',
};

export function getItemName(id: number): string {
  return ITEM_NAMES[id] ?? `Item #${id}`;
}

export function searchItems(query: string): Array<{ id: number; name: string }> {
  const q = query.toLowerCase();
  return Object.entries(ITEM_NAMES)
    .filter(([_, name]) => name.toLowerCase().includes(q))
    .map(([id, name]) => ({ id: parseInt(id), name }))
    .slice(0, 50);
}

export const BALL_NAMES: Record<number, string> = {
  1: 'Master Ball', 2: 'Ultra Ball', 3: 'Great Ball', 4: 'Poké Ball',
  5: 'Safari Ball', 6: 'Net Ball', 7: 'Dive Ball', 8: 'Nest Ball',
  9: 'Repeat Ball', 10: 'Timer Ball', 11: 'Luxury Ball', 12: 'Premier Ball',
  13: 'Dusk Ball', 14: 'Heal Ball', 15: 'Quick Ball', 16: 'Cherish Ball',
  17: 'Fast Ball', 18: 'Level Ball', 19: 'Lure Ball', 20: 'Heavy Ball',
  21: 'Love Ball', 22: 'Friend Ball', 23: 'Moon Ball', 24: 'Sport Ball',
  25: 'Dream Ball', 26: 'Beast Ball',
};
