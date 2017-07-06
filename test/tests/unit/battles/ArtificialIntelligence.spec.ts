import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {ArtificialIntelligence} from "../../../../source/battles/ArtificialIntelligence";
import {OwnedPokemonService} from "../../../../source/pokemon/OwnedPokemonService";
import * as sinon from "Sinon";
import {StoredPokemonFactory} from "../../../factories/StoredPokemonFactory";
import {Async} from "../../../../source/utilities/Async";
import {BattleActionType} from "../../../../source/models/BattleActionType";

describe('ArtificialIntelligence', () => {
  describe('with a Pokemon with two moves', () => {
    const pokemon = StoredPokemonFactory.build({moveIds: [33, 39]});

    const ownedPokemonService = sinon.createStubInstance(OwnedPokemonService);
    ownedPokemonService.getActivePokemon.resolves(pokemon);
    const ai = new ArtificialIntelligence(ownedPokemonService);

    it('picks one of the moves', (done) => {
      Async.do(function* () {
        const action = yield ai.pickAction('trainerId', 'battleId');
        expect(action.trainerId).to.equal('trainerId');
        expect(action.battleId).to.equal('battleId');
        expect(action.type).to.equal(BattleActionType.MOVE);
        expect(action.moveId).to.be.oneOf([33, 39]);
        done();
      });
    });
  });
});
