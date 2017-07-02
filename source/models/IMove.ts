import {DamageCategory} from "./DamageCategory";
import {Type} from "./Type";
import {MoveCategory} from "./MoveCategory";
import {Ailment} from "./Ailment";

export interface IMove {
  id: string;
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
  criticalRate: 0;
  ailmentChance: 0;
  flinchChance: 0;
  statChance: 0;
}
