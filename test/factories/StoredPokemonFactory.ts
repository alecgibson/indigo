import {IPokemonStat, IStoredPokemon} from "../../source/models/IStoredPokemon";
import {Gender} from "../../source/models/Gender";
import {Nature} from "../../source/models/Nature";
import {Random} from "../../source/utilities/Random";
import {PokemonService} from "../../source/pokemon/PokemonService";

export class StoredPokemonFactory {
  public static build(overrides?): IStoredPokemon {
    let pokemon: IStoredPokemon = {
      id: Random.uuid(),
      speciesId: Random.integerInclusive(1, 151),
      level: Random.integerInclusive(1, 100),
      stats: {
        hitPoints: StoredPokemonFactory.randomStat(),
        attack: StoredPokemonFactory.randomStat(),
        defense: StoredPokemonFactory.randomStat(),
        specialAttack: StoredPokemonFactory.randomStat(),
        specialDefense: StoredPokemonFactory.randomStat(),
        speed: StoredPokemonFactory.randomStat(),
      },
      moveIds: [1, 2, 3, 4],
      gender: Gender.FEMALE,
      nature: Nature.BRAVE,
      abilityId: 1,
    };

    return Object.assign(pokemon, overrides);
  }

  public static create(overrides?): Promise<IStoredPokemon> {
    let pokemon = StoredPokemonFactory.build(overrides);
    let pokemonService = new PokemonService();
    return pokemonService.create(pokemon);
  }

  private static randomStat(): IPokemonStat {
    return {
      value: Random.integerInclusive(11, 100),
      individualValue: Random.integerInclusive(0, 31),
      effortValue: Random.integerInclusive(0, 252),
    };
  }
}
