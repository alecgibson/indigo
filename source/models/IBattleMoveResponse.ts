import {IBattleAction} from "./IBattleAction";
import {IBattleActionResponse} from "./IBattleActionResponse";

export interface IBattleMoveResponse {
  actions: IBattleAction[];
  actionResponses: IBattleActionResponse[];
}
