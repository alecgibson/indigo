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
  public static readonly JOB_FREQUENCY_MINUTES = 10;

  private readonly MAX_LATITUDE = 51.5053399;
  private readonly MIN_LATITUDE = 51.5007419;
  private readonly MAX_LONGITUDE = -0.114196;
  private readonly MIN_LONGITUDE = -0.1246827;
  private readonly POKEMON_PER_SQUARE_METRE = 1 / 200;

  private readonly MIN_POKEMON_LEVEL = 2;
  private readonly MAX_POKEMON_LEVEL = 50;

  private readonly RELATIVE_ENCOUNTER_RATES = {
    VERY_RARE: 1,
    RARE: 10,
    SEMI_RARE: 20,
    COMMON: 50,
    VERY_COMMON: 100,
  };

  public constructor(@inject(PokemonLookup) private pokemonLookup: PokemonLookup,
                     @inject(PokemonSpawner) private pokemonSpawner: PokemonSpawner,
                     @inject(PokemonService) private pokemonService: PokemonService,
                     @inject(WildEncounterService) private wildEncounterService: WildEncounterService) {
  }

  public generate() {
    console.log("GENERATE POKEMON");
    // TODO: Check if this needs to run in case the cron job is restarted?
    let numberOfPokemon = this.numberOfPokemonToGenerate();
    console.log("Generating " + numberOfPokemon);
    for (let i = 0; i < numberOfPokemon; i++) {
      let pokemonPool = this.pokemonLookup.byEncounterRate(this.randomEncounterRate());
      let pokemonSpecies = pokemonPool[Random.integerExclusive(0, pokemonPool.length)];
      let level = Random.integerInclusive(this.MIN_POKEMON_LEVEL, this.MAX_POKEMON_LEVEL);
      let pokemon = this.pokemonSpawner.spawn(pokemonSpecies.id, level);

      this.pokemonService.create(pokemon)
        .then((createdPokemon) => {
          let startTime = this.randomStartTime();
          let endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + 10);

          let location = this.randomLocation();

          let encounter: IWildEncounter = {
            startTime: startTime,
            endTime: endTime,
            pokemonId: createdPokemon.id,
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
    return Math.floor(this.POKEMON_PER_SQUARE_METRE * area);
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

  private randomStartTime(): Date {
    let nowMilliseconds = Date.now();
    let refreshRateMillis = WildEncounterGenerator.JOB_FREQUENCY_MINUTES * 60 * 1000;
    let randomTime = Random.integerInclusive(nowMilliseconds, nowMilliseconds + refreshRateMillis);
    return new Date(randomTime);
  }
}
