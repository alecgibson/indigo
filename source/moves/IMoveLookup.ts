import {IMove} from "../models/IMove";

export interface IMoveLookup {
  byId(id: number): IMove;
}
