import PokemonFactory from '../../Factories/PokemonFactory';
import IPokemon from '../../Pokemon/IPokemon';
import AttackBattleAction from './AttackBattleAction';
import Attack from '../../Moves/Attack';
import { expect } from 'chai';
import IBattleState from '../IBattleState';
import BattleStateFactory from '../../Factories/BattleStateFactory';
import IDamageCalculator from '../../Moves/IDamageCalculator';
import DamageCalculatorFactory from '../../Factories/DamageCalculatorFactory';
import IBattleEvent from '../Events/IBattleEvent';
import { BattleEventType } from '../Events/BattleEventType';
import IFaintHandler from '../Events/IFaintHandler';
import FaintHandler from '../Events/FaintHandler';
import IStatCalculator from '../../Moves/IStatCalculator';
import StatCalculatorFactory from '../../Factories/StatCalculatorFactory';
import IRandom from '../../Helpers/IRandom';
import RandomFactory from '../../Factories/RandomFactory';
import MoveFactory from '../../Factories/MoveFactory';
import IMove from '../../Moves/IMove';
import IAttackBattleEvent from '../Events/IAttackBattleEvent';

describe('AttackBattleAction', () => {
  let damageCalculator: IDamageCalculator;
  let statCalculator: IStatCalculator;
  let faintHandler: IFaintHandler;
  let random: IRandom;

  beforeEach(() => {
    damageCalculator = new DamageCalculatorFactory().build();
    statCalculator = new StatCalculatorFactory().build();
    faintHandler = new FaintHandler();
    random = new RandomFactory().build();
  });

  describe('Pokemon with different speeds', () => {
    let fastPokemon: IPokemon;
    let slowPokemon: IPokemon;

    beforeEach(() => {
      fastPokemon = new PokemonFactory().build((p: IPokemon) => p.stats.speed.current = 10);
      slowPokemon = new PokemonFactory().build((p: IPokemon) => p.stats.speed.current = 5);
    });

    it('gives a faster Pokemon using the same attack a higher priority', () => {
      const move = new MoveFactory().build();

      const fastAction = new AttackBattleAction(
        damageCalculator,
        statCalculator,
        faintHandler,
        random,
        Attack.by(fastPokemon).using(move).on(slowPokemon)
      );

      const slowAction = new AttackBattleAction(
        damageCalculator,
        statCalculator,
        faintHandler,
        random,
        Attack.by(slowPokemon).using(move).on(fastPokemon)
      );

      expect(fastAction.priority()).to.be.greaterThan(slowAction.priority());
    });

    it('gives a slow Pokemon using Quick Attack a higher priority than a fast Pokemon using Scratch', () => {
      const scratch = new MoveFactory().build((m: IMove) => m.priority = 0);
      const quickAttack = new MoveFactory().build((m: IMove) => m.priority = 1);

      const fastAction = new AttackBattleAction(
        damageCalculator,
        statCalculator,
        faintHandler,
        random,
        Attack.by(slowPokemon).using(quickAttack).on(fastPokemon)
      );
      const slowAction = new AttackBattleAction(
        damageCalculator,
        statCalculator,
        faintHandler,
        random,
        Attack.by(fastPokemon).using(scratch).on(slowPokemon)
      );

      expect(fastAction.priority()).to.be.greaterThan(slowAction.priority());
    });
  });

  describe('two Pokemon', () => {
    let charmander: IPokemon;
    let bulbasaur: IPokemon;
    let initialState: IBattleState;

    beforeEach(() => {
      charmander = new PokemonFactory().build((p: IPokemon) => {
        p.id = 'charmander';
        p.speciesId = 4;
        p.stats.hitPoints.current = 10;
      });

      bulbasaur = new PokemonFactory().build((p: IPokemon) => {
        p.id = 'bulbasaur';
        p.speciesId = 1;
        p.stats.hitPoints.current = 10;
      });

      initialState = new BattleStateFactory()
        .withPokemons(charmander, bulbasaur)
        .build();
    });

    describe('doing non-KO damage to each other', () => {
      beforeEach(() => {
        damageCalculator = new DamageCalculatorFactory().build((c: IDamageCalculator) => {
          c.calculate = () => 5;
        });
      });

      it('reduces the health of the defending Pokemon', () => {
        const move = new MoveFactory().build();

        const action = new AttackBattleAction(
          damageCalculator,
          statCalculator,
          faintHandler,
          random,
          Attack.by(charmander).using(move).on(bulbasaur)
        );

        const events = action.events(initialState);

        expect(events).to.have.length(1);
        const newState = events[0].state;
        expect(newState.pokemonsById.bulbasaur.stats.hitPoints.current).to.equal(5);
        expect(newState.pokemonsById.charmander.stats.hitPoints.current).to.equal(10);
      });
    });

    describe('doing KO damage', () => {
      beforeEach(() => {
        damageCalculator = new DamageCalculatorFactory().build((c: IDamageCalculator) => {
          c.calculate = () => 10;
        });
      });

      it('knocks out the defending Pokemon, and adds a faint event', () => {
        const move = new MoveFactory().build();

        const action = new AttackBattleAction(
          damageCalculator,
          statCalculator,
          faintHandler,
          random,
          Attack.by(charmander).using(move).on(bulbasaur)
        );

        const events = action.events(initialState);
        const eventTypes = events.map((event: IBattleEvent) => event.type);

        expect(events).to.have.length(2);
        expect(eventTypes).to.deep.equal([BattleEventType.Attack, BattleEventType.Faint]);

        const newState = events[1].state;
        expect(newState.pokemonsById.bulbasaur.stats.hitPoints.current).to.equal(0);
        expect(newState.pokemonsById.charmander.stats.hitPoints.current).to.equal(10);
      });
    });

    describe('an inaccurate attacker', () => {
      beforeEach(() => {
        damageCalculator = new DamageCalculatorFactory().build((c: IDamageCalculator) => {
          c.calculate = () => 5;
        });

        statCalculator = new StatCalculatorFactory().build((c: IStatCalculator) => {
          c.accuracyMultiplier = () => 0.5;
        });
      });

      it('applies damage if the random number is less than the accuracy multiplier', () => {
        random = new RandomFactory().build((r: IRandom) => {
          r.integer = () => 40;
        });

        const move = new MoveFactory().build();

        const action = new AttackBattleAction(
          damageCalculator,
          statCalculator,
          faintHandler,
          random,
          Attack.by(charmander).using(move).on(bulbasaur)
        );

        const events = action.events(initialState);
        expect(events).to.have.length(1);
        const attackEvent = events[0] as IAttackBattleEvent;
        expect(attackEvent.missedTarget).to.be.false;
        expect(attackEvent.state.pokemonsById.bulbasaur.stats.hitPoints.current).to.equal(5);
      });

      it('does not apply damage if the random number is greater than than the accuracy multiplier', () => {
        random = new RandomFactory().build((r: IRandom) => {
          r.integer = () => 60;
        });

        const move = new MoveFactory().build();

        const action = new AttackBattleAction(
          damageCalculator,
          statCalculator,
          faintHandler,
          random,
          Attack.by(charmander).using(move).on(bulbasaur)
        );

        const events = action.events(initialState);
        expect(events).to.have.length(1);
        const attackEvent = events[0] as IAttackBattleEvent;
        expect(attackEvent.missedTarget).to.be.true;
        expect(attackEvent.state.pokemonsById.bulbasaur.stats.hitPoints.current).to.equal(10);
      });

      it('ignores the multiplier altogether when using Swift', () => {
        random = new RandomFactory().build((r: IRandom) => {
          r.integer = () => 0;
        });

        const swift = new MoveFactory().build((m: IMove) => m.accuracy = null);

        const action = new AttackBattleAction(
          damageCalculator,
          statCalculator,
          faintHandler,
          random,
          Attack.by(charmander).using(swift).on(bulbasaur)
        );

        const events = action.events(initialState);
        expect(events).to.have.length(1);
        const attackEvent = events[0] as IAttackBattleEvent;
        expect(attackEvent.missedTarget).to.be.false;
        expect(attackEvent.state.pokemonsById.bulbasaur.stats.hitPoints.current).to.equal(5);
      });

      it('misses if the move accuracy is less than 100%', () => {
        random = new RandomFactory().build((r: IRandom) => {
          r.integer = () => 40;
        });

        const inaccurateMove = new MoveFactory().build((m: IMove) => m.accuracy = 50);

        const action = new AttackBattleAction(
          damageCalculator,
          statCalculator,
          faintHandler,
          random,
          Attack.by(charmander).using(inaccurateMove).on(bulbasaur)
        );

        const events = action.events(initialState);
        expect(events).to.have.length(1);
        const attackEvent = events[0] as IAttackBattleEvent;
        expect(attackEvent.missedTarget).to.be.true;
        expect(attackEvent.state.pokemonsById.bulbasaur.stats.hitPoints.current).to.equal(10);
      });

      it('does not apply a stat change if the attack misses')
    });
  });
});
