import {IPokemon} from "../Models/IPokemon";

export interface IPokemonService {
    updatePokemon(pokemon: IPokemon);
}