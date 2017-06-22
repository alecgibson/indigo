import {DamageCategory} from "./DamageCategory";
import {Type} from "./Type";

export interface IMove {
    power: number;
    damageCategory: DamageCategory;
    type: Type;
}
