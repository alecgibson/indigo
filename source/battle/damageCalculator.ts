import {Move} from "../models/move";
import {Pokemon} from "../models/pokemon";
import {DamageCategory} from "../models/damageCategory";
import {TypeEffectiveness} from "./typeEffectiveness";

export class DamageCalculator {
    public move: Move;
    public attacker: Pokemon;
    public defender: Pokemon;

    public constructor(attacker: Pokemon) {
        this.attacker = attacker;
    }

    public static calculate(attacker: Pokemon): DamageCalculator {
        return new DamageCalculator(attacker);
    }

    public using(move: Move): DamageCalculator {
        this.move = move;
        return this;
    }

    public on(defender: Pokemon): number {
        this.defender = defender;
        return this.calculate();
    }

    private calculate(): number {
        let levelFactor = 0.4*this.attacker.level + 2;

        let attackDefenceRatio = this.move.damageCategory === DamageCategory.Physical
            ? this.attacker.attack / this.defender.defence
            : this.attacker.specialAttack / this.defender.specialDefence;

        // TODO: Constant-damage attacks

        return (0.02 * levelFactor * this.move.power * attackDefenceRatio + 2)
            * this.damageModifier();
    }

    private damageModifier(): number {
        // TODO: Handle critical hits, random modifier, burn, etc.
        // https://bulbapedia.bulbagarden.net/wiki/Damage
        let sameTypeAttackBonus = this.attacker.types.indexOf(this.move.type) > -1 ? 1.5 : 1;

        return sameTypeAttackBonus * this.moveEffectiveness(this.move, this.defender);
    }

    private moveEffectiveness(move: Move, defender: Pokemon): number {
        return defender.types.reduce((modifier, defenderType) => {
            return modifier * TypeEffectiveness.offensive(move.type, defenderType);
        }, 1);
    }
}
