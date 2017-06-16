import {BattleState} from "./BattleState";
import {Squad} from "./Squad";

export interface IBattle {
    id: string;
    nextTurnTrainerId: string;
    squadsByTrainer: Map<string, Array<Squad>>;
    state: BattleState;
}