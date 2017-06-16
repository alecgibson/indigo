import {DamageCategory} from "../Models/damageCategory";
import {TypeEffectiveness} from "./typeEffectiveness";
import {IMove} from "../Models/IMove";
import {IPokemon} from "../Models/IPokemon";
import {Attack} from "../Models/Attack";

export class DamageCalculator {
    public calculate(attack: Attack): number {
        let levelFactor = 0.4*attack.attacker.level + 2;

        let attackDefenceRatio = attack.move.damageCategory === DamageCategory.Physical
            ? attack.attacker.attack / attack.defender.defence
            : attack.attacker.specialAttack / attack.defender.specialDefence;

        // TODO: Constant-damage attacks

        let damage = (0.02 * levelFactor * attack.move.power * attackDefenceRatio + 2)
            * this.damageModifier(attack);

        return Math.floor(damage);
    }

    private damageModifier(attack: Attack): number {
        // TODO: Handle critical hits, random modifier, burn, etc.
        // https://bulbapedia.bulbagarden.net/wiki/Damage
        let sameTypeAttackBonus = attack.attacker.types.indexOf(attack.move.type) > -1 ? 1.5 : 1;

        return sameTypeAttackBonus * this.moveEffectiveness(attack.move, attack.defender);
    }

    private moveEffectiveness(move: IMove, defender: IPokemon): number {
        return defender.types.reduce((modifier, defenderType) => {
            return modifier * TypeEffectiveness.offensive(move.type, defenderType);
        }, 1);
    }
}
