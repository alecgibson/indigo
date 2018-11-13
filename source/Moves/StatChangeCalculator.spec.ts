import IPokemon from '../Pokemon/IPokemon';
import PokemonFactory from '../Factories/PokemonFactory';
import StatChangeCalculator from './StatChangeCalculator';
import { StatType } from '../Pokemon/StatType';
import { expect } from 'chai';

describe('StatChangeCalculator', () => {
  describe('a Pokemon with 0 Speed stage', () => {
    let pokemon: IPokemon;
    let calculator: StatChangeCalculator;

    beforeEach(() => {
      pokemon = new PokemonFactory().build((p: IPokemon) => {
        p.stats.speed.total = 100;
        p.stats.speed.stage = 0;
      });

      calculator = new StatChangeCalculator();
    });

    it('applies a stage change of +1 to Speed', () => {
      calculator.apply(+1, StatType.SPEED, pokemon);

      expect(pokemon.stats.speed.stage).to.equal(1);
      expect(pokemon.stats.speed.total).to.equal(100);
      expect(pokemon.stats.speed.current).to.equal(100 * 1.5);
    });

    it('applies a stage change of +2 to Speed', () => {
      calculator.apply(+2, StatType.SPEED, pokemon);

      expect(pokemon.stats.speed.stage).to.equal(2);
      expect(pokemon.stats.speed.total).to.equal(100);
      expect(pokemon.stats.speed.current).to.equal(100 * 2);
    });

    it('applies two consecutive +1 changes to Speed', () => {
      calculator.apply(+1, StatType.SPEED, pokemon);
      calculator.apply(+1, StatType.SPEED, pokemon);

      expect(pokemon.stats.speed.stage).to.equal(2);
      expect(pokemon.stats.speed.total).to.equal(100);
      expect(pokemon.stats.speed.current).to.equal(100 * 2);
    });

    it('applies a +1 then -1 change to Speed', () => {
      calculator.apply(+1, StatType.SPEED, pokemon);
      calculator.apply(-1, StatType.SPEED, pokemon);

      expect(pokemon.stats.speed.stage).to.equal(0);
      expect(pokemon.stats.speed.total).to.equal(100);
      expect(pokemon.stats.speed.current).to.equal(100);
    });

    it('does not go higher than +6', () => {
      calculator.apply(+7, StatType.SPEED, pokemon);

      expect(pokemon.stats.speed.stage).to.equal(6);
      expect(pokemon.stats.speed.total).to.equal(100);
      expect(pokemon.stats.speed.current).to.equal(100 * 4);
    });

    it('does not go lower than -6', () => {
      calculator.apply(-7, StatType.SPEED, pokemon);

      expect(pokemon.stats.speed.stage).to.equal(-6);
      expect(pokemon.stats.speed.total).to.equal(100);
      expect(pokemon.stats.speed.current).to.equal(100 / 4);
    });

    it('errors if attempting to bump an unknown stat', () => {
      const unknownStat = -1;
      const calculate = () => calculator.apply(+1, unknownStat, pokemon);
      expect(calculate).to.throw();
    });

    it('errors if attempting to change HP', () => {
      const calculate = () => calculator.apply(+1, StatType.HIT_POINTS, pokemon);
      expect(calculate).to.throw();
    });
  });

  describe('a Pokemon with 0 Evasion stage', () => {
    let pokemon: IPokemon;
    let calculator: StatChangeCalculator;

    beforeEach(() => {
      pokemon = new PokemonFactory().build((p: IPokemon) => {
        p.stats.evasion.total = undefined;
        p.stats.evasion.stage = 0;
      });

      calculator = new StatChangeCalculator();
    });

    it('bumps the stage and does not matter that total is undefined', () => {
      calculator.apply(+1, StatType.EVASION, pokemon);
      expect(pokemon.stats.evasion.stage).to.equal(1);
      expect(pokemon.stats.evasion.total).to.be.undefined;
    });
  });
});
