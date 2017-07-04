import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {BattleMoveActionProcessor} from "../../../../source/battles/BattleMoveActionProcessor";
import {MoveLookup} from "../../../../source/moves/MoveLookup";
import {DamageCalculator} from "../../../../source/battles/DamageCalculator";
import {PokemonLookup} from "../../../../source/pokemon/PokemonLookup";
import {PokemonService} from "../../../../source/pokemon/PokemonService";
import * as sinon from "sinon";
import {StoredPokemonFactory} from "../../../factories/StoredPokemonFactory";
import {Async} from "../../../../source/utilities/Async";
import {BattleActionFactory} from "../../../factories/BattleActionFactory";
import {Serializable} from "../../../../source/utilities/Serializable";
import {BattleEventType} from "../../../../source/models/BattleEventType";

describe('BattleMoveActionProcessor', () => {
  const moveLookup = new MoveLookup();
  const pokemonLookup = new PokemonLookup();
  const damageCalculator = new DamageCalculator(pokemonLookup);

  describe('Squirtle attacking Bulbasaur', () => {
    const tackle = 33;
    const bulbasaur = StoredPokemonFactory.build({speciesId: 1});
    const squirtle = StoredPokemonFactory.build({speciesId: 7, moveIds: [tackle]});

    const pokemonService = sinon.createStubInstance(PokemonService);
    pokemonService.battlingPokemons.returns([
      Serializable.deepClone(squirtle),
      Serializable.deepClone(bulbasaur),
    ]);

    const processor = new BattleMoveActionProcessor(moveLookup, damageCalculator, pokemonService);

    const tackleAction = BattleActionFactory.moveAction(tackle);
    tackleAction.trainerId = squirtle.trainerId;

    it('damages Bulbasaur', (done) => {
      Async.do(function* () {
        expect(squirtle.currentValues.hitPoints).to.equal(squirtle.stats.hitPoints.value);
        expect(bulbasaur.currentValues.hitPoints).to.equal(bulbasaur.stats.hitPoints.value);

        let events = yield processor.process(tackleAction);

        expect(pokemonService.update.callCount).to.equal(2);
        let updatedPokemon = pokemonService.update.getCalls().map(call => call.args[0]);

        let squirtleUpdate = updatedPokemon.find(pokemon => pokemon.id === squirtle.id);
        let bulbasaurUpdate = updatedPokemon.find(pokemon => pokemon.id === bulbasaur.id);

        expect(squirtleUpdate.currentValues.hitPoints).to.equal(squirtleUpdate.currentValues.hitPoints);
        expect(bulbasaurUpdate.currentValues.hitPoints).to.be.below(bulbasaur.currentValues.hitPoints);
        expect(squirtleUpdate.currentValues.pp[tackle]).to.equal(squirtle.currentValues.pp[tackle] - 1);

        expect(events[0].type).to.equal(BattleEventType.ATTACK);
        expect(events[0].attackingPokemonId).to.equal(squirtle.id);
        expect(events[0].defendingPokemonId).to.equal(bulbasaur.id);

        done();
      });
    });
  });
});
