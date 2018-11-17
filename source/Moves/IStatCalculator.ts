import { StatType } from '../Pokemon/StatType';
import IPokemon from '../Pokemon/IPokemon';

export default interface IStatCalculator {
  apply(statType: StatType, stageIncrease: number, pokemon: IPokemon): void;
  accuracyMultiplier(attacker: IPokemon, defender: IPokemon): number;
}
