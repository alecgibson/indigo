import {IBattleAction} from "./IBattleAction";

export interface IBattleSwitchAction extends IBattleAction {
  switchPokemonId: string;
}