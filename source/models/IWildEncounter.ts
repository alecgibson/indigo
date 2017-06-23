import {ICartesianCoordinates} from "./ICartesianCoordinates";
import {IGeoCoordinates} from "./IGeoCoordinates";

export interface IWildEncounter {
  id?: string;
  startTime: Date;
  endTime: Date;
  pokemonId: string;
  coordinates: IGeoCoordinates;
  cartesianMetres: ICartesianCoordinates;
}
