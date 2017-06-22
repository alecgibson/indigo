import {Container} from "inversify";
import "reflect-metadata";
import {IWebSocketRouter} from "./routes/IWebSocketRouter";
import {WebSocketRouter} from "./routes/WebSocketRouter";
import {BattleMoveRoute} from "./routes/BattleMoveRoute";
import {UserService} from "./users/UserService";
import {SessionService} from "./users/SessionService";
import {PokemonLookup} from "./pokemon/PokemonLookup";
import {BattleService} from "./battle/BattleService";

const container = new Container();

container.bind<BattleMoveRoute>(BattleMoveRoute).toSelf().inSingletonScope();
container.bind<BattleService>(BattleService).toSelf().inSingletonScope();
container.bind<PokemonLookup>(PokemonLookup).toSelf().inSingletonScope();
container.bind<SessionService>(SessionService).toSelf().inSingletonScope();
container.bind<UserService>(UserService).toSelf().inSingletonScope();
container.bind<IWebSocketRouter>(WebSocketRouter).to(WebSocketRouter).inSingletonScope();

export default container;
