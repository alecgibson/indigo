import PokemonFactory from '../Factories/PokemonFactory';
import IPokemon from '../Pokemon/IPokemon';
import BattleTurn from './BattleTurn';
import IBattleState from './IBattleState';
import BattleStateFactory from '../Factories/BattleStateFactory';
import Attack from '../Moves/Attack';
import AttackBattleAction from './Actions/AttackBattleAction';
import { expect } from 'chai';
import IBattleEvent from './Events/IBattleEvent';
import { BattleEventType } from './Events/BattleEventType';
import IAttackBattleEvent from './Events/IAttackBattleEvent';
import IDamageCalculator from '../Moves/IDamageCalculator';
import DamageCalculatorFactory from '../Factories/DamageCalculatorFactory';
import MoveFactory from '../Factories/MoveFactory';
import IAttack from '../Moves/IAttack';
import IFaintHandler from './Events/IFaintHandler';
import FaintHandler from './Events/FaintHandler';

describe('BattleTurn', () => {
  describe('a fast Charmander using tackle and a slow Magikarp using tackle', () => {
    let damageCalculator: IDamageCalculator;
    let faintHandler: IFaintHandler;
    let charmander: IPokemon;
    let magikarp: IPokemon;
    let startingState: IBattleState;
    let charmanderAttack: IAttack;
    let magikarpAttack: IAttack;
    let turn: BattleTurn;
    let events: IBattleEvent[];

    beforeEach(() => {
      faintHandler = new FaintHandler();

      charmander = new PokemonFactory().build((p: IPokemon) => {
        p.id = 'charmander';
        p.speciesId = 4;
        p.stats.speed.current = 50;
        p.stats.hitPoints.current = 10;
      });

      magikarp = new PokemonFactory().build((p: IPokemon) => {
        p.id = 'magikarp';
        p.speciesId = 129;
        p.stats.speed.current = 5;
        p.stats.hitPoints.current = 10;
      });

      const tackle = new MoveFactory().build();
      charmanderAttack = Attack.by(charmander).using(tackle).on(magikarp);
      magikarpAttack = Attack.by(magikarp).using(tackle).on(charmander);
    });

    describe('damage too low to KO', () => {
      beforeEach(() => {
        damageCalculator = new DamageCalculatorFactory().build((c: IDamageCalculator) => {
          c.calculate = () => 5;
        });

        const charmanderAction = new AttackBattleAction(damageCalculator, faintHandler, charmanderAttack);
        const magikarpAction = new AttackBattleAction(damageCalculator, faintHandler, magikarpAttack);

        startingState = new BattleStateFactory()
          .withPokemons(charmander, magikarp)
          .withActions(magikarpAction, charmanderAction)
          .build();

        turn = new BattleTurn(startingState);
        events = turn.events();
      });

      it('returns two attack events', () => {
        const eventTypes = events.map((event: IBattleEvent) => event.type);
        expect(eventTypes).to.deep.equal([BattleEventType.Attack, BattleEventType.Attack]);
      });

      it('Charmander attacks first', () => {
        const firstAttack = events[0] as IAttackBattleEvent;
        const secondAttack = events[1] as IAttackBattleEvent;

        expect(firstAttack.attack.attacker.speciesId).to.equal(charmander.speciesId);
        expect(secondAttack.attack.attacker.speciesId).to.equal(magikarp.speciesId);
      });

      it('Magikarp loses health after the first attack', () => {
        const magikarpHealthAfterFirstAttack = events[0].state.pokemonsById.magikarp.stats.hitPoints.current;
        const magikarpHealthAfterSecondAttack = events[1].state.pokemonsById.magikarp.stats.hitPoints.current;

        expect(magikarpHealthAfterFirstAttack).to.equal(5);
        expect(magikarpHealthAfterSecondAttack).to.equal(5);
      });

      it('Charmander loses health after the second attack', () => {
        const charmanderHealthAfterFirstAttack = events[0].state.pokemonsById.charmander.stats.hitPoints.current;
        const charmanderHealthAfterSecondAttack = events[1].state.pokemonsById.charmander.stats.hitPoints.current;

        expect(charmanderHealthAfterFirstAttack).to.equal(10);
        expect(charmanderHealthAfterSecondAttack).to.equal(5);
      });

      it('does not mutate the original state', () => {
        expect(startingState.pokemonsById.magikarp.stats.hitPoints.current).to.equal(10);
        expect(startingState.pokemonsById.charmander.stats.hitPoints.current).to.equal(10);
      });
    });

    describe('damage equal to remaining health', () => {
      beforeEach(() => {
        damageCalculator = new DamageCalculatorFactory().build((c: IDamageCalculator) => {
          c.calculate = () => 10;
        });

        const charmanderAction = new AttackBattleAction(damageCalculator, faintHandler, charmanderAttack);
        const magikarpAction = new AttackBattleAction(damageCalculator, faintHandler, magikarpAttack);

        startingState = new BattleStateFactory()
          .withPokemons(charmander, magikarp)
          .withActions(magikarpAction, charmanderAction)
          .build();

        turn = new BattleTurn(startingState);
        events = turn.events();
      });

      it('returns an attack and a faint event', () => {
        const eventTypes = events.map((event: IBattleEvent) => event.type);
        expect(events).to.have.length(2);
        expect(eventTypes).to.deep.equal([BattleEventType.Attack, BattleEventType.Faint]);
      });

      it('leaves Magikarp on 0 HP after the first attack', () => {
        const magikarpHealth = events[0].state.pokemonsById.magikarp.stats.hitPoints.current;
        expect(magikarpHealth).to.equal(0);
      });

      it('does not damage Charmander', () => {
        const finalState = events[events.length - 1].state;
        const charmanderHealth = finalState.pokemonsById.charmander.stats.hitPoints.current;
        expect(charmanderHealth).to.equal(10);
      });
    });
  });
});
