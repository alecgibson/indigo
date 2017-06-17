import * as WebSocket from "ws";
import {IRequest} from "../Models/Requests/IRequest";
import {BattleMoveRoute} from "./BattleMoveRoute";
import {IRoute} from "./IRoute";
import {IWebSocketRouter} from "./IWebSocketRouter";
import {inject, injectable} from "inversify";

@injectable()
export class WebSocketRouter implements IWebSocketRouter {
    private readonly routes: Map<string, IRoute>;

    public constructor(
        @inject(BattleMoveRoute) battleMove: BattleMoveRoute
    ) {
        this.routes = new Map();
        this.routes.set('battleMove', battleMove);
    }

    public route(webSocket: WebSocket, data: WebSocket.Data) {
        let message = WebSocketRouter.castToRequest(data);
        if (!message) {
            console.warn("Unsupported WebSocket message");
            return;
        }

        let route = this.routes.get(message.type);
        if (!route) {
            console.warn("Unsupported message type");
            return;
        }

        route.handle(webSocket, message);
    }

    private static castToRequest(data: WebSocket.Data): IRequest {
        try {
            return <IRequest>JSON.parse(<string>data);
        } catch (e) {
        }
    }
}