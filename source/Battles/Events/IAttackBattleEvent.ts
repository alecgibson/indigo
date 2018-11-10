import IBattleEvent from './IBattleEvent';
import IAttack from '../../Moves/IAttack';

export default interface IAttackBattleEvent extends IBattleEvent {
  attack: IAttack;
}
