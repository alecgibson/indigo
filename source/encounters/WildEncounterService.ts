import {IWildEncounter} from "../models/IWildEncounter";
import {inject, injectable} from "inversify";
import {RoughCoordinates} from "../models/RoughCoordinates";
import {IGeoCoordinates} from "../models/IGeoCoordinates";
import {Async} from "../utilities/Async";
import {TrainerService} from "../battles/TrainerService";
import {BattleService} from "../battles/BattleService";
import {TrainerType} from "../models/TrainerType";
import {Transaction} from "sequelize";
import {PokemonSpawner} from "../pokemon/PokemonSpawner";
import {PokemonService} from "../pokemon/PokemonService";
import {IBattle} from "../models/IBattle";
import {UserService} from "../users/UserService";
const WildEncounter = require("../sequelize/index").wildEncounters;
const SeenEncounter = require("../sequelize/index").seenEncounters;
const sequelize = require("../sequelize/index").sequelize;

@injectable()
export class WildEncounterService {
  private readonly SEARCH_RADIUS_METRES = 100;

  public constructor(@inject(TrainerService) private trainers: TrainerService,
                     @inject(BattleService) private battles: BattleService,
                     @inject(PokemonSpawner) private pokemonSpawner: PokemonSpawner,
                     @inject(PokemonService) private pokemonService: PokemonService,
                     @inject(UserService) private users: UserService) {
  }

  public create(encounter: IWildEncounter): Promise<IWildEncounter> {
    return WildEncounter.create({
      startTime: encounter.startTime,
      endTime: encounter.endTime,
      speciesId: encounter.speciesId,
      level: encounter.level,
      latitude: encounter.coordinates.latitude,
      longitude: encounter.coordinates.longitude,
      xMetres: encounter.cartesianMetres.x,
      yMetres: encounter.cartesianMetres.y,
    });
  }

  public get(id: string, transaction?: Transaction): Promise<IWildEncounter> {
    return WildEncounter.findById(id, {transaction})
      .then((result) => {
        return this.databaseResultToEncounter(result);
      });
  }

  public getByLocation(location: IGeoCoordinates, userId: string): Promise<IWildEncounter[]> {
    let coordinates = new RoughCoordinates(location.latitude, location.longitude);
    let cartesianMetres = coordinates.toCartesianMetres();
    let now = new Date();
    return sequelize.query(
      `SELECT * FROM "wildEncounters" AS we
      WHERE "xMetres" > :xLowerLimit
      AND "xMetres" < :xUpperLimit
      AND "yMetres" > :yLowerLimit
      AND "yMetres" < :yUpperLimit
      AND "startTime" < :now
      AND "endTime" > :now
      AND NOT EXISTS(
        SELECT * FROM "seenEncounters" AS se
        WHERE se."userId" = :userId
        AND se."wildEncounterId" = we.id
      );`,
      {
        replacements: {
          xLowerLimit: cartesianMetres.x - this.SEARCH_RADIUS_METRES,
          xUpperLimit: cartesianMetres.x + this.SEARCH_RADIUS_METRES,
          yLowerLimit: cartesianMetres.y - this.SEARCH_RADIUS_METRES,
          yUpperLimit: cartesianMetres.y + this.SEARCH_RADIUS_METRES,
          now: now,
          userId: userId,
        },
        model: WildEncounter,
      }
    ).then((results) => {
      return results.map((result) => {
        return this.databaseResultToEncounter(result);
      });
    });
  }

  public startBattle(userId: string, encounterId: string): Promise<IBattle> {
    return sequelize
      .transaction(transaction => {
        return Async.do(function*() {
          const user = yield this.users.get(userId);

          const userHasSeenEncounter = yield this.userHasSeen(user.id, encounterId, transaction);
          if (userHasSeenEncounter) {
            throw "Trainer has already seen encounter";
          }

          yield this.markAsSeen(user.id, encounterId, transaction);
          const wildTrainer = yield this.trainers.create({type: TrainerType.WILD_ENCOUNTER}, transaction);
          const wildEncounter = yield this.get(encounterId, transaction);
          const wildPokemon = this.pokemonSpawner.spawn(wildEncounter.speciesId, wildEncounter.level);
          wildPokemon.trainerId = wildTrainer.id;
          wildPokemon.squadOrder = 1;
          yield this.pokemonService.create(wildPokemon, transaction);

          return this.battles.start(user.trainerId, wildTrainer.id, transaction);
        }.bind(this));
      })
      .then(battle => {
        return Async.do(function*() {
          yield this.battles.sendStartBattleEventsToUsers(battle);
          return battle;
        }.bind(this));
      });
  }

  public garbageCollect() {
    return WildEncounter.destroy(
      {
        where: {
          endTime: {lt: new Date()},
        }
      }
    );
  }

  public markAsSeen(userId: string, encounterId: string, transaction?: Transaction) {
    return SeenEncounter.create({userId: userId, wildEncounterId: encounterId}, {transaction});
  }

  public userHasSeen(userId: string, encounterId: string, transaction?: Transaction): Promise<boolean> {
    return SeenEncounter.findOne({
      where: {
        userId: userId,
        wildEncounterId: encounterId,
      },
      transaction: transaction,
    }).then(result => !!result);
  }

  public startTestEncounterBattle(userId: string) {
    return Async.do(function*() {
      const user = yield this.users.get(userId);
      const battleState = yield this.battles.getTrainerBattleState(user.trainerId);
      if (battleState) {
        yield this.battles.destroy(battleState.battleId);
      }

      const encounters = yield sequelize.query(
        `SELECT * FROM "wildEncounters" AS we
        WHERE NOT EXISTS(
          SELECT * FROM "seenEncounters" AS se
          WHERE se."userId" = :userId
          AND se."wildEncounterId" = we.id
        );`,
        {
          replacements: {
            userId: userId,
          },
          model: WildEncounter,
        }
      );

      return this.startBattle(userId, encounters[0].id);
    }.bind(this));
  }

  private databaseResultToEncounter(result) {
    if (!result) {
      return null;
    }

    let encounter: IWildEncounter = {
      id: result.id,
      startTime: result.startTime,
      endTime: result.endTime,
      speciesId: result.speciesId,
      level: result.level,
      coordinates: {
        latitude: result.latitude,
        longitude: result.longitude,
      },
      cartesianMetres: {
        x: result.xMetres,
        y: result.yMetres,
      },
    };

    return encounter;
  }
}
