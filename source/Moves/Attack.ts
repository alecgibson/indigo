import IPokemon from '../Pokemon/IPokemon';
import IMove from './IMove';
import IAttack from './IAttack';

export class Attack implements IAttack {
  public attacker: IPokemon;
  public defender: IPokemon;
  public move: IMove;

  private constructor(attacker: IPokemon) {
    this.attacker = attacker;
  }

  public static by(attacker: IPokemon): Attack {
    return new Attack(attacker);
  }

  public using(move: IMove): Attack {
    this.move = move;
    return this;
  }

  public on(defender: IPokemon): Attack {
    this.defender = defender;
    return this;
  }
}
