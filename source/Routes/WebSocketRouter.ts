import * as WebSocket from "ws";
import {IRequest} from "../Models/Requests/IRequest";
import {BattleMoveRoute} from "./BattleMoveRoute";
import {IRoute} from "./IRoute";
import {IWebSocketRouter} from "./IWebSocketRouter";
import {inject, injectable} from "inversify";
import {UserService} from "../Users/UserService";
import {IUser} from "../Models/IUser";

@injectable()
export class WebSocketRouter implements IWebSocketRouter {
  private readonly routes: Map<string, IRoute>;

  public constructor(@inject(UserService) private users: UserService,
                     @inject(BattleMoveRoute) battleMove: BattleMoveRoute,) {
    this.routes = new Map();
    this.routes.set('battleMove', battleMove);
  }

  public connect(webSocket: WebSocket, newSessionToken: string) {
    this.users.validateNewSessionToken(newSessionToken)
      .then((user) => {
        if (user) {
          this.setUpRouting(webSocket, user);
          console.log(`User connected: ${user.username}`);
        }
        // TODO: Send connection message to client
      });
  }

  private route(webSocket: WebSocket, data: WebSocket.Data) {
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

  private setUpRouting(webSocket: WebSocket, user: IUser) {
    webSocket.on('message', (data) => {
      this.users.validateActiveSessionToken(user)
        .then((isValid) => {
          if (isValid) {
            this.route(webSocket, data);
          } else {
            // TODO: Send message to client
          }
        });
    });
  }

  private static castToRequest(data: WebSocket.Data): IRequest {
    try {
      return <IRequest>JSON.parse(<string>data);
    } catch (e) {
    }
  }
}