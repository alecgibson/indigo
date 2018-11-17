import IBattleEvent from './IBattleEvent';
import IAttack from '../../Moves/IAttack';
import { BattleEventType } from './BattleEventType';

export default interface IAttackBattleEvent extends IBattleEvent {
  type: BattleEventType.Attack;
  attack: IAttack;
  missedTarget: boolean;
}
