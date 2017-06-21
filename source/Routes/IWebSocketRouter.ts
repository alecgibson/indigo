import * as WebSocket from "ws";

export interface IWebSocketRouter {
    connect(webSocket: WebSocket, newSessionToken: string);
}
