import {Container} from "inversify";
import "reflect-metadata";
import {IWebSocketRouter} from "./Routes/IWebSocketRouter";
import {WebSocketRouter} from "./Routes/WebSocketRouter";
import {BattleMoveRoute} from "./Routes/BattleMoveRoute";
import {IBattleService} from "./Battle/IBattleService";
import {BattleService} from "./Battle/BattleService";
import {UserService} from "./Users/UserService";
import {SessionService} from "./Users/SessionService";

const container = new Container();

container.bind<BattleMoveRoute>(BattleMoveRoute).to(BattleMoveRoute);
container.bind<IBattleService>(BattleService).to(BattleService);
container.bind<SessionService>(SessionService).to(SessionService);
container.bind<UserService>(UserService).to(UserService);
container.bind<IWebSocketRouter>(WebSocketRouter).to(WebSocketRouter);

export default container;
