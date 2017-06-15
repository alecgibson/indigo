import {DamageCategory} from "./damageCategory";
import {Type} from "./type";

export interface Move {
    power: number;
    damageCategory: DamageCategory;
    type: Type;
}
