import {BattleStatus} from "./BattleStatus";

export interface IBattle {
  id: string;
  status: BattleStatus;
  statesByTrainerId: any;
}
