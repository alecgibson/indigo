import IPokemonStat from '../Pokemon/IPokemonStat';
import Factory from './factory';
import { StatType } from '../Pokemon/StatType';

export default class PokemonStatFactory extends Factory<IPokemonStat> {
  protected base(): IPokemonStat {
    return {
      type: StatType.HIT_POINTS,
      total: 10,
      current: 10,
      individualValue: 5,
      effortValue: 5,
      stage: 0,
    };
  }
}
