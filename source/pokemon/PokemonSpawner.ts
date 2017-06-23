import {IPokemon} from "../models/IPokemon";
export class PokemonSpawner {
  public spawn(speciesId: number, level: number): IPokemon {
    return {
      speciesId: speciesId,
      level: level,
      stats: {

      }
    }
  }
}
