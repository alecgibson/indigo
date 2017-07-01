import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {BattleService} from "../../../../source/battles/BattleService";
import {OwnedPokemonService} from "../../../../source/pokemon/OwnedPokemonService";
import {PokemonService} from "../../../../source/pokemon/PokemonService";
import {TrainerFactory} from "../../../factories/TrainerFactory";
import {StoredPokemonFactory} from "../../../factories/StoredPokemonFactory";
import {IStoredPokemon} from "../../../../source/models/IStoredPokemon";
import {IBattleState} from "../../../../source/models/IBattleState";
import {BattleActionType} from "../../../../source/models/BattleActionType";
import * as sinon from "Sinon";

describe('BattleService', () => {
  const pokemonService = new PokemonService();
  const ownedPokemonService = new OwnedPokemonService(pokemonService);
  const battleTurnProcessor = {
    process: sinon.spy(),
  };
  const battleService = new BattleService(ownedPokemonService, battleTurnProcessor);

  beforeEach(() => {
    battleTurnProcessor.process.reset();
  });

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

  describe('starting a battle with a trainer already in a battle', () => {
    it('does not start a new battle', (done) => {
      Promise
        .all([
          createPokemon(),
          createPokemon(),
          createPokemon(),
        ])
        .then(([pokemon1, pokemon2, pokemon3]) => {
          battleService.start(pokemon1.trainerId, pokemon2.trainerId)
            .then(() => {
              return battleService.start(pokemon2.trainerId, pokemon3.trainerId);
            })
            .catch((error) => {
              expect(error.name).to.equal('SequelizeUniqueConstraintError');
              expect(error.fields.trainerId).to.equal(pokemon2.trainerId);
              battleService.getTrainerBattleState(pokemon3.trainerId)
                .then((battleState) => {
                  expect(battleState).to.be.null;
                  done();
                });
            });
        });
    });
  });

  describe('with a battle in progress', () => {
    it('can submit an action', (done) => {
      startBattle()
        .then(([battleState1, battleState2]) => {
          let action = {
            trainerId: battleState1.trainerId,
            battleId: battleState1.battleId,
            type: BattleActionType.MOVE,
          };

          battleService.submitAction(action)
            .then(() => {
              return battleService.get(battleState1.battleId);
            })
            .then((statesByTrainerId) => {
              let updatedState1 = statesByTrainerId[battleState1.trainerId];
              let updatedState2 = statesByTrainerId[battleState2.trainerId];
              expect(updatedState1.action).to.deep.equal(action);
              expect(updatedState2.action).to.be.null;
              done();
            });
        });
    });

    it('processes the battle turn after the second action is submitted', (done) => {
      startBattle()
        .then(([battleState1, battleState2]) => {
          let action1 = {
            trainerId: battleState1.trainerId,
            battleId: battleState1.battleId,
            type: BattleActionType.MOVE,
          };

          let action2 = {
            trainerId: battleState2.trainerId,
            battleId: battleState2.battleId,
            type: BattleActionType.MOVE,
          };

          battleService.submitAction(action1)
            .then(() => {
              expect(battleTurnProcessor.process.notCalled).to.be.true;
            })
            .then(() => {
              return battleService.submitAction(action2);
            })
            .then(() => {
              expect(battleTurnProcessor.process.calledOnce).to.be.true;
              done();
            });
        })
    });

    it('ignores the second action submitted by the same trainer', (done) => {
      startBattle()
        .then(([battleState1, battleState2]) => {
          let action1 = {
            trainerId: battleState1.trainerId,
            battleId: battleState1.battleId,
            type: BattleActionType.MOVE,
          };

          let action2 = {
            trainerId: battleState1.trainerId,
            battleId: battleState1.battleId,
            type: BattleActionType.FLEE,
          };

          battleService.submitAction(action1)
            .then(() => {
              return battleService.submitAction(action2);
            })
            .then(() => {
              return battleService.get(battleState1.battleId);
            })
            .then((statesByTrainerId) => {
              let updatedState1 = statesByTrainerId[battleState1.trainerId];
              expect(updatedState1.action).to.deep.equal(action1);
              done();
            });
        });
    });
  });

  function createPokemon(): Promise<IStoredPokemon> {
    return TrainerFactory.create()
      .then((trainer) => {
        return StoredPokemonFactory.create({
          trainerId: trainer.id,
          squadOrder: 1,
        });
      });
  }

  function startBattle(): Promise<IBattleState[]> {
    return Promise
      .all([
        createPokemon(),
        createPokemon(),
      ])
      .then(([pokemon1, pokemon2]) => {
        return battleService.start(pokemon1.trainerId, pokemon2.trainerId);
      });
  }
});
