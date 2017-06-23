import {IRequest} from "./IRequest";

export interface ILocationRequest extends IRequest {
  latitude: number;
  longitude: number;
}
