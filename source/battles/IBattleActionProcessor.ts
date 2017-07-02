import {IBattleAction} from "../models/IBattleAction";

export interface IBattleActionProcessor {
  process(action: IBattleAction);
}
