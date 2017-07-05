import {IBattleState} from "../models/IBattleState";
import {IBattle} from "../models/IBattle";
import {IBattleTurnResponse} from "../models/IBattleTurnResponse";

export interface IBattleTurnProcessor {
  process(battle: IBattle, battleStates: IBattleState[]): Promise<IBattleTurnResponse>;
}
