import { expect } from 'chai';
import MoveLookup from './MoveLookup';
import PokemonLookup from '../Pokemon/PokemonLookup';
import DamageCalculator from './DamageCalculator';
import IRandom from '../Helpers/IRandom';
import RandomFactory from '../Factories/RandomFactory';
import PokemonFactory from '../Factories/PokemonFactory';
import Attack from './Attack';
import IPokemon from '../Pokemon/IPokemon';

describe('DamageCalculator', () => {
  let moveLookup: MoveLookup;
  let pokemonLookup: PokemonLookup;
  let random: IRandom;
  let damageCalculator: DamageCalculator;

  beforeEach(() => {
    moveLookup = new MoveLookup();
    pokemonLookup = new PokemonLookup();

    random = new RandomFactory().build((r: IRandom) => {
      r.float = () => 1;
    });

    damageCalculator = new DamageCalculator(pokemonLookup, random);
  });

  it('should return an integer', () => {
    const tackle = moveLookup.byId(33);

    const irrationalNumber = 1 / 9;
    const rattata = new PokemonFactory().build((p: IPokemon) => {
      p.stats.attack.current = irrationalNumber;
    });
    const pidgey = new PokemonFactory().build();

    const damage = damageCalculator.calculate(Attack.by(rattata).using(tackle).on(pidgey));

    expect(Number.isInteger(damage)).to.be.true;
  });

  it('should do no damage when the move does not affect the defender', () => {
    const thunderShock = moveLookup.byId(84);

    const pikachu = new PokemonFactory().build((p: IPokemon) => p.speciesId = 25);
    const onix = new PokemonFactory().build((p: IPokemon) => p.speciesId = 95);

    const damage = damageCalculator.calculate(Attack.by(pikachu).using(thunderShock).on(onix));

    expect(damage).to.equal(0);
  });

  it('does not do damage from Tail Whip', () => {
    const tailWhip = moveLookup.byId(39);

    const squirtle = new PokemonFactory().build((p: IPokemon) => p.speciesId = 7);
    const bulbasaur = new PokemonFactory().build((p: IPokemon) => p.speciesId = 1);

    const damage = damageCalculator.calculate(Attack.by(squirtle).using(tailWhip).on(bulbasaur));

    expect(damage).to.equal(0);
  });

  it('returns the defender health when the move would knock it out', () => {
    const thunderShock = moveLookup.byId(84);

    const pikachu = new PokemonFactory().build((p: IPokemon) => {
      p.speciesId = 25;
      p.stats.attack.current = 100;
    });

    const pidgey = new PokemonFactory().build((p: IPokemon) => {
      p.speciesId = 16;
      p.stats.hitPoints.current = 1;
    });

    const damage = damageCalculator.calculate(Attack.by(pikachu).using(thunderShock).on(pidgey));

    expect(damage).to.equal(1);
  });

  // Based on worked example here: https://bulbapedia.bulbagarden.net/wiki/Damage#Damage_calculation
  it('should correctly calculate a level 75 Golem using Rock Slide against a Charizard', () => {
    const rockSlide = moveLookup.byId(157);

    const golem = new PokemonFactory().build((p: IPokemon) => {
      p.speciesId = 76;
      p.level = 75;
      p.stats.attack.current = 123;
    });

    const charizard = new PokemonFactory().build((p: IPokemon) => {
      p.speciesId = 6;
      p.stats.defense.current = 163;
      p.stats.hitPoints.current = 300;
    });

    const damage = damageCalculator.calculate(Attack.by(golem).using(rockSlide).on(charizard));

    expect(damage).to.equal(229);
  });
});
