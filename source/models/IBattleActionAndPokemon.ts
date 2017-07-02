import {IBattleAction} from "./IBattleAction";
import {IStoredPokemon} from "./IStoredPokemon";

export interface IBattleActionAndPokemon {
  action: IBattleAction;
  pokemon: IStoredPokemon;
}
