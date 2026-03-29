export const MOVE_NAMES: Record<number, string> = {
  0: '(None)', 1: 'Pound', 2: 'Karate Chop', 3: 'Double Slap', 4: 'Comet Punch',
  5: 'Mega Punch', 6: 'Pay Day', 7: 'Fire Punch', 8: 'Ice Punch', 9: 'Thunder Punch',
  10: 'Scratch', 11: 'Vise Grip', 12: 'Guillotine', 13: 'Razor Wind', 14: 'Swords Dance',
  15: 'Cut', 16: 'Gust', 17: 'Wing Attack', 18: 'Whirlwind', 19: 'Fly',
  20: 'Bind', 21: 'Slam', 22: 'Vine Whip', 23: 'Stomp', 24: 'Double Kick',
  25: 'Mega Kick', 26: 'Jump Kick', 27: 'Rolling Kick', 28: 'Sand Attack',
  29: 'Headbutt', 30: 'Horn Attack', 31: 'Fury Attack', 32: 'Horn Drill',
  33: 'Tackle', 34: 'Body Slam', 35: 'Wrap', 36: 'Take Down',
  37: 'Thrash', 38: 'Double-Edge', 39: 'Tail Whip', 40: 'Poison Sting',
  41: 'Twineedle', 42: 'Pin Missile', 44: 'Bite', 45: 'Growl',
  46: 'Roar', 47: 'Sing', 48: 'Supersonic', 49: 'Sonic Boom',
  50: 'Disable', 51: 'Acid', 52: 'Ember', 53: 'Flamethrower',
  55: 'Water Gun', 56: 'Hydro Pump', 57: 'Surf', 58: 'Ice Beam',
  59: 'Blizzard', 60: 'Psybeam', 61: 'Bubble Beam', 62: 'Aurora Beam',
  63: 'Hyper Beam', 64: 'Peck', 65: 'Drill Peck',
  84: 'Thunder Shock', 85: 'Thunderbolt', 86: 'Thunder Wave', 87: 'Thunder',
  89: 'Earthquake', 90: 'Fissure', 91: 'Dig', 92: 'Toxic',
  93: 'Confusion', 94: 'Psychic', 95: 'Hypnosis', 97: 'Agility',
  98: 'Quick Attack', 99: 'Rage', 100: 'Teleport', 101: 'Night Shade',
  102: 'Mimic', 103: 'Screech', 104: 'Double Team', 105: 'Recover',
  115: 'Reflect', 126: 'Fire Blast', 127: 'Waterfall', 135: 'Soft-Boiled',
  138: 'Dream Eater', 143: 'Sky Attack', 153: 'Explosion',
  156: 'Rest', 157: 'Rock Slide', 163: 'Slash', 164: 'Substitute',
  182: 'Protect', 183: 'Mach Punch', 188: 'Sludge Bomb', 192: 'Zap Cannon',
  200: 'Outrage', 202: 'Giga Drain', 203: 'Endure', 204: 'Charm',
  214: 'Sleep Talk', 216: 'Return', 218: 'Frustration',
  223: 'Dynamic Punch', 237: 'Hidden Power', 240: 'Rain Dance',
  241: 'Sunny Day', 242: 'Crunch', 244: 'Psych Up', 245: 'Extreme Speed',
  247: 'Shadow Ball', 261: 'Will-O-Wisp', 269: 'Taunt',
  280: 'Brick Break', 290: 'Secret Power', 299: 'Blaze Kick',
  304: 'Hyper Voice', 311: 'Weather Ball', 314: 'Air Cutter',
  317: 'Rock Tomb', 318: 'Silver Wind', 325: 'Shadow Punch',
  332: 'Aerial Ace', 334: 'Iron Defense', 337: 'Dragon Claw',
  340: 'Bounce', 348: 'Leaf Blade', 349: 'Dragon Dance',
  352: 'Water Pulse', 354: 'Psycho Boost',
  355: 'Roost', 369: 'U-turn', 370: 'Close Combat',
  394: 'Flare Blitz', 396: 'Aura Sphere', 398: 'Poison Jab',
  399: 'Dark Pulse', 400: 'Night Slash', 402: 'Seed Bomb',
  403: 'Air Slash', 404: 'X-Scissor', 405: 'Bug Buzz',
  406: 'Dragon Pulse', 407: 'Dragon Rush', 408: 'Power Gem',
  409: 'Drain Punch', 411: 'Focus Blast', 412: 'Energy Ball',
  413: 'Brave Bird', 414: 'Earth Power', 416: 'Giga Impact',
  417: 'Nasty Plot', 421: 'Shadow Claw', 422: 'Thunder Fang',
  423: 'Ice Fang', 424: 'Fire Fang', 428: 'Zen Headbutt',
  430: 'Flash Cannon', 432: 'Defog', 437: 'Leaf Storm',
  444: 'Stone Edge', 446: 'Stealth Rock', 450: 'Bug Bite',
  468: 'Hone Claws', 473: 'Psyshock', 503: 'Scald',
  521: 'Volt Switch', 525: 'Dragon Tail', 526: 'Work Up',
  528: 'Wild Charge', 529: 'Drill Run', 540: 'Psystrike',
  542: 'Hurricane', 556: 'Sticky Web', 573: 'Freeze-Dry',
  583: 'Play Rough', 585: 'Moonblast', 586: 'Boomburst',
  605: 'Dazzling Gleam', 706: 'Darkest Lariat', 710: 'Liquidation',
  742: 'Double Iron Bash', 796: 'Steel Beam',
  799: 'Scale Shot', 800: 'Meteor Assault', 802: 'Astral Barrage',
  803: 'Glacial Lance', 804: 'Eternabeam',
  906: 'Tera Blast', 915: 'Blood Moon',
};

export function getMoveName(id: number): string {
  return MOVE_NAMES[id] ?? `Move #${id}`;
}

export function searchMoves(query: string): Array<{ id: number; name: string }> {
  const q = query.toLowerCase();
  return Object.entries(MOVE_NAMES)
    .filter(([_, name]) => name.toLowerCase().includes(q))
    .map(([id, name]) => ({ id: parseInt(id), name }))
    .slice(0, 50);
}
