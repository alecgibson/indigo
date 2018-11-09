import PokemonLookup from '../Pokemon/PokemonLookup';
import IAttack from './IAttack';
import { DamageCategory } from './DamageCategory';
import IRandom from '../Helpers/IRandom';
import IMove from './IMove';
import IPokemon from '../Pokemon/IPokemon';
import TypeEffectiveness from './TypeEffectiveness';

export default class DamageCalculator {
  public constructor(
    private readonly pokemonLookup: PokemonLookup,
    private readonly random: IRandom
  ) { }

  public calculate(attack: IAttack): number {
    if (!attack.move.power) {
      return 0;
    }

    const levelFactor = 0.4 * attack.attacker.level + 2;

    const attackDefenseRatio = attack.move.damageCategory === DamageCategory.Physical
      ? attack.attacker.stats.attack.current / attack.defender.stats.defense.current
      : attack.attacker.stats.specialAttack.current / attack.defender.stats.specialDefense.current;

    // TODO: Constant-damage attacks

    const damage = (0.02 * levelFactor * attack.move.power * attackDefenseRatio + 2)
      * this.damageModifier(attack);

    return Math.floor(damage);
  }

  private damageModifier(attack: IAttack): number {
    // TODO: Handle critical hits, burn, etc.
    // https://bulbapedia.bulbagarden.net/wiki/Damage
    const attackerSpecies = this.pokemonLookup.byId(attack.attacker.speciesId);
    const sameTypeAttackBonus = attackerSpecies.types.indexOf(attack.move.type) > -1 ? 1.5 : 1;
    const randomModifier = this.random.float(0.85, 1);

    return sameTypeAttackBonus * this.moveEffectiveness(attack.move, attack.defender) * randomModifier;
  }

  private moveEffectiveness(move: IMove, defender: IPokemon): number {
    const defenderSpecies = this.pokemonLookup.byId(defender.speciesId);
    return defenderSpecies.types.reduce(
      (modifier, defenderType) => modifier * TypeEffectiveness.offensive(move.type, defenderType), 1);
  }
}
