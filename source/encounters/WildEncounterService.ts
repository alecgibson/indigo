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
const WildEncounter = require("../sequelize/index").wildEncounters;
const SeenEncounter = require("../sequelize/index").seenEncounters;
const sequelize = require("../sequelize/index").sequelize;

@injectable()
export class WildEncounterService {
  private readonly SEARCH_RADIUS_METRES = 100;

  public constructor(@inject(TrainerService) private trainers: TrainerService,
                     @inject(BattleService) private battles: BattleService,
                     @inject(PokemonSpawner) private pokemonSpawner: PokemonSpawner,
                     @inject(PokemonService) private pokemonService: PokemonService) {
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

  // TODO: Filter out Encounters already seen
  public getByLocation(location: IGeoCoordinates): Promise<IWildEncounter[]> {
    let coordinates = new RoughCoordinates(location.latitude, location.longitude);
    let cartesianMetres = coordinates.toCartesianMetres();
    let now = new Date();
    return WildEncounter.findAll({
      where: {
        $and: [
          {xMetres: {gt: cartesianMetres.x - this.SEARCH_RADIUS_METRES}},
          {xMetres: {lt: cartesianMetres.x + this.SEARCH_RADIUS_METRES}},
          {yMetres: {gt: cartesianMetres.y - this.SEARCH_RADIUS_METRES}},
          {yMetres: {lt: cartesianMetres.y + this.SEARCH_RADIUS_METRES}},
          {startTime: {lt: now}},
          {endTime: {gt: now}},
        ],
      },
    }).then((results) => {
      return results.map((result) => {
        return this.databaseResultToEncounter(result);
      });
    });
  }

  public startBattle(trainerId: string, encounterId: string): Promise<IBattle> {
    return sequelize.transaction(transaction => {
      return Async.do(function*() {
        const trainerHasSeenEncounter = yield this.trainerHasSeen(trainerId, encounterId, transaction);
        if (trainerHasSeenEncounter) {
          throw "Trainer has already seen encounter";
        }

        yield this.markAsSeen(trainerId, encounterId, transaction);
        const wildTrainer = yield this.trainers.create({type: TrainerType.WILD_ENCOUNTER}, transaction);
        const wildEncounter = yield this.get(encounterId, transaction);
        const wildPokemon = this.pokemonSpawner.spawn(wildEncounter.speciesId, wildEncounter.level);
        wildPokemon.trainerId = wildTrainer.id;
        wildPokemon.squadOrder = 1;
        yield this.pokemonService.create(wildPokemon, transaction);

        return this.battles.start(trainerId, wildTrainer.id, transaction);
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

  public markAsSeen(trainerId: string, encounterId: string, transaction?: Transaction) {
    return SeenEncounter.create({trainerId: trainerId, wildEncounterId: encounterId}, {transaction});
  }

  public trainerHasSeen(trainerId: string, encounterId: string, transaction?: Transaction): Promise<boolean> {
    return SeenEncounter.findOne({
      where: {
        trainerId: trainerId,
        wildEncounterId: encounterId,
      },
      transaction: transaction,
    }).then(result => !!result);
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
