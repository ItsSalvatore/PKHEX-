export enum PokemonType {
  Normal, Fighting, Flying, Poison, Ground,
  Rock, Bug, Ghost, Steel, Fire,
  Water, Grass, Electric, Psychic, Ice,
  Dragon, Dark, Fairy,
}

export const TYPE_NAMES: string[] = [
  'Normal', 'Fighting', 'Flying', 'Poison', 'Ground',
  'Rock', 'Bug', 'Ghost', 'Steel', 'Fire',
  'Water', 'Grass', 'Electric', 'Psychic', 'Ice',
  'Dragon', 'Dark', 'Fairy',
];

export const TYPE_COLORS: Record<PokemonType, string> = {
  [PokemonType.Normal]: '#A8A77A',
  [PokemonType.Fighting]: '#C22E28',
  [PokemonType.Flying]: '#A98FF3',
  [PokemonType.Poison]: '#A33EA1',
  [PokemonType.Ground]: '#E2BF65',
  [PokemonType.Rock]: '#B6A136',
  [PokemonType.Bug]: '#A6B91A',
  [PokemonType.Ghost]: '#735797',
  [PokemonType.Steel]: '#B7B7CE',
  [PokemonType.Fire]: '#EE8130',
  [PokemonType.Water]: '#6390F0',
  [PokemonType.Grass]: '#7AC74C',
  [PokemonType.Electric]: '#F7D02C',
  [PokemonType.Psychic]: '#F95587',
  [PokemonType.Ice]: '#96D9D6',
  [PokemonType.Dragon]: '#6F35FC',
  [PokemonType.Dark]: '#705746',
  [PokemonType.Fairy]: '#D685AD',
};

export const TYPE_CHART: number[][] = [
  /*            Nor Fig Fly Poi Gro Roc Bug Gho Ste Fir Wat Gra Ele Psy Ice Dra Dar Fai */
  /* Normal  */ [1,  1,  1,  1,  1, .5,  1,  0, .5,  1,  1,  1,  1,  1,  1,  1,  1,  1],
  /* Fighting*/ [2,  1, .5, .5,  1,  2, .5,  0,  2,  1,  1,  1,  1, .5,  2,  1,  2, .5],
  /* Flying  */ [1,  2,  1,  1,  1, .5,  2,  1, .5,  1,  1,  2, .5,  1,  1,  1,  1,  1],
  /* Poison  */ [1,  1,  1, .5, .5, .5,  1, .5,  0,  1,  1,  2,  1,  1,  1,  1,  1,  2],
  /* Ground  */ [1,  1,  0,  2,  1,  2, .5,  1,  2,  2,  1, .5,  2,  1,  1,  1,  1,  1],
  /* Rock    */ [1, .5,  2,  1, .5,  1,  2,  1, .5,  2,  1,  1,  1,  1,  2,  1,  1,  1],
  /* Bug     */ [1, .5, .5, .5,  1,  1,  1, .5, .5, .5,  1,  2,  1,  2,  1,  1,  2, .5],
  /* Ghost   */ [0,  1,  1,  1,  1,  1,  1,  2,  1,  1,  1,  1,  1,  2,  1,  1, .5,  1],
  /* Steel   */ [1,  1,  1,  1,  1,  2,  1,  1, .5, .5, .5,  1, .5,  1,  2,  1,  1,  2],
  /* Fire    */ [1,  1,  1,  1,  1, .5,  2,  1,  2, .5, .5,  2,  1,  1,  2, .5,  1,  1],
  /* Water   */ [1,  1,  1,  1,  2,  2,  1,  1,  1,  2, .5, .5,  1,  1,  1, .5,  1,  1],
  /* Grass   */ [1,  1, .5, .5,  2,  2, .5,  1, .5, .5,  2, .5,  1,  1,  1, .5,  1,  1],
  /* Electric*/ [1,  1,  2,  1,  0,  1,  1,  1,  1,  1,  2, .5, .5,  1,  1, .5,  1,  1],
  /* Psychic */ [1,  2,  1,  2,  1,  1,  1,  1, .5,  1,  1,  1,  1, .5,  1,  1,  0,  1],
  /* Ice     */ [1,  1,  2,  1,  2,  1,  1,  1, .5, .5, .5,  2,  1,  1, .5,  2,  1,  1],
  /* Dragon  */ [1,  1,  1,  1,  1,  1,  1,  1, .5,  1,  1,  1,  1,  1,  1,  2,  1,  0],
  /* Dark    */ [1, .5,  1,  1,  1,  1,  1,  2,  1,  1,  1,  1,  1,  2,  1,  1, .5, .5],
  /* Fairy   */ [1,  2,  1, .5,  1,  1,  1,  1, .5, .5,  1,  1,  1,  1,  1,  2,  2,  1],
];

export function getTypeEffectiveness(attackType: PokemonType, defenseType: PokemonType): number {
  return TYPE_CHART[attackType][defenseType];
}

export function getTypeName(type: PokemonType): string {
  return TYPE_NAMES[type] ?? 'Unknown';
}
