import {inject, injectable} from "inversify";
import {IBattleState} from "../models/IBattleState";
import {ActionPrioritiser} from "./ActionPrioritiser";
import {IBattleAction} from "../models/IBattleAction";
import {IBattleActionProcessor} from "./IBattleActionProcessor";
import {BattleActionType} from "../models/BattleActionType";
import {BattleMoveActionProcessor} from "./BattleMoveActionProcessor";
import {IBattleTurnProcessor} from "./IBattleTurnProcessor";
import {Async} from "../utilities/Async";
import {BattleFaintProcessor} from "./BattleFaintProcessor";
import {BattleVictoryProcessor} from "./BattleVictoryProcessor";
import {IBattle} from "../models/IBattle";
import {IBattleTurnResponse} from "../models/IBattleTurnResponse";
import {Objects} from "../utilities/Objects";

@injectable()
export class BattleTurnProcessor implements IBattleTurnProcessor {
  public constructor(@inject(ActionPrioritiser) private actionPrioritiser: ActionPrioritiser,
                     @inject(BattleFaintProcessor) private faintProcessor: BattleFaintProcessor,
                     @inject(BattleMoveActionProcessor) private moveProcessor: BattleMoveActionProcessor,
                     @inject(BattleVictoryProcessor) private victoryProcessor: BattleVictoryProcessor) {
  }

  public process(battle: IBattle): Promise<IBattleTurnResponse> {
    return Async.do(function*() {
      const battleStates = Objects.values(battle.statesByTrainerId);
      let prioritisedActions = yield this.actionPrioritiser.prioritise(battleStates);
      return this.processActions(battle, prioritisedActions);
    }.bind(this));
  }

  private processActions(battle: IBattle, actions: IBattleAction[]): Promise<IBattleTurnResponse> {
    let actionQueue = [];
    for (let action of actions) {
      actionQueue.push(() => {
        return this.processAction(action);
      });
    }

    return Async.do(function*() {
      let response: IBattleTurnResponse = {
        events: [],
        battle: battle,
      };

      while (actionQueue.length) {
        const action = actionQueue.shift();
        const actionEvents = yield action();
        response.events.concat(actionEvents);
        const faintEvents = yield this.faintProcessor.processAndMutateQueue(battle.id, actionQueue);
        response.events.concat(faintEvents);
        const victoryEvents = yield this.victoryProcessor.processAndMutateBattle(battle);
        response.events.concat(victoryEvents);
      }

      return response;
    }.bind(this));
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
