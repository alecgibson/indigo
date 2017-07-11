import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {BattleMoveActionProcessor} from "../../../../source/battles/BattleMoveActionProcessor";
import {MoveLookup} from "../../../../source/moves/MoveLookup";
import {DamageCalculator} from "../../../../source/battles/DamageCalculator";
import {PokemonLookup} from "../../../../source/pokemon/PokemonLookup";
import {PokemonService} from "../../../../source/pokemon/PokemonService";
import {TrainerFactory} from "../../../factories/TrainerFactory";
import {StoredPokemonFactory} from "../../../factories/StoredPokemonFactory";
import {BattleService} from "../../../../source/battles/BattleService";
import {OwnedPokemonService} from "../../../../source/pokemon/OwnedPokemonService";
import {BattleTurnProcessor} from "../../../../source/battles/BattleTurnProcessor";
import {ActionPrioritiser} from "../../../../source/battles/ActionPrioritiser";
import {BattleActionType} from "../../../../source/models/BattleActionType";
import {IBattleMoveAction} from "../../../../source/models/IBattleMoveAction";
import {Async} from "../../../../source/utilities/Async";
import {BattleFaintProcessor} from "../../../../source/battles/BattleFaintProcessor";
import {BattleVictoryProcessor} from "../../../../source/battles/BattleVictoryProcessor";
import {ArtificialIntelligence} from "../../../../source/battles/ArtificialIntelligence";
import {WildEncounterService} from "../../../../source/encounters/WildEncounterService";
import {TrainerService} from "../../../../source/battles/TrainerService";
import {PokemonSpawner} from "../../../../source/pokemon/PokemonSpawner";
import {WildEncounterFactory} from "../../../factories/WildEncounterFactory";
import {TrainerType} from "../../../../source/models/TrainerType";
import {WebSocketService} from "../../../../source/users/WebSocketService";
import * as sinon from "Sinon";
import {UserService} from "../../../../source/users/UserService";
import {UserFactory} from "../../../factories/UserFactory";

describe('Battle', () => {
  const moveLookup = new MoveLookup();
  const pokemonLookup = new PokemonLookup();
  const damageCalculator = new DamageCalculator(pokemonLookup);
  const pokemonService = new PokemonService();
  const moveProcessor = new BattleMoveActionProcessor(moveLookup, damageCalculator, pokemonService);

  const ownedPokemonService = new OwnedPokemonService(pokemonService);
  const actionPrioritiser = new ActionPrioritiser(moveLookup, pokemonService);
  const faintProcessor = new BattleFaintProcessor(pokemonService);
  const victoryProcessor = new BattleVictoryProcessor(ownedPokemonService);
  const battleTurnProcessor = new BattleTurnProcessor(actionPrioritiser, faintProcessor, moveProcessor, victoryProcessor);
  const artificialIntelligence = new ArtificialIntelligence(ownedPokemonService);
  const webSocketService = sinon.createStubInstance(WebSocketService);
  const pokemonSpawner = new PokemonSpawner(pokemonLookup, moveLookup);
  const trainerService = new TrainerService();
  const userService = new UserService(trainerService);

  const battleService = new BattleService(
    ownedPokemonService,
    battleTurnProcessor,
    artificialIntelligence,
    webSocketService,
    pokemonService,
    userService,
  );

  const wildEncounterService = new WildEncounterService(
    trainerService,
    battleService,
    pokemonSpawner,
    pokemonService,
    userService,
  );

  it('a Charmander using Scratch damages Squirtle, and Squirtle using Tail Whip does not damage Charmander', (done) => {
    Async.test(function* () {
      const scratch = 10;
      const tailWhip = 39;

      let charmanderOwner = yield TrainerFactory.create();
      let squirtleOwner = yield TrainerFactory.create();

      let charmander = yield StoredPokemonFactory.create({
        trainerId: charmanderOwner.id,
        speciesId: 4,
        moveIds: [scratch],
        squadOrder: 1,
      });

      let squirtle = yield StoredPokemonFactory.create({
        trainerId: squirtleOwner.id,
        speciesId: 7,
        moveIds: [tailWhip],
        squadOrder: 1,
      });

      expect(charmander.currentValues.hitPoints).to.equal(charmander.stats.hitPoints.value);
      expect(squirtle.currentValues.hitPoints).to.equal(squirtle.stats.hitPoints.value);

      let battle = yield battleService.start(charmanderOwner.id, squirtleOwner.id);

      let scratchAction: IBattleMoveAction = {
        trainerId: charmander.trainerId,
        battleId: battle.id,
        type: BattleActionType.MOVE,
        moveId: scratch,
      };

      let tailWhipAction: IBattleMoveAction = {
        trainerId: squirtle.trainerId,
        battleId: battle.id,
        type: BattleActionType.MOVE,
        moveId: tailWhip,
      };

      // Submit as a parallel request to flex the backend's race condition handling
      yield Promise.all([
        battleService.submitAction(scratchAction),
        battleService.submitAction(tailWhipAction),
      ]);

      let updatedCharmander = yield pokemonService.get(charmander.id);
      let updatedSquirtle = yield pokemonService.get(squirtle.id);

      expect(updatedCharmander.currentValues.hitPoints).to.equal(charmander.currentValues.hitPoints);
      expect(updatedCharmander.currentValues.pp[scratch]).to.equal(charmander.currentValues.pp[scratch] - 1);
      expect(updatedSquirtle.currentValues.hitPoints).to.be.below(squirtle.currentValues.hitPoints);
      done();
    });
  });

  describe('Bulbasaur fighting a wild Rattata', () => {
    it('eventually faints if a trainer keeps attacking it', (done) => {
      Async.test(function* () {
        const user = yield UserFactory.create();
        let bulbasaur = pokemonSpawner.spawn(1, 5);
        bulbasaur.trainerId = user.trainerId;
        bulbasaur.squadOrder = 1;
        yield pokemonService.create(bulbasaur);

        const wildEncounter = yield WildEncounterFactory.create({speciesId: 19, level: 3});

        let battle = yield wildEncounterService.startBattle(user.id, wildEncounter.id);
        const tackleAction: IBattleMoveAction = {
          trainerId: user.trainerId,
          battleId: battle.id,
          type: BattleActionType.MOVE,
          moveId: 33,
        };

        let numberOfTurns = 0;
        while(battle) {
          yield battleService.submitAction(tackleAction);
          battle = yield battleService.get(battle.id);
          numberOfTurns++;
          if (numberOfTurns > 10) {
            throw "It's taken more than 10 turns to beat a Rattata";
          }
        }

        done();
      });
    });
  });
});
