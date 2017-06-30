import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {BattleService} from "../../../../source/battles/BattleService";
import {OwnedPokemonService} from "../../../../source/pokemon/OwnedPokemonService";
import {PokemonService} from "../../../../source/pokemon/PokemonService";
import {TrainerFactory} from "../../../factories/TrainerFactory";
import {StoredPokemonFactory} from "../../../factories/StoredPokemonFactory";

describe('BattleService', () => {
  const pokemonService = new PokemonService();
  const ownedPokemonService = new OwnedPokemonService(pokemonService);
  const battleService = new BattleService(ownedPokemonService);

  it('can start a battle', (done) => {
    Promise
      .all([
        createPokemon(),
        createPokemon(),
      ])
      .then(([pokemon1, pokemon2]) => {
        battleService.start(pokemon1.trainerId, pokemon2.trainerId)
          .then(([battleState1, battleState2]) => {
            expect(battleState1.trainerId).to.equal(pokemon1.trainerId);
            expect(battleState2.trainerId).to.equal(pokemon2.trainerId);
            expect(battleState1.activePokemonId).to.equal(pokemon1.id);
            expect(battleState2.activePokemonId).to.equal(pokemon2.id);
            expect(battleState1.battleId).to.equal(battleState2.battleId);
            battleService.get(battleState1.battleId)
              .then((statesByTrainerId) => {
                expect(statesByTrainerId[battleState1.trainerId]).to.deep.equal(battleState1);
                expect(statesByTrainerId[battleState2.trainerId]).to.deep.equal(battleState2);
                done();
              });
          });
      });
  });

  function createPokemon() {
    return TrainerFactory.create()
      .then((trainer) => {
        return StoredPokemonFactory.create({
          trainerId: trainer.id,
          squadOrder: 1,
        });
      });
  }
});
