import IBattleState from '../Battles/IBattleState';
import Factory from './Factory';
import IPokemon from '../Pokemon/IPokemon';
import BattleAction from '../Battles/Actions/BattleAction';

export default class BattleStateFactory extends Factory<IBattleState> {
  private readonly pokemonsById: {[id: string]: IPokemon} = {};
  private readonly actions: BattleAction[] = [];

  public withPokemons(...pokemons: IPokemon[]) {
    pokemons.forEach((pokemon: IPokemon) => this.pokemonsById[pokemon.id] = pokemon);
    return this;
  }

  public withActions(...actions: BattleAction[]) {
    actions.forEach((action: BattleAction) => this.actions.push(action));
    return this;
  }

  protected base(): IBattleState {
    return {
      pokemonsById: this.pokemonsById,
      actions: this.actions,
    };
  }
}
