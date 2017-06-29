import {IStoredPokemon} from "../models/IStoredPokemon";
import {injectable} from "inversify";
const Pokemon = require("../sequelize/index").pokemon;

@injectable()
export class PokemonService {
  public create(pokemon: IStoredPokemon): Promise<IStoredPokemon> {
    return Pokemon.create({
      speciesId: pokemon.speciesId,
      level: pokemon.level,
      hitPointsValue: pokemon.stats.hitPoints.value,
      hitPointsIndividualValue: pokemon.stats.hitPoints.individualValue,
      hitPointsEffortValue: pokemon.stats.hitPoints.effortValue,
      attackValue: pokemon.stats.attack.value,
      attackIndividualValue: pokemon.stats.attack.individualValue,
      attackEffortValue: pokemon.stats.attack.effortValue,
      defenseValue: pokemon.stats.defense.value,
      defenseIndividualValue: pokemon.stats.defense.individualValue,
      defenseEffortValue: pokemon.stats.defense.effortValue,
      specialAttackValue: pokemon.stats.specialAttack.value,
      specialAttackIndividualValue: pokemon.stats.specialAttack.individualValue,
      specialAttackEffortValue: pokemon.stats.specialAttack.effortValue,
      specialDefenseValue: pokemon.stats.specialDefense.value,
      specialDefenseIndividualValue: pokemon.stats.specialDefense.individualValue,
      specialDefenseEffortValue: pokemon.stats.specialDefense.effortValue,
      speedValue: pokemon.stats.speed.value,
      speedIndividualValue: pokemon.stats.speed.individualValue,
      speedEffortValue: pokemon.stats.speed.effortValue,
      moveIds: JSON.stringify(pokemon.moveIds),
      gender: pokemon.gender,
      nature: pokemon.nature,
      abilityId: pokemon.abilityId,
    });
  }

  public get(id: string): Promise<IStoredPokemon> {
    return Pokemon.findById(id)
      .then((result) => {
        if (!result) {
          return null;
        }

        let pokemon: IStoredPokemon = {
          id: result.id,
          speciesId: result.speciesId,
          level: result.level,
          stats: {
            hitPoints: {
              value: result.hitPointsValue,
              individualValue: result.hitPointsIndividualValue,
              effortValue: result.hitPointsEffortValue,
            },
            attack: {
              value: result.attackValue,
              individualValue: result.attackIndividualValue,
              effortValue: result.attackEffortValue,
            },
            defense: {
              value: result.defenseValue,
              individualValue: result.defenseIndividualValue,
              effortValue: result.defenseEffortValue,
            },
            specialAttack: {
              value: result.specialAttackValue,
              individualValue: result.specialAttackIndividualValue,
              effortValue: result.specialAttackEffortValue,
            },
            specialDefense: {
              value: result.specialDefenseValue,
              individualValue: result.specialDefenseIndividualValue,
              effortValue: result.specialDefenseEffortValue,
            },
            speed: {
              value: result.speedValue,
              individualValue: result.speedIndividualValue,
              effortValue: result.speedEffortValue,
            }
          },
          moveIds: JSON.parse(result.moveIds),
          gender: result.gender,
          nature: result.nature,
          abilityId: result.abilityId,
        };

        return pokemon;
      });
  }
}
