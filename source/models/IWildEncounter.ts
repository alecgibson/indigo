import {ICartesianCoordinates} from "./ICartesianCoordinates";
import {IGeoCoordinates} from "./IGeoCoordinates";

export interface IWildEncounter {
  id?: string;
  startTime: Date;
  endTime: Date;
  speciesId: number;
  level: number;
  coordinates: IGeoCoordinates;
  cartesianMetres: ICartesianCoordinates;
}
