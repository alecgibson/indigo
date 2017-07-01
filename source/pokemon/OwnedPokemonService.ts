import {inject, injectable} from "inversify";
import {PokemonService} from "./PokemonService";
import {IStoredPokemon} from "../models/IStoredPokemon";
import {Transaction} from "sequelize";
const Pokemon = require("../sequelize/index").pokemon;

@injectable()
export class OwnedPokemonService {
  public constructor(@inject(PokemonService) private pokemonService: PokemonService) {
  }

  public transferPokemonTo(trainerId: string, pokemonId: string): Promise<IStoredPokemon> {
    return this.getSquadCount(trainerId)
      .then((numberOfPokemon) => {
        let squadOrder = numberOfPokemon >= 6 ? null : numberOfPokemon + 1;
        return Pokemon.update(
          {
            trainerId: trainerId,
            squadOrder: squadOrder,
          },
          {
            where: {id: pokemonId},
            returning: true,
          },
        );
      })
      .then(([affectedCount, affectedRows]) => {
        return this.pokemonService.mapDatabaseResultToPokemon(affectedRows[0]);
      });
  }

  public getSquad(trainerId: string): Promise<IStoredPokemon[]> {
    return Pokemon.findAll({
      where: {
        trainerId: trainerId,
        $not: {squadOrder: null},
      },
      order: [['squadOrder', 'ASC']],
      limit: 6,
    }).then((results) => {
      return this.mapDatabaseResultsToSquad(results);
    });
  }

  public getActivePokemon(trainerId: string, transaction: Transaction): Promise<IStoredPokemon> {
    return Pokemon.findAll({
      where: {
        // TODO: Get first squad Pokemon that hasn't fainted
        trainerId: trainerId,
        $not: {squadOrder: null},
      },
      order: [['squadOrder', 'ASC']],
      limit: 1,
      transaction: transaction,
    }).then((results) => {
      return this.mapDatabaseResultsToSquad(results)[0];
    });
  }

  private getSquadCount(trainerId: string): Promise<number> {
    return Pokemon.count({
      where: {
        trainerId: trainerId,
        $not: {squadOrder: null},
      }
    });
  }

  private mapDatabaseResultsToSquad(results): IStoredPokemon[] {
    return results.map((result) => {
      return this.pokemonService.mapDatabaseResultToPokemon(result);
    });
  }
}
