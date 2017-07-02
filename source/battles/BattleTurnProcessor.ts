import {injectable} from "inversify";
import {IBattleState} from "../models/IBattleState";

@injectable()
export class BattleTurnProcessor {
  public process(battleStates: IBattleState[]) {
    this.sortByActionPriority(battleStates);
  }

  private sortByActionPriority(battleStates: IBattleState[]): IBattleState[] {
    return battleStates.sort((a, b) => {
      return b.action.type - a.action.type;
    });
  }
}
