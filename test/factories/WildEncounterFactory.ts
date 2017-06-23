import {IWildEncounter} from "../../source/models/IWildEncounter";
import {Random} from "../../source/utilities/Random";
import {RoughCoordinates} from "../../source/models/RoughCoordinates";

export class WildEncounterFactory {
  public static build(overrides?): IWildEncounter {
    let startTime = new Date();
    let endTime = new Date();
    startTime.setMinutes(startTime.getMinutes() - 5);
    endTime.setMinutes(endTime.getMinutes() + 5);

    let location = new RoughCoordinates(50, 0);
    if (overrides.coordinates) {
      location = new RoughCoordinates(overrides.coordinates.latitude, overrides.coordinates.longitude);
    }

    let encounter: IWildEncounter = {
      startTime: startTime,
      endTime: endTime,
      pokemonId: Random.uuid(),
      coordinates: location,
      cartesianMetres: location.toCartesianMetres(),
    };

    return Object.assign(encounter, overrides);
  }
}