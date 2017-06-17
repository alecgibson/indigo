import {IMove} from "../Models/IMove";

export interface IMoveLookup {
  byId(id: number): IMove;
}
