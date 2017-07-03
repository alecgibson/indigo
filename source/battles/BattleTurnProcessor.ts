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

@injectable()
export class BattleTurnProcessor implements IBattleTurnProcessor {
  public constructor(@inject(PokemonService) private pokemonService: PokemonService,
                     @inject(ActionPrioritiser) private actionPrioritiser: ActionPrioritiser,
                     @inject(BattleMoveActionProcessor) private moveProcessor: BattleMoveActionProcessor) {
  }

  public process(battleStates: IBattleState[]) {
    return this.prioritiseActions(battleStates)
      .then((prioritisedActions) => {
        return this.processActions(prioritisedActions);
      });
  }

  private prioritiseActions(battleStates: IBattleState[]) {
    let pokemonPromises = battleStates.map((battleState) => {
      return this.pokemonService.get(battleState.activePokemonId);
    });

    return Promise
      .all(pokemonPromises)
      .then((pokemons) => {
        let actionsAndPokemon = [];

        for (let i = 0; i < pokemons.length; i++) {
          actionsAndPokemon.push({action: battleStates[i].action, pokemon: pokemons[i]});
        }

        return this.actionPrioritiser.prioritise(actionsAndPokemon)
          .map(actionAndPokemon => actionAndPokemon.action);
      });
  }

  // Don't accept an IActionAndPokemon to avoid the temptation of using the supplied Pokemon
  // when resolving the second action - they will almost have certainly changed state due
  // to the first action
  private processActions(actions: IBattleAction[]) {
    let action1 = actions[0];
    let action2 = actions[1];
    let actionProcessor1 = this.actionProcessor(action1);
    let actionProcessor2 = this.actionProcessor(action2);

    return Async.do(function* () {
      let action1Response = yield actionProcessor1.process(action1);
      let action2Response = yield actionProcessor2.process(action2);

      let response: IBattleActionResponse = {
        actions: [action1, action2],
        actionResponses: [action1Response, action2Response],
      };
      return response;
    });
  }

  private actionProcessor(action: IBattleAction): IBattleActionProcessor {
    switch (action.type) {
      case BattleActionType.MOVE:
        return this.moveProcessor;
    }
  }
}
