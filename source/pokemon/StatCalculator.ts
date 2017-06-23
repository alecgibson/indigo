import {Nature} from "../models/Nature";
import {NatureModifier} from "./NatureModifier";
import {StatType} from "../models/StatType";

// See https://bulbapedia.bulbagarden.net/wiki/Statistic
export class StatCalculator {
  public static calculate(statType: StatType,
                          baseValue: number,
                          individualValue: number,
                          effortValue: number,
                          level: number,
                          nature: Nature): number {
    if (statType === StatType.HIT_POINTS) {
      return Math.floor(
          0.01 * (2 * baseValue + individualValue + Math.floor(0.25 * effortValue)) * level
        ) + level + 10;
    } else {
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
}
