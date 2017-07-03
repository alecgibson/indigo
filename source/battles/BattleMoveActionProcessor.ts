import {IBattleActionProcessor} from "./IBattleActionProcessor";
import {IBattleAction} from "../models/IBattleAction";
import {IBattleMoveAction} from "../models/IBattleMoveAction";
import {inject, injectable} from "inversify";
import {DamageCalculator} from "./DamageCalculator";
import {Attack} from "../models/Attack";
import {MoveLookup} from "../moves/MoveLookup";
import {IStoredPokemon} from "../models/IStoredPokemon";
import {PokemonService} from "../pokemon/PokemonService";
import {IBattleMoveActionResponse} from "../models/IBattleMoveActionResponse";

@injectable()
export class BattleMoveActionProcessor implements IBattleActionProcessor {
  public constructor(@inject(MoveLookup) private moveLookup: MoveLookup,
                     @inject(DamageCalculator) private damageCalculator: DamageCalculator,
                     @inject(PokemonService) private pokemonService: PokemonService) {
  }

  public process(action: IBattleAction): Promise<IBattleMoveActionResponse> {
    let moveAction = action as IBattleMoveAction;
    return this.attackingAndDefendingPokemon(moveAction)
      .then(([attackingPokemon, defendingPokemon]) => {
        let move = this.moveLookup.byId(moveAction.moveId);

        let damage = this.damageCalculator.calculate(
          Attack.by(attackingPokemon).using(move).on(defendingPokemon)
        );

        defendingPokemon.currentValues.hitPoints =
          Math.max(0, defendingPokemon.currentValues.hitPoints - damage);

        attackingPokemon.currentValues.pp[moveAction.moveId] =
          Math.max(0, attackingPokemon.currentValues.pp[moveAction.moveId] - 1);

        return this.updatePokemons([attackingPokemon, defendingPokemon])
          .then(() => {
            let response: IBattleMoveActionResponse = {
              attackingPokemon: attackingPokemon,
              defendingPokemon: defendingPokemon,
            };

            return response;
          });
      });
  }

  public attackingAndDefendingPokemon(action: IBattleMoveAction): Promise<IStoredPokemon[]> {
    return Promise.all([
      this.pokemonService.attackingPokemon(action.trainerId, action.battleId),
      this.pokemonService.defendingPokemon(action.trainerId, action.battleId),
    ]);
  }

  public updatePokemons(pokemons: IStoredPokemon[]) {
    let promises = pokemons.map((pokemon) => {
      return this.pokemonService.update(pokemon);
    });

    return Promise.all(promises);
  }
}