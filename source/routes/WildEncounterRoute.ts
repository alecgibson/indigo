import {IRoute} from "./IRoute";
import {IWildEncounterRequest} from "../models/requests/IWildEncounterRequest";
import {inject, injectable} from "inversify";
import {WildEncounterService} from "../encounters/WildEncounterService";
import {WebSocketService} from "../users/WebSocketService";

@injectable()
export class WildEncounterRoute implements IRoute {
  public constructor(@inject(WildEncounterService) private wildEncounters: WildEncounterService,
                     @inject(WebSocketService) private webSockets: WebSocketService) {
  }

  public handle(message: IWildEncounterRequest) {
    switch (message.method) {
      case 'getAll':
        this.getAll(message);
        break;
      case 'startBattle':
        this.startBattle(message);
        break;
      case 'testBattle':
        this.testBattle(message);
        break;
      default:
        console.warn('Unrecognised Wild Encounter request: ' + message.method);
    }
  }

  private getAll(message: IWildEncounterRequest) {
    const location = message.location;

    this.wildEncounters.getByLocation(location, message.userId)
      .then((encounters) => {
        let strippedEncounters = encounters.map((encounter) => {
          return {
            id: encounter.id,
            location: encounter.coordinates,
            speciesId: encounter.speciesId
          };
        });

        this.webSockets.sendMessage(message.userId, {
          type: 'wildEncounters',
          encounters: strippedEncounters,
        });
      });
  }

  private startBattle(message: IWildEncounterRequest) {
    this.wildEncounters.startBattle(message.userId, message.encounterId);
  }

  private testBattle(message: IWildEncounterRequest) {
    this.wildEncounters.startTestEncounterBattle(message.userId);
  }
}
