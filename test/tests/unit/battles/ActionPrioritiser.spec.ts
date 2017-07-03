import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {ActionPrioritiser} from "../../../../source/battles/ActionPrioritiser";
import {MoveLookup} from "../../../../source/moves/MoveLookup";
import {BattleActionFactory} from "../../../factories/BattleActionFactory";
import {StoredPokemonFactory} from "../../../factories/StoredPokemonFactory";
import {PokemonService} from "../../../../source/pokemon/PokemonService";
import * as sinon from "Sinon";
import {BattleStateFactory} from "../../../factories/BattleStateFactory";
import {Async} from "../../../../source/utilities/Async";

describe('ActionPrioritiser', () => {
  describe('with any two Pokemon', () => {
    const pokemonService = sinon.createStubInstance(PokemonService);
    pokemonService.get.returns(StoredPokemonFactory.build());
    const moveLookup = new MoveLookup();
    const actionPrioritiser = new ActionPrioritiser(moveLookup, pokemonService);

    it('lets switching go before using a move', (done) => {
      Async.do(function* () {
        let switchAction = BattleActionFactory.switchAction();
        let moveAction = BattleActionFactory.moveAction();

        let prioritisedActions = yield actionPrioritiser.prioritise([
          BattleStateFactory.build({action: moveAction}),
          BattleStateFactory.build({action: switchAction}),
        ]);

        expect(prioritisedActions[0]).to.deep.equal(switchAction);
        expect(prioritisedActions[1]).to.deep.equal(moveAction);
        done();
      });
    });

    it('lets switching go before using an item', (done) => {
      Async.do(function* () {
        let switchAction = BattleActionFactory.switchAction();
        let itemAction = BattleActionFactory.itemAction();

        let prioritisedActions = yield actionPrioritiser.prioritise([
          BattleStateFactory.build({action: itemAction}),
          BattleStateFactory.build({action: switchAction}),
        ]);

        expect(prioritisedActions[0]).to.deep.equal(switchAction);
        expect(prioritisedActions[1]).to.deep.equal(itemAction);
        done();
      });
    });

    it('lets items go before fleeing', (done) => {
      Async.do(function* () {
        let itemAction = BattleActionFactory.itemAction();
        let fleeAction = BattleActionFactory.fleeAction();

        let prioritisedActions = yield actionPrioritiser.prioritise([
          BattleStateFactory.build({action: fleeAction}),
          BattleStateFactory.build({action: itemAction, pokemon: StoredPokemonFactory.build()}),
        ]);

        expect(prioritisedActions[0]).to.deep.equal(itemAction);
        expect(prioritisedActions[1]).to.deep.equal(fleeAction);
        done();
      });
    });

    it('lets Quick Attack go before Tackle', (done) => {
      Async.do(function* () {
        let quickAttack = BattleActionFactory.moveAction(98);
        let tackle = BattleActionFactory.moveAction(33);

        let prioritisedActions = yield actionPrioritiser.prioritise([
          BattleStateFactory.build({action: tackle}),
          BattleStateFactory.build({action: quickAttack}),
        ]);

        expect(prioritisedActions[0]).to.deep.equal(quickAttack);
        expect(prioritisedActions[1]).to.deep.equal(tackle);
        done();
      });
    });
  });

  describe('with a faster Pokemon', () => {
    let slowPokemon = StoredPokemonFactory.buildWithStats({speed: 5});
    let fastPokemon = StoredPokemonFactory.buildWithStats({speed: 10});

    const pokemonService = sinon.createStubInstance(PokemonService);
    pokemonService.get.withArgs(slowPokemon.id).returns(slowPokemon);
    pokemonService.get.withArgs(fastPokemon.id).returns(fastPokemon);

    const moveLookup = new MoveLookup();
    const actionPrioritiser = new ActionPrioritiser(moveLookup, pokemonService);

    it('lets the faster Pokemon go first if they use the same move', (done) => {
      Async.do(function* () {
        let tackleBySlowPokemon = BattleActionFactory.moveAction(33);
        tackleBySlowPokemon.trainerId = slowPokemon.trainerId;

        let tackleByFastPokemon = BattleActionFactory.moveAction(33);
        tackleByFastPokemon.trainerId = fastPokemon.trainerId;

        let prioritisedActions = yield actionPrioritiser.prioritise([
          BattleStateFactory.build({action: tackleBySlowPokemon, activePokemonId: slowPokemon.id}),
          BattleStateFactory.build({action: tackleByFastPokemon, activePokemonId: fastPokemon.id}),
        ]);

        expect(prioritisedActions[0].trainerId).to.equal(fastPokemon.trainerId);
        expect(prioritisedActions[1].trainerId).to.equal(slowPokemon.trainerId);
        done();
      });
    });
  });
});
