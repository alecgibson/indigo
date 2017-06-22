import {IPokemon} from "../models/IPokemon";

export interface IPokemonService {
    updatePokemon(pokemon: IPokemon);
}