import {IStoredPokemon} from "../models/IStoredPokemon";
export interface IPokemonService {
  create(pokemon: IStoredPokemon): Promise<IStoredPokemon>;
  get(id: string): Promise<IStoredPokemon>;
  update(pokemon: IStoredPokemon): Promise<IStoredPokemon>;
  attackingPokemon(attackingTrainerId: string, battleId: string): Promise<IStoredPokemon>;
  defendingPokemon(attackingTrainerId: string, battleId: string): Promise<IStoredPokemon>;
  mapDatabaseResultToPokemon(result): IStoredPokemon;
}
