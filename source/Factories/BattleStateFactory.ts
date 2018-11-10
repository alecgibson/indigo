import IBattleState from '../Battles/IBattleState';
import Factory from './Factory';

export default class BattleStateFactory extends Factory<IBattleState> {
  protected base(): IBattleState {
    return {
      turn: 0,
      pokemonsById: {},
    };
  }
}
