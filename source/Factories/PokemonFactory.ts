import IPokemon from '../Pokemon/IPokemon';
import Factory from './factory';
import PokemonStatFactory from './PokemonStatFactory';
import { Gender } from '../Pokemon/Gender';
import { Nature } from '../Pokemon/Nature';
import IPokemonStat from '../Pokemon/IPokemonStat';
import { StatType } from '../Pokemon/StatType';

export default class PokemonFactory extends Factory<IPokemon> {
  private idCounter = 1;

  protected base(): IPokemon {
    return {
      id: `pokemon-${this.idCounter++}`,
      trainerId: 'trainer-123',
      squadOrder: 1,
      speciesId: 1,
      level: 5,
      stats: {
        hitPoints: new PokemonStatFactory().build((s: IPokemonStat) => s.type = StatType.HIT_POINTS),
        attack: new PokemonStatFactory().build((s: IPokemonStat) => s.type = StatType.ATTACK),
        defense: new PokemonStatFactory().build((s: IPokemonStat) => s.type = StatType.DEFENSE),
        specialAttack: new PokemonStatFactory().build((s: IPokemonStat) => s.type = StatType.SPECIAL_ATTACK),
        specialDefense: new PokemonStatFactory().build((s: IPokemonStat) => s.type = StatType.SPECIAL_DEFENSE),
        speed: new PokemonStatFactory().build((s: IPokemonStat) => s.type = StatType.SPEED),
        accuracy: new PokemonStatFactory().build((s: IPokemonStat) => s.type = StatType.ACCURACY),
        evasion: new PokemonStatFactory().build((s: IPokemonStat) => s.type = StatType.EVASION),
      },
      moveIds: [],
      gender: Gender.NONE,
      nature: Nature.ADAMANT,
      abilityId: 1,
    };
  }
}
