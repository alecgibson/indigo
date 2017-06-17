import * as WebSocket from "ws";
import {IRequest} from "../Models/Requests/IRequest";

export interface IRoute {
    handle(webSocket: WebSocket, message: IRequest);
}
