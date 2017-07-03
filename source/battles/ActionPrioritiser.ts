import {inject, injectable} from "inversify";
import {MoveLookup} from "../moves/MoveLookup";
import {IBattleAction} from "../models/IBattleAction";
import {IBattleMoveAction} from "../models/IBattleMoveAction";
import {BattleActionType} from "../models/BattleActionType"
import {IBattleActionAndPokemon} from "../models/IBattleActionAndPokemon";

@injectable()
export class ActionPrioritiser {
  public constructor(@inject(MoveLookup) private moveLookup: MoveLookup) {}

  public prioritise(actions: IBattleActionAndPokemon[]) {
    // Return a copy of the array
    return actions.concat().sort((a, b) => {
      let priorityA = this.priority(a.action);
      let priorityB = this.priority(b.action);

      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }

      return b.pokemon.stats.speed.value - a.pokemon.stats.speed.value;
    });
  }

  private priority(action: IBattleAction): number {
    if (action.type === BattleActionType.SWITCH) {
      return 200;
    }

    if (action.type === BattleActionType.USE_ITEM) {
      return 100;
    }

    if (action.type === BattleActionType.FLEE) {
      return 0;
    }

    if (action.type === BattleActionType.MOVE) {
      let moveAction = action as IBattleMoveAction;
      let move = this.moveLookup.byId(moveAction.moveId);
      return move.priority;
    }
  }
}