import IMove from '../Moves/IMove';
import Factory from './Factory';
import { DamageCategory } from '../Moves/DamageCategory';
import { Type } from '../Pokemon/Type';
import { MoveCategory } from '../Moves/MoveCategory';
import { Ailment } from '../Pokemon/Ailment';

export default class MoveFactory extends Factory<IMove> {
  protected base(): IMove {
    return {
      id: 33,
      identifier: 'tackle',
      name: 'Tackle',
      type: Type.NORMAL,
      power: 50,
      pp: 35,
      accuracy: 100,
      priority: 0,
      damageCategory: DamageCategory.Physical,
      category: MoveCategory.DAMAGE,
      ailment: Ailment.NONE,
      minimumHits: null,
      maximumHits: null,
      minimumTurns: null,
      maximumTurns: null,
      drain: 0,
      healing: 0,
      criticalRate: 0,
      ailmentChance: 0,
      flinchChance: 0,
      statChance: 0,
    };
  }
}
