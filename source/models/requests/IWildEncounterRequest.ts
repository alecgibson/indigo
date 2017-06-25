import {IGeoCoordinates} from "../IGeoCoordinates";
import {IRequest} from "./IRequest";

export interface IWildEncounterRequest extends IRequest {
  method: string;
  location?: IGeoCoordinates;
}
