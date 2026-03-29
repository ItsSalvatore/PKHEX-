import { GameGeneration, GameVersion } from '../structures/save-file.js';

export enum CheatCodeType {
  ActionReplay = 'Action Replay',
  GameShark = 'GameShark',
  CodeBreaker = 'Code Breaker',
}

export enum CheatCategory {
  MasterCode = 'Master Code',
  WalkThroughWalls = 'Walk Through Walls',
  RareCandy = 'Rare Candy',
  MasterBall = 'Master Ball',
  InfiniteMoney = 'Infinite Money',
  CatchRate = '100% Catch Rate',
  ShinyPokemon = 'Shiny Pokémon',
  WildModifier = 'Wild Pokémon Modifier',
  ExpMultiplier = 'EXP Multiplier',
  AllItems = 'All Items',
  InfiniteHP = 'Infinite HP',
  InfinitePP = 'Infinite PP',
  MaxStats = 'Max Stats',
  Teleport = 'Teleport',
  Pokedex = 'Complete Pokédex',
  AllBadges = 'All Badges',
  EggHatch = 'Instant Egg Hatch',
  NoBattles = 'No Random Battles',
  CatchTrainer = "Catch Trainer's Pokémon",
  AllTMs = 'All TMs/HMs',
  EggTicket = 'Event Items',
  Misc = 'Miscellaneous',
}

export interface CheatCode {
  id: number;
  game: GameVersion;
  gameName: string;
  generation: GameGeneration;
  category: CheatCategory;
  name: string;
  description: string;
  codeType: CheatCodeType;
  codes: string[];
  masterCodeRequired: boolean;
  activationNote?: string;
  warning?: string;
}

export interface CheatCodeDatabase {
  codes: CheatCode[];
  lastUpdated: string;
  totalCount: number;
  source: string;
}

let nextId = 1;
function c(
  game: GameVersion, gameName: string, generation: GameGeneration,
  category: CheatCategory, name: string, description: string,
  codeType: CheatCodeType, codes: string[],
  masterCodeRequired: boolean, activationNote?: string, warning?: string,
): CheatCode {
  return { id: nextId++, game, gameName, generation, category, name, description, codeType, codes, masterCodeRequired, activationNote, warning };
}

export function createCheatCodeDatabase(): CheatCodeDatabase {
  const AR = CheatCodeType.ActionReplay;
  const GS = CheatCodeType.GameShark;
  const CB = CheatCodeType.CodeBreaker;
  const Cat = CheatCategory;

  const codes: CheatCode[] = [
    // ========== GEN 3: EMERALD ==========
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.MasterCode, 'Master Code (Required)', 'Must be entered before any other GameShark code', GS, ['D8BAE4D9 4864DCE5', 'A86CDBA5 19BA49B3'], false),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.WalkThroughWalls, 'Walk Through Walls', 'Move through any solid object', GS, ['7881A409 E2026E0C', '8E883EFF 92E9660D'], true),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.RareCandy, 'Rare Candy in PC', 'Get Rare Candy in your PC storage', GS, ['BFF956FA 2F9EC50D'], true),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.RareCandy, 'Rare Candy (Buy at Mart)', 'Buy Rare Candy at any Poké Mart for $0', CB, ['820257C4 0044'], false),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.MasterBall, 'Master Ball in PC', 'Get Master Ball in your PC storage', GS, ['128898B6 EDA43037'], true),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.MasterBall, 'Master Ball (Buy at Mart)', 'Buy Master Ball at any Poké Mart', CB, ['820257C4 0001'], false),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.InfiniteMoney, 'Infinite Money', 'Max out your money at ₽999999', GS, ['29C78059 96542194'], true),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.CatchRate, '100% Catch Rate', 'Catch any wild Pokémon with any ball', GS, ['87ACF659 707466DC', '8BB602F7 8CEB681A'], true),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.ShinyPokemon, 'Shiny Wild Pokémon', 'All wild Pokémon encounters are shiny', GS, ['F3A9A86D 4E2629B4', '18452A7D DDE55BCC'], true, undefined, 'May cause nickname issues with caught shinies'),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.WildModifier, 'Wild Pokémon: Mew', 'Encounter wild Mew (Grass)', GS, ['83007CF6 0097'], true),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.WildModifier, 'Wild Pokémon: Rayquaza', 'Encounter wild Rayquaza (Grass)', GS, ['83007CF6 0196'], true),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.WildModifier, 'Wild Pokémon: Deoxys', 'Encounter wild Deoxys (Grass)', GS, ['83007CF6 019A'], true),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.WildModifier, 'Wild Pokémon: Jirachi', 'Encounter wild Jirachi (Grass)', GS, ['83007CF6 0199'], true),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.WildModifier, 'Wild Pokémon: Celebi', 'Encounter wild Celebi (Grass)', GS, ['83007CF6 00FB'], true),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.InfiniteHP, 'No Damage in Battle', 'Your Pokémon takes no damage', GS, ['E12CFCE0 C4260271'], true),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.InfiniteHP, 'Infinite HP (1st Pokémon)', 'First party Pokémon has infinite HP in battle', GS, ['8038C644 63', '8038C645 63'], true),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.Teleport, 'Teleport: Lilycove City', 'Warp to Lilycove City Department Store', CB, ['82031DBC 0A0C'], false),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.NoBattles, 'No Random Encounters', 'Disable wild Pokémon encounters', GS, ['B505DB41 6E39EA4E'], true),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.EggTicket, 'Mystic Ticket', 'Obtain Mystic Ticket for Navel Rock (Ho-Oh & Lugia)', CB, ['820257BC 0172'], false),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.EggTicket, 'Aurora Ticket', 'Obtain Aurora Ticket for Birth Island (Deoxys)', CB, ['820257BC 0173'], false),
    c(GameVersion.Emerald, 'Emerald', GameGeneration.Gen3, Cat.EggTicket, 'Old Sea Map', 'Obtain Old Sea Map for Faraway Island (Mew)', CB, ['820257BC 0178'], false),

    // ========== GEN 3: FIRERED ==========
    c(GameVersion.FireRed, 'FireRed', GameGeneration.Gen3, Cat.MasterCode, 'Master Code', 'Required before other GS codes', GS, ['000014D1 000A', '1003DAE6 0007'], false),
    c(GameVersion.FireRed, 'FireRed', GameGeneration.Gen3, Cat.WalkThroughWalls, 'Walk Through Walls', 'Move through any solid object', GS, ['509197D3 542975F4', '78DA95DF 44018CB4'], true),
    c(GameVersion.FireRed, 'FireRed', GameGeneration.Gen3, Cat.RareCandy, 'Rare Candy (999x)', 'Get 999 Rare Candies in Bag', CB, ['820257C4 0044'], false),
    c(GameVersion.FireRed, 'FireRed', GameGeneration.Gen3, Cat.MasterBall, 'Master Ball (999x)', 'Get 999 Master Balls in Bag', CB, ['820257C4 0001'], false),
    c(GameVersion.FireRed, 'FireRed', GameGeneration.Gen3, Cat.InfiniteMoney, 'Infinite Money', 'Max money ₽999999', GS, ['29C78059 96542194'], true),
    c(GameVersion.FireRed, 'FireRed', GameGeneration.Gen3, Cat.CatchRate, '100% Catch Rate', 'Catch any wild Pokémon', GS, ['87ACF659 707466DC', '8BB602F7 8CEB681A'], true),
    c(GameVersion.FireRed, 'FireRed', GameGeneration.Gen3, Cat.ShinyPokemon, 'Shiny Wild Pokémon', 'Wild encounters are shiny', GS, ['39584B19 D80CC66A', 'CE71B3D3 1F6A85FB'], true),

    // ========== GEN 3: RUBY/SAPPHIRE ==========
    c(GameVersion.Ruby, 'Ruby', GameGeneration.Gen3, Cat.MasterCode, 'Master Code', 'Required for GameShark codes', GS, ['DE00AAFD 2EBD05D0', '530823D9 16558191'], false),
    c(GameVersion.Ruby, 'Ruby', GameGeneration.Gen3, Cat.WalkThroughWalls, 'Walk Through Walls', 'Move through any solid object', GS, ['7881A409 E2026E0C', '8E883EFF 92E9660D'], true),
    c(GameVersion.Ruby, 'Ruby', GameGeneration.Gen3, Cat.InfiniteMoney, 'Infinite Money', 'Max money ₽999999', GS, ['A57E2EDE A5AFF210'], true),
    c(GameVersion.Ruby, 'Ruby', GameGeneration.Gen3, Cat.MasterBall, 'Master Ball (Buy at Mart)', 'Buy Master Ball at any Mart', CB, ['820257C4 0001'], false),
    c(GameVersion.Ruby, 'Ruby', GameGeneration.Gen3, Cat.RareCandy, 'Rare Candy (Buy at Mart)', 'Buy Rare Candy at any Mart', CB, ['820257C4 0044'], false),

    // ========== GEN 4: DIAMOND ==========
    c(GameVersion.Diamond, 'Diamond', GameGeneration.Gen4, Cat.WalkThroughWalls, 'Walk Through Walls', 'Hold R to walk through walls, release to stop', AR, ['94000130 FCFF0000', 'D5000000 00000001', 'C0000000 00000026', 'D6000000 000233E0', 'D4000000 00000001', 'D2000000 00000000'], false, 'Hold R button'),
    c(GameVersion.Diamond, 'Diamond', GameGeneration.Gen4, Cat.RareCandy, '999x Rare Candy', 'Press L+R to get 999 Rare Candies', AR, ['94000130 FCFF0000', 'B21C4D28 00000000', 'B0000004 00000000', '00000F4C 03E70032', 'D2000000 00000000'], false, 'Press L+R'),
    c(GameVersion.Diamond, 'Diamond', GameGeneration.Gen4, Cat.MasterBall, '999x Master Ball', 'Press L+R to get 999 Master Balls', AR, ['94000130 FCFF0000', 'B21C4D28 00000000', 'B0000004 00000000', '00000F4C 03E70001', 'D2000000 00000000'], false, 'Press L+R'),
    c(GameVersion.Diamond, 'Diamond', GameGeneration.Gen4, Cat.InfiniteMoney, 'Max Money (₽999999)', 'Press L+R to max out money', AR, ['94000130 FCFF0000', 'B21C4D28 00000000', 'B0000004 00000000', '000000F8 000F423F', 'D2000000 00000000'], false, 'Press L+R'),
    c(GameVersion.Diamond, 'Diamond', GameGeneration.Gen4, Cat.CatchRate, '100% Catch Rate', 'Catch any wild Pokémon guaranteed', AR, ['9224A948 00002801', '1224A948 00004280', 'D2000000 00000000'], false),
    c(GameVersion.Diamond, 'Diamond', GameGeneration.Gen4, Cat.ShinyPokemon, 'Shiny Wild Pokémon', 'All wild encounters are shiny', AR, ['12068AC6 000046C0'], false, undefined, 'Save before using. Disable after catching.'),
    c(GameVersion.Diamond, 'Diamond', GameGeneration.Gen4, Cat.AllBadges, 'All 8 Badges', 'Obtain all gym badges instantly', AR, ['94000130 FCFF0000', 'B21C4D28 00000000', 'B0000004 00000000', '20000097 000000FF', 'D2000000 00000000'], false, 'Press L+R'),
    c(GameVersion.Diamond, 'Diamond', GameGeneration.Gen4, Cat.ExpMultiplier, 'Max EXP Gain', 'Gain massive experience from battles', AR, ['62106FC0 00000000', 'B2106FC0 00000000', '100749E6 0000270F', 'D2000000 00000000'], false),
    c(GameVersion.Diamond, 'Diamond', GameGeneration.Gen4, Cat.CatchTrainer, "Catch Trainer's Pokémon", "Throw a ball at trainer's Pokémon", AR, ['9223B5FA 00002101', '1223B5FA 00002100', 'D2000000 00000000'], false, undefined, 'May cause softlocks in some trainer battles'),

    // ========== GEN 4: PEARL ==========
    c(GameVersion.Pearl, 'Pearl', GameGeneration.Gen4, Cat.WalkThroughWalls, 'Walk Through Walls', 'Hold R to walk through walls', AR, ['94000130 FCFF0000', 'D5000000 00000001', 'C0000000 00000026', 'D6000000 000233E0', 'D4000000 00000001', 'D2000000 00000000'], false, 'Hold R button'),
    c(GameVersion.Pearl, 'Pearl', GameGeneration.Gen4, Cat.RareCandy, '999x Rare Candy', 'Press L+R', AR, ['94000130 FCFF0000', 'B21C4D28 00000000', 'B0000004 00000000', '00000F4C 03E70032', 'D2000000 00000000'], false, 'Press L+R'),
    c(GameVersion.Pearl, 'Pearl', GameGeneration.Gen4, Cat.InfiniteMoney, 'Max Money', 'Press L+R', AR, ['94000130 FCFF0000', 'B21C4D28 00000000', 'B0000004 00000000', '000000F8 000F423F', 'D2000000 00000000'], false, 'Press L+R'),
    c(GameVersion.Pearl, 'Pearl', GameGeneration.Gen4, Cat.CatchRate, '100% Catch Rate', 'Catch any wild Pokémon', AR, ['9224A948 00002801', '1224A948 00004280', 'D2000000 00000000'], false),

    // ========== GEN 4: PLATINUM ==========
    c(GameVersion.Platinum, 'Platinum', GameGeneration.Gen4, Cat.WalkThroughWalls, 'Walk Through Walls', 'Walk through any walls and barriers', AR, ['94000130 FCFF0000', '62101D40 00000000', 'B2101D40 00000000', '0000008C 00000001', 'D2000000 00000000'], false, 'Press R+B to activate, L+B to deactivate'),
    c(GameVersion.Platinum, 'Platinum', GameGeneration.Gen4, Cat.RareCandy, '900x Medicine Items', 'Press L+R for 900x Rare Candy and all medicine', AR, ['94000130 FCFF0000', '62101D40 00000000', 'B2101D40 00000000', 'D5000000 03840011', 'C0000000 00000025', 'D6000000 00000B74', 'D4000000 00000001', 'D2000000 00000000'], false, 'Press L+R'),
    c(GameVersion.Platinum, 'Platinum', GameGeneration.Gen4, Cat.MasterBall, '999x Master Ball', 'Get 999 Master Balls', AR, ['94000130 FCFF0000', '62101D40 00000000', 'B2101D40 00000000', '00000F4C 03E70001', 'D2000000 00000000'], false, 'Press L+R'),
    c(GameVersion.Platinum, 'Platinum', GameGeneration.Gen4, Cat.InfiniteMoney, 'Max Money (₽999999)', 'Max out your wallet', AR, ['94000130 FCFF0000', '62101D40 00000000', 'B2101D40 00000000', '00000090 000F423F', 'D2000000 00000000'], false, 'Press L+R'),
    c(GameVersion.Platinum, 'Platinum', GameGeneration.Gen4, Cat.CatchRate, '100% Catch Rate', 'Every Poké Ball is guaranteed to catch', AR, ['9224A948 00002801', '1224A948 00004280', 'D2000000 00000000'], false),
    c(GameVersion.Platinum, 'Platinum', GameGeneration.Gen4, Cat.ShinyPokemon, 'Shiny Pokémon Encounters', 'All wild encounters are shiny', AR, ['12068AC6 000046C0'], false, undefined, 'Disable immediately after catching'),
    c(GameVersion.Platinum, 'Platinum', GameGeneration.Gen4, Cat.AllBadges, 'All 8 Badges', 'Get all gym badges', AR, ['94000130 FCFF0000', '62101D40 00000000', 'B2101D40 00000000', '2000008E 000000FF', 'D2000000 00000000'], false, 'Press L+R'),
    c(GameVersion.Platinum, 'Platinum', GameGeneration.Gen4, Cat.EggHatch, 'Instant Egg Hatch', 'Eggs hatch in 1 step', AR, ['92071D5A 00002001', '12071D5A 00002000', 'D2000000 00000000'], false),
    c(GameVersion.Platinum, 'Platinum', GameGeneration.Gen4, Cat.AllTMs, 'All TMs & HMs (999x)', 'Get all TMs and HMs in bag', AR, ['94000130 FCFF0000', '62101D40 00000000', 'B2101D40 00000000', 'D5000000 03E30148', 'C0000000 00000063', 'D6000000 00000D64', 'D4000000 00000001', 'D2000000 00000000'], false, 'Press L+R'),
    c(GameVersion.Platinum, 'Platinum', GameGeneration.Gen4, Cat.CatchTrainer, "Catch Trainer's Pokémon", 'Throw balls at trainers\' Pokémon', AR, ['9223B5FA 00002101', '1223B5FA 00002100', 'D2000000 00000000'], false),
    c(GameVersion.Platinum, 'Platinum', GameGeneration.Gen4, Cat.NoBattles, 'No Random Encounters', 'Disable wild battles entirely', AR, ['12060C20 00000200'], false),

    // ========== GEN 4: HEARTGOLD ==========
    c(GameVersion.HeartGold, 'HeartGold', GameGeneration.Gen4, Cat.WalkThroughWalls, 'Walk Through Walls', 'Walk through any walls (hold R)', AR, ['12060C12 00000200'], false, 'Hold R'),
    c(GameVersion.HeartGold, 'HeartGold', GameGeneration.Gen4, Cat.RareCandy, '999x Rare Candy', 'Press L+R for 999 Rare Candies', AR, ['94000130 FCFF0000', '62111880 00000000', 'B2111880 00000000', '00000F4C 03E70032', 'D2000000 00000000'], false, 'Press L+R'),
    c(GameVersion.HeartGold, 'HeartGold', GameGeneration.Gen4, Cat.InfiniteMoney, 'Max Money', 'Max out money to ₽999999', AR, ['94000130 FCFF0000', '62111880 00000000', 'B2111880 00000000', '00000088 000F423F', 'D2000000 00000000'], false, 'Press L+R'),
    c(GameVersion.HeartGold, 'HeartGold', GameGeneration.Gen4, Cat.CatchRate, '100% Catch Rate', 'Guaranteed catch with any ball', AR, ['9224A948 00002801', '1224A948 00004280', 'D2000000 00000000'], false),
    c(GameVersion.HeartGold, 'HeartGold', GameGeneration.Gen4, Cat.ShinyPokemon, 'Shiny Wild Pokémon', 'All wild encounters are shiny', AR, ['12068AC6 000046C0'], false),

    // ========== GEN 5: BLACK ==========
    c(GameVersion.Black, 'Black', GameGeneration.Gen5, Cat.WalkThroughWalls, 'Walk Through Walls', 'Walk through walls and obstacles', AR, ['521A04D4 D1032800', '121A04D4 00002000', 'D2000000 00000000'], false),
    c(GameVersion.Black, 'Black', GameGeneration.Gen5, Cat.RareCandy, '900x Rare Candy', 'Press SELECT to fill bag with Rare Candy', AR, ['94000130 FFFB0000', '0223CDAC 03840032', 'D2000000 00000000'], false, 'Press SELECT'),
    c(GameVersion.Black, 'Black', GameGeneration.Gen5, Cat.MasterBall, '900x Master Ball', 'Press SELECT for Master Balls', AR, ['94000130 FFFB0000', '0223CDAC 03840001', 'D2000000 00000000'], false, 'Press SELECT'),
    c(GameVersion.Black, 'Black', GameGeneration.Gen5, Cat.InfiniteMoney, 'Max Money (₽9999999)', 'Press SELECT for max money', AR, ['94000130 FFFB0000', '0223CDCC 0098967F', 'D2000000 00000000'], false, 'Press SELECT'),
    c(GameVersion.Black, 'Black', GameGeneration.Gen5, Cat.CatchRate, '100% Catch Rate', 'Catch any Pokémon guaranteed', AR, ['521CBDB4 7820D203', '121CBDB4 00004280', 'D2000000 00000000'], false),
    c(GameVersion.Black, 'Black', GameGeneration.Gen5, Cat.ShinyPokemon, 'Shiny Wild Pokémon', 'All wild encounters are shiny', AR, ['521A96D8 1C221C33', '021A96D8 2C001C22', 'D2000000 00000000'], false),
    c(GameVersion.Black, 'Black', GameGeneration.Gen5, Cat.ExpMultiplier, 'Fast EXP Gain', 'Earn boosted experience from battles', AR, ['5219811C 4C08210F', '0219811C 210F4C08', 'D2000000 00000000'], false),

    // ========== GEN 5: WHITE ==========
    c(GameVersion.White, 'White', GameGeneration.Gen5, Cat.InfiniteMoney, 'Max Money (₽9999999)', 'Press SELECT for max money', AR, ['94000130 FFFB0000', '0223CDCC 0098967F', 'D2000000 00000000'], false, 'Press SELECT'),
    c(GameVersion.White, 'White', GameGeneration.Gen5, Cat.RareCandy, '900x Rare Candy', 'Press SELECT', AR, ['94000130 FFFB0000', '0223CDAC 03840032', 'D2000000 00000000'], false, 'Press SELECT'),
    c(GameVersion.White, 'White', GameGeneration.Gen5, Cat.MasterBall, '900x Master Ball', 'Press SELECT', AR, ['94000130 FFFB0000', '0223CDAC 03840001', 'D2000000 00000000'], false, 'Press SELECT'),
    c(GameVersion.White, 'White', GameGeneration.Gen5, Cat.WalkThroughWalls, 'Walk Through Walls', 'Pass through any solid object', AR, ['521A04D4 D1032800', '121A04D4 00002000', 'D2000000 00000000'], false),

    // ========== GEN 5: BLACK 2 ==========
    c(GameVersion.Black2, 'Black 2', GameGeneration.Gen5, Cat.InfiniteMoney, 'Max Money', 'Press SELECT for max money', AR, ['94000130 FFFB0000', '0223CC2C 0098967F', 'D2000000 00000000'], false, 'Press SELECT'),
    c(GameVersion.Black2, 'Black 2', GameGeneration.Gen5, Cat.RareCandy, '900x Rare Candy', 'Press SELECT', AR, ['94000130 FFFB0000', '0223CC0C 03840032', 'D2000000 00000000'], false, 'Press SELECT'),
    c(GameVersion.Black2, 'Black 2', GameGeneration.Gen5, Cat.WalkThroughWalls, 'Walk Through Walls', 'Walk through walls', AR, ['521AFAA0 D1032800', '121AFAA0 00002000', 'D2000000 00000000'], false),
    c(GameVersion.Black2, 'Black 2', GameGeneration.Gen5, Cat.ShinyPokemon, 'Shiny Wild Pokémon', 'All wild encounters are shiny', AR, ['521A8CDC 1C221C33', '021A8CDC 2C001C22', 'D2000000 00000000'], false),
    c(GameVersion.Black2, 'Black 2', GameGeneration.Gen5, Cat.CatchRate, '100% Catch Rate', 'Catch anything with any ball', AR, ['521CBDB4 7820D203', '121CBDB4 00004280', 'D2000000 00000000'], false),

    // ========== GEN 6: X ==========
    c(GameVersion.X, 'X', GameGeneration.Gen6, Cat.InfiniteMoney, 'Max Money', 'Set money to max', AR, ['Pokemon X Money: Edit offset in save file using PKHeX'], false, 'Use PKHeX save editor for Gen 6+'),
    c(GameVersion.X, 'X', GameGeneration.Gen6, Cat.ShinyPokemon, 'Shiny Charm Effect', 'Triple shiny encounter odds', AR, ['Use PKHeX to add Shiny Charm to inventory'], false, 'Use PKHeX editor'),

    // ========== GEN 7: SUN ==========
    c(GameVersion.Sun, 'Sun', GameGeneration.Gen7, Cat.InfiniteMoney, 'Max Money', 'Set money to max ₽9999999', AR, ['Edit trainer block money field via save editor'], false, 'Use PKHeX save editor'),
    c(GameVersion.Sun, 'Sun', GameGeneration.Gen7, Cat.RareCandy, 'Max Rare Candy', 'Set Rare Candy quantity to 999', AR, ['Edit item pouch via save editor'], false, 'Use PKHeX save editor'),

    // ========== GEN 8: SWORD ==========
    c(GameVersion.Sword, 'Sword', GameGeneration.Gen8, Cat.InfiniteMoney, 'Max Money', 'Set money to max', AR, ['Edit save trainer block money via PKHeX'], false, 'Use PKHeX save editor'),
    c(GameVersion.Sword, 'Sword', GameGeneration.Gen8, Cat.RareCandy, 'Max Rare Candy + EXP Candy', 'Give 999x Rare Candy and all EXP Candies', AR, ['Edit item pouch via save editor'], false, 'Use PKHeX save editor'),
    c(GameVersion.Sword, 'Sword', GameGeneration.Gen8, Cat.AllItems, 'All Items', 'Add all key items and battle items', AR, ['Edit save file inventory via PKHeX'], false, 'Use PKHeX save editor'),

    // ========== GEN 9: SCARLET ==========
    c(GameVersion.Scarlet, 'Scarlet', GameGeneration.Gen9, Cat.InfiniteMoney, 'Max Money', 'Set money to ₽9999999', AR, ['Edit trainer block in save file'], false, 'Use PKHeX save editor'),
    c(GameVersion.Scarlet, 'Scarlet', GameGeneration.Gen9, Cat.RareCandy, 'Max Rare Candy + EXP Candy', 'Give max Rare Candy and EXP Candies', AR, ['Edit item pouch in save file'], false, 'Use PKHeX save editor'),
    c(GameVersion.Scarlet, 'Scarlet', GameGeneration.Gen9, Cat.ShinyPokemon, 'Shiny Charm', 'Add Shiny Charm to key items', AR, ['Add item ID via save editor'], false, 'Use PKHeX save editor'),
  ];

  return { codes, lastUpdated: new Date().toISOString(), totalCount: codes.length, source: 'PokemonCoders, AxeeTech, Gaming Gorilla, Pro Game Guides' };
}

export function searchCheatCodes(db: CheatCodeDatabase, query: string): CheatCode[] {
  const q = query.toLowerCase();
  return db.codes.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.gameName.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q)
  );
}

export function filterByGame(db: CheatCodeDatabase, game: GameVersion): CheatCode[] {
  return db.codes.filter(c => c.game === game);
}

export function filterByGeneration(db: CheatCodeDatabase, gen: GameGeneration): CheatCode[] {
  return db.codes.filter(c => c.generation === gen);
}

export function filterByCategory(db: CheatCodeDatabase, cat: CheatCategory): CheatCode[] {
  return db.codes.filter(c => c.category === cat);
}

export function getAvailableGames(db: CheatCodeDatabase): Array<{ version: GameVersion; name: string }> {
  const seen = new Map<GameVersion, string>();
  for (const c of db.codes) {
    if (!seen.has(c.game)) seen.set(c.game, c.gameName);
  }
  return Array.from(seen.entries()).map(([version, name]) => ({ version, name }));
}

export function getAvailableCategories(db: CheatCodeDatabase): CheatCategory[] {
  return [...new Set(db.codes.map(c => c.category))];
}
