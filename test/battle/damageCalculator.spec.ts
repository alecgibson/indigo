import { expect } from 'chai';
import 'mocha';
import {DamageCalculator} from "../../source/battle/damageCalculator";
import {Pokemon} from "../../source/models/pokemon";
import {Type} from "../../source/models/type";
import {Move} from "../../source/models/move";
import {DamageCategory} from "../../source/models/damageCategory";

describe('DamageCalculator', () => {
    it('should do more damage when the attacker is a higher level', () => {
        const tackle = testMove();
        const caterpie = testPokemon({level: 5});
        const metapod = testPokemon({level: 7});

        let damageFromCaterpie = DamageCalculator.calculate(caterpie).using(tackle).on(caterpie);
        let damageFromMetapod = DamageCalculator.calculate(metapod).using(tackle).on(caterpie);

        expect(damageFromMetapod).to.be.above(damageFromCaterpie);
    });

    it('should do more damage when the move is super-effective', () => {
        const slam = testMove({type: Type.Normal});
        const thunderShock = testMove({type: Type.Electric});

        const pikachu = testPokemon({types: [Type.Electric]});
        const spearow = testPokemon({types: [Type.Flying]});

        let slamDamage = DamageCalculator.calculate(pikachu).using(slam).on(spearow);
        let thunderShockDamage = DamageCalculator.calculate(pikachu).using(thunderShock).on(spearow);

        expect(thunderShockDamage).to.be.above(slamDamage);
    });

    it('should do less damage when the move is ineffective', () => {
        const tackle = testMove({type: Type.Normal});
        const razorLeaf = testMove({type: Type.Grass});

        const bulbasaur = testPokemon({types: [Type.Grass]});
        const charmander = testPokemon({types: [Type.Fire]});

        let tackleDamage = DamageCalculator.calculate(bulbasaur).using(tackle).on(charmander);
        let razorLeafDamage = DamageCalculator.calculate(bulbasaur).using(razorLeaf).on(charmander);

        expect(tackleDamage).to.be.above(razorLeafDamage);
    });

    it('should do no damage when the move does not affect the defender', () => {
        const thunderShock = testMove({type: Type.Electric});

        const pikachu = testPokemon({types: [Type.Electric]});
        const onix = testPokemon({types: [Type.Ground]});

        let damage = DamageCalculator.calculate(pikachu).using(thunderShock).on(onix);

        expect(damage).to.equal(0);
    });

    it('should do more damage for higher attack stats and physical moves', () => {
        const tackle = testMove({damageCategory: DamageCategory.Physical});

        const magikarp = testPokemon({attack: 10});
        const gyarados = testPokemon({attack: 100});

        let damageFromMagikarp = DamageCalculator.calculate(magikarp).using(tackle).on(magikarp);
        let damageFromGyarados = DamageCalculator.calculate(gyarados).using(tackle).on(magikarp);

        expect(damageFromGyarados).to.be.above(damageFromMagikarp);
    });

    it('should do less damage for higher defence stats and physical moves', () => {
        const tackle = testMove({damageCategory: DamageCategory.Physical});

        const magikarp = testPokemon({defence: 10});
        const gyarados = testPokemon({defence: 100});

        let damageToMagikarp = DamageCalculator.calculate(magikarp).using(tackle).on(magikarp);
        let damageToGyarados = DamageCalculator.calculate(magikarp).using(tackle).on(gyarados);

        expect(damageToGyarados).to.be.below(damageToMagikarp);
    });

    it('should do the same damage for higher attack stats and special moves', () => {
        const confusion = testMove({damageCategory: DamageCategory.Special});

        const abra = testPokemon({attack: 10});
        const kadabra = testPokemon({attack: 20});

        let damageFromAbra = DamageCalculator.calculate(abra).using(confusion).on(abra);
        let damageFromKadabra = DamageCalculator.calculate(kadabra).using(confusion).on(abra);

        expect(damageFromAbra).to.equal(damageFromKadabra);
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
