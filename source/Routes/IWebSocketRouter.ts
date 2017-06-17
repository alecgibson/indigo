import * as WebSocket from "ws";

export interface IWebSocketRouter {
    route(webSocket: WebSocket, data: WebSocket.Data);
}
