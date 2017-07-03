import {IStoredPokemon} from "./IStoredPokemon";
import {IBattleActionResponse} from "./IBattleActionResponse";

export interface IBattleMoveActionResponse extends IBattleActionResponse {
  attackingPokemon: IStoredPokemon;
  defendingPokemon: IStoredPokemon;
}
