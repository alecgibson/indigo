import IPokemon from '../Pokemon/IPokemon';
import IMove from './IMove';

export default interface IAttack {
  attacker: IPokemon;
  defender: IPokemon;
  move: IMove;
}
