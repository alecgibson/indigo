import {IMoveBattleAction} from "../models/actions/IMoveBattleAction";
import {injectable} from "inversify";

@injectable()
export class BattleService {
    submitAction(action: IMoveBattleAction) {
        throw new Error("Method not implemented.");
    }
}
