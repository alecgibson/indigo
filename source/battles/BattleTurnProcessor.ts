import {inject, injectable} from "inversify";
import {IBattleState} from "../models/IBattleState";
import {ActionPrioritiser} from "./ActionPrioritiser";
import {PokemonService} from "../pokemon/PokemonService";
import {IBattleAction} from "../models/IBattleAction";
import {IBattleActionProcessor} from "./IBattleActionProcessor";
import {BattleActionType} from "../models/BattleActionType";
import {BattleMoveActionProcessor} from "./BattleMoveActionProcessor";
import {IBattleTurnProcessor} from "./IBattleTurnProcessor";

@injectable()
export class BattleTurnProcessor implements IBattleTurnProcessor {
  public constructor(@inject(PokemonService) private pokemonService: PokemonService,
                     @inject(ActionPrioritiser) private actionPrioritiser: ActionPrioritiser,
                     @inject(BattleMoveActionProcessor) private moveProcessor: BattleMoveActionProcessor) {
  }

  public process(battleStates: IBattleState[]) {
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
        let prioritisedActions = this.actionPrioritiser.prioritise(actionsAndPokemon)
          .map(actionAndPokemon => actionAndPokemon.action);

        return this.processActions(prioritisedActions);
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

    return actionProcessor1.process(action1)
      .then(() => {
        return actionProcessor2.process(action2);
      });
  }

  private actionProcessor(action: IBattleAction): IBattleActionProcessor {
    switch (action.type) {
      case BattleActionType.MOVE:
        return this.moveProcessor;
    }
  }
}
