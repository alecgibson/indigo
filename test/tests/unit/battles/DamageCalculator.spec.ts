import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {DamageCalculator} from "../../../../source/battles/DamageCalculator";
import {Attack} from "../../../../source/models/Attack";
import {PokemonLookup} from "../../../../source/pokemon/PokemonLookup";
import {StoredPokemonFactory} from "../../../factories/StoredPokemonFactory";
import {MoveLookup} from "../../../../source/moves/MoveLookup";

describe('DamageCalculator', () => {
  const moveLookup = new MoveLookup();
  const pokemonLookup = new PokemonLookup();
  const damageCalculator = new DamageCalculator(pokemonLookup);

  it('should return an integer', () => {
    const tackle = moveLookup.byId(33);

    const irrationalNumber = 1 / 9;
    let rattata = StoredPokemonFactory.build();
    rattata.stats.attack.value = irrationalNumber;
    let pidgey = StoredPokemonFactory.build();

    let damage = damageCalculator.calculate(Attack.by(rattata).using(tackle).on(pidgey));

    expect(Number.isInteger(damage)).to.be.true;
  });

  it('should do no damage when the move does not affect the defender', () => {
    const thunderShock = moveLookup.byId(84);

    const pikachu = StoredPokemonFactory.build({speciesId: 25});
    const onix = StoredPokemonFactory.build({speciesId: 95});

    let damage = damageCalculator.calculate(Attack.by(pikachu).using(thunderShock).on(onix));

    expect(damage).to.equal(0);
  });

  it('does not do damage from Tail Whip', () => {
    const tailWhip = moveLookup.byId(39);

    const squirtle = StoredPokemonFactory.build({speciesId: 7});
    const bulbasaur = StoredPokemonFactory.build({speciesId: 1});

    let damage = damageCalculator.calculate(Attack.by(squirtle).using(tailWhip).on(bulbasaur));

    expect(damage).to.equal(0);
  });

  // Based on worked example here: https://bulbapedia.bulbagarden.net/wiki/Damage#Damage_calculation
  it('should correctly calculate a level 75 Golem using Rock Slide against a Charizard', () => {
    let rockSlide = moveLookup.byId(157);

    let golem = StoredPokemonFactory.build({speciesId: 76, level: 75});
    golem.stats.attack.value = 123;

    let charizard = StoredPokemonFactory.build({speciesId: 6});
    charizard.stats.defense.value = 163;

    let damage = damageCalculator.calculate(Attack.by(golem).using(rockSlide).on(charizard));

    expect(damage).to.be.above(193);
    expect(damage).to.be.below(230);
  });
});
