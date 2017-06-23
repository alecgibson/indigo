import * as WebSocket from "ws";
import {IRoute} from "./IRoute";
import {inject, injectable} from "inversify";
import {ILocationRequest} from "../models/requests/ILocationRequest";
import {RoughCoordinates} from "../models/RoughCoordinates";
import {WildEncounterService} from "../encounters/WildEncounterService";

@injectable()
export class LocationRoute implements IRoute {
  public constructor(@inject(WildEncounterService) private wildEncounters: WildEncounterService) {
  }

  handle(webSocket: WebSocket, message: ILocationRequest) {
    let location = new RoughCoordinates(message.latitude, message.longitude);
    this.wildEncounters.getByLocation(location)
      .then((encounters) => {
        let strippedEncounters = encounters.map((encounter) => {
          return {
            id: encounter.id,
            location: encounter.coordinates,
          };
        });

        webSocket.send(JSON.stringify({
          type: 'wildEncounters',
          encounters: strippedEncounters,
        }));
      });
  }
}
