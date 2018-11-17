import IPokemon from '../Pokemon/IPokemon';
import PokemonFactory from '../Factories/PokemonFactory';
import StatCalculator from './StatCalculator';
import { StatType } from '../Pokemon/StatType';
import { expect } from 'chai';

describe('StatCalculator', () => {
  describe('a Pokemon with 0 Speed stage', () => {
    let pokemon: IPokemon;
    let calculator: StatCalculator;

    beforeEach(() => {
      pokemon = new PokemonFactory().build((p: IPokemon) => {
        p.stats.speed.total = 100;
        p.stats.speed.stage = 0;
      });

      calculator = new StatCalculator();
    });

    it('applies a stage change of +1 to Speed', () => {
      calculator.apply(StatType.SPEED, +1, pokemon);

      expect(pokemon.stats.speed.stage).to.equal(1);
      expect(pokemon.stats.speed.total).to.equal(100);
      expect(pokemon.stats.speed.current).to.equal(100 * 1.5);
    });

    it('applies a stage change of +2 to Speed', () => {
      calculator.apply(StatType.SPEED, +2, pokemon);

      expect(pokemon.stats.speed.stage).to.equal(2);
      expect(pokemon.stats.speed.total).to.equal(100);
      expect(pokemon.stats.speed.current).to.equal(100 * 2);
    });

    it('applies two consecutive +1 changes to Speed', () => {
      calculator.apply(StatType.SPEED, +1, pokemon);
      calculator.apply(StatType.SPEED, +1, pokemon);

      expect(pokemon.stats.speed.stage).to.equal(2);
      expect(pokemon.stats.speed.total).to.equal(100);
      expect(pokemon.stats.speed.current).to.equal(100 * 2);
    });

    it('applies a +1 then -1 change to Speed', () => {
      calculator.apply(StatType.SPEED, +1, pokemon);
      calculator.apply(StatType.SPEED, -1, pokemon);

      expect(pokemon.stats.speed.stage).to.equal(0);
      expect(pokemon.stats.speed.total).to.equal(100);
      expect(pokemon.stats.speed.current).to.equal(100);
    });

    it('does not go higher than +6', () => {
      calculator.apply(StatType.SPEED, +7, pokemon);

      expect(pokemon.stats.speed.stage).to.equal(6);
      expect(pokemon.stats.speed.total).to.equal(100);
      expect(pokemon.stats.speed.current).to.equal(100 * 4);
    });

    it('does not go lower than -6', () => {
      calculator.apply(StatType.SPEED, -7, pokemon);

      expect(pokemon.stats.speed.stage).to.equal(-6);
      expect(pokemon.stats.speed.total).to.equal(100);
      expect(pokemon.stats.speed.current).to.equal(100 / 4);
    });

    it('errors if attempting to bump an unknown stat', () => {
      const unknownStat = -1;
      const calculate = () => calculator.apply(unknownStat, +1, pokemon);
      expect(calculate).to.throw();
    });

    it('errors if attempting to change HP', () => {
      const calculate = () => calculator.apply(StatType.HIT_POINTS, +1, pokemon);
      expect(calculate).to.throw();
    });
  });

  describe('a Pokemon with 0 Evasion stage', () => {
    let pokemon: IPokemon;
    let calculator: StatCalculator;

    beforeEach(() => {
      pokemon = new PokemonFactory().build((p: IPokemon) => {
        p.stats.evasion.total = undefined;
        p.stats.evasion.stage = 0;
      });

      calculator = new StatCalculator();
    });

    it('bumps the stage and does not matter that total is undefined', () => {
      calculator.apply(StatType.EVASION, +1, pokemon);
      expect(pokemon.stats.evasion.stage).to.equal(1);
      expect(pokemon.stats.evasion.total).to.be.undefined;
    });
  });

  describe('evasion', () => {
    let calculator: StatCalculator;

    beforeEach(() => {
      calculator = new StatCalculator();
    });

    it('calculates a combined stage multiplier', () => {
      const attacker = new PokemonFactory().build((p: IPokemon) => {
        p.stats.accuracy.total = undefined;
        p.stats.accuracy.stage = -1;
      });

      const defender = new PokemonFactory().build((p: IPokemon) => {
        p.stats.evasion.total = undefined;
        p.stats.evasion.stage = +1;
      });

      const multiplier = calculator.accuracyMultiplier(attacker, defender);
      expect(multiplier).to.equal(3 / 5);
    });

    it('caps the multiplier stage at -6', () => {
      const attacker = new PokemonFactory().build((p: IPokemon) => {
        p.stats.accuracy.total = undefined;
        p.stats.accuracy.stage = -6;
      });

      const normalDefender = new PokemonFactory().build((p: IPokemon) => {
        p.stats.evasion.total = undefined;
        p.stats.evasion.stage = 0;
      });

      const evasiveDefender = new PokemonFactory().build((p: IPokemon) => {
        p.stats.evasion.total = undefined;
        p.stats.evasion.stage = +6;
      });

      const normalDefenderMultiplier = calculator.accuracyMultiplier(attacker, normalDefender);
      const evasiveDefenderMultiplier = calculator.accuracyMultiplier(attacker, evasiveDefender);

      expect(normalDefenderMultiplier).to.equal(1 / 3);
      expect(evasiveDefenderMultiplier).to.equal(1 / 3);
    });

    it('caps the multiplier stage at +6', () => {
      const attacker = new PokemonFactory().build((p: IPokemon) => {
        p.stats.accuracy.total = undefined;
        p.stats.accuracy.stage = +6;
      });

      const normalDefender = new PokemonFactory().build((p: IPokemon) => {
        p.stats.evasion.total = undefined;
        p.stats.evasion.stage = 0;
      });

      const unevasiveDefender = new PokemonFactory().build((p: IPokemon) => {
        p.stats.evasion.total = undefined;
        p.stats.evasion.stage = -6;
      });

      const normalDefenderMultiplier = calculator.accuracyMultiplier(attacker, normalDefender);
      const unevasiveDefenderMultiplier = calculator.accuracyMultiplier(attacker, unevasiveDefender);

      expect(normalDefenderMultiplier).to.equal(3);
      expect(unevasiveDefenderMultiplier).to.equal(3);
    });
  });
});
