import BattleAction from './BattleAction';
import IAttack from '../../Moves/IAttack';
import { BattleEventType } from '../Events/BattleEventType';
import IBattleState from '../IBattleState';
import IDamageCalculator from '../../Moves/IDamageCalculator';
import IPokemon from '../../Pokemon/IPokemon';
import IBattleEvent from '../Events/IBattleEvent';
import IAttackBattleEvent from '../Events/IAttackBattleEvent';
import IFaintHandler from '../Events/IFaintHandler';

export default class AttackBattleAction extends BattleAction {
  public readonly attack: IAttack;

  private readonly damageCalculator: IDamageCalculator;
  private readonly faintHandler: IFaintHandler;

  public constructor(damageCalculator: IDamageCalculator, faintHandler: IFaintHandler, attack: IAttack) {
    super();
    this.attack = attack;
    this.damageCalculator = damageCalculator;
    this.faintHandler = faintHandler;
  }

  public priority(): number {
    return this.attack.move.priority * 1000 + this.attack.attacker.stats.speed.current;
  }

  // TODO: Status effects
  // TODO: Both Pokemon fainting (eg recoil, destiny bond, etc.)
  public events(state: IBattleState): IBattleEvent[] {
    this.applyDamage(state);

    const events: any[] = [
      this.attackEvent(state),
      ...this.faintHandler.events(state, this.defender(state)),
    ].filter(Boolean);

    return events;
  }

  private attackEvent(state: IBattleState): IAttackBattleEvent {
    return {
      type: BattleEventType.Attack,
      state: state,
      attack: this.attack,
    };
  }

  private applyDamage(state: IBattleState) {
    const damage = this.damageCalculator.calculate(this.attack);
    this.defender(state).stats.hitPoints.current -= damage;
  }

  private defender(state: IBattleState): IPokemon {
    return state.pokemonsById[this.attack.defender.id];
  }
}
