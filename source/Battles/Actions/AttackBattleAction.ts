import BattleAction from './BattleAction';
import IAttack from '../../Moves/IAttack';
import { BattleEventType } from '../Events/BattleEventType';
import IBattleState from '../IBattleState';
import IAttackBattleEvent from '../Events/IAttackBattleEvent';
import IDamageCalculator from '../../Moves/IDamageCalculator';

export default class AttackBattleAction extends BattleAction {
  public readonly attack: IAttack;

  private readonly damageCalculator: IDamageCalculator;

  public constructor(damageCalculator: IDamageCalculator, attack: IAttack) {
    super();
    this.attack = attack;
    this.damageCalculator = damageCalculator;
  }

  public priority(): number {
    return this.attack.move.priority * 1000 + this.attack.attacker.stats.speed.current;
  }

  public event(state: IBattleState): IAttackBattleEvent {
    this.applyDamage(state);

    return {
      type: BattleEventType.Attack,
      state: state,
      attack: this.attack,
    };
  }

  private applyDamage(state: IBattleState) {
    const damage = this.damageCalculator.calculate(this.attack);
    const defender = state.pokemonsById[this.attack.defender.id];
    defender.stats.hitPoints.current -= damage;

    if (defender.stats.hitPoints.current < 0) {
      defender.stats.hitPoints.current = 0;
    }
  }
}
