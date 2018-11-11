import IBattleState from './IBattleState';
import IBattleEvent from './Events/IBattleEvent';
import * as clone from 'clone';

export default class BattleTurn {
  private state: IBattleState;

  public constructor(state: IBattleState) {
    this.state = clone(state);
    this.state.actions.sort((a, b) => b.priority() - a.priority());
  }

  public events(): IBattleEvent[] {
    const events: IBattleEvent[] = [];

    while (this.shouldProgressTurn()) {
      const action = this.state.actions.shift();
      events.push(...action.events(this.state));

      const lastEvent = events[events.length - 1];
      this.state = clone(lastEvent.state);
    }

    return events;
  }

  private shouldProgressTurn() {
    // TODO: Handle case where first Pokemon faints before second Pokemon can attack (eg poison, wrap, recoil, etc.)
    return this.state.actions.length;
  }
}
