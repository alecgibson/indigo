import { expect } from 'chai';
import 'mocha';
import {StatCalculator} from "../../../../source/pokemon/StatCalculator";
import {Nature} from "../../../../source/models/Nature";
import {StatType} from "../../../../source/models/StatType";

describe('StatCalculator', () => {
  it('gives a lowest HP of 11', () => {
    let hp = StatCalculator.hp(0, 0, 0, 1);
    expect(hp).to.equal(11);
  });

  it('gives a lowest Attack of 4', () => {
    let attack = StatCalculator.stat(StatType.ATTACK, 0, 0, 0, 1, Nature.CALM);
    expect(attack).to.equal(4);
  });

  describe('working on a Level 78 Garchomp', () => {
    // See worked examples here: https://bulbapedia.bulbagarden.net/wiki/Statistic

    const nature = Nature.ADAMANT;
    const level = 78;
    const hpStats = {base: 108, iv: 24, ev: 74};
    const attackStats = {base: 130, iv: 12, ev: 190};
    const specialAttackStats = {base: 80, iv: 16, ev: 48};
    const speedStats = {base: 102, iv: 5, ev: 23};

    it('calculates the correct HP', () => {
      let hp = StatCalculator.hp(hpStats.base, hpStats.iv, hpStats.ev, level);
      expect(hp).to.equal(289);
    });

    it('calculates the correct Attack', () => {
      let attack = StatCalculator.stat(
        StatType.ATTACK, attackStats.base, attackStats.iv, attackStats.ev, level, nature
      );
      expect(attack).to.equal(278);
    });

    it('calculates the correct Special Attack', () => {
      let specialAttack = StatCalculator.stat(
        StatType.SPECIAL_ATTACK, specialAttackStats.base, specialAttackStats.iv, specialAttackStats.ev, level, nature
      );
      expect(specialAttack).to.equal(135);
    });

    it('calculates the correct Speed', () => {
      let speed = StatCalculator.stat(
        StatType.SPEED, speedStats.base, speedStats.iv, speedStats.ev, level, nature
      );
      expect(speed).to.equal(171);
    });
  });
});
