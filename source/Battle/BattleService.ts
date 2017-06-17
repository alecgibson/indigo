import {IBattleService} from "./IBattleService";
import {IMoveBattleAction} from "../Models/Actions/IMoveBattleAction";
import {injectable} from "inversify";

@injectable()
export class BattleService implements IBattleService{
    submitAction(action: IMoveBattleAction) {
        throw new Error("Method not implemented.");
    }
}
