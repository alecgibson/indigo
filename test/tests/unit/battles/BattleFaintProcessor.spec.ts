import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {BattleFaintProcessor} from "../../../../source/battles/BattleFaintProcessor";
import {PokemonService} from "../../../../source/pokemon/PokemonService";
import * as sinon from "Sinon";
import {StoredPokemonFactory} from "../../../factories/StoredPokemonFactory";
import {BattleActionFactory} from "../../../factories/BattleActionFactory";
import {Async} from "../../../../source/utilities/Async";
import {BattleEventType} from "../../../../source/models/BattleEventType";

describe('BattleFaintProcessor', () => {
  describe("a Pokemon going second that faints", () => {
    const firstPokemon = StoredPokemonFactory.build();
    const secondPokemon = StoredPokemonFactory.build();
    secondPokemon.currentValues.hitPoints = 0;

    const pokemonService = sinon.createStubInstance(PokemonService);
    pokemonService.battlingPokemons.returns([firstPokemon, secondPokemon]);

    const faintProcessor = new BattleFaintProcessor(pokemonService);

    it("doesn't get its action", (done) => {
      Async.do(function* () {
        const secondPokemonAction = BattleActionFactory.moveAction(33);
        secondPokemonAction.trainerId = secondPokemon.trainerId;

        const actionQueue = [secondPokemonAction];
        const faintEvents = yield faintProcessor.processAndMutateQueue('battleId', actionQueue);

        expect(faintEvents.length).to.equal(1);
        expect(faintEvents[0].type).to.equal(BattleEventType.FAINT);
        expect(faintEvents[0].pokemon).to.deep.equal(secondPokemon);
        expect(actionQueue.length).to.equal(0);

        done();
      });
    });
  });
});
