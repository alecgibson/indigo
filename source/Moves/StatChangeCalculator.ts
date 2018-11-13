import { StatType } from '../Pokemon/StatType';
import IPokemon from '../Pokemon/IPokemon';
import IPokemonStat from '../Pokemon/IPokemonStat';
import InvalidStatError from '../Errors/InvalidStatError';

export default class StatChangeCalculator {
  public apply(stageIncrease: number, statType: StatType, pokemon: IPokemon) {
    if (statType === StatType.HIT_POINTS) {
      throw new InvalidStatError('Hit points cannot be changed through StatChangeCalculator');
    }

    this.changeStage(stageIncrease, statType, pokemon);

    // Evasion and accuracy are combined with the opponent's corresponding stat, so cannot
    // be calculated in advance
    if (this.isAccuracyRelated(statType)) {
      return;
    }

    this.applyMultiplier(statType, pokemon);
  }

  private changeStage(stageIncrease: number, statType: StatType, pokemon: IPokemon) {
    const stat = this.stat(statType, pokemon);
    const currentStage = stat.stage;
    let newStage = currentStage + stageIncrease;

    if (newStage > 6) {
      newStage = 6;
    } else if (newStage < -6) {
      newStage = -6;
    }

    stat.stage = newStage;
  }

  private stat(statType: StatType, pokemon: IPokemon) {
    const stats = pokemon.stats as {[key: string]: IPokemonStat};

    for (const key in pokemon.stats) {
      const stat = stats[key];
      if (stat.type === statType) {
        return stat;
      }
    }

    throw new InvalidStatError(`statType '${statType}' is invalid`);
  }

  private isAccuracyRelated(statType: StatType) {
    return statType === StatType.ACCURACY
      || statType === StatType.EVASION;
  }

  private applyMultiplier(statType: StatType, pokemon: IPokemon) {
    const stat = this.stat(statType, pokemon);
    stat.current = stat.total * this.multiplier(stat.stage);
  }

  private multiplier(stage: number): number {
    const isNegative = stage < 0;
    const numerator = 2 + Math.abs(stage);

    let multiplier = numerator * 0.5;
    if (isNegative) {
      multiplier = 1 / multiplier;
    }

    return multiplier;
  }
}
