import {Nature} from "../models/Nature";
import {StatType} from "../models/StatType";

export class NatureModifier {
  private static readonly modifiers = {
    HARDY: {},
    LONELY: {
      ATTACK: 1.1,
      DEFENSE: 0.9,
    },
    BRAVE: {
      ATTACK: 1.1,
      SPEED: 0.9,
    },
    ADAMANT: {
      ATTACK: 1.1,
      SPECIAL_ATTACK: 0.9,
    },
    NAUGHTY: {
      ATTACK: 1.1,
      SPECIAL_DEFENSE: 0.9,
    },
    BOLD: {
      DEFENSE: 1.1,
      ATTACK: 0.9,
    },
    DOCILE: {},
    RELAXED: {
      DEFENSE: 1.1,
      SPEED: 0.9,
    },
    IMPISH: {
      DEFENSE: 1.1,
      SPECIAL_ATTACK: 0.9,
    },
    LAX: {
      DEFENSE: 1.1,
      SPECIAL_DEFENSE: 0.9,
    },
    TIMID: {
      SPEED: 1.1,
      ATTACK: 0.9,
    },
    HASTY: {
      SPEED: 1.1,
      DEFENSE: 0.9,
    },
    SERIOUS: {},
    JOLLY: {
      SPEED: 1.1,
      SPECIAL_ATTACK: 0.9,
    },
    NAIVE: {
      SPEED: 1.1,
      SPECIAL_DEFENSE: 0.9,
    },
    MODEST: {
      SPECIAL_ATTACK: 1.1,
      ATTACK: 0.9,
    },
    MILD: {
      SPECIAL_ATTACK: 1.1,
      DEFENSE: 0.9,
    },
    QUIET: {
      SPECIAL_ATTACK: 1.1,
      SPEED: 0.9,
    },
    BASHFUL: {},
    RASH: {
      SPECIAL_ATTACK: 1.1,
      SPECIAL_DEFENSE: 0.9,
    },
    CALM: {
      SPECIAL_DEFENSE: 1.1,
      ATTACK: 0.9,
    },
    GENTLE: {
      SPECIAL_DEFENSE: 1.1,
      DEFENSE: 0.9,
    },
    SASSY: {
      SPECIAL_DEFENSE: 1.1,
      SPEED: 0.9,
    },
    CAREFUL: {
      SPECIAL_DEFENSE: 1.1,
      SPECIAL_ATTACK: 0.9,
    },
    QUIRKY: {},
  };

  public static modifier(nature: Nature, statType: StatType): number {
    let statModifier = this.modifiers[Nature[nature]][StatType[statType]];
    return typeof statModifier === 'number' ? statModifier : 1;
  }
}
