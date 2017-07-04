import {IStoredPokemon} from "../models/IStoredPokemon";
export interface IPokemonService {
  create(pokemon: IStoredPokemon): Promise<IStoredPokemon>;
  get(id: string): Promise<IStoredPokemon>;
  update(pokemon: IStoredPokemon): Promise<IStoredPokemon>;
  battlingPokemons(battleId: string): Promise<IStoredPokemon[]>;
  mapDatabaseResultToPokemon(result): IStoredPokemon;
}
