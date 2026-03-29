/**
 * Action Replay lines from PokemonCoders (Platinum, Black, White).
 * Hex is stored compact; cheat-codes.ts splits into XXXXXXXX YYYYYYYY lines.
 * https://www.pokemoncoders.com/pokemon-platinum-cheats/
 * https://www.pokemoncoders.com/pokemon-black-cheats/
 * https://www.pokemoncoders.com/pokemon-white-cheats/
 */
export type NdsPokemonCodersGame = 'Platinum' | 'Black' | 'White';

export interface NdsPokemonCodersRow {
  game: NdsPokemonCodersGame;
  generation: 4 | 5;
  /** Must match CheatCategory string value */
  category: string;
  name: string;
  /** Short line for UI; optional when name is enough */
  description?: string;
  /** Hex only; spaces allowed (stripped when formatting) */
  hex: string;
  activationNote?: string;
  warning?: string;
}

function h(s: string): string {
  return s.replace(/\s+/g, '');
}

export const POKEMONCODERS_GEN45: NdsPokemonCodersRow[] = [
  // ——— Platinum ———
  {
    game: 'Platinum',
    generation: 4,
    category: 'Rare Candy',
    name: '900× medicine + Rare Candy',
    description: 'Fills medicine pouch; includes Rare Candy.',
    hex: h(`94000130 FCBF0000 62101D40 00000000 B2101D40 00000000 D5000000 03840011
      C0000000 00000025 D6000000 00000B60 D4000000 00000001 D2000000 00000000`),
    activationNote: 'Press L + R, then check your bag.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Rare Candy',
    name: 'Rare Candy stack (bag)',
    description: 'Adds Rare Candies to medicine pocket; may need several tries.',
    hex: h(`94000130 FCFF0000 B2101D40 00000000 E0000B60 000000A0 03E30032 00000000
      00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
      00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
      00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
      00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
      D2000000 00000000`),
    activationNote: 'Press UP + L + R repeatedly; check medicine.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Walk Through Walls',
    name: 'Walk through walls (R+B / L+B)',
    description: 'PokemonCoders layout for Platinum.',
    hex: h(`94000130 FCFD0200 12060C20 00000200 D2000000 00000000 94000130 FCFD0100
      12060C20 00001C20 D2000000 00000000`),
    activationNote: 'R + B on, L + B off.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'EXP Multiplier',
    name: 'High EXP after battle',
    description: 'Strong EXP boost; remove Exp. Share from party if it misbehaves.',
    hex: h(`92241E7E 0000319C 02241E80 60080180 02241E84 309C1C28 D0000000 00000000`),
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'EXP Multiplier',
    name: 'Max EXP (no off switch)',
    description: 'Levels very fast until you disable the cheat.',
    hex: h(`52240FB4 DBEF42AE 62101D40 00000000 B2101D40 00000000 00044914 0001FFFF
      D2000000 00000000`),
    warning: 'Disable after leveling; can overshoot evolutions.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Infinite Money',
    name: 'Max money',
    description: 'Sets wallet to ₽999999.',
    hex: h(`94000130 FCFF0000 62101D40 00000000 B2101D40 00000000 00000090 000F423F
      D2000000 00000000`),
    activationNote: 'Press L + R.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Shiny Pokémon',
    name: 'Shiny wild (long code)',
    description: 'All wild encounters shiny.',
    hex: h(`621BFAF0 00000000 02073E44 47004800 02073E48 02000001 E2000000 0000003C
      6800480D 490B6840 88011808 9C0D8842 40510C24 20074061 04244041 940D430C
      21001C28 F074AA0D 4801FE1B 46C04700 02073E4D 000000E4 021BFAF0 00000000
      D2000000 00000000`),
    warning: 'Turn off after catching; backup save first.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Master Ball',
    name: 'Master Balls (bag)',
    description: 'Adds Master Balls to ball pocket.',
    hex: h(`94000130 FCFF0000 B2101D40 00000000 E0000D00 0000003C 03E70001 00000000
      00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
      00000000 00000000 00000000 00000000 D2000000 00000000`),
    activationNote: 'Press L + R.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Miscellaneous',
    name: 'Ghost mode (walk + speed)',
    description: 'Hover, 2× speed, pass through walls; hard to turn off.',
    hex: h(`E2000400 00000018 6837AE06 D1012F03 60372709 D0022B02 085F0056 1C164770
      02000418 47701C1F 52000400 6837AE06 12060C20 00000200 02065988 FD3AF79A
      62101D40 00000000 B2101D40 00000000 10023986 00000F0F D2000000 00000000`),
    warning: 'Save, disable cheat, restart game to fully clear.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Max Stats',
    name: 'Max IV (all stats)',
    description: 'Sets IVs high for party/battle context.',
    hex: h(`12073F50 0000201F 12073F66 0000201F 12073F7C 0000201F 12073F92 0000201F
      12073FA8 0000201F 12073FBE 0000201F`),
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Miscellaneous',
    name: 'Max happiness (summary screen)',
    description: 'Use on Pokémon summary.',
    hex: h(`920748F0 0000E119 120748F2 00009800 120748F4 00008880 1207491A 00006972
      0207491C 400B1C23 02074920 21004002 02074924 40592000 12074928 00004050
      94000130 FFF30000 120748F2 0000480B 120748F4 00004700 1207491A 00004A02
      0207491C 00004710 02074920 02000101 02074924 02000129 12074928 0000BC10
      D2000000 00000000 62000100 402E1C26 E2000100 00000010 732820FF 88809800
      47284D00 020748F7 E2000128 0000001C 6972B410 400B1C23 21004002 40592000
      4C014050 46C04720 02074929 00000000 D2000000 00000000`),
    activationNote: 'Hold Start + Select while opening Summary.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Miscellaneous',
    name: 'Pokérus spread',
    description: 'Hold A at end of battle to spread Pokérus.',
    hex: h(`120776C2 00004288 94000130 FFFE0000 120776C2 00004280 D2000000 00000000`),
    activationNote: 'Hold A after battle; disable when done.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: '100% Catch Rate',
    name: '100% catch (alt)',
    description: 'Any ball catches wild Pokémon.',
    hex: h(`9224A948 00002801 1224A948 00004280 D2000000 00000000`),
  },
  {
    game: 'Platinum',
    generation: 4,
    category: "Catch Trainer's Pokémon",
    name: "Catch trainer's Pokémon",
    description: 'Battle ends when you catch one enemy Pokémon.',
    hex: h(`92249CDE 00002101 12249CDE 00002100 D2000000 00000000`),
    warning: 'Can softlock some fights.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Complete Pokédex',
    name: 'Sinnoh Dex seen & caught',
    description: 'For pre-National Dex; read PokemonCoders warning about National.',
    hex: h(`94000130 FFFB0000 62101D40 00000000 B2101D40 00000000 00001654 00010101
      00001658 FFFCC750 1000165C 0000FDFE 0000137C 10001FFF E00013BC 000000A8
      32001FFF 70000000 00000000 00000000 08050000 00000000 00000000 00000000
      00032000 00000000 02000000 00000000 08000000 90000000 00800000 20000000
      00000080 7FFFFFFF FFFFFFFC FFFCFFFF 7E7FF9E7 FF9C7EF7 FFFFFFFF FFFFFEFF
      F8E3E6FF FFFFFFFF FEFFFFF7 FF3CFFFF 081FFFFF DFFFFFFC FFE7FFFF 39FFDFFF
      00000090 A2AC83FB E4E4FEFE 03020100 07060504 0B0A0908 0F0E0D0C 13121110
      17161514 1B1A1918 C0000000 0000000E 00001340 FFFFFFFF 00001380 FFFFFFFF
      DC000000 00000004 D2000000 00000000 94000130 FFFB0000 62101D40 00000000
      B2101D40 00000000 C0000000 000001EC 20001465 0000003F DC000000 00000001
      D2000000 00000000`),
    activationNote: 'Press Select.',
    warning: 'Avoid if you already have National Dex; may wipe National entries.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'All Badges',
    name: 'All 8 badges',
    description: 'Unlocks every gym badge.',
    hex: h(`94000130 FCFF0000 B2101D40 00000000 20000096 000000FF D2000000 00000000`),
    activationNote: 'Press L + R.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'All Items',
    name: 'All standard items (995)',
    description: 'Large bag write; use MelonDS save fix if needed.',
    hex: h(`94000130 FCFF0000 B2101D40 00000000 E0000644 00000294 03E30044 03E30045
      03E30046 03E30047 03E30048 03E30049 03E3004A 03E3004B 03E3004C 03E3004D
      03E3004E 03E3004F 03E30050 03E30051 03E30052 03E30053 03E30054 03E30055
      03E30056 03E30057 03E30058 03E30059 03E3005A 03E3005B 03E3005C 03E3005D
      03E3005E 03E3005F 03E30060 03E30061 03E30062 03E30063 03E30064 03E30065
      03E30066 03E30067 03E30068 03E30069 03E3006A 03E3006B 03E3006C 03E3006D
      03E3006E 03E3006F 03E30070 03E30087 03E30088 03E300D5 03E300D6 03E300D7
      03E300D8 03E300D9 03E300DA 03E300DB 03E300DC 03E300DD 03E300DE 03E300DF
      03E300E0 03E300E1 03E300E2 03E300E3 03E300E4 03E300E5 03E300E6 03E300E7
      03E300E8 03E300E9 03E300EA 03E300EB 03E300EC 03E300ED 03E300EE 03E300EF
      03E300F0 03E300F1 03E300F2 03E300F3 03E300F4 03E300F5 03E300F6 03E300F7
      03E300F8 03E300F9 03E300FA 03E300FB 03E300FC 03E300FD 03E300FE 03E300FF
      03E30100 03E30101 03E30102 03E30103 03E30104 03E30105 03E30106 03E30107
      03E30108 03E30109 03E3010A 03E3010B 03E3010C 03E3010D 03E3010E 03E3010F
      03E30110 03E30111 03E30112 03E30113 03E30114 03E30115 03E30116 03E30117
      03E30118 03E30119 03E3011A 03E3011B 03E3011C 03E3011D 03E3011E 03E3011F
      03E30120 03E30121 03E30122 03E30123 03E30124 03E30125 03E30126 03E30127
      03E30128 03E30129 03E3012A 03E3012B 03E3012C 03E3012D 03E3012E 03E3012F
      03E30130 03E30131 03E30132 03E30133 03E30134 03E30135 03E30136 03E30137
      03E30138 03E30139 03E3013A 03E3013B 03E3013C 03E3013D 03E3013E 03E3013F
      03E30140 03E30141 03E30142 03E30143 03E30144 03E30145 03E30146 03E30147
      00000000 00000000 00000000 00000000 D2000000 00000000`),
    activationNote: 'Press L + R.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Master Ball',
    name: 'All Poké Balls (995)',
    description: 'Every ball type including Master Ball.',
    hex: h(`94000130 FCFF0000 B2101D40 00000000 E0000D00 0000003C 03E30001 03E30002
      03E30003 03E30004 03E30006 03E30007 03E30008 03E30009 03E3000A 03E3000B
      03E3000C 03E3000D 03E3000E 03E3000F 03E30010 00000000 D2000000 00000000`),
    activationNote: 'Press L + R.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Rare Candy',
    name: 'Healing items + Rare Candy (Select+Up)',
    description: '998 each healing + candy.',
    hex: h(`94000130 FFBB0000 62101D40 00000000 B2101D40 00000000 D5000000 03E60011
      C0000000 00000025 D6000000 00000B60 D4000000 00000001 D2000000 00000000`),
    activationNote: 'Select + Up.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'All Items',
    name: 'All Berries (995)',
    description: 'Fills berry pocket.',
    hex: h(`94000130 FCFF0000 B2101D40 00000000 E0000C00 00000100 03E30095 03E30096
      03E30097 03E30098 03E30099 03E3009A 03E3009B 03E3009C 03E3009D 03E3009E
      03E3009F 03E300A0 03E300A1 03E300A2 03E300A3 03E300A4 03E300A5 03E300A6
      03E300A7 03E300A8 03E300A9 03E300AA 03E300AB 03E300AC 03E300AD 03E300AE
      03E300AF 03E300B0 03E300B1 03E300B2 03E300B3 03E300B4 03E300B5 03E300B6
      03E300B7 03E300B8 03E300B9 03E300BA 03E300BB 03E300BC 03E300BD 03E300BE
      03E300BF 03E300C0 03E300C1 03E300C2 03E300C3 03E300C4 03E300C5 03E300C6
      03E300C7 03E300C8 03E300C9 03E300CA 03E300CB 03E300CC 03E300CD 03E300CE
      03E300CF 03E300D0 03E300D1 03E300D2 03E300D3 03E300D4 D2000000 00000000`),
    activationNote: 'Press L + R.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'All Items',
    name: 'All battle items (995)',
    description: 'Battle pocket.',
    hex: h(`94000130 FCFF0000 B2101D40 00000000 E0000D3C 00000034 03E30037 03E30038
      03E30039 03E3003A 03E3003B 03E3003C 03E3003D 03E3003E 03E3003F 03E30040
      03E30041 03E30042 03E30043 00000000 D2000000 00000000`),
    activationNote: 'Press L + R.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'All TMs/HMs',
    name: 'All TMs & HMs (98 each)',
    description: 'Select + Up.',
    hex: h(`94000130 FFBB0000 62101D40 00000000 B2101D40 00000000 D5000000 00620148
      C0000000 00000063 D6000000 000009A0 D4000000 00000001 D2000000 00000000`),
    activationNote: 'Select + Up.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'All Items',
    name: 'All Mail (998)',
    description: 'Mail pocket.',
    hex: h(`94000130 FFBB0000 62101D40 00000000 B2101D40 00000000 D5000000 03E60089
      C0000000 0000000B D6000000 00000B30 D4000000 00000001 D2000000 00000000`),
    activationNote: 'Select + Up.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'All TMs/HMs',
    name: 'Teach any TM/HM',
    description: 'Lets incompatible Pokémon learn any TM/HM.',
    hex: h(`9207802E 0000D001 1207802E 000046C0 D2000000 00000000`),
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Miscellaneous',
    name: 'PC Pokémon dupe',
    description: 'Follow PokemonCoders box steps (Move + Select+Start+A + L+R).',
    hex: h(`9207998A 00001808 0207998C F962F7FA 94000130 FFF30000 0207998C 46C046C0
      D2000000 00000000`),
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Shiny Pokémon',
    name: 'Shiny (Trainer Card toggle)',
    description: 'R+A on Trainer Card on, L+A off.',
    hex: h(`02071D78 47104A00 02071D7C 02000031 94000130 FCFE0200 0207406C 47084900
      02074070 02000001 02073E3C 47084900 02073E40 02000051 12073E30 000046C0
      D2000000 00000000 94000130 FCFE0100 0207406C 95019000 02074070 90022000
      02073E3C 43200400 02073E40 1C28900D 12073E30 0000D107 D2000000 00000000
      62000000 95019000 E2000000 00000080 95019000 90022000 1C28B40D F0754907
      1C01FF13 2901BC0D 4902D101 49024708 00004708 02074075 02074053 00000000
      95019000 69384A04 98046010 4B019A09 00004718 02071D81 0200002C 00000000
      43200400 4907B401 F0756809 1C01FEED 2901BC01 4904D001 900D4708 49031C28
      00004708 0200002C 02073E33 02073E45 D2000000 00000000`),
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Miscellaneous',
    name: 'Pokétch calculator: wild + level + nature',
    description: 'Use calculator app: Dex #, L, R, level, R, nature, Select. See PokemonCoders.',
    hex: h(`94000130 FDFF0000 94000130 FDFF0000 B2101D40 00000000 D9000000 00111D10
      C0000000 0000000C DC000000 00000004 D6000000 000233E8 D1000000 00000000
      C0000000 0000000A D6000000 000233E8 D2000000 00000000 94000130 FEFF0000
      B2101D40 00000000 D9000000 00111D10 C0000000 0000000C D6000000 000233E8
      DC000000 00000004 D2000000 00000000 94000130 FFFB0000 B2101D40 00000000
      DA000000 00111D10 D4000000 00002400 D3000000 00000000 D7000000 0207404C
      D2000000 00000000`),
    warning: 'Requires Pokétch calculator; some legendaries may fail.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Infinite PP',
    name: 'Infinite PP',
    description: 'PP stops decreasing; re-enable after new moves.',
    hex: h(`52240FB4 DBEF42AE 62101D40 00000000 B2101D40 00000000 000475E4 FFFFFFFF
      00047764 FFFFFFFF D2000000 00000000`),
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Infinite HP',
    name: 'Infinite HP (battle)',
    description: 'HP refills; returns to normal when cheat off.',
    hex: h(`52240FB4 DBEF42AE 62101D40 00000000 B2101D40 00000000 10047604 000003E7
      10047608 000003E7 10047784 000003E7 10047788 000003E7 D2000000 00000000`),
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Miscellaneous',
    name: 'Character sprite modifier',
    description: 'Hold R entering doors; set number on Pokétch first.',
    hex: h(`94000130 FEFF0000 B2101D40 00000000 DA000000 00111D10 D7000000 0002388C
      D2000000 00000000`),
    activationNote: 'Needs Pokétch calculator; see PokemonCoders for ID list.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Complete Pokédex',
    name: 'National Dex entries (shorter block)',
    description: 'Second Pokédex routine from PokemonCoders.',
    hex: h(`94000130 FFFB0000 B2101D40 00000000 00001654 01010101 00001658 FFFCC750
      1000165C 0000FDFE 0000137C 10001FFF C0000000 0000000E 00001340 FFFFFFFF
      DC000000 00000004 D2000000 00000000 D0000000 00000000 94000130 FFFB0000
      B2101D40 00000000 C0000000 0000000E 00001380 FFFFFFFF DC000000 00000004
      D2000000 00000000 D0000000 00000000`),
    activationNote: 'Press Select.',
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'No Random Battles',
    name: 'Skip trainer battles',
    description: 'Skips trainer fights when active.',
    hex: h(`12067BFC 0000E008`),
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'No Random Battles',
    name: 'No wild battles while running',
    description: 'Walking still gets encounters.',
    hex: h(`92241802 0000D301 12241800 00002C05 1224185C 000042A6 94000130 FFFD0000
      12241800 000042A4 1224185C 000042A4 D2000000 00000000`),
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Instant Egg Hatch',
    name: 'Fast egg hatch',
    description: 'Eggs hatch quickly.',
    hex: h(`921E71EC 00004281 121E71EC 00004289 D2000000 00000000`),
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Miscellaneous',
    name: 'Run from any battle',
    description: 'Enables run in normally locked fights.',
    hex: h(`9224BBA2 00002101 1224BBA2 00002100 D2000000 00000000`),
  },
  {
    game: 'Platinum',
    generation: 4,
    category: 'Miscellaneous',
    name: 'MelonDS: save after long item cheats',
    description: 'Use if long codes block saving.',
    hex: h(`94000130 FCFF0000 B2101D40 00000000 DC000000 00000644 D5000000 03E30044
      C0000000 0000002C D6000000 00000000 D4000000 00000001 D1000000 00000000
      D5000000 03E30087 C0000000 00000001 D6000000 00000000 D4000000 00000001
      D1000000 00000000 D5000000 03E300D5 C0000000 00000072 D6000000 00000000
      D4000000 00000001 D1000000 00000000 D5000000 00000000 C0000000 00000002
      D6000000 00000000 D2000000 00000000`),
    activationNote: 'Press L + R.',
  },

  // ——— Pokémon Black ———
  {
    game: 'Black',
    generation: 5,
    category: 'Walk Through Walls',
    name: 'Walk through walls (L+A / L+B)',
    description: 'PokemonCoders primary Black code.',
    hex: h(`94000130 FDFC0002 1216398E 00000200 D2000000 00000000 94000130 FDFD0000
      1216398E 00001C20 D2000000 00000000 94000130 000002DC 94000136 FFFC0000
      0224F90C 00000185 0224F910 030E8000 0224F914 00000000 0224F918 02ED8000
      038090E0 EB9FE7C7 D2000000 00000000`),
    activationNote: 'L + A on, L + B off.',
    warning: 'Easy to get stuck; save often.',
  },
  {
    game: 'Black',
    generation: 5,
    category: 'Walk Through Walls',
    name: 'Walk through walls (hold L)',
    description: 'Alternative if main walk code fails.',
    hex: h(`521639A8 2010D101 121639AE 00001C20 94000130 FDFF0000 121639AE 00000200
      D0000000 00000000`),
    activationNote: 'Hold L while moving.',
  },
  {
    game: 'Black',
    generation: 5,
    category: 'Miscellaneous',
    name: 'Faster walk speed',
    description: 'Careful on bike; may skip triggers.',
    hex: h(`52197FC4 1C05210C 02197FC8 085F0056 D0000000 00000000`),
  },
  {
    game: 'Black',
    generation: 5,
    category: 'Complete Pokédex',
    name: 'Complete National Dex (Select)',
    description: 'Seen/caught flags for National Dex.',
    hex: h(`94000130 FFFB0000 0223D1B0 00001803 D5000000 FFFFFFFF C0000000 00000131
      D6000000 0223D1B4 D2000000 00000000`),
    activationNote: 'Press Select.',
  },
  {
    game: 'Black',
    generation: 5,
    category: "Catch Trainer's Pokémon",
    name: "Catch trainer's Pokémon (A)",
    description: 'Standard Black AR version.',
    hex: h(`521CBAAC 2F06D134 121CBAAC 0000E001 121CBAE6 00002001 121CBACC 00002000
      D2000000 00000000`),
  },
  {
    game: 'Black',
    generation: 5,
    category: "Catch Trainer's Pokémon",
    name: "Catch trainer's Pokémon (B)",
    description: 'Alternative; ends battle on catch.',
    hex: h(`02002300 68006868 02002304 60012100 02002308 00004770 521CBAA4 F7EC6868
      121CBAAA 0000F636 121CBAAC 0000FC29 D2000000 00000000`),
    warning: 'May not award money.',
  },
  {
    game: 'Black',
    generation: 5,
    category: 'No Random Battles',
    name: 'No wild battles (Select)',
    description: 'Max Repel–style effect.',
    hex: h(`94000130 FFFB0000 2223D6DD 000000FF D2000000 00000000`),
    activationNote: 'Press Select.',
  },
  {
    game: 'Black',
    generation: 5,
    category: 'No Random Battles',
    name: 'Skip trainer battles (hold L)',
    description: 'Walk past trainers while holding L.',
    hex: h(`521AE258 FB1AF000 94000130 FDFF0000 121AE25E 0000E009 D0000000 00000000
      521AE258 FB1AF000 94000130 FDFF0200 121AE25E 0000D109 D2000000 00000000`),
    activationNote: 'Hold L near trainers.',
  },
  {
    game: 'Black',
    generation: 5,
    category: 'Miscellaneous',
    name: 'Nature changer (summary)',
    description: 'Long code; L/R on nature screen.',
    hex: h(`521D5390 F6304841 E2002080 00000060 29006DA9 2103D103 42080209 4770D100
      65A92101 448E2106 0A06B5FF 21011C28 F818F1D4 F1D31C28 1C04FFDD 22002170
      FEEAF015 D1042E01 28193001 2000D108 2E02E006 2800D104 2018D101 3801E000
      1C201C02 F0152170 1C28FEC5 F1D32100 020020E0 BDFFFFF9 121D539E 0000F62C
      121D53A0 0000FE6F D2000000 00000000`),
    activationNote: 'Open Summary → nature line → L or R.',
  },
  {
    game: 'Black',
    generation: 5,
    category: 'EXP Multiplier',
    name: 'Exp. Share all party',
    description: 'Inactive party members still gain EXP.',
    hex: h(`521CB43C 42819903 121CB440 000046C0 D2000000 00000000`),
  },
  {
    game: 'Black',
    generation: 5,
    category: 'All Badges',
    name: 'All badges (Select)',
    hex: h(`94000130 FFFB0000 1223D8AC 0000270F D2000000 00000000`),
    activationNote: 'Press Select.',
  },
  {
    game: 'Black',
    generation: 5,
    category: 'All Badges',
    name: 'All badges (alt A)',
    hex: h(`1223CDB0 0000FFFF`),
  },
  {
    game: 'Black',
    generation: 5,
    category: 'All Badges',
    name: 'All badges (alt B)',
    hex: h(`620A7298 00000000 B20A7298 00000000 100217D8 000000FF D2000000 00000000`),
  },
  {
    game: 'Black',
    generation: 5,
    category: 'All Items',
    name: 'All Berries (900, Select)',
    hex: h(`94000130 FFFB0000 C0000000 0000003F 12234846 00000384 DC000000 00000004
      D2000000 00000000 94000130 FFFB0000 D5000000 00000095 C0000000 0000003F
      D7000000 02234844 D4000000 00000001 DC000000 00000002 D2000000 00000000`),
    activationNote: 'Press Select.',
  },
  {
    game: 'Black',
    generation: 5,
    category: 'All Items',
    name: 'All misc items (900, Select)',
    description: 'Long; excludes TM/HM/berries/key.',
    hex: h(`94000130 FFFB0000 022340A8 03840074 022340AC 03840075 022340B0 03840076
      022340B4 03840077 02234344 0384023C 02234348 0384023D 0223434C 0384023E
      02234350 0384023F 02234354 03840240 02234358 03840241 D2000000 00000000
      94000130 FFFB0000 D5000000 03840001 C0000000 0000000F D6000000 02233FAC
      D4000000 00000001 D2000000 00000000 94000130 FFFB0000 D5000000 03840041
      C0000000 0000002E D6000000 02233FEC D4000000 00000001 D2000000 00000000
      94000130 FFFB0000 D5000000 03840087 C0000000 0000000C D6000000 022340B8
      D4000000 00000001 D2000000 00000000 94000130 FFFB0000 D5000000 038400D5
      C0000000 00000071 D6000000 022340EC D4000000 00000001 D2000000 00000000
      94000130 FFFB0000 D5000000 038401EC C0000000 00000008 D6000000 022342B4
      D4000000 00000001 D2000000 00000000 94000130 FFFB0000 D5000000 03840219
      C0000000 0000001A D6000000 022342D8 D4000000 00000001 D2000000 00000000
      94000130 FFFB0000 D5000000 03840244 C0000000 0000000A D6000000 0223435C
      D4000000 00000001 D2000000 00000000`),
    activationNote: 'Press Select.',
  },
  {
    game: 'Black',
    generation: 5,
    category: 'All TMs/HMs',
    name: 'All TM/HM batch 1',
    hex: h(`94000130 FFFB0000 022345A0 0001026A 022345A4 0001026B 022345A8 0001026C
      D5000000 00010148 C0000000 0000005B D6000000 02234430 D4000000 00000001
      D1000000 00000000 C0000000 00000005 D6000000 0223443C D4000000 00000001
      D2000000 00000000`),
    activationNote: 'Press Select; pair with batch 2 if needed.',
  },
  {
    game: 'Black',
    generation: 5,
    category: 'All TMs/HMs',
    name: 'All TM/HM batch 2',
    hex: h(`94000130 FFFB0000 022345A0 0001026A 022345A4 0001026B 022345A8 0001026C
      D5000000 00010148 C0000000 0000005A D6000000 02234430 D4000000 00000001
      D2000000 00000000 94000130 FFFB0000 D5000000 000101A4 C0000000 00000004
      D6000000 022345AC D4000000 00000001 D2000000 00000000`),
    activationNote: 'Press Select.',
  },
  {
    game: 'Black',
    generation: 5,
    category: 'All TMs/HMs',
    name: 'All TM/HM (gman alt)',
    hex: h(`94000130 FFFB0000 02234760 0001026A 02234764 0001026B 02234768 0001026C
      D5000000 00010148 C0000000 0000005B D6000000 022345F0 D4000000 00000001
      D2000000 00000000`),
    activationNote: 'Press Select.',
  },
  {
    game: 'Black',
    generation: 5,
    category: 'Infinite HP',
    name: 'Invulnerability',
    hex: h(`521C605C D10E2800 021C605C FBD0F1E8 023AE800 D0002800 023AE804 4903BD70
      023AE808 428E6809 023AE80C 2400D200 023AE810 46C04770 023AE814 0226993C
      D2000000 00000000`),
  },
  {
    game: 'Black',
    generation: 5,
    category: 'Shiny Pokémon',
    name: 'Shiny wild (long)',
    hex: h(`521A96D0 1C221C39 E2002200 00000028 4C08B57E 88248865 08ED4065 F1A7B40F
      1C06FD8F 40410401 428D0CC9 D1F5BC0F BD7E1C30 0224F93C 021A96D4 FD94F658
      D0000000 00000000`),
  },
  {
    game: 'Black',
    generation: 5,
    category: 'Infinite Money',
    name: 'Max money (Select)',
    hex: h(`94000130 FFFB0000 0223CDAC 0098967F D2000000 00000000`),
    activationNote: 'Press Select; check trainer card / money.',
  },
  {
    game: 'Black',
    generation: 5,
    category: 'Rare Candy',
    name: '900× healing items (Select)',
    hex: h(`94000130 FFFB0000 D5000000 03840011 C0000000 00000025 D6000000 02234784
      D4000000 00000001 D2000000 00000000`),
    activationNote: 'Press Select.',
  },
  {
    game: 'Black',
    generation: 5,
    category: 'Master Ball',
    name: '900× Master Balls (L+R)',
    hex: h(`94000130 FCFF0000 02233FAC 03840001 D2000000 00000000`),
    activationNote: 'Press L + R.',
  },
  {
    game: 'Black',
    generation: 5,
    category: 'Infinite PP',
    name: 'Unlimited PP',
    hex: h(`921D5618 0000D301 121D5618 0000E003 D2000000 00000000`),
  },
  {
    game: 'Black',
    generation: 5,
    category: '100% Catch Rate',
    name: '100% catch (Black)',
    hex: h(`521CBCD4 7820D203 121CBCD4 000046C0 D2000000 00000000`),
  },
  {
    game: 'Black',
    generation: 5,
    category: 'Miscellaneous',
    name: 'PC anywhere (START)',
    hex: h(`52188DF0 B086B570 E2002240 00000030 F034B50E 2170E84C D00A2808 E006981F
      F034B50E 219EE844 D0022808 07C09822 2027BD0E 306A0200 18529A03 BD0E9203
      12189DDA 0000F678 12189DDC 0000FA39 1218A31E 0000F677 1218A320 0000FF8F
      D0000000 00000000`),
    activationNote: 'Press START.',
  },
  {
    game: 'Black',
    generation: 5,
    category: 'Rare Candy',
    name: '900× Rare Candy (L+R)',
    hex: h(`94000130 FCFF0000 02234784 03840032 D2000000 00000000`),
    activationNote: 'Press L + R.',
  },

  // ——— Pokémon White (same engine; different offsets on some codes) ———
  {
    game: 'White',
    generation: 5,
    category: 'Rare Candy',
    name: '900× Rare Candy (L+R)',
    hex: h(`94000130 FCFF0000 022347A4 03840032 D2000000 00000000`),
    activationNote: 'Press L + R.',
  },
  {
    game: 'White',
    generation: 5,
    category: 'Infinite Money',
    name: 'Max money (Select)',
    hex: h(`94000130 FFFB0000 0223CDCC 0098967F D2000000 00000000`),
    activationNote: 'Press Select.',
  },
  {
    game: 'White',
    generation: 5,
    category: 'Rare Candy',
    name: '900× Rare Candy (Select)',
    hex: h(`94000130 FFFB0000 0223CDAC 03840032 D2000000 00000000`),
    activationNote: 'Press Select.',
  },
  {
    game: 'White',
    generation: 5,
    category: 'Master Ball',
    name: '900× Master Ball (Select)',
    hex: h(`94000130 FFFB0000 0223CDAC 03840001 D2000000 00000000`),
    activationNote: 'Press Select.',
  },
  {
    game: 'White',
    generation: 5,
    category: 'Walk Through Walls',
    name: 'Walk through walls',
    hex: h(`521A04D4 D1032800 121A04D4 00002000 D2000000 00000000`),
  },
  {
    game: 'White',
    generation: 5,
    category: '100% Catch Rate',
    name: '100% catch',
    hex: h(`521CBDB4 7820D203 121CBDB4 00004280 D2000000 00000000`),
  },
  {
    game: 'White',
    generation: 5,
    category: 'Shiny Pokémon',
    name: 'Shiny wild',
    hex: h(`521A96D8 1C221C33 021A96D8 2C001C22 D2000000 00000000`),
  },
  {
    game: 'White',
    generation: 5,
    category: 'EXP Multiplier',
    name: 'Fast EXP',
    hex: h(`5219811C 4C08210F 0219811C 210F4C08 D2000000 00000000`),
  },
];
