"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
var damageCalculator_1 = require("../../source/battle/damageCalculator");
describe('DamageCalculator', function () {
    var damageCalcualtor = new damageCalculator_1.DamageCalculator();
    it('should do more damage when the attacker is a higher level', function () {
    });
    function testPokemon(customProperties) {
        return {
            level: 5,
            attack: 10,
            specialAttack: 10,
            defence: 10,
            specialDefence: 10,
            types: []
        };
    }
});
