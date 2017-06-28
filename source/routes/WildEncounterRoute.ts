import {IRoute} from "./IRoute";
import {IWildEncounterRequest} from "../models/requests/IWildEncounterRequest";
import * as WebSocket from "ws";
import {inject, injectable} from "inversify";
import {IGeoCoordinates} from "../models/IGeoCoordinates";
import {WildEncounterService} from "../encounters/WildEncounterService";

@injectable()
export class WildEncounterRoute implements IRoute {
  public constructor(@inject(WildEncounterService) private wildEncounters: WildEncounterService) {
  }

  public handle(webSocket: WebSocket, message: IWildEncounterRequest) {
    switch(message.method) {
      case 'getAll':
        this.getAll(message.location, webSocket);
        break;
    }
  }

  private getAll(location: IGeoCoordinates, webSocket: WebSocket) {
    this.wildEncounters.getByLocation(location)
      .then((encounters) => {
        let strippedEncounters = encounters.map((encounter) => {
          return {
            id: encounter.id,
            location: encounter.coordinates,
            speciesId: encounter.speciesId
          };
        });

        console.log(JSON.stringify({
          type: 'wildEncounters',
          encounters: strippedEncounters,
        }));

        webSocket.send(JSON.stringify({
          type: 'wildEncounters',
          encounters: strippedEncounters,
        }));
      });
  }
}