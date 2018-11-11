import IPokemon from '../Pokemon/IPokemon';
import BattleAction from './Actions/BattleAction';

export default interface IBattleState {
  pokemonsById: {[id: string]: IPokemon};
  actions: BattleAction[];
}
