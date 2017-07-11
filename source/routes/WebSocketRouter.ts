import * as WebSocket from "ws";
import {IRequest} from "../models/requests/IRequest";
import {BattleMoveRoute} from "./BattleMoveRoute";
import {IRoute} from "./IRoute";
import {inject, injectable} from "inversify";
import {IUser} from "../models/IUser";
import {SessionService} from "../users/SessionService";
import {WildEncounterRoute} from "./WildEncounterRoute";
import {WebSocketService} from "../users/WebSocketService";

@injectable()
export class WebSocketRouter {
  private readonly routes: Map<string, IRoute>;

  public constructor(@inject(SessionService) private sessions: SessionService,
                     @inject(BattleMoveRoute) private battleMove: BattleMoveRoute,
                     @inject(WildEncounterRoute) private wildEncounter: WildEncounterRoute,
                     @inject(WebSocketService) private webSocketService: WebSocketService) {
    this.routes = new Map();
    this.routes.set('battleMove', battleMove);
    this.routes.set('wildEncounter', wildEncounter);
  }

  public connect(webSocket: WebSocket, newSessionToken: string) {
    this.sessions.validateNewSessionToken(newSessionToken)
      .then((user) => {
        if (user) {
          this.webSocketService.registerWebSocket(user.id, webSocket);
          this.setUpRouting(webSocket, user);
          this.notifyOfValidatedSession(user.id, user.newSessionToken);
        } else {
          this.notifyOfInvalidatedSession(webSocket);
        }
      });
  }

  private route(user: IUser, data: WebSocket.Data) {
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

    if (message.userId !== user.id) {
      console.warn("User ID mismatch");
      return;
    }

    route.handle(message);
  }

  private setUpRouting(webSocket: WebSocket, user: IUser) {
    webSocket.on('message', (data) => {
      this.sessions.validateActiveSessionToken(user)
        .then((isValid) => {
          if (isValid) {
            this.route(user, data);
          } else {
            this.notifyOfInvalidatedSession(webSocket);
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

  private notifyOfValidatedSession(userId: string, newSessionToken: string) {
    this.webSocketService.sendMessage(userId, {
      type: 'authentication',
      message: 'SESSION_VALIDATED',
      userId: userId,
      token: newSessionToken,
    });
  }

  private notifyOfInvalidatedSession(webSocket: WebSocket) {
    webSocket.send(JSON.stringify({
      type: 'authentication',
      message: 'SESSION_INVALIDATED',
    }));
  }
}