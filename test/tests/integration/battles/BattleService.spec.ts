import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {BattleService} from "../../../../source/battles/BattleService";
import {OwnedPokemonService} from "../../../../source/pokemon/OwnedPokemonService";
import {PokemonService} from "../../../../source/pokemon/PokemonService";
import {StoredPokemonFactory} from "../../../factories/StoredPokemonFactory";
import {BattleActionType} from "../../../../source/models/BattleActionType";
import * as sinon from "Sinon";
import {Async} from "../../../../source/utilities/Async";
import {Random} from "../../../../source/utilities/Random";
import {BattleStatus} from "../../../../source/models/BattleStatus";
import {IBattle} from "../../../../source/models/IBattle";
import {Objects} from "../../../../source/utilities/Objects";
import isUppercase = require("validator/lib/isUppercase");

describe('BattleService', () => {
  const pokemonService = new PokemonService();
  const ownedPokemonService = new OwnedPokemonService(pokemonService);

  const battleTurnProcessor = {
    process: sinon.stub(),
  };
  const battleService = new BattleService(ownedPokemonService, battleTurnProcessor);

  beforeEach(() => {
    battleTurnProcessor.process.reset();
    battleTurnProcessor.process.resolves({
      events: [],
      battle: {
        id: Random.uuid(),
        status: BattleStatus.IN_PROGRESS,
        statesByTrainerId: {},
      },
    });
  });

  it('can start a battle', (done) => {
    Async.test(function* () {
      const [pokemon1, pokemon2] = yield Promise.all([
        StoredPokemonFactory.createWithTrainer(),
        StoredPokemonFactory.createWithTrainer(),
      ]);

      const trainer1Id = pokemon1.trainerId;
      const trainer2Id = pokemon2.trainerId;

      const battle = yield battleService.start(trainer1Id, trainer2Id);

      expect(battle.statesByTrainerId[trainer1Id].activePokemonId).to.equal(pokemon1.id);
      expect(battle.statesByTrainerId[trainer2Id].activePokemonId).to.equal(pokemon2.id);
      expect(battle.statesByTrainerId[trainer1Id].battleId).to.equal(battle.statesByTrainerId[trainer2Id].battleId);

      const fetchedBattle = yield battleService.get(battle.id);
      expect(fetchedBattle.statesByTrainerId).to.deep.equal(battle.statesByTrainerId);
      done();
    });
  });

  describe('starting a battle with a trainer already in a battle', () => {
    it('does not start a new battle', (done) => {
      Promise
        .all([
          StoredPokemonFactory.createWithTrainer(),
          StoredPokemonFactory.createWithTrainer(),
          StoredPokemonFactory.createWithTrainer(),
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
      Async.test(function* () {
        const battle = yield startBattle();
        const trainerIds = Object.keys(battle.statesByTrainerId);
        const action = {
          trainerId: trainerIds[0],
          battleId: battle.id,
          type: BattleActionType.MOVE,
        };

        yield battleService.submitAction(action);
        const updatedBattle = yield battleService.get(battle.id);
        expect(updatedBattle.statesByTrainerId[trainerIds[0]].action).to.deep.equal(action);
        expect(updatedBattle.statesByTrainerId[trainerIds[1]].action).to.be.null;
        done();
      });
    });

    it('processes the battle turn after the second action is submitted', (done) => {
      Async.test(function* () {
        const battle = yield startBattle();
        const trainerIds = Object.keys(battle.statesByTrainerId);

        const action1 = {
          trainerId: trainerIds[0],
          battleId: battle.id,
          type: BattleActionType.MOVE,
        };

        const action2 = {
          trainerId: trainerIds[1],
          battleId: battle.id,
          type: BattleActionType.MOVE,
        };

        yield battleService.submitAction(action1);
        expect(battleTurnProcessor.process.notCalled).to.be.true;
        yield battleService.submitAction(action2);
        expect(battleTurnProcessor.process.calledOnce).to.be.true;

        const updatedBattle = yield battleService.get(battle.id);
        expect(updatedBattle.statesByTrainerId[trainerIds[0]].action).to.be.null;
        expect(updatedBattle.statesByTrainerId[trainerIds[1]].action).to.be.null;
        done();
      });
    });

    it('ignores the second action submitted by the same trainer', (done) => {
      Async.test(function* () {
        const battle = yield startBattle();
        const trainerIds = Object.keys(battle.statesByTrainerId);

        const action1 = {
          trainerId: trainerIds[0],
          battleId: battle.id,
          type: BattleActionType.MOVE,
        };

        const action2 = {
          trainerId: trainerIds[0],
          battleId: battle.id,
          type: BattleActionType.FLEE,
        };

        yield battleService.submitAction(action1);
        yield battleService.submitAction(action2);
        const updatedBattle = yield battleService.get(battle.id);
        expect(updatedBattle.statesByTrainerId[trainerIds[0]].action).to.deep.equal(action1);
        done();
      });
    });

    it('removes the battle from the database when the battle is finished', (done) => {
      Async.test(function* () {
        const battle = yield startBattle();
        const trainerIds = Object.keys(battle.statesByTrainerId);

        battleTurnProcessor.process.resolves({
          events: [],
          battle: {
            id: battle.id,
            status: BattleStatus.FINISHED,
            statesByTrainerId: {},
          },
        });

        const action1 = {
          trainerId: trainerIds[0],
          battleId: battle.id,
          type: BattleActionType.MOVE,
        };

        const action2 = {
          trainerId: trainerIds[1],
          battleId: battle.id,
          type: BattleActionType.MOVE,
        };

        yield battleService.submitAction(action1);
        yield battleService.submitAction(action2);

        const updatedBattle = yield battleService.get(battle.id);
        expect(updatedBattle).to.be.null;

        done();
      });
    });
  });

  function startBattle(): Promise<IBattle> {
    return Promise
      .all([
        StoredPokemonFactory.createWithTrainer(),
        StoredPokemonFactory.createWithTrainer(),
      ])
      .then(([pokemon1, pokemon2]) => {
        return battleService.start(pokemon1.trainerId, pokemon2.trainerId);
      });
  }
});
