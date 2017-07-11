import * as WebSocket from "ws";
import {IRequest} from "../models/requests/IRequest";

export interface IRoute {
    handle(message: IRequest);
}
