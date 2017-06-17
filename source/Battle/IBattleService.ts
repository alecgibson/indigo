import {IMoveBattleAction} from "../Models/Actions/IMoveBattleAction";

export interface IBattleService {
    submitAction(action: IMoveBattleAction);
}
