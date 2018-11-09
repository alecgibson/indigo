import { expect } from 'chai';
import { StatCalculator } from './StatCalculator';
import { StatType } from './StatType';
import { Nature } from './Nature';

describe('StatCalculator', () => {
  it('gives a lowest HP of 11', () => {
    const hp = StatCalculator.calculate(StatType.HIT_POINTS, 0, 0, 0, 1, Nature.ADAMANT);
    expect(hp).to.equal(11);
  });

  it('gives a lowest Attack of 4', () => {
    const attack = StatCalculator.calculate(StatType.ATTACK, 0, 0, 0, 1, Nature.CALM);
    expect(attack).to.equal(4);
  });

  describe('working on a Level 78 Garchomp', () => {
    // See worked examples here: https://bulbapedia.bulbagarden.net/wiki/Statistic

    const nature = Nature.ADAMANT;
    const level = 78;
    const hpStats = { base: 108, iv: 24, ev: 74 };
    const attackStats = { base: 130, iv: 12, ev: 190 };
    const specialAttackStats = { base: 80, iv: 16, ev: 48 };
    const speedStats = { base: 102, iv: 5, ev: 23 };

    it('calculates the correct HP', () => {
      const hp = StatCalculator.calculate(
        StatType.HIT_POINTS, hpStats.base, hpStats.iv, hpStats.ev, level, nature
      );
      expect(hp).to.equal(289);
    });

    it('calculates the correct Attack', () => {
      const attack = StatCalculator.calculate(
        StatType.ATTACK, attackStats.base, attackStats.iv, attackStats.ev, level, nature
      );
      expect(attack).to.equal(278);
    });

    it('calculates the correct Special Attack', () => {
      const specialAttack = StatCalculator.calculate(
        StatType.SPECIAL_ATTACK, specialAttackStats.base, specialAttackStats.iv, specialAttackStats.ev, level, nature
      );
      expect(specialAttack).to.equal(135);
    });

    it('calculates the correct Speed', () => {
      const speed = StatCalculator.calculate(
        StatType.SPEED, speedStats.base, speedStats.iv, speedStats.ev, level, nature
      );
      expect(speed).to.equal(171);
    });
  });
});
