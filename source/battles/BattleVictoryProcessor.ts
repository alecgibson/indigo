import {inject, injectable} from "inversify";
import {Async} from "../utilities/Async";
import {BattleService} from "./BattleService";
import {IStoredPokemon} from "../models/IStoredPokemon";
import {OwnedPokemonService} from "../pokemon/OwnedPokemonService";

@injectable()
export class BattleVictoryProcessor {
  public constructor(@inject(BattleService) private battleService: BattleService,
                     @inject(OwnedPokemonService) private ownedPokemonService: OwnedPokemonService) {
  }

  public process(battleId: string): Promise<any[]> {
    return Async.do(function*() {
      let battleStatesByTrainerId = yield this.battleService.get(battleId);
      let trainerIds = Object.keys(battleStatesByTrainerId);

      let activePokemons = yield this.activePokemons(trainerIds);
      let trainersWithActivePokemon = activePokemons.reduce((trainerIds, activePokemon) => {
        if (activePokemon) {
          trainerIds.push(activePokemon.trainerId);
        }
        return trainerIds;
      }, []);

      let events = [];

      if (trainersWithActivePokemon.length === 1) {
        // Victory
        // Push event
        // TODO: Award money
        // TODO: Increment some victory counter?
        // TODO: Trainer experience
        // Clear battle from database
      }

      // TODO: Handle ties? (Eg one Pokemon each, and then using Explosion to KO both?)

      return events;
    }.bind(this));
  }

  private activePokemons(trainerIds: string[]): Promise<IStoredPokemon[]> {
    let pokemonPromises = trainerIds.map((trainerId) => {
      return this.ownedPokemonService.getActivePokemon(trainerId)
    });

    return Promise.all(pokemonPromises);
  }
}