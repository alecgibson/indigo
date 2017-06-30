import {IBattleAction} from "./IBattleAction";

export interface IBattleState {
  trainerId: string;
  battleId: string;
  action?: IBattleAction
  activePokemonId: string;
}
