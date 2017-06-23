import "reflect-metadata";
import * as fs from "fs";
import * as yaml from "js-yaml";
import {injectable} from "inversify";
import {IPokemonSpecies} from "../models/IPokemonSpecies";
import {EncounterRate} from "../models/EncounterRate";

@injectable()
export class PokemonLookup {
  private readonly DATA_DIRECTORY = 'data/pokemon';
  private readonly pokemons = [];
  private readonly pokemonsByEncounterRate: Map<EncounterRate, IPokemonSpecies[]>;

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
  }

  public byId(id: number): IPokemonSpecies {
    return this.pokemons[id - 1];
  }

  public byEncounterRate(encounterRate: EncounterRate): IPokemonSpecies[] {
    return this.pokemonsByEncounterRate[encounterRate];
  }
}
