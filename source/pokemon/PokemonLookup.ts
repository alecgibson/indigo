import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import { EncounterRate } from './EncounterRate';
import IPokemonSpecies from './IPokemonSpecies';
import { EvolutionTrigger } from './EvolutionTrigger';

export default class PokemonLookup {
  private readonly DATA_DIRECTORY = 'data/pokemon';
  private readonly pokemons: IPokemonSpecies[] = [];
  private readonly pokemonsByEncounterRate: Map<EncounterRate, IPokemonSpecies[]>;
  private readonly pokemonsByNextEvolvedId: Map<number, IPokemonSpecies>;

  public constructor() {
    fs.readdirSync(this.DATA_DIRECTORY).forEach(filename => {
      const pokemonYaml = fs.readFileSync(`${this.DATA_DIRECTORY}/${filename}`, 'utf8');
      const pokemon = yaml.safeLoad(pokemonYaml);
      this.pokemons.push(pokemon);
    });

    this.pokemonsByEncounterRate = this.pokemons
      .reduce((map: Map<EncounterRate, IPokemonSpecies[]>, pokemon: IPokemonSpecies) => {
        const pokemons = map.get(pokemon.encounterRate) || [];
        pokemons.push(pokemon);
        map.set(pokemon.encounterRate, pokemons);
        return map;
      }, new Map<EncounterRate, IPokemonSpecies[]>());

    this.pokemonsByNextEvolvedId = this.pokemons
      .reduce((map: Map<number, IPokemonSpecies>, pokemon: IPokemonSpecies) => {
        if (pokemon.evolution) {
          map.set(pokemon.evolution.evolvedPokemonId, pokemon);
        }

        return map;
      }, new Map<number, IPokemonSpecies>());
  }

  public byId(id: number): IPokemonSpecies {
    return this.pokemons[id - 1];
  }

  public byEncounterRate(encounterRate: EncounterRate): IPokemonSpecies[] {
    return this.pokemonsByEncounterRate.get(encounterRate);
  }

  public minimumLevel(id: number): number {
    const previousEvolution = this.pokemonsByNextEvolvedId.get(id);
    return previousEvolution && (previousEvolution.evolution.trigger === EvolutionTrigger.LEVEL_UP)
      ? previousEvolution.evolution.level : 1;
  }
}
