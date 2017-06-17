import * as WebSocket from "ws";
import {IRoute} from "./IRoute";
import {IRequest} from "../Models/Requests/IRequest";
import {inject, injectable} from "inversify";
import {IBattleService} from "../Battle/IBattleService";
import {BattleService} from "../Battle/BattleService";
import {IMoveBattleAction} from "../Models/Actions/IMoveBattleAction";

@injectable()
export class BattleMoveRoute implements IRoute {
    public constructor(
        @inject(BattleService) private battles: IBattleService
    ) {}

    public handle(webSocket: WebSocket, message: IRequest) {
        let action = <IMoveBattleAction>message;

        this.validate(action);
        this.submitToBattle(action);
        this.acknowledgeReceiptOf(action);
    }

    private validate(action: IMoveBattleAction) {
        // TODO: Throw if invalid request
    }

    private submitToBattle(action: IMoveBattleAction) {
        this.battles.submitAction(action);
    }

    private acknowledgeReceiptOf(action: IMoveBattleAction) {
        // TODO: Inform trainer of receipt
    }
}
