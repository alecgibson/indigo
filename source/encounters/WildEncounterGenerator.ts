import {RoughCoordinates} from "../models/RoughCoordinates";
import {Random} from "../utilities/Random";
import {EncounterRate} from "../models/EncounterRate";
import {PokemonLookup} from "../pokemon/PokemonLookup";
import {inject, injectable} from "inversify";
import {PokemonSpawner} from "../pokemon/PokemonSpawner";
import {PokemonService} from "../pokemon/PokemonService";
import {IWildEncounter} from "../models/IWildEncounter";
import {WildEncounterService} from "./WildEncounterService";
import {ICartesianCoordinates} from "../models/ICartesianCoordinates";
import {IGeoCoordinates} from "../models/IGeoCoordinates";

@injectable()
export class WildEncounterGenerator {
  public static readonly JOB_FREQUENCY_SECONDS = 30;
  public static readonly ENCOUNTER_LIFE_TIME_MINUTES = 20;

  private readonly MAX_LATITUDE = 51.5166929;
  private readonly MIN_LATITUDE = 51.496623;
  private readonly MAX_LONGITUDE = -0.1116437;
  private readonly MIN_LONGITUDE = -0.1287656;
  private readonly POKEMON_PER_SQUARE_METRE = 1 / 40000;

  private readonly MIN_POKEMON_LEVEL = 2;
  private readonly MAX_POKEMON_LEVEL = 50;

  private readonly RELATIVE_ENCOUNTER_RATES = {
    VERY_RARE: 1,
    RARE: 10,
    SEMI_RARE: 20,
    COMMON: 50,
    VERY_COMMON: 100,
  };

  // TODO: Garbage collection?

  public constructor(@inject(PokemonLookup) private pokemonLookup: PokemonLookup,
                     @inject(PokemonSpawner) private pokemonSpawner: PokemonSpawner,
                     @inject(PokemonService) private pokemonService: PokemonService,
                     @inject(WildEncounterService) private wildEncounterService: WildEncounterService) {
  }

  public generate() {
    let numberOfPokemon = this.numberOfPokemonToGenerate();
    for (let i = 0; i < numberOfPokemon; i++) {
      let pokemonPool = this.pokemonLookup.byEncounterRate(this.randomEncounterRate());
      let pokemonSpecies = pokemonPool[Random.integerExclusive(0, pokemonPool.length)];
      let level = Random.integerInclusive(this.MIN_POKEMON_LEVEL, this.MAX_POKEMON_LEVEL);
      let pokemon = this.pokemonSpawner.spawn(pokemonSpecies.id, level);

      this.pokemonService.create(pokemon)
        .then((createdPokemon) => {
          let startTime = new Date();
          let endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + WildEncounterGenerator.ENCOUNTER_LIFE_TIME_MINUTES);

          let location = this.randomLocation();

          let encounter: IWildEncounter = {
            startTime: startTime,
            endTime: endTime,
            pokemonId: createdPokemon.id,
            speciesId: createdPokemon.speciesId,
            coordinates: location,
            cartesianMetres: location.toCartesianMetres()
          };

          return this.wildEncounterService.create(encounter);
        });
    }
  }

  private numberOfPokemonToGenerate(): number {
    let northWestBound = this.northWestBound().toCartesianMetres();
    let southEastBound = this.southEastBound().toCartesianMetres();

    let x = southEastBound.x - northWestBound.x;
    let y = northWestBound.y - southEastBound.y;

    let area = x * y;
    return Math.floor(this.POKEMON_PER_SQUARE_METRE * area *
      WildEncounterGenerator.JOB_FREQUENCY_SECONDS / (WildEncounterGenerator.ENCOUNTER_LIFE_TIME_MINUTES * 60));
  }

  private randomLocation(): RoughCoordinates {
    let northWestBound = this.northWestBound();
    let southEastBound = this.southEastBound();

    return new RoughCoordinates(
      Random.float(northWestBound.latitude, southEastBound.latitude),
      Random.float(southEastBound.longitude, northWestBound.longitude),
    );
  }

  private northWestBound(): RoughCoordinates {
    return new RoughCoordinates(this.MAX_LATITUDE, this.MIN_LONGITUDE);
  }

  private southEastBound(): RoughCoordinates {
    return new RoughCoordinates(this.MIN_LATITUDE, this.MAX_LONGITUDE);
  }

  private randomEncounterRate(): EncounterRate {
    let veryRareThreshold = this.RELATIVE_ENCOUNTER_RATES.VERY_RARE;
    let rareThreshold = veryRareThreshold + this.RELATIVE_ENCOUNTER_RATES.RARE;
    let semiRareThreshold = rareThreshold + this.RELATIVE_ENCOUNTER_RATES.SEMI_RARE;
    let commonThreshold = semiRareThreshold + this.RELATIVE_ENCOUNTER_RATES.COMMON;
    let veryCommonThreshold = commonThreshold + this.RELATIVE_ENCOUNTER_RATES.VERY_COMMON;

    let randomNumber = Random.integerInclusive(0, veryCommonThreshold);

    if (randomNumber < veryRareThreshold) {
      return EncounterRate.VERY_RARE;
    } else if (randomNumber < rareThreshold) {
      return EncounterRate.RARE;
    } else if (randomNumber < semiRareThreshold) {
      return EncounterRate.SEMI_RARE;
    } else if (randomNumber < commonThreshold) {
      return EncounterRate.COMMON;
    } else {
      return EncounterRate.VERY_COMMON;
    }
  }
}
