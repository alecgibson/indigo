import {Random} from "../../source/utilities/Random";
import {BattleActionType} from "../../source/models/BattleActionType";
import {IBattleMoveAction} from "../../source/models/IBattleMoveAction";
import {IBattleSwitchAction} from "../../source/models/IBattleSwitchAction";
import {IBattleAction} from "../../source/models/IBattleAction";
import {IBattleItemAction} from "../../source/models/IBattleItemAction";

export class BattleActionFactory {
  public static moveAction(moveId?: number): IBattleMoveAction {
    let action: IBattleMoveAction = {
      trainerId: Random.uuid(),
      battleId: Random.uuid(),
      type: BattleActionType.MOVE,
      moveId: moveId || Random.integerInclusive(1, 354),
    };

    return action;
  }

  public static switchAction(pokemonId?: string): IBattleSwitchAction {
    let action: IBattleSwitchAction = {
      trainerId: Random.uuid(),
      battleId: Random.uuid(),
      type: BattleActionType.SWITCH,
      switchPokemonId: pokemonId || Random.uuid(),
    };

    return action;
  }

  public static fleeAction(): IBattleAction {
    let action: IBattleAction = {
      trainerId: Random.uuid(),
      battleId: Random.uuid(),
      type: BattleActionType.FLEE,
    };

    return action;
  }

  public static itemAction(itemId?: number): IBattleItemAction {
    let action: IBattleItemAction = {
      trainerId: Random.uuid(),
      battleId: Random.uuid(),
      type: BattleActionType.USE_ITEM,
      // TODO: Adjust this range
      itemId: itemId || Random.integerInclusive(1, 100),
    };

    return action;
  }
}
