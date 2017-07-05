import {inject, injectable} from "inversify";
import {Async} from "../utilities/Async";
import {IStoredPokemon} from "../models/IStoredPokemon";
import {OwnedPokemonService} from "../pokemon/OwnedPokemonService";
import {BattleEventType} from "../models/BattleEventType";
import {IBattle} from "../models/IBattle";
import {BattleStatus} from "../models/BattleStatus";

@injectable()
export class BattleVictoryProcessor {
  public constructor(@inject(OwnedPokemonService) private ownedPokemonService: OwnedPokemonService) {
  }

  public processAndMutateBattle(battle: IBattle): Promise<any[]> {
    return Async.do(function*() {
      let trainerIds = Object.keys(battle.statesByTrainerId);

      let activePokemons = yield this.activePokemons(trainerIds);
      let trainersWithActivePokemon = activePokemons.reduce((trainerIds, activePokemon) => {
        if (activePokemon) {
          trainerIds.push(activePokemon.trainerId);
        }
        return trainerIds;
      }, []);

      let events = [];

      if (trainersWithActivePokemon.length === 1) {
        const winningTrainerId = trainersWithActivePokemon[0].trainerId;
        const losingTrainerId = trainerIds.find(trainer => trainer !== winningTrainerId);

        events.push({
          type: BattleEventType.VICTORY,
          winningTrainerId: winningTrainerId,
          losingTrainerId: losingTrainerId,
        });

        battle.status = BattleStatus.FINISHED;

        // TODO: Award money
        // TODO: Increment some victory counter?
        // TODO: Trainer experience
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