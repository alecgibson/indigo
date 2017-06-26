import * as WebSocket from "ws";
import {IRequest} from "../models/requests/IRequest";
import {BattleMoveRoute} from "./BattleMoveRoute";
import {IRoute} from "./IRoute";
import {inject, injectable} from "inversify";
import {IUser} from "../models/IUser";
import {SessionService} from "../users/SessionService";
import {WildEncounterRoute} from "./WildEncounterRoute";

@injectable()
export class WebSocketRouter {
  private readonly routes: Map<string, IRoute>;

  public constructor(@inject(SessionService) private sessions: SessionService,
                     @inject(BattleMoveRoute) battleMove: BattleMoveRoute,
                     @inject(WildEncounterRoute) wildEncounter: WildEncounterRoute,) {
    this.routes = new Map();
    this.routes.set('battleMove', battleMove);
    this.routes.set('wildEncounter', wildEncounter);
  }

  public connect(webSocket: WebSocket, newSessionToken: string) {
    this.sessions.validateNewSessionToken(newSessionToken)
      .then((user) => {
        if (user) {
          this.setUpRouting(webSocket, user);
          this.notifyOfValidatedSession(webSocket, user.newSessionToken);
        } else {
          this.notifyOfInvalidatedSession(webSocket);
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

  private notifyOfValidatedSession(webSocket: WebSocket, newSessionToken: string) {
    webSocket.send(JSON.stringify({
      type: 'authentication',
      message: 'SESSION_VALIDATED',
      token: newSessionToken,
    }));
  }

  private notifyOfInvalidatedSession(webSocket: WebSocket) {
    webSocket.send(JSON.stringify({
      type: 'authentication',
      message: 'SESSION_INVALIDATED',
    }));
  }
}