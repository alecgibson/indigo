import IPokemonStat from '../Pokemon/IPokemonStat';
import Factory from './factory';

export default class PokemonStatFactory extends Factory<IPokemonStat> {
  protected base(): IPokemonStat {
    return {
      total: 10,
      current: 10,
      individualValue: 5,
      effortValue: 5,
    };
  }
}
