import {Container} from "inversify";
import "reflect-metadata";
import {IWebSocketRouter} from "./Routes/IWebSocketRouter";
import {WebSocketRouter} from "./Routes/WebSocketRouter";
import {BattleMoveRoute} from "./Routes/BattleMoveRoute";
import {IBattleService} from "./Battle/IBattleService";
import {BattleService} from "./Battle/BattleService";

var container = new Container();
container.bind<IWebSocketRouter>(WebSocketRouter).to(WebSocketRouter);
container.bind<BattleMoveRoute>(BattleMoveRoute).to(BattleMoveRoute);
container.bind<IBattleService>(BattleService).to(BattleService);

export default container;
