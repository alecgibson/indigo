import PokemonFactory from '../../Factories/PokemonFactory';
import IPokemon from '../../Pokemon/IPokemon';
import AttackBattleAction from './AttackBattleAction';
import MoveLookup from '../../Moves/MoveLookup';
import Attack from '../../Moves/Attack';
import { expect } from 'chai';
import IBattleState from '../IBattleState';
import BattleStateFactory from '../../Factories/BattleStateFactory';
import IDamageCalculator from '../../Moves/IDamageCalculator';
import DamageCalculatorFactory from '../../Factories/DamageCalculatorFactory';

describe('AttackBattleAction', () => {
  const moves = new MoveLookup();
  let damageCalculator: IDamageCalculator;

  beforeEach(() => {
    damageCalculator = new DamageCalculatorFactory().build();
  });

  describe('Pokemon with different speeds', () => {
    let fastPokemon: IPokemon;
    let slowPokemon: IPokemon;

    beforeEach(() => {
      fastPokemon = new PokemonFactory().build((p: IPokemon) => p.stats.speed.current = 10);
      slowPokemon = new PokemonFactory().build((p: IPokemon) => p.stats.speed.current = 5);
    });

    it('gives a faster Pokemon using the same attack a higher priority', () => {
      const scratch = moves.byId(10);

      const fastAction = new AttackBattleAction(
        damageCalculator,
        Attack.by(fastPokemon).using(scratch).on(slowPokemon)
      );

      const slowAction = new AttackBattleAction(
        damageCalculator,
        Attack.by(slowPokemon).using(scratch).on(fastPokemon)
      );

      expect(fastAction.priority()).to.be.greaterThan(slowAction.priority());
    });

    it('gives a slow Pokemon using Quick Attack a higher priority than a fast Pokemon using Scratch', () => {
      const scratch = moves.byId(10);
      const quickAttack = moves.byId(98);

      const fastAction = new AttackBattleAction(
        damageCalculator,
        Attack.by(slowPokemon).using(quickAttack).on(fastPokemon)
      );
      const slowAction = new AttackBattleAction(
        damageCalculator,
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

      initialState = new BattleStateFactory().build((s: IBattleState) => {
        s.pokemonsById = { charmander, bulbasaur };
      });

      damageCalculator = new DamageCalculatorFactory().build((c: IDamageCalculator) => {
        c.calculate = () => 5;
      });
    });

    it('reduces the health of the defending Pokemon', () => {
      const scratch = moves.byId(10);
      const action = new AttackBattleAction(
        damageCalculator,
        Attack.by(charmander).using(scratch).on(bulbasaur)
      );

      const newState = action.event(initialState).state;

      expect(newState.pokemonsById.bulbasaur.stats.hitPoints.current).to.equal(5);
      expect(newState.pokemonsById.charmander.stats.hitPoints.current).to.equal(10);
    });
  });
});
