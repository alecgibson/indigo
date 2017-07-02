import {IPokemonStat, IStoredPokemon} from "../../source/models/IStoredPokemon";
import {Gender} from "../../source/models/Gender";
import {Nature} from "../../source/models/Nature";
import {Random} from "../../source/utilities/Random";
import {PokemonService} from "../../source/pokemon/PokemonService";
import {TrainerFactory} from "./TrainerFactory";

export class StoredPokemonFactory {
  public static build(overrides?): IStoredPokemon {
    overrides = overrides || {};
    let hitPoints = StoredPokemonFactory.randomStat();
    let moveIds = overrides.moveIds || [1, 2, 3, 4];
    let pp = moveIds.reduce((map, moveId) => {
      map[moveId] = 10;
      return map;
    }, {});

    let pokemon: IStoredPokemon = {
      id: Random.uuid(),
      trainerId: Random.uuid(),
      squadOrder: 1,
      speciesId: Random.integerInclusive(1, 151),
      level: Random.integerInclusive(1, 100),
      stats: {
        hitPoints: hitPoints,
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
      currentValues: {
        hitPoints: hitPoints.value,
        pp: pp,
      }
    };

    return Object.assign(pokemon, overrides);
  }

  public static create(overrides?): Promise<IStoredPokemon> {
    let pokemon = StoredPokemonFactory.build(overrides);
    let pokemonService = new PokemonService();
    return pokemonService.create(pokemon);
  }

  public static createWithTrainer(): Promise<IStoredPokemon> {
    return TrainerFactory.create()
      .then((trainer) => {
        return StoredPokemonFactory.create({
          trainerId: trainer.id,
          squadOrder: 1,
        });
      });
  }

  private static randomStat(): IPokemonStat {
    return {
      value: Random.integerInclusive(11, 100),
      individualValue: Random.integerInclusive(0, 31),
      effortValue: Random.integerInclusive(0, 252),
    };
  }
}
