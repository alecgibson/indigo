import {injectable} from "inversify";
import * as WebSocket from "ws";

@injectable()
export class WebSocketService {
  private webSocketsByUserId = {};

  public registerWebSocket(userId: string, webSocket: WebSocket) {
    this.webSocketsByUserId[userId] = webSocket;
  }

  public sendMessage(userId: string, message: any) {
    const webSocket = this.webSocketsByUserId[userId];
    webSocket.send(JSON.stringify(message));
  }
}
