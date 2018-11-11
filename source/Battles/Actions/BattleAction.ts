import IBattleEvent from '../Events/IBattleEvent';
import IBattleState from '../IBattleState';

export default abstract class BattleAction {
  public abstract priority(): number;
  public abstract events(state: IBattleState): IBattleEvent[];
}
