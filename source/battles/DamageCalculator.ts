import {DamageCategory} from "../models/DamageCategory";
import {TypeEffectiveness} from "./TypeEffectiveness";
import {IMove} from "../models/IMove";
import {Attack} from "../models/Attack";
import {inject, injectable} from "inversify";
import {PokemonLookup} from "../pokemon/PokemonLookup";
import {IStoredPokemon} from "../models/IStoredPokemon";
import {Random} from "../utilities/Random";

@injectable()
export class DamageCalculator {
  public constructor(@inject(PokemonLookup) private pokemonLookup: PokemonLookup) {}

  public calculate(attack: Attack): number {
    if (!attack.move.power) {
      return 0;
    }

    let levelFactor = 0.4 * attack.attacker.level + 2;

    let attackDefenseRatio = attack.move.damageCategory === DamageCategory.Physical
      ? attack.attacker.stats.attack.value / attack.defender.stats.defense.value
      : attack.attacker.stats.specialAttack.value / attack.defender.stats.specialDefense.value;

    // TODO: Constant-damage attacks

    let damage = (0.02 * levelFactor * attack.move.power * attackDefenseRatio + 2)
      * this.damageModifier(attack);

    return Math.floor(damage);
  }

  private damageModifier(attack: Attack): number {
    // TODO: Handle critical hits, burn, etc.
    // https://bulbapedia.bulbagarden.net/wiki/Damage
    let attackerSpecies = this.pokemonLookup.byId(attack.attacker.speciesId);
    let sameTypeAttackBonus = attackerSpecies.types.indexOf(attack.move.type) > -1 ? 1.5 : 1;
    let randomModifier = Random.float(0.85, 1);

    return sameTypeAttackBonus * this.moveEffectiveness(attack.move, attack.defender) * randomModifier;
  }

  private moveEffectiveness(move: IMove, defender: IStoredPokemon): number {
    let defenderSpecies = this.pokemonLookup.byId(defender.speciesId);
    return defenderSpecies.types.reduce((modifier, defenderType) => {
      return modifier * TypeEffectiveness.offensive(move.type, defenderType);
    }, 1);
  }
}
