import {StoredPokemonFactory} from "./StoredPokemonFactory";
import {BattleService} from "../../source/battles/BattleService";
import {OwnedPokemonService} from "../../source/pokemon/OwnedPokemonService";
import {PokemonService} from "../../source/pokemon/PokemonService";
import {IBattleState} from "../../source/models/IBattleState";

export class BattleFactory {
  public static create(): Promise<IBattleState[]> {
    return Promise
      .all([
        StoredPokemonFactory.createWithTrainer(),
        StoredPokemonFactory.createWithTrainer(),
      ])
      .then(([pokemon1, pokemon2]) => {
        const pokemonService = new PokemonService();
        const ownedPokemonService = new OwnedPokemonService(pokemonService);
        let battleService = new BattleService(ownedPokemonService, {process: () => {}});
        return battleService.start(pokemon1.trainerId, pokemon2.trainerId);
      });
  }
}
