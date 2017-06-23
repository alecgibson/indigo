import "reflect-metadata";
import * as fs from "fs";
import * as yaml from "js-yaml";
import {injectable} from "inversify";
import {IPokemonSpecies} from "../models/IPokemonSpecies";

@injectable()
export class PokemonLookup {
  private readonly DATA_DIRECTORY = 'data/pokemon';
  private readonly pokemons = [];

  public constructor() {
    fs.readdirSync(this.DATA_DIRECTORY).forEach((filename) => {
      let pokemonYaml = fs.readFileSync(`${this.DATA_DIRECTORY}/${filename}`, 'utf8');
      let pokemon = yaml.safeLoad(pokemonYaml);
      this.pokemons.push(pokemon);
    });
  }

  public byId(id: number): IPokemonSpecies {
    return this.pokemons[id - 1];
  }
}
