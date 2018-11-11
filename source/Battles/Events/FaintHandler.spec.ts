import PokemonFactory from '../../Factories/PokemonFactory';
import IPokemon from '../../Pokemon/IPokemon';
import BattleStateFactory from '../../Factories/BattleStateFactory';
import FaintHandler from './FaintHandler';
import { expect } from 'chai';
import IBattleEvent from './IBattleEvent';
import { BattleEventType } from './BattleEventType';
import AttackBattleAction from '../Actions/AttackBattleAction';
import IDamageCalculator from '../../Moves/IDamageCalculator';
import DamageCalculatorFactory from '../../Factories/DamageCalculatorFactory';
import MoveFactory from '../../Factories/MoveFactory';
import Attack from '../../Moves/Attack';

describe('FaintHandler', () => {
  let handler: FaintHandler;
  let damageCalculator: IDamageCalculator;
  let pokemonFactory: PokemonFactory;

  beforeEach(() => {
    handler = new FaintHandler();
    damageCalculator = new DamageCalculatorFactory().build();
    pokemonFactory = new PokemonFactory();
  });

  it('returns an empty array if the Pokemon has not fainted', () => {
    const pokemon = pokemonFactory.build((p: IPokemon) => {
      p.stats.hitPoints.current = 10;
    });

    const state = new BattleStateFactory()
      .withPokemons(pokemon)
      .build();

    const events = handler.events(state, pokemon);

    expect(events).to.have.length(0);
  });

  it('adds a faint event for the Pokemon if it has 0 HP', () => {
    const pokemon = pokemonFactory.build((p: IPokemon) => {
      p.stats.hitPoints.current = 0;
    });

    const state = new BattleStateFactory()
      .withPokemons(pokemon)
      .build();

    const events = handler.events(state, pokemon);
    const eventTypes = events.map((event: IBattleEvent) => event.type);

    expect(eventTypes).to.deep.equal([BattleEventType.Faint]);
  });

  it('removes the fainted Pokemon attack, but leaves another attack alone', () => {
    const faintedPokemon = pokemonFactory.build((p: IPokemon) => {
      p.stats.hitPoints.current = 0;
    });

    const consciousPokemon = pokemonFactory.build((p: IPokemon) => {
      p.stats.hitPoints.current = 10;
    });

    const move = new MoveFactory().build();

    const faintedPokemonAttack = new AttackBattleAction(
      damageCalculator,
      handler,
      Attack.by(faintedPokemon).using(move).on(consciousPokemon)
    );

    const consciousPokemonAttack = new AttackBattleAction(
      damageCalculator,
      handler,
      Attack.by(consciousPokemon).using(move).on(faintedPokemon)
    );

    const state = new BattleStateFactory()
      .withPokemons(faintedPokemon, consciousPokemon)
      .withActions(faintedPokemonAttack, consciousPokemonAttack)
      .build();

    const events = handler.events(state, faintedPokemon);
    const finalState = events[events.length - 1].state;

    expect(finalState.actions).to.have.length(1);
    const attackAction = finalState.actions[0] as AttackBattleAction;
    expect(attackAction.attack.attacker).to.equal(consciousPokemon);
  });
});
