import {inject, injectable} from "inversify";
import {IBattleState} from "../models/IBattleState";
import {ActionPrioritiser} from "./ActionPrioritiser";
import {PokemonService} from "../pokemon/PokemonService";
import {IBattleAction} from "../models/IBattleAction";
import {IBattleActionProcessor} from "./IBattleActionProcessor";
import {BattleActionType} from "../models/BattleActionType";
import {BattleMoveActionProcessor} from "./BattleMoveActionProcessor";
import {IBattleTurnProcessor} from "./IBattleTurnProcessor";
import {IBattleActionResponse} from "../models/IBattleActionResponse";
import {Async} from "../utilities/Async";
import {IPokemonService} from "../pokemon/IPokemonService";

@injectable()
export class BattleTurnProcessor implements IBattleTurnProcessor {
  public constructor(@inject(ActionPrioritiser) private actionPrioritiser: ActionPrioritiser,
                     @inject(BattleMoveActionProcessor) private moveProcessor: BattleMoveActionProcessor) {
  }

  public process(battleStates: IBattleState[]) {
    return Async.do(function* () {
      let prioritisedActions = yield this.actionPrioritiser.prioritise(battleStates);
      return this.processActions(prioritisedActions);
    }.bind(this));
  }

  private processActions(actions: IBattleAction[]) {
    let actionQueue = [];
    for (let action of actions) {
      actionQueue.push(() => {
        return this.processAction(action);
      });
    }

    return Async.do(function* () {
      let response = {
        events: [],
      };

      while (actionQueue.length) {
        let action = actionQueue.shift();
        let actionEvents = yield action();
        response.events.concat(actionEvents);
      }

      return response;
    });
  }

  private processAction(action: IBattleAction) {
    return this.actionProcessor(action).process(action);
  }

  private actionProcessor(action: IBattleAction): IBattleActionProcessor {
    switch (action.type) {
      case BattleActionType.MOVE:
        return this.moveProcessor;
    }
  }
}
