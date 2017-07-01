import {BattleActionType} from "./BattleActionType";

export interface IBattleAction {
  trainerId: string;
  battleId: string;
  type: BattleActionType;
}
