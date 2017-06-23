import {Container} from "inversify";
import "reflect-metadata";
import {WebSocketRouter} from "./routes/WebSocketRouter";
import {BattleMoveRoute} from "./routes/BattleMoveRoute";
import {UserService} from "./users/UserService";
import {SessionService} from "./users/SessionService";
import {PokemonLookup} from "./pokemon/PokemonLookup";
import {BattleService} from "./battle/BattleService";
import {PokemonSpawner} from "./pokemon/PokemonSpawner";
import {PokemonService} from "./pokemon/PokemonService";
import {WildEncounterService} from "./encounters/WildEncounterService";
import {LocationRoute} from "./routes/LocationRoute";
import {WildEncounterGenerator} from "./encounters/WildEncounterGenerator";

const container = new Container();

container.bind<BattleMoveRoute>(BattleMoveRoute).toSelf().inSingletonScope();
container.bind<BattleService>(BattleService).toSelf().inSingletonScope();
container.bind<LocationRoute>(LocationRoute).toSelf().inSingletonScope();
container.bind<PokemonLookup>(PokemonLookup).toSelf().inSingletonScope();
container.bind<PokemonService>(PokemonService).toSelf().inSingletonScope();
container.bind<PokemonSpawner>(PokemonSpawner).toSelf().inSingletonScope();
container.bind<SessionService>(SessionService).toSelf().inSingletonScope();
container.bind<UserService>(UserService).toSelf().inSingletonScope();
container.bind<WebSocketRouter>(WebSocketRouter).toSelf().inSingletonScope();
container.bind<WildEncounterGenerator>(WildEncounterGenerator).toSelf().inSingletonScope()
container.bind<WildEncounterService>(WildEncounterService).toSelf().inSingletonScope();

export default container;
