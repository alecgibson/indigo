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

describe('Battle', () => {
  const moveLookup = new MoveLookup();
  const pokemonLookup = new PokemonLookup();
  const damageCalculator = new DamageCalculator(pokemonLookup);
  const pokemonService = new PokemonService();
  const moveProcessor = new BattleMoveActionProcessor(moveLookup, damageCalculator, pokemonService);

  const ownedPokemonService = new OwnedPokemonService(pokemonService);
  const actionPrioritiser = new ActionPrioritiser(moveLookup);
  const battleTurnProcessor = new BattleTurnProcessor(pokemonService, actionPrioritiser, moveProcessor);
  const battleService = new BattleService(ownedPokemonService, battleTurnProcessor);

  it('a Charmander using Scratch damages Squirtle, and Squirtle using Tail Whip does not damage Charmander', (done) => {
    Async.do(function* () {
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

      let battleStates = yield battleService.start(charmanderOwner.id, squirtleOwner.id);
      let battleId = battleStates[0].battleId;

      let scratchAction: IBattleMoveAction = {
        trainerId: charmander.trainerId,
        battleId: battleId,
        type: BattleActionType.MOVE,
        moveId: scratch,
      };

      let tailWhipAction: IBattleMoveAction = {
        trainerId: squirtle.trainerId,
        battleId: battleId,
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
});
