import BattleAction from './BattleAction';
import IAttack from '../../Moves/IAttack';
import { BattleEventType } from '../Events/BattleEventType';
import IBattleState from '../IBattleState';
import IDamageCalculator from '../../Moves/IDamageCalculator';
import IPokemon from '../../Pokemon/IPokemon';
import IBattleEvent from '../Events/IBattleEvent';
import IAttackBattleEvent from '../Events/IAttackBattleEvent';
import IFaintHandler from '../Events/IFaintHandler';
import IStatCalculator from '../../Moves/IStatCalculator';
import IRandom from '../../Helpers/IRandom';
import IStatChange from '../../Moves/IStatChange';

export default class AttackBattleAction extends BattleAction {
  public readonly attack: IAttack;

  private readonly damageCalculator: IDamageCalculator;
  private readonly statCalculator: IStatCalculator;
  private readonly faintHandler: IFaintHandler;
  private readonly random: IRandom;

  public constructor(
    damageCalculator: IDamageCalculator,
    statCalculator: IStatCalculator,
    faintHandler: IFaintHandler,
    random: IRandom,
    attack: IAttack
  ) {
    super();
    this.attack = attack;
    this.damageCalculator = damageCalculator;
    this.statCalculator = statCalculator;
    this.faintHandler = faintHandler;
    this.random = random;
  }

  public priority(): number {
    // Use multiplier to allow for very large Speed stats
    return this.attack.move.priority * 100000 + this.attack.attacker.stats.speed.current;
  }

  // TODO: Status effects (ailments)
  // TODO: Double-slap, etc.
  // TODO: Recoil (submission, etc.)
  // TODO: Healing moves, drain moves
  // TODO: Multi-turn moves (fly, hyper beam, etc.)
  // TODO: 1-hit KO (guillotine, etc.)
  // TODO: Weather effects (sunny day, sandstorm, etc.)
  // TODO: Look for other weird moves with effects (pursuit, etc.)
  // TODO: Both Pokemon fainting (eg recoil, destiny bond, etc.)
  public events(state: IBattleState): IBattleEvent[] {
    const moveHitsTarget = this.moveHitsTarget(state);

    if (moveHitsTarget) {
      this.applyDamage(state);
      this.applyStatChange(state);
    }

    const attackEvent: IAttackBattleEvent = {
      type: BattleEventType.Attack,
      state: state,
      attack: this.attack,
      missedTarget: !moveHitsTarget,
    };

    const events: any[] = [
      attackEvent,
      ...this.faintHandler.events(state, this.defender(state)),
    ].filter(Boolean);

    return events;
  }

  private applyDamage(state: IBattleState) {
    const damage = this.damageCalculator.calculate(this.attack);
    this.defender(state).stats.hitPoints.current -= damage;
  }

  private applyStatChange(state: IBattleState) {
    const statChanges = this.attack.move.statChanges || [];
    if (!statChanges.length) {
      return;
    }

    if (this.random.integer(1, 100) > this.attack.move.statChance) {
      return;
    }

    const defender = this.defender(state);
    statChanges.forEach((change: IStatChange) => {
      this.statCalculator.apply(change.statId, change.change, defender);
    });
  }

  private moveHitsTarget(state: IBattleState): boolean {
    // Moves that always hit (eg Swift) will have a falsy accuracy
    if (!this.attack.move.accuracy) {
      return true;
    }

    const moveAccuracy = this.attack.move.accuracy;
    const multiplier = this.statCalculator.accuracyMultiplier(this.attacker(state), this.defender(state));
    const probabilityOfHit = multiplier * moveAccuracy;
    return this.random.integer(1, 100) <= probabilityOfHit;
  }

  private attacker(state: IBattleState): IPokemon {
    return state.pokemonsById[this.attack.attacker.id];
  }

  private defender(state: IBattleState): IPokemon {
    return state.pokemonsById[this.attack.defender.id];
  }
}
