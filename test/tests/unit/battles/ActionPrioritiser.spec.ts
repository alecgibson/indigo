import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {ActionPrioritiser} from "../../../../source/battles/ActionPrioritiser";
import {MoveLookup} from "../../../../source/moves/MoveLookup";
import {BattleActionFactory} from "../../../factories/BattleActionFactory";
import {StoredPokemonFactory} from "../../../factories/StoredPokemonFactory";

describe('ActionPrioritiser', () => {
  const moveLookup = new MoveLookup();
  const actionPrioritiser = new ActionPrioritiser(moveLookup);

  it('lets switching go before using a move', () => {
    let switchAction = BattleActionFactory.switchAction();
    let moveAction = BattleActionFactory.moveAction();

    let prioritisedActions = actionPrioritiser.prioritise([
      {action: moveAction, pokemon: StoredPokemonFactory.build()},
      {action: switchAction, pokemon: StoredPokemonFactory.build()},
    ]);

    expect(prioritisedActions[0].action).to.deep.equal(switchAction);
    expect(prioritisedActions[1].action).to.deep.equal(moveAction);
  });

  it('lets switching go before using an item', () => {
    let switchAction = BattleActionFactory.switchAction();
    let itemAction = BattleActionFactory.itemAction();

    let prioritisedActions = actionPrioritiser.prioritise([
      {action: itemAction, pokemon: StoredPokemonFactory.build()},
      {action: switchAction, pokemon: StoredPokemonFactory.build()},
    ]);

    expect(prioritisedActions[0].action).to.deep.equal(switchAction);
    expect(prioritisedActions[1].action).to.deep.equal(itemAction);
  });

  it('lets items go before fleeing', () => {
    let itemAction = BattleActionFactory.itemAction();
    let fleeAction = BattleActionFactory.fleeAction();

    let prioritisedActions = actionPrioritiser.prioritise([
      {action: fleeAction, pokemon: StoredPokemonFactory.build()},
      {action: itemAction, pokemon: StoredPokemonFactory.build()},
    ]);

    expect(prioritisedActions[0].action).to.deep.equal(itemAction);
    expect(prioritisedActions[1].action).to.deep.equal(fleeAction);
  });

  it('lets Quick Attack go before Tackle', () => {
    let quickAttack = BattleActionFactory.moveAction(98);
    let tackle = BattleActionFactory.moveAction(33);

    let prioritisedActions = actionPrioritiser.prioritise([
      {action: tackle, pokemon: StoredPokemonFactory.build()},
      {action: quickAttack, pokemon: StoredPokemonFactory.build()},
    ]);

    expect(prioritisedActions[0].action).to.deep.equal(quickAttack);
    expect(prioritisedActions[1].action).to.deep.equal(tackle);
  });

  it('lets the faster Pokemon go first if they use the same move', () => {
    let tackle = BattleActionFactory.moveAction(33);
    let fastPokemon = StoredPokemonFactory.build();
    fastPokemon.stats.speed.value = 20;
    let slowPokemon = StoredPokemonFactory.build();
    slowPokemon.stats.speed.value = 10;

    let prioritisedActions = actionPrioritiser.prioritise([
      {action: tackle, pokemon: slowPokemon},
      {action: tackle, pokemon: fastPokemon},
    ]);

    expect(prioritisedActions[0].pokemon).to.deep.equal(fastPokemon);
    expect(prioritisedActions[1].pokemon).to.deep.equal(slowPokemon);
  })
});
