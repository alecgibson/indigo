import {IPokemonStat, IStoredPokemon} from "../../source/models/IStoredPokemon";
import {Gender} from "../../source/models/Gender";
import {Nature} from "../../source/models/Nature";
import {Random} from "../../source/utilities/Random";
import {PokemonService} from "../../source/pokemon/PokemonService";
import {TrainerFactory} from "./TrainerFactory";
import {MoveLookup} from "../../source/moves/MoveLookup";
import {PokemonLookup} from "../../source/pokemon/PokemonLookup";

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
    const pokemon = StoredPokemonFactory.build(overrides);
    const moveLookup = new MoveLookup();
    const pokemonLookup = new PokemonLookup();
    const pokemonService = new PokemonService(moveLookup, pokemonLookup);
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

  public static buildWithStats(stats): IStoredPokemon {
    let hitPoints = StoredPokemonFactory.randomStat();
    hitPoints.value = stats.hitPoints || hitPoints.value;

    let attack = StoredPokemonFactory.randomStat();
    attack.value = stats.attack || attack.value;

    let defense = StoredPokemonFactory.randomStat();
    defense.value = stats.defense || defense.value;

    let specialAttack = StoredPokemonFactory.randomStat();
    specialAttack.value = stats.specialAttack || specialAttack.value;

    let specialDefense = StoredPokemonFactory.randomStat();
    specialDefense.value = stats.specialDefense || specialDefense.value;

    let speed = StoredPokemonFactory.randomStat();
    speed.value = stats.speed || speed.value;

    return StoredPokemonFactory.build({
      stats: {
        hitPoints: hitPoints,
        attack: attack,
        defense: defense,
        specialAttack: specialAttack,
        specialDefense: specialDefense,
        speed: speed,
      },
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
