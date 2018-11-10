import { BattleEventType } from './BattleEventType';
import IBattleState from '../IBattleState';

export default interface IBattleEvent {
  type: BattleEventType;
  state: IBattleState;
}
