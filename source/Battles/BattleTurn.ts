import IBattleState from './IBattleState';
import BattleAction from './Actions/BattleAction';
import IBattleEvent from './Events/IBattleEvent';

export default class BattleTurn {
  private readonly state: IBattleState;
  private readonly actions: BattleAction[];

  public constructor(state: IBattleState, ...actions: BattleAction[]) {
    this.state = state;
    this.actions = actions.sort((a, b) => b.priority() - a.priority());
  }

  public events(): IBattleEvent[] {
    let state = this.state;

    return this.actions.map((action: BattleAction) => {
      const event = action.event(state);
      state = event.state;
      return event;
    });
  }
}
