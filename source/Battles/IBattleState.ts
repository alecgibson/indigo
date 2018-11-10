import IPokemon from '../Pokemon/IPokemon';

export default interface IBattleState {
  turn: number;
  pokemonsById: {[id: string]: IPokemon};
}
