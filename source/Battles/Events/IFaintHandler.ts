import IBattleEvent from './IBattleEvent';
import IPokemon from '../../Pokemon/IPokemon';
import IBattleState from '../IBattleState';

export default interface IFaintHandler {
  events(state: IBattleState, pokemon: IPokemon): IBattleEvent[];
}
