import {IStoredPokemon} from "../../source/models/IStoredPokemon";
import {Gender} from "../../source/models/Gender";
import {Nature} from "../../source/models/Nature";
import {Random} from "../../source/utilities/Random";

export class StoredPokemonFactory {
  public static build(overrides?): IStoredPokemon {
    return Object.assign({
      id: Random.uuid(),
      speciesId: 1,
      level: 5,
      stats: {
        hitPoints: {
          value: 11,
          individualValue: 10,
          effortValue: 0,
        },
        attack: {
          value: 5,
          individualValue: 10,
          effortValue: 4,
        },
        defense: {
          value: 5,
          individualValue: 10,
          effortValue: 4,
        },
        specialAttack: {
          value: 5,
          individualValue: 10,
          effortValue: 4,
        },
        specialDefense: {
          value: 5,
          individualValue: 10,
          effortValue: 4,
        },
        speed: {
          value: 5,
          individualValue: 10,
          effortValue: 4,
        },
      },
      moveIds: [1, 2, 3, 4],
      gender: Gender.FEMALE,
      nature: Nature.BRAVE,
    }, overrides);
  }
}
