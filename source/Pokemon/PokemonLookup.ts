import * as fs from "fs";
import * as yaml from "js-yaml";

export class PokemonLookup {
  private readonly DATA_DIRECTORY = 'data/pokemon';
  private readonly pokemons = [];

  // TODO: Ensure this is singleton
  public constructor() {
    fs.readdirSync(this.DATA_DIRECTORY).forEach((filename) => {
      let pokemonYaml = fs.readFileSync(`${this.DATA_DIRECTORY}/${filename}`, 'utf8');
      let pokemon = yaml.safeLoad(pokemonYaml);
      this.pokemons.push(pokemon);
    });
  }

  // TODO: Redefine IPokemon
  public byId(id: number) {
    return this.pokemons[id - 1];
  }
}
