import {RoughCoordinates} from "../models/RoughCoordinates";
import {Random} from "../utilities/Random";
import {EncounterRate} from "../models/EncounterRate";
import {PokemonLookup} from "./PokemonLookup";
import {inject} from "inversify";
import {PokemonSpawner} from "./PokemonSpawner";

export class WildEncounterGenerator {
  private readonly MAX_LATITUDE = 60.348967;
  private readonly MIN_LATITUDE = 50.0205013;
  private readonly MAX_LONGITUDE = 1.6766941;
  private readonly MIN_LONGITUDE = -11.8155738;
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
                     @inject(PokemonSpawner) private pokemonSpawner: PokemonSpawner) {
  }

  public generate() {
    let numberOfPokemon = this.numberOfPokemonToGenerate();
    for (let i = 0; i < numberOfPokemon; i++) {
      let pokemonPool = this.pokemonLookup.byEncounterRate(this.randomEncounterRate());
      let pokemonSpecies = pokemonPool[Random.integerExclusive(0, pokemonPool.length)];
      let level = Random.integerInclusive(this.MIN_POKEMON_LEVEL, this.MAX_POKEMON_LEVEL);
      let pokemon = this.pokemonSpawner.spawn(pokemonSpecies.id, level);
    }
  }

  private numberOfPokemonToGenerate(): number {
    let northWestBound = new RoughCoordinates(this.MAX_LATITUDE, this.MIN_LONGITUDE).toCartesianMetres();
    let southEastBound = new RoughCoordinates(this.MIN_LATITUDE, this.MAX_LONGITUDE).toCartesianMetres();

    let x = southEastBound.x - northWestBound.x;
    let y = northWestBound.y - southEastBound.y;

    let area = x * y;
    return Math.floor(this.POKEMON_PER_SQUARE_METRE * area);
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
