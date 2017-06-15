import { expect } from 'chai';
import 'mocha';
import {DamageCalculator} from "../../source/battle/damageCalculator";
import {Pokemon} from "../../source/models/pokemon";

describe('DamageCalculator', () => {
    const damageCalcualtor = new DamageCalculator();

    it('should do more damage when the attacker is a higher level', () => {

    });

    function testPokemon(customProperties): Pokemon {
        return {
            level: 5,
            attack: 10,
            specialAttack: 10,
            defence: 10,
            specialDefence: 10,
            types: [

            ]
        }
    }
});
