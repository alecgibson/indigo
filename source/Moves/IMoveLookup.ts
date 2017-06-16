import {IMove} from "./IMove";

export interface IMoveLookup {
    byId(id: number): IMove;
}
