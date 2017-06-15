import { expect } from 'chai';
import 'mocha';
import {DamageCalculator} from "../../source/battle/damageCalculator";
import {Pokemon} from "../../source/models/pokemon";
import {Type} from "../../source/models/type";
import {Move} from "../../source/models/move";
import {DamageCategory} from "../../source/models/damageCategory";

describe('DamageCalculator', () => {
    const damageCalculator = new DamageCalculator();

    it('should do more damage when the attacker is a higher level', () => {
        const move = testMove();
        const lowLevel = testPokemon({level: 5});
        const highLevel = testPokemon({level: 10});

        let lowLevelDamage = damageCalculator.calculate(move, lowLevel, lowLevel);
        let highLevelDamage = damageCalculator.calculate(move, highLevel, lowLevel);

        expect(lowLevelDamage).to.be.below(highLevelDamage);
    });

    it('should do more damage when the move is super-effective', () => {
        const slam = testMove({type: Type.Normal});
        const thunderShock = testMove({type: Type.Electric});

        const pikachu = testPokemon({types: [Type.Electric]});
        const spearow = testPokemon({types: [Type.Flying]});

        let slamDamage = damageCalculator.calculate(slam, pikachu, spearow);
        let thunderShockDamage = damageCalculator.calculate(thunderShock, pikachu, spearow);

        expect(thunderShockDamage).to.be.above(slamDamage);
    });

    it('should do less damage when the move is ineffective', () => {
        const tackle = testMove({type: Type.Normal});
        const razorLeaf = testMove({type: Type.Grass});

        const bulbasaur = testPokemon({types: [Type.Grass]});
        const charmander = testPokemon({types: [Type.Fire]});

        let tackleDamage = damageCalculator.calculate(tackle, bulbasaur, charmander);
        let razorLeafDamage = damageCalculator.calculate(razorLeaf, bulbasaur, charmander);

        expect(tackleDamage).to.be.above(razorLeafDamage);
    });

    it('should do no damage when the move does not affect the defender', () => {
        const thunderShock = testMove({type: Type.Electric});

        const pikachu = testPokemon({types: [Type.Electric]});
        const onix = testPokemon({types: [Type.Ground]});

        let damage = damageCalculator.calculate(thunderShock, pikachu, onix);

        expect(damage).to.equal(0);
    });

    // TODO: Test usage of atk vs spc. attack with physical/special
    // TODO: Test same type attack bonus
    // TODO: Test effectiveness compounding (eg Fighting attacking Flying/Ice combo)

    function testMove(customProperties?): Move {
        return Object.assign({
            power: 10,
            damageCategory: DamageCategory.Physical,
            type: Type.Normal,
        }, customProperties);
    }

    function testPokemon(customProperties?): Pokemon {
        return Object.assign({
            level: 5,
            attack: 10,
            specialAttack: 10,
            defence: 10,
            specialDefence: 10,
            types: [
                Type.Normal,
            ],
        }, customProperties);
    }
});
