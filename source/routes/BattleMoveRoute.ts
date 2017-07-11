import {IRoute} from "./IRoute";
import {IRequest} from "../models/requests/IRequest";
import {inject, injectable} from "inversify";
import {BattleService} from "../battles/BattleService";
import {IBattleMoveAction} from "../models/IBattleMoveAction";

@injectable()
export class BattleMoveRoute implements IRoute {
    public constructor(
        @inject(BattleService) private battles: BattleService
    ) {}

    public handle(message: IRequest) {
        // let action = <IBattleMoveAction>message;
        //
        // this.validate(action);
        // this.submitToBattle(action);
        // this.acknowledgeReceiptOf(action);
    }

    private validate(action: IBattleMoveAction) {
        // TODO: Throw if invalid request
    }

    private submitToBattle(action: IBattleMoveAction) {
        this.battles.submitAction(action);
    }

    private acknowledgeReceiptOf(action: IBattleMoveAction) {
        // TODO: Inform trainer of receipt
    }
}
