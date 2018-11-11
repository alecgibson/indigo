import IBattleState from '../IBattleState';
import IPokemon from '../../Pokemon/IPokemon';
import IBattleEvent from './IBattleEvent';
import IFaintBattleEvent from './IFaintBattleEvent';
import { BattleEventType } from './BattleEventType';
import AttackBattleAction from '../Actions/AttackBattleAction';
import IFaintHandler from './IFaintHandler';

export default class FaintHandler implements IFaintHandler {
  public events(state: IBattleState, pokemon: IPokemon): IBattleEvent[] {
    if (!this.hasFainted(pokemon)) {
      return [];
    }

    this.removePokemonAttack(state, pokemon);

    const events: any[] = [
      this.faintEvent(state, pokemon),
    ];

    return events;
  }

  private hasFainted(pokemon: IPokemon) {
    return pokemon.stats.hitPoints.current <= 0;
  }

  private removePokemonAttack(state: IBattleState, pokemon: IPokemon) {
    for (let i = state.actions.length - 1; i >= 0; i--) {
      const action = state.actions[i];
      if (action instanceof AttackBattleAction) {
        const attackAction = action as AttackBattleAction;
        if (attackAction.attack.attacker.id === pokemon.id) {
          state.actions.splice(i, 1);
        }
      }
    }
  }

  private faintEvent(state: IBattleState, pokemon: IPokemon): IFaintBattleEvent {
    return {
      type: BattleEventType.Faint,
      state: state,
      faintedPokemon: pokemon,
    };
  }
}
