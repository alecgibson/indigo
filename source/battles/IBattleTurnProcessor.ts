import {IBattleState} from "../models/IBattleState";

export interface IBattleTurnProcessor {
  process(battleStates: IBattleState[])
}
