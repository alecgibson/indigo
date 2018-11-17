import { StatType } from '../Pokemon/StatType';
import IPokemon from '../Pokemon/IPokemon';
import IPokemonStat from '../Pokemon/IPokemonStat';
import InvalidStatError from '../Errors/InvalidStatError';
import IStatCalculator from './IStatCalculator';

export default class StatCalculator implements IStatCalculator {
  private readonly ATTACK_DENOMINATOR = 2;
  private readonly ACCURACY_DENOMINATOR = 3;

  public apply(statType: StatType, stageIncrease: number, pokemon: IPokemon) {
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

  public accuracyMultiplier(attacker: IPokemon, defender: IPokemon) {
    let stage = attacker.stats.accuracy.stage - defender.stats.evasion.stage;
    stage = this.capStage(stage);
    return this.multiplier(stage, this.ACCURACY_DENOMINATOR);
  }

  private changeStage(stageIncrease: number, statType: StatType, pokemon: IPokemon) {
    const stat = this.stat(statType, pokemon);
    const currentStage = stat.stage;
    const newStage = currentStage + stageIncrease;
    stat.stage = this.capStage(newStage);
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

  private capStage(stage: number) {
    if (stage > 6) {
      stage = 6;
    } else if (stage < -6) {
      stage = -6;
    }

    return stage;
  }

  private isAccuracyRelated(statType: StatType) {
    return statType === StatType.ACCURACY
      || statType === StatType.EVASION;
  }

  private applyMultiplier(statType: StatType, pokemon: IPokemon) {
    const stat = this.stat(statType, pokemon);
    stat.current = stat.total * this.multiplier(stat.stage, this.ATTACK_DENOMINATOR);
  }

  private multiplier(stage: number, denominator: number): number {
    const isNegative = stage < 0;
    const numerator = denominator + Math.abs(stage);

    let multiplier = numerator / denominator;
    if (isNegative) {
      multiplier = 1 / multiplier;
    }

    return multiplier;
  }
}
