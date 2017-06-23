import {Nature} from "../models/Nature";
import {NatureModifier} from "./NatureModifier";
import {StatType} from "../models/StatType";

// See https://bulbapedia.bulbagarden.net/wiki/Statistic
export class StatCalculator {
  public static hp(baseHp: number,
                   individualValue: number,
                   effortValue: number,
                   level: number): number {
    return Math.floor(
        0.01 * (2 * baseHp + individualValue + Math.floor(0.25 * effortValue)) * level
      ) + level + 10;
  }

  public static stat(statType: StatType,
                     baseValue: number,
                     individualValue: number,
                     effortValue: number,
                     level: number,
                     nature: Nature): number {
    let natureModifier = NatureModifier.modifier(nature, statType);

    return Math.floor(
      natureModifier * (
        5 + Math.floor(
          0.01 * (2 * baseValue + individualValue + Math.floor(effortValue / 4)) * level
        )
      )
    );
  }
}
