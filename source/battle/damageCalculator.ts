import {Move} from "../models/move";
import {Pokemon} from "../models/pokemon";
import {DamageCategory} from "../models/damageCategory";
import {TypeEffectiveness} from "./typeEffectiveness";

export class DamageCalculator {
    public calculate(move: Move, attacker: Pokemon, defender: Pokemon): number {
        let levelFactor = 0.4*attacker.level + 2;

        let attackDefenceRatio = move.damageCategory === DamageCategory.Physical
            ? attacker.attack / defender.defence
            : attacker.specialAttack / defender.specialDefence;

        return (0.02 * levelFactor * move.power * attackDefenceRatio + 2)
            * this.damageModifier(move, attacker, defender);
    }

    private damageModifier(move: Move, attacker: Pokemon, defender: Pokemon): number {
        // TODO: Handle critical hits, random modifier, burn, etc.
        // https://bulbapedia.bulbagarden.net/wiki/Damage
        let sameTypeAttackBonus = attacker.types.includes(move.type) ? 1.5 : 1;

        return sameTypeAttackBonus * this.moveEffectiveness(move, defender);
    }

    private moveEffectiveness(move: Move, defender: Pokemon): number {
        return defender.types.reduce((modifier, defenderType) => {
            return modifier * TypeEffectiveness.offensive(move.type, defenderType);
        }, 1);
    }
}
