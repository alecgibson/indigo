import {IMove} from "../../source/models/IMove";
import {Random} from "../../source/utilities/Random";
import {Type} from "../../source/models/Type";
import {DamageCategory} from "../../source/models/DamageCategory";
import {MoveCategory} from "../../source/models/MoveCategory";

export class MoveFactory {
  public static build(overrides?) {
    let move: IMove = {
      id: Random.integerInclusive(1, 354),
      identifier: 'move',
      name: 'Move',
      type: Type.NORMAL,
      power: 30,
      pp: 10,
      accuracy: 100,
      priority: 0,
      damageCategory: DamageCategory.Physical,
      ailment: null,
      drain: 0,
      healing: 0,
      criticalRate: 0,
      ailmentChance: 0,
      flinchChance: 0,
      statChance: 0,
      category: MoveCategory.DAMAGE,
    };

    return Object.assign(move, overrides);
  }
}
