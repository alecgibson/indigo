import {Type} from "./type";

export interface Pokemon {
    level: number;
    attack: number;
    specialAttack: number;
    defence: number;
    specialDefence: number;
    types: Type[];
}
