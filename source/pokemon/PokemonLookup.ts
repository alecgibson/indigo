import * as fs from "fs";
import * as yaml from "js-yaml";
import {injectable} from "inversify";
import {IPokemonSpecies} from "../models/IPokemonSpecies";
import {EncounterRate} from "../models/EncounterRate";
import {EvolutionTrigger} from "../models/EvolutionTrigger";

@injectable()
export class PokemonLookup {
  private readonly DATA_DIRECTORY = 'data/pokemon';
  private readonly pokemons = [];
  private readonly pokemonsByEncounterRate: Map<EncounterRate, IPokemonSpecies[]>;
  private readonly pokemonsByNextEvolvedId: Map<number, IPokemonSpecies>;

  public constructor() {
    fs.readdirSync(this.DATA_DIRECTORY).forEach((filename) => {
      let pokemonYaml = fs.readFileSync(`${this.DATA_DIRECTORY}/${filename}`, 'utf8');
      let pokemon = yaml.safeLoad(pokemonYaml);
      this.pokemons.push(pokemon);
    });

    this.pokemonsByEncounterRate = this.pokemons.reduce((map, pokemon) => {
      map[pokemon.encounterRate] = map[pokemon.encounterRate] || [];
      map[pokemon.encounterRate].push(pokemon);
      return map;
    }, {});

    this.pokemonsByNextEvolvedId = this.pokemons.reduce((map, pokemon) => {
      if (!pokemon.evolution) {
        return map;
      }

      map[pokemon.evolution.evolvedPokemonId] = pokemon;
      return map;
    }, {});
  }

  public byId(id: number): IPokemonSpecies {
    return this.pokemons[id - 1];
  }

  public byEncounterRate(encounterRate: EncounterRate): IPokemonSpecies[] {
    return this.pokemonsByEncounterRate[encounterRate];
  }

  public minimumLevel(id: number): number {
    let previousEvolution = this.pokemonsByNextEvolvedId[id];
    return previousEvolution && (previousEvolution.evolution.trigger === EvolutionTrigger.LEVEL_UP)
      ? previousEvolution.evolution.level : 1;
  }
}
