import {IBattleState} from "../../source/models/IBattleState";
import {Random} from "../../source/utilities/Random";

export class BattleStateFactory {
  public static build(overrides?): IBattleState {
    let battleState: IBattleState = {
      trainerId: Random.uuid(),
      battleId: Random.uuid(),
      action: null,
      activePokemonId: Random.uuid(),
    };

    return Object.assign(battleState, overrides);
  }
}
