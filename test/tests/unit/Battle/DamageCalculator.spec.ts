import { expect } from 'chai';
import 'mocha';
import {DamageCalculator} from "../../../../source/battle/DamageCalculator";
import {Type} from "../../../../source/models/Type";
import {DamageCategory} from "../../../../source/models/DamageCategory";
import {IMove} from "../../../../source/models/IMove";
import {IPokemon} from "../../../../source/models/IPokemon";
import {Attack} from "../../../../source/models/Attack";

describe('DamageCalculator', () => {
    const damageCalculator = new DamageCalculator();

    it('should return an integer', () => {
       const tackle = testMove();

       const irrationalNumber = 1/9;
       const rattata = testPokemon({attack: irrationalNumber});
       const pidgey = testPokemon();

       let damage = damageCalculator.calculate(Attack.by(rattata).using(tackle).on(pidgey));

       expect(Number.isInteger(damage)).to.be.true;
    });

    it('should do more damage when the attacker is a higher level', () => {
        const tackle = testMove();

        const caterpie = testPokemon({level: 5});
        const butterfree = testPokemon({level: 15});

        let damageFromCaterpie = damageCalculator.calculate(Attack.by(caterpie).using(tackle).on(caterpie));
        let damageFromButterfree = damageCalculator.calculate(Attack.by(butterfree).using(tackle).on(caterpie));

        expect(damageFromButterfree).to.be.above(damageFromCaterpie);
    });

    it('should do more damage when the move is super-effective', () => {
        const thunderShock = testMove({type: Type.ELECTRIC});

        const pikachu = testPokemon({types: [Type.ELECTRIC]});
        const spearow = testPokemon({types: [Type.FLYING]});
        const rattata = testPokemon({types: [Type.NORMAL]});

        let damageToSpearow = damageCalculator.calculate(Attack.by(pikachu).using(thunderShock).on(spearow));
        let damageToRattata = damageCalculator.calculate(Attack.by(pikachu).using(thunderShock).on(rattata));

        expect(damageToSpearow).to.be.above(damageToRattata);
    });

    it('should do less damage when the move is ineffective', () => {
        const tackle = testMove({type: Type.NORMAL});
        const razorLeaf = testMove({type: Type.GRASS});

        const bulbasaur = testPokemon({types: [Type.GRASS]});
        const charmander = testPokemon({types: [Type.FIRE]});

        let tackleDamage = damageCalculator.calculate(Attack.by(bulbasaur).using(tackle).on(charmander));
        let razorLeafDamage = damageCalculator.calculate(Attack.by(bulbasaur).using(razorLeaf).on(charmander));

        expect(tackleDamage).to.be.above(razorLeafDamage);
    });

    it('should do no damage when the move does not affect the defender', () => {
        const thunderShock = testMove({type: Type.ELECTRIC});

        const pikachu = testPokemon({types: [Type.ELECTRIC]});
        const onix = testPokemon({types: [Type.GROUND]});

        let damage = damageCalculator.calculate(Attack.by(pikachu).using(thunderShock).on(onix));

        expect(damage).to.equal(0);
    });

    describe('for physical moves', () => {
        const tackle = testMove({damageCategory: DamageCategory.Physical});

        const magikarp = testPokemon({attack: 10, defence: 10});
        const gyarados = testPokemon({attack: 100, defence: 100});

        it('should do more damage for higher attack stats and physical moves', () => {
            let damageFromMagikarp = damageCalculator.calculate(Attack.by(magikarp).using(tackle).on(magikarp));
            let damageFromGyarados = damageCalculator.calculate(Attack.by(gyarados).using(tackle).on(magikarp));

            expect(damageFromGyarados).to.be.above(damageFromMagikarp);
        });

        it('should do less damage for higher defence stats and physical moves', () => {
            let damageToMagikarp = damageCalculator.calculate(Attack.by(magikarp).using(tackle).on(magikarp));
            let damageToGyarados = damageCalculator.calculate(Attack.by(magikarp).using(tackle).on(gyarados));

            expect(damageToGyarados).to.be.below(damageToMagikarp);
        });

        it('should do the same damage for higher attack stats and special moves', () => {
            const twister = testMove({damageCategory: DamageCategory.Special});

            let damageFromMagikarp = damageCalculator.calculate(Attack.by(magikarp).using(twister).on(magikarp));
            let damageFromGyarados = damageCalculator.calculate(Attack.by(gyarados).using(twister).on(magikarp));

            expect(damageFromMagikarp).to.equal(damageFromGyarados);
        });
    });

    describe('for special moves', () => {
        const psychic = testMove({damageCategory: DamageCategory.Special});

        const abra = testPokemon({specialAttack: 10, specialDefence: 10});
        const kadabra = testPokemon({specialAttack: 20, specialDefence: 20});

        it('should do more damage for higher special attack stats and special moves', () => {
            let damageFromAbra = damageCalculator.calculate(Attack.by(abra).using(psychic).on(abra));
            let damageFromKadabra = damageCalculator.calculate(Attack.by(kadabra).using(psychic).on(abra));

            expect(damageFromKadabra).to.be.above(damageFromAbra);
        });

        it('should do less damage for higher special defence stats and special moves', () => {
            let damageToAbra = damageCalculator.calculate(Attack.by(abra).using(psychic).on(abra));
            let damageToKadabra = damageCalculator.calculate(Attack.by(abra).using(psychic).on(kadabra));

            expect(damageToKadabra).to.be.below(damageToAbra);
        });

        it('should do the same damage for higher special attack stats and normal moves', () => {
            const slam = testMove({damageCategory: DamageCategory.Physical});

            let damageToAbra = damageCalculator.calculate(Attack.by(abra).using(slam).on(abra));
            let damageToKadabra = damageCalculator.calculate(Attack.by(abra).using(slam).on(kadabra));

            expect(damageToAbra).to.equal(damageToKadabra);
        });
    });

    it('should do more damage for attacks that have the same type as the attacker', () => {
       const tackle = testMove({type: Type.NORMAL});
       const ember = testMove({type: Type.FIRE});

       const charmander = testPokemon({types: [Type.FIRE]});
       const bulbasaur = testPokemon({types: [Type.GRASS]});

       let damageWithTackle = damageCalculator.calculate(Attack.by(charmander).using(tackle).on(bulbasaur));
       let damageWithEmber = damageCalculator.calculate(Attack.by(charmander).using(ember).on(bulbasaur));

       expect(damageWithEmber).to.be.above(damageWithTackle);
    });

    it('should be doubly effective on types that have two weak types', () => {
        const thunderShock = testMove({type: Type.ELECTRIC});

        const pikachu = testPokemon({types: [Type.ELECTRIC]});
        const gyarados = testPokemon({types: [Type.WATER, Type.FLYING]});
        const magikarp = testPokemon({types: [Type.WATER]});

        let damageToGyarados = damageCalculator.calculate(Attack.by(pikachu).using(thunderShock).on(gyarados));
        let damageToMagikarp = damageCalculator.calculate(Attack.by(pikachu).using(thunderShock).on(magikarp));

        expect(damageToGyarados).to.equal(2 * damageToMagikarp);
    });

    it('should be neutrally effective where types cancel out', () => {
       const machPunch = testMove({type: Type.FIGHTING});
       const bodySlam = testMove({type: Type.NORMAL});

       const charmeleon = testPokemon({types: [Type.FIRE]});
       const articuno = testPokemon({types: [Type.FLYING, Type.ICE]});

       let damageWithMachPunch = damageCalculator.calculate(Attack.by(charmeleon).using(machPunch).on(articuno));
       let damageWithBodySlam = damageCalculator.calculate(Attack.by(charmeleon).using(bodySlam).on(articuno));

       expect(damageWithMachPunch).to.equal(damageWithBodySlam);
    });

    function testMove(customProperties?): IMove {
        return Object.assign({
            power: 10,
            damageCategory: DamageCategory.Physical,
            type: Type.NORMAL,
        }, customProperties);
    }

    function testPokemon(customProperties?): IPokemon {
        return Object.assign({
            level: 20,
            attack: 30,
            specialAttack: 30,
            defence: 30,
            specialDefence: 30,
            types: [
                Type.NORMAL,
            ],
        }, customProperties);
    }
});
