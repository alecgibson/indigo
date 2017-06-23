import * as WebSocket from "ws";
import {IRequest} from "../models/requests/IRequest";
import {BattleMoveRoute} from "./BattleMoveRoute";
import {IRoute} from "./IRoute";
import {inject, injectable} from "inversify";
import {IUser} from "../models/IUser";
import {SessionService} from "../users/SessionService";
import {LocationRoute} from "./LocationRoute";

@injectable()
export class WebSocketRouter {
  private readonly routes: Map<string, IRoute>;

  public constructor(@inject(SessionService) private sessions: SessionService,
                     @inject(LocationRoute) private location: LocationRoute,
                     @inject(BattleMoveRoute) battleMove: BattleMoveRoute,) {
    this.routes = new Map();
    this.routes.set('location', location);
    this.routes.set('battleMove', battleMove);
  }

  public connect(webSocket: WebSocket, newSessionToken: string) {
    this.sessions.validateNewSessionToken(newSessionToken)
      .then((user) => {
        if (user) {
          this.setUpRouting(webSocket, user);
          console.log(`User connected: ${user.username}`);
        } else {
          webSocket.send(JSON.stringify({
            type: 'authentication',
            message: 'You are not authenticated'
          }));
        }
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
      this.sessions.validateActiveSessionToken(user)
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