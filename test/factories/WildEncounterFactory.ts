import {IWildEncounter} from "../../source/models/IWildEncounter";
import {Random} from "../../source/utilities/Random";
import {RoughCoordinates} from "../../source/models/RoughCoordinates";
import {WildEncounterService} from "../../source/encounters/WildEncounterService";
import {StoredPokemonFactory} from "./StoredPokemonFactory";

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
      speciesId: Random.integerInclusive(1, 151),
      coordinates: location,
      cartesianMetres: location.toCartesianMetres(),
    };

    return Object.assign(encounter, overrides);
  }

  public static create(overrides?): Promise<IWildEncounter> {
    return StoredPokemonFactory.create()
      .then((pokemon) => {
        overrides = overrides || {};
        Object.assign(overrides, {pokemonId: pokemon.id});
        let encounter = WildEncounterFactory.build(overrides);
        let wildEncounterService = new WildEncounterService();
        return wildEncounterService.create(encounter);
      });
  }
}