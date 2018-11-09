import { Type } from '../Pokemon/Type';

export default class TypeEffectiveness {
  private static readonly offensiveTypeEffectiveness: ITypeEffectiveness = {
    NORMAL: {
      ROCK: 0.5,
      STEEL: 0.5,
      GHOST: 0,
    },
    FIRE: {
      BUG: 2,
      GRASS: 2,
      ICE: 2,
      STEEL: 2,
      DRAGON: 0.5,
      FIRE: 0.5,
      ROCK: 0.5,
      WATER: 0.5,
    },
    FIGHTING: {
      NORMAL: 2,
      ICE: 2,
      DARK: 2,
      ROCK: 2,
      STEEL: 2,
      POISON: 0.5,
      FLYING: 0.5,
      BUG: 0.5,
      PSYCHIC: 0.5,
      GHOST: 0,
    },
    WATER: {
      FIRE: 2,
      GROUND: 2,
      ROCK: 2,
      DRAGON: 0.5,
      GRASS: 0.5,
      WATER: 0.5,
    },
    FLYING: {
      BUG: 2,
      FIGHTING: 2,
      GRASS: 2,
      ELECTRIC: 0.5,
      ROCK: 0.5,
      STEEL: 0.5,
    },
    GRASS: {
      GROUND: 2,
      ROCK: 2,
      WATER: 2,
      BUG: 0.5,
      DRAGON: 0.5,
      FIRE: 0.5,
      FLYING: 0.5,
      GRASS: 0.5,
      POISON: 0.5,
      STEEL: 0.5,
    },
    POISON: {
      GRASS: 2,
      POISON: 0.5,
      GROUND: 0.5,
      ROCK: 0.5,
      GHOST: 0.5,
      STEEL: 0,
    },
    ELECTRIC: {
      FLYING: 2,
      WATER: 2,
      DRAGON: 0.5,
      ELECTRIC: 0.5,
      GRASS: 0.5,
      GROUND: 0,
    },
    GROUND: {
      ELECTRIC: 2,
      FIRE: 2,
      POISON: 2,
      ROCK: 2,
      STEEL: 2,
      BUG: 0.5,
      GRASS: 0.5,
      FLYING: 0,
    },
    PSYCHIC: {
      FIGHTING: 2,
      POISON: 2,
      PSYCHIC: 0.5,
      STEEL: 0.5,
      DARK: 0,
    },
    ROCK: {
      BUG: 2,
      FIRE: 2,
      FLYING: 2,
      ICE: 2,
      FIGHTING: 0.5,
      GROUND: 0.5,
      STEEL: 0.5,
    },
    ICE: {
      DRAGON: 2,
      FLYING: 2,
      GRASS: 2,
      GROUND: 2,
      FIRE: 0.5,
      ICE: 0.5,
      STEEL: 0.5,
      WATER: 0.5,
    },
    BUG: {
      DARK: 2,
      GRASS: 2,
      PSYCHIC: 2,
      FIGHTING: 0.5,
      FIRE: 0.5,
      FLYING: 0.5,
      GHOST: 0.5,
      POISON: 0.5,
      STEEL: 0.5,
    },
    DRAGON: {
      DRAGON: 2,
      STEEL: 0.5,
    },
    GHOST: {
      GHOST: 2,
      PSYCHIC: 2,
      DARK: 0.5,
      NORMAL: 0,
    },
    DARK: {
      GHOST: 2,
      PSYCHIC: 2,
      DARK: 0.5,
      FIGHTING: 0.5,
      STEEL: 0.5,
    },
    STEEL: {
      ICE: 2,
      ROCK: 2,
      ELECTRIC: 0.5,
      FIRE: 0.5,
      STEEL: 0.5,
      WATER: 0.5,
    },
  };

  public static offensive(moveType: Type, defenderType: Type): number {
    const effectiveness = this.offensiveTypeEffectiveness[Type[moveType]][Type[defenderType]];
    return typeof effectiveness === 'number' ? effectiveness : 1;
  }
}

interface ITypeEffectiveness {
  [offensiveType: string]: {
    [defensiveType: string]: number;
  };
}
