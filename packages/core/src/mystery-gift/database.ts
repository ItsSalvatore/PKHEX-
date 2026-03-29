import { MysteryGift, MysteryGiftType, type MysteryGiftDatabase } from './mystery-gift.js';
import { GameGeneration } from '../structures/save-file.js';

export function createBuiltinMysteryGiftDatabase(): MysteryGiftDatabase {
  const gifts: MysteryGift[] = [
    // Gen 9 - Scarlet/Violet
    { id: 1001, title: "Flying Tera Type Pikachu", description: "Special Pikachu with Flying Tera Type from early purchase bonus", type: MysteryGiftType.Pokemon, species: 25, speciesName: "Pikachu", level: 25, isShiny: false, generation: GameGeneration.Gen9, gameVersions: [36, 37], region: "Global", isActive: true },
    { id: 1002, title: "Mew & Jirachi Gift", description: "Mew for having LGPE save, Jirachi for having BDSP save", type: MysteryGiftType.Pokemon, species: 151, speciesName: "Mew", level: 5, isShiny: false, generation: GameGeneration.Gen9, gameVersions: [36, 37], region: "Global", isActive: true },
    { id: 1003, title: "Shiny Lucario", description: "Serial Code Shiny Lucario distribution", type: MysteryGiftType.Pokemon, species: 448, speciesName: "Lucario", level: 75, isShiny: true, generation: GameGeneration.Gen9, gameVersions: [36, 37], region: "Global", isActive: false, serialCode: "LUC4R10" },
    { id: 1004, title: "Mythical Pokémon Diancie", description: "Mythical Diancie distribution via Mystery Gift", type: MysteryGiftType.Pokemon, species: 719, speciesName: "Diancie", level: 50, isShiny: false, generation: GameGeneration.Gen9, gameVersions: [36, 37], region: "Global", isActive: false },
    { id: 1005, title: "Ability Patch", description: "Free Ability Patch via serial code", type: MysteryGiftType.Item, itemId: 1606, itemName: "Ability Patch", itemCount: 1, generation: GameGeneration.Gen9, gameVersions: [36, 37], region: "Global", isActive: false, serialCode: "AB1L1TY" },
    { id: 1006, title: "Walking Wake / Iron Leaves", description: "Paradox Suicune and Virizion from Tera Raid events", type: MysteryGiftType.Pokemon, species: 1009, speciesName: "Walking Wake", level: 75, isShiny: false, generation: GameGeneration.Gen9, gameVersions: [36, 37], region: "Global", isActive: false },
    { id: 1007, title: "Shiny Charizard", description: "7-Star Tera Raid Shiny Charizard event", type: MysteryGiftType.Pokemon, species: 6, speciesName: "Charizard", level: 100, isShiny: true, generation: GameGeneration.Gen9, gameVersions: [36, 37], region: "Global", isActive: false },
    { id: 1008, title: "Mythical Darkrai", description: "Darkrai distribution via serial code", type: MysteryGiftType.Pokemon, species: 491, speciesName: "Darkrai", level: 50, isShiny: false, generation: GameGeneration.Gen9, gameVersions: [36, 37], region: "Global", isActive: false },
    { id: 1009, title: "Hisuian Zoroark", description: "Special Hisuian Zoroark via Mystery Gift", type: MysteryGiftType.Pokemon, species: 571, speciesName: "Zoroark", form: 1, level: 50, isShiny: false, generation: GameGeneration.Gen9, gameVersions: [36, 37], region: "Japan", isActive: false },
    { id: 1010, title: "Master Ball", description: "Mystery Gift Master Ball", type: MysteryGiftType.Item, itemId: 1, itemName: "Master Ball", itemCount: 1, generation: GameGeneration.Gen9, gameVersions: [36, 37], region: "Global", isActive: true },

    // Gen 8 - Sword/Shield
    { id: 801, title: "Gigantamax Meowth", description: "Early purchase Gigantamax Meowth", type: MysteryGiftType.Pokemon, species: 52, speciesName: "Meowth", level: 10, isShiny: false, generation: GameGeneration.Gen8, gameVersions: [31, 32], region: "Global", isActive: false },
    { id: 802, title: "Shiny Zeraora", description: "Max Raid Battle event Shiny Zeraora", type: MysteryGiftType.Pokemon, species: 807, speciesName: "Zeraora", level: 100, isShiny: true, generation: GameGeneration.Gen8, gameVersions: [31, 32], region: "Global", isActive: false },
    { id: 803, title: "Gigantamax Pikachu", description: "LGPE save bonus Gigantamax Pikachu", type: MysteryGiftType.Pokemon, species: 25, speciesName: "Pikachu", level: 10, isShiny: false, generation: GameGeneration.Gen8, gameVersions: [31, 32], region: "Global", isActive: false },
    { id: 804, title: "Kubfu", description: "Isle of Armor Kubfu", type: MysteryGiftType.Pokemon, species: 891, speciesName: "Kubfu", level: 10, isShiny: false, generation: GameGeneration.Gen8, gameVersions: [31, 32], region: "Global", isActive: false },
    { id: 805, title: "Zarude", description: "Mythical Pokémon Zarude distribution", type: MysteryGiftType.Pokemon, species: 893, speciesName: "Zarude", level: 60, isShiny: false, generation: GameGeneration.Gen8, gameVersions: [31, 32], region: "Global", isActive: false },
    { id: 806, title: "Shiny Toxtricity", description: "Serial code Shiny Toxtricity event", type: MysteryGiftType.Pokemon, species: 849, speciesName: "Toxtricity", level: 50, isShiny: true, generation: GameGeneration.Gen8, gameVersions: [31, 32], region: "Global", isActive: false },

    // Gen 7 - Sun/Moon / USUM
    { id: 701, title: "Magearna", description: "QR Code Magearna event", type: MysteryGiftType.Pokemon, species: 801, speciesName: "Magearna", level: 50, isShiny: false, generation: GameGeneration.Gen7, gameVersions: [25, 26, 27, 28], region: "Global", isActive: false },
    { id: 702, title: "Ash's Pikachu (Cap)", description: "Ash's Pikachu with various caps", type: MysteryGiftType.Pokemon, species: 25, speciesName: "Pikachu", form: 8, level: 25, isShiny: false, generation: GameGeneration.Gen7, gameVersions: [27, 28], region: "Global", isActive: false },
    { id: 703, title: "Shiny Tapu Koko", description: "Shiny Tapu Koko event distribution", type: MysteryGiftType.Pokemon, species: 785, speciesName: "Tapu Koko", level: 60, isShiny: true, generation: GameGeneration.Gen7, gameVersions: [25, 26], region: "Global", isActive: false },
    { id: 704, title: "Marshadow", description: "Mythical Marshadow distribution", type: MysteryGiftType.Pokemon, species: 802, speciesName: "Marshadow", level: 50, isShiny: false, generation: GameGeneration.Gen7, gameVersions: [25, 26], region: "Global", isActive: false },
    { id: 705, title: "Zeraora", description: "Mythical Zeraora event", type: MysteryGiftType.Pokemon, species: 807, speciesName: "Zeraora", level: 50, isShiny: false, generation: GameGeneration.Gen7, gameVersions: [27, 28], region: "Global", isActive: false },

    // Gen 6 - X/Y / ORAS
    { id: 601, title: "Fancy Pattern Vivillon", description: "100 Million GTS trades Vivillon", type: MysteryGiftType.Pokemon, species: 666, speciesName: "Vivillon", form: 18, level: 12, isShiny: false, generation: GameGeneration.Gen6, gameVersions: [21, 22, 23, 24], region: "Global", isActive: false },
    { id: 602, title: "Shiny Rayquaza", description: "Galileo Shiny Rayquaza event", type: MysteryGiftType.Pokemon, species: 384, speciesName: "Rayquaza", level: 70, isShiny: true, generation: GameGeneration.Gen6, gameVersions: [23, 24], region: "Global", isActive: false },
    { id: 603, title: "Hoopa", description: "Mythical Hoopa distribution", type: MysteryGiftType.Pokemon, species: 720, speciesName: "Hoopa", level: 50, isShiny: false, generation: GameGeneration.Gen6, gameVersions: [21, 22, 23, 24], region: "Global", isActive: false },
    { id: 604, title: "Volcanion", description: "Mythical Volcanion movie event", type: MysteryGiftType.Pokemon, species: 721, speciesName: "Volcanion", level: 70, isShiny: false, generation: GameGeneration.Gen6, gameVersions: [21, 22, 23, 24], region: "Global", isActive: false },

    // Gen 5 - BW / B2W2
    { id: 501, title: "Victini", description: "Liberty Pass Victini event", type: MysteryGiftType.Pokemon, species: 494, speciesName: "Victini", level: 15, isShiny: false, generation: GameGeneration.Gen5, gameVersions: [17, 18], region: "Global", isActive: false },
    { id: 502, title: "Meloetta", description: "Mythical Meloetta distribution", type: MysteryGiftType.Pokemon, species: 648, speciesName: "Meloetta", level: 50, isShiny: false, generation: GameGeneration.Gen5, gameVersions: [17, 18, 19, 20], region: "Global", isActive: false },
    { id: 503, title: "Genesect", description: "Mythical Genesect movie event", type: MysteryGiftType.Pokemon, species: 649, speciesName: "Genesect", level: 50, isShiny: false, generation: GameGeneration.Gen5, gameVersions: [17, 18, 19, 20], region: "Global", isActive: false },
    { id: 504, title: "Keldeo", description: "Mythical Keldeo distribution", type: MysteryGiftType.Pokemon, species: 647, speciesName: "Keldeo", level: 50, isShiny: false, generation: GameGeneration.Gen5, gameVersions: [17, 18, 19, 20], region: "Global", isActive: false },

    // Gen 4 - DPPt / HGSS
    { id: 401, title: "Member Card Darkrai", description: "Member Card event for Darkrai", type: MysteryGiftType.Pokemon, species: 491, speciesName: "Darkrai", level: 50, isShiny: false, generation: GameGeneration.Gen4, gameVersions: [12, 13, 14], region: "Global", isActive: false },
    { id: 402, title: "Azure Flute Arceus", description: "Azure Flute Arceus event", type: MysteryGiftType.Pokemon, species: 493, speciesName: "Arceus", level: 80, isShiny: false, generation: GameGeneration.Gen4, gameVersions: [12, 13], region: "Japan", isActive: false },
    { id: 403, title: "Shaymin", description: "Oak's Letter Shaymin event", type: MysteryGiftType.Pokemon, species: 492, speciesName: "Shaymin", level: 30, isShiny: false, generation: GameGeneration.Gen4, gameVersions: [14], region: "Global", isActive: false },
    { id: 404, title: "Manaphy Egg", description: "Pokémon Ranger Manaphy Egg", type: MysteryGiftType.Pokemon, species: 490, speciesName: "Manaphy", level: 1, isShiny: false, generation: GameGeneration.Gen4, gameVersions: [12, 13, 14], region: "Global", isActive: false },
  ];

  return {
    gifts,
    lastUpdated: new Date().toISOString(),
    totalCount: gifts.length,
  };
}

export interface MysteryGiftInsertionResult {
  success: boolean;
  message: string;
  slotIndex?: number;
}

export function canInsertGift(gift: MysteryGift, saveGeneration: GameGeneration): boolean {
  return gift.generation === saveGeneration;
}
