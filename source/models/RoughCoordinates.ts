import {ICartesianCoordinates} from "./ICartesianCoordinates";
import {IGeoCoordinates} from "./IGeoCoordinates";

export class RoughCoordinates implements IGeoCoordinates {
  public static readonly METRES_IN_A_DEGREE = 111000;

  public constructor(public latitude: number, public longitude: number) {}

  public toCartesianMetres(): ICartesianCoordinates {
    return {
      x: this.longitude * Math.cos(this.longitude) * RoughCoordinates.METRES_IN_A_DEGREE,
      y: this.latitude * RoughCoordinates.METRES_IN_A_DEGREE,
    };
  }
}