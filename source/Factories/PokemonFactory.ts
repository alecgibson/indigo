import IPokemon from '../Pokemon/IPokemon';
import Factory from './factory';
import PokemonStatFactory from './PokemonStatFactory';
import { Gender } from '../Pokemon/Gender';
import { Nature } from '../Pokemon/Nature';

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
        hitPoints: new PokemonStatFactory().build(),
        attack: new PokemonStatFactory().build(),
        defense: new PokemonStatFactory().build(),
        specialAttack: new PokemonStatFactory().build(),
        specialDefense: new PokemonStatFactory().build(),
        speed: new PokemonStatFactory().build(),
      },
      moveIds: [],
      gender: Gender.NONE,
      nature: Nature.ADAMANT,
      abilityId: 1,
    };
  }
}
