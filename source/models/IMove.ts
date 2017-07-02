import {DamageCategory} from "./DamageCategory";
import {Type} from "./Type";
import {MoveCategory} from "./MoveCategory";
import {Ailment} from "./Ailment";

export interface IMove {
  id: number;
  identifier: string;
  name: string;
  type: Type;
  power: number;
  pp: number;
  accuracy: number;
  priority: number;
  damageCategory: DamageCategory;
  category: MoveCategory;
  ailment: Ailment;
  minimumHits?: number;
  maximumHits?: number;
  minimumTurns?: number;
  maximumTurns?: number;
  drain: number;
  healing: number;
  criticalRate: number;
  ailmentChance: number;
  flinchChance: number;
  statChance: number;
}
