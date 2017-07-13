import {IStoredPokemon} from "../models/IStoredPokemon";
import {inject, injectable} from "inversify";
import {IPokemonService} from "./IPokemonService";
import {Transaction} from "sequelize";
import {IOwnPokemon, IOwnPokemonMove} from "../models/IOwnPokemon";
import {IOppoentPokemon} from "../models/IOppoentPokemon";
import {MoveLookup} from "../moves/MoveLookup";
import {PokemonLookup} from "./PokemonLookup";
const Pokemon = require("../sequelize/index").pokemon;
const BattleState = require("../sequelize/index").battleStates;

@injectable()
export class PokemonService implements IPokemonService {
  public constructor(@inject(MoveLookup) private moveLookup: MoveLookup,
  @inject(PokemonLookup) private pokemonLookup: PokemonLookup) {}

  public create(pokemon: IStoredPokemon, transaction?: Transaction): Promise<IStoredPokemon> {
    return Pokemon.create(this.mapPokemonToDatabase(pokemon), {transaction})
      .then((result) => {
        return this.mapDatabaseResultToPokemon(result);
      });
  }

  public get(id: string): Promise<IStoredPokemon> {
    return Pokemon.findById(id)
      .then((result) => {
        return this.mapDatabaseResultToPokemon(result);
      });
  }

  public update(pokemon: IStoredPokemon): Promise<IStoredPokemon> {
    return Pokemon.update(this.mapPokemonToDatabase(pokemon),
      {
        where: {id: pokemon.id}
      });
  }

  public battlingPokemons(battleId: string): Promise<IStoredPokemon[]> {
    return BattleState
      .findAll({
        where: {
          battleId: battleId,
        },
        include: ['activePokemon'],
      })
      .then((results) => {
        return results.map((battleState) => {
          return this.mapDatabaseResultToPokemon(battleState.activePokemon);
        })
      })
  }

  public mapDatabaseResultToPokemon(result): IStoredPokemon {
    if (!result) {
      return null;
    }

    let pokemon: IStoredPokemon = {
      id: result.id,
      trainerId: result.trainerId,
      squadOrder: result.squadOrder,
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
      currentValues: {
        hitPoints: result.currentHitPoints,
        pp: JSON.parse(result.currentPowerPoints),
      },
    };

    return pokemon;
  }

  public ownPokemon(pokemon: IStoredPokemon): IOwnPokemon {
    const ownPokemon: IOwnPokemon = {
      id: pokemon.id,
      name: this.pokemonLookup.byId(pokemon.speciesId).name,
      trainerId: pokemon.trainerId,
      squadOrder: pokemon.squadOrder,
      speciesId: pokemon.speciesId,
      level: pokemon.level,
      stats: {
        hitPoints: pokemon.stats.hitPoints.value,
        attack: pokemon.stats.attack.value,
        defense: pokemon.stats.defense.value,
        specialAttack: pokemon.stats.specialAttack.value,
        specialDefense: pokemon.stats.specialDefense.value,
        speed: pokemon.stats.speed.value,
      },
      moves: this.mapMoveIdsToMoves(pokemon.moveIds, pokemon.currentValues.pp),
      gender: pokemon.gender,
      nature: pokemon.nature,
      abilityId: pokemon.abilityId,
      currentValues: pokemon.currentValues,
    };

    return ownPokemon;
  }

  public opponentPokemon(pokemon: IStoredPokemon): IOppoentPokemon {
    const opponentPokemon: IOppoentPokemon = {
      id: pokemon.id,
      trainerId: pokemon.trainerId,
      speciesId: pokemon.speciesId,
      level: pokemon.level,
      gender: pokemon.gender,
      hitPointFraction: pokemon.currentValues.hitPoints / pokemon.stats.hitPoints.value,
    };

    return opponentPokemon;
  }

  private mapPokemonToDatabase(pokemon: IStoredPokemon) {
    return {
      trainerId: pokemon.trainerId,
      squadOrder: pokemon.squadOrder,
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
      currentHitPoints: pokemon.currentValues.hitPoints,
      currentPowerPoints: JSON.stringify(pokemon.currentValues.pp),
    }
  }

  private mapMoveIdsToMoves(moveIds: number[], currentPowerPoints: any): IOwnPokemonMove[] {
    return moveIds.map(id => {
      const move = this.moveLookup.byId(id);

      let ownPokemonMove: IOwnPokemonMove = {
        id: id,
        name: move.name,
        currentPowerPoints: currentPowerPoints[id],
        maxPowerPoints: move.pp,
      };

      return ownPokemonMove;
    });
  }
}
