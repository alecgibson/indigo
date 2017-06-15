import { expect } from 'chai';
import 'mocha';
import {DamageCalculator} from "../../source/battle/damageCalculator";
import {Pokemon} from "../../source/models/pokemon";
import {Type} from "../../source/models/type";
import {Move} from "../../source/models/move";
import {DamageCategory} from "../../source/models/damageCategory";

describe('DamageCalculator', () => {
    it('should return an integer', () => {
       const tackle = testMove();

       const irrationalNumber = 1/9;
       const rattata = testPokemon({attack: irrationalNumber});
       const pidgey = testPokemon();

       let damage = DamageCalculator.calculate(rattata).using(tackle).on(pidgey);

       expect(Number.isInteger(damage)).to.be.true;
    });

    it('should do more damage when the attacker is a higher level', () => {
        const tackle = testMove();

        const caterpie = testPokemon({level: 5});
        const butterfree = testPokemon({level: 15});

        let damageFromCaterpie = DamageCalculator.calculate(caterpie).using(tackle).on(caterpie);
        let damageFromButterfree = DamageCalculator.calculate(butterfree).using(tackle).on(caterpie);

        expect(damageFromButterfree).to.be.above(damageFromCaterpie);
    });

    it('should do more damage when the move is super-effective', () => {
        const thunderShock = testMove({type: Type.Electric});

        const pikachu = testPokemon({types: [Type.Electric]});
        const spearow = testPokemon({types: [Type.Flying]});
        const rattata = testPokemon({types: [Type.Normal]});

        let damageToSpearow = DamageCalculator.calculate(pikachu).using(thunderShock).on(spearow);
        let damageToRattata = DamageCalculator.calculate(pikachu).using(thunderShock).on(rattata);

        expect(damageToSpearow).to.be.above(damageToRattata);
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

    describe('for physical moves', () => {
        const tackle = testMove({damageCategory: DamageCategory.Physical});

        const magikarp = testPokemon({attack: 10, defence: 10});
        const gyarados = testPokemon({attack: 100, defence: 100});

        it('should do more damage for higher attack stats and physical moves', () => {
            let damageFromMagikarp = DamageCalculator.calculate(magikarp).using(tackle).on(magikarp);
            let damageFromGyarados = DamageCalculator.calculate(gyarados).using(tackle).on(magikarp);

            expect(damageFromGyarados).to.be.above(damageFromMagikarp);
        });

        it('should do less damage for higher defence stats and physical moves', () => {
            let damageToMagikarp = DamageCalculator.calculate(magikarp).using(tackle).on(magikarp);
            let damageToGyarados = DamageCalculator.calculate(magikarp).using(tackle).on(gyarados);

            expect(damageToGyarados).to.be.below(damageToMagikarp);
        });

        it('should do the same damage for higher attack stats and special moves', () => {
            const twister = testMove({damageCategory: DamageCategory.Special});

            let damageFromMagikarp = DamageCalculator.calculate(magikarp).using(twister).on(magikarp);
            let damageFromGyarados = DamageCalculator.calculate(gyarados).using(twister).on(magikarp);

            expect(damageFromMagikarp).to.equal(damageFromGyarados);
        });
    });

    describe('for special moves', () => {
        const psychic = testMove({damageCategory: DamageCategory.Special});

        const abra = testPokemon({specialAttack: 10, specialDefence: 10});
        const kadabra = testPokemon({specialAttack: 20, specialDefence: 20});

        it('should do more damage for higher special attack stats and special moves', () => {
            let damageFromAbra = DamageCalculator.calculate(abra).using(psychic).on(abra);
            let damageFromKadabra = DamageCalculator.calculate(kadabra).using(psychic).on(abra);

            expect(damageFromKadabra).to.be.above(damageFromAbra);
        });

        it('should do less damage for higher special defence stats and special moves', () => {
            let damageToAbra = DamageCalculator.calculate(abra).using(psychic).on(abra);
            let damageToKadabra = DamageCalculator.calculate(abra).using(psychic).on(kadabra);

            expect(damageToKadabra).to.be.below(damageToAbra);
        });

        it('should do the same damage for higher special attack stats and normal moves', () => {
            const slam = testMove({damageCategory: DamageCategory.Physical});

            let damageToAbra = DamageCalculator.calculate(abra).using(slam).on(abra);
            let damageToKadabra = DamageCalculator.calculate(abra).using(slam).on(kadabra);

            expect(damageToAbra).to.equal(damageToKadabra);
        });
    });

    it('should do more damage for attacks that have the same type as the attacker', () => {
       const tackle = testMove({type: Type.Normal});
       const ember = testMove({type: Type.Fire});

       const charmander = testPokemon({types: [Type.Fire]});
       const bulbasaur = testPokemon({types: [Type.Grass]});

       let damageWithTackle = DamageCalculator.calculate(charmander).using(tackle).on(bulbasaur);
       let damageWithEmber = DamageCalculator.calculate(charmander).using(ember).on(bulbasaur);

       expect(damageWithEmber).to.be.above(damageWithTackle);
    });

    it('should be doubly effective on types that have two weak types', () => {
        const thunderShock = testMove({type: Type.Electric});

        const pikachu = testPokemon({types: [Type.Electric]});
        const gyarados = testPokemon({types: [Type.Water, Type.Flying]});
        const magikarp = testPokemon({types: [Type.Water]});

        let damageToGyarados = DamageCalculator.calculate(pikachu).using(thunderShock).on(gyarados);
        let damageToMagikarp = DamageCalculator.calculate(pikachu).using(thunderShock).on(magikarp);

        expect(damageToGyarados).to.equal(2 * damageToMagikarp);
    });

    it('should be neutrally effective where types cancel out', () => {
       const machPunch = testMove({type: Type.Fighting});
       const bodySlam = testMove({type: Type.Normal});

       const charmeleon = testPokemon({types: [Type.Fire]});
       const articuno = testPokemon({types: [Type.Flying, Type.Ice]});

       let damageWithMachPunch = DamageCalculator.calculate(charmeleon).using(machPunch).on(articuno);
       let damageWithBodySlam = DamageCalculator.calculate(charmeleon).using(bodySlam).on(articuno);

       expect(damageWithMachPunch).to.equal(damageWithBodySlam);
    });

    function testMove(customProperties?): Move {
        return Object.assign({
            power: 10,
            damageCategory: DamageCategory.Physical,
            type: Type.Normal,
        }, customProperties);
    }

    function testPokemon(customProperties?): Pokemon {
        return Object.assign({
            level: 20,
            attack: 30,
            specialAttack: 30,
            defence: 30,
            specialDefence: 30,
            types: [
                Type.Normal,
            ],
        }, customProperties);
    }
});
