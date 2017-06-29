import {IWildEncounter} from "../models/IWildEncounter";
import {injectable} from "inversify";
import {RoughCoordinates} from "../models/RoughCoordinates";
import {IGeoCoordinates} from "../models/IGeoCoordinates";
const WildEncounter = require("../sequelize/index").wildEncounters;
const sequelize = require("../sequelize/index").sequelize;

@injectable()
export class WildEncounterService {
  private readonly SEARCH_RADIUS_METRES = 100;

  public create(encounter: IWildEncounter): Promise<IWildEncounter> {
    return WildEncounter.create({
      startTime: encounter.startTime,
      endTime: encounter.endTime,
      pokemonId: encounter.pokemonId,
      speciesId: encounter.speciesId,
      latitude: encounter.coordinates.latitude,
      longitude: encounter.coordinates.longitude,
      xMetres: encounter.cartesianMetres.x,
      yMetres: encounter.cartesianMetres.y,
    });
  }

  public get(id: string): Promise<IWildEncounter> {
    return WildEncounter.findById(id)
      .then((result) => {
        return this.databaseResultToEncounter(result);
      });
  }

  // TODO: Filter out Encounters already seen (check if Battle exists)
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

  public garbageCollect() {
    return sequelize.query(`
      DELETE
      FROM "pokemon" P
      USING "wildEncounters" W
      WHERE P."id" = W."pokemonId"
      AND W."endTime" < NOW();
    `);
  }

  databaseResultToEncounter(result) {
    if (!result) {
      return null;
    }

    let encounter: IWildEncounter = {
      id: result.id,
      startTime: result.startTime,
      endTime: result.endTime,
      pokemonId: result.pokemonId,
      speciesId: result.speciesId,
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
