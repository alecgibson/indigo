import {IBattleAction} from "../models/IBattleAction";
import {inject, injectable} from "inversify";
import {PokemonService} from "../pokemon/PokemonService";
import {IPokemonService} from "../pokemon/IPokemonService";
import {Async} from "../utilities/Async";
import {BattleEventType} from "../models/BattleEventType";
import {Arrays} from "../utilities/Arrays";

@injectable()
export class BattleFaintProcessor {
  public constructor(@inject(PokemonService) private pokemonService: IPokemonService) {
  }

  public processAndMutateQueue(battleId: string, actionQueue: IBattleAction[]): Promise<any[]> {
    return Async.do(function*() {
      let battlingPokemons = yield this.pokemonService.battlingPokemons(battleId);
      let faintedPokemons = battlingPokemons.filter((pokemon) => pokemon.currentValues.hitPoints <= 0);

      let events = [];

      faintedPokemons.forEach((faintedPokemon) => {
        this.removeFaintedPokemonActions(faintedPokemon, actionQueue);

        events.push({
          type: BattleEventType.FAINT,
          pokemon: faintedPokemon,
        });
      });

      // TODO: Handle experience

      return events;
    }.bind(this));
  }

  private removeFaintedPokemonActions(faintedPokemon, actionQueue) {
    Arrays.filterInPlace(actionQueue, (action) => {
      return action.trainerId === faintedPokemon.trainerId;
    });
  }
}
