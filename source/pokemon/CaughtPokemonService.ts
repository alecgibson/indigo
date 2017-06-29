import {inject, injectable} from "inversify";
import {IGeoCoordinates} from "../models/IGeoCoordinates";
import {PokemonService} from "./PokemonService";
import {ISquadEntry} from "../models/ISquadEntry";
const PokemonOwner = require("../sequelize/index").pokemonOwners;
const Pokemon = require("../sequelize/index").pokemon;

@injectable()
export class CaughtPokemonService {
  public constructor(@inject(PokemonService) private pokemonService: PokemonService) {}

  public addPokemon(userId: string, pokemonId: string, catchLocation: IGeoCoordinates) {
    return this.getSquadCount(userId)
      .then((numberOfPokemon) => {
        let squadOrder = numberOfPokemon >= 6 ? null : numberOfPokemon + 1;
        return PokemonOwner.create({
          userId: userId,
          pokemonId: pokemonId,
          squadOrder: squadOrder,
          latitude: catchLocation.latitude,
          longitude: catchLocation.longitude,
        });
      });
  }

  public getSquad(userId: string) {
    return PokemonOwner.findAll({
      where: {
        userId: userId,
        $not: {squadOrder: null},
      },
      order: [['squadOrder', 'ASC']],
      limit: 6,
      include: [
        {
          model: Pokemon,
        },
      ],
    }).then((results) => {
      return this.mapDatabaseResultsToSquad(results);
    });
  }

  private getSquadCount(userId: string) {
    return PokemonOwner.count({
      where: {
        userId: userId,
        $not: {squadOrder: null},
      }
    });
  }

  private mapDatabaseResultsToSquad(results): ISquadEntry[] {
    return results.map((result) => {
      return this.mapDatabaseResultToSquadEntry(result);
    });
  }

  private mapDatabaseResultToSquadEntry(result): ISquadEntry {
    let squadEntry = {
      userId: result.userId,
      pokemon: this.pokemonService.mapDatabaseResultToPokemon(result.pokemon),
      squadOrder: result.squadOrder,
      caughtDate: result.createdAt,
      caughtLocation: {
        latitude: result.latitude,
        longitude: result.longitude,
      },
    };

    return squadEntry;
  }
}
