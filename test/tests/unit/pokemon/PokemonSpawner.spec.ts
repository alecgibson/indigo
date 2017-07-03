import { expect } from 'chai';
import 'mocha';
import {PokemonLookup} from "../../../../source/pokemon/PokemonLookup";
import {PokemonSpawner} from "../../../../source/pokemon/PokemonSpawner";
import {Gender} from "../../../../source/models/Gender";
import {MoveLookup} from "../../../../source/moves/MoveLookup";

describe('PokemonSpawner', () => {
  const pokemonLookup = new PokemonLookup();
  const moveLookup = new MoveLookup();
  const pokemonSpawner = new PokemonSpawner(pokemonLookup, moveLookup);

  const tackle = 33;
  const tailWhip = 39;
  const bubble = 145;
  const withdraw = 110;
  const waterGun = 55;
  const bite = 44;

  describe('spawning a Squirtle at Level 5', () => {
    const squirtle = pokemonSpawner.spawn(7, 5);

    it('has the correct move set', () => {
      expect(squirtle.moveIds).to.deep.equal([
        tackle,
        tailWhip,
      ]);
    });

    it('spawns more males than females', () => {
      let numberOfMales = 0;
      let numberOfFemales = 0;

      for (let i = 0; i < 100; i++) {
        let spawnedSquirtle = pokemonSpawner.spawn(7, 5);
        if (spawnedSquirtle.gender === Gender.MALE) {
          numberOfMales++;
        } else {
          numberOfFemales++;
        }
      }

      expect(numberOfMales).to.be.above(numberOfFemales);
    });

    it('has 0 EVs', () => {
      expect(squirtle.stats.hitPoints.effortValue).to.equal(0);
      expect(squirtle.stats.attack.effortValue).to.equal(0);
      expect(squirtle.stats.defense.effortValue).to.equal(0);
      expect(squirtle.stats.specialAttack.effortValue).to.equal(0);
      expect(squirtle.stats.specialDefense.effortValue).to.equal(0);
      expect(squirtle.stats.speed.effortValue).to.equal(0);
    });

    it('has IVs between 0 and 31', () => {
      expect(squirtle.stats.hitPoints.individualValue).to.be.gte(0);
      expect(squirtle.stats.hitPoints.individualValue).to.be.lte(31);
      expect(squirtle.stats.attack.individualValue).to.be.gte(0);
      expect(squirtle.stats.attack.individualValue).to.be.lte(31);
      expect(squirtle.stats.defense.individualValue).to.be.gte(0);
      expect(squirtle.stats.defense.individualValue).to.be.lte(31);
      expect(squirtle.stats.specialAttack.individualValue).to.be.gte(0);
      expect(squirtle.stats.specialAttack.individualValue).to.be.lte(31);
      expect(squirtle.stats.specialDefense.individualValue).to.be.gte(0);
      expect(squirtle.stats.specialDefense.individualValue).to.be.lte(31);
      expect(squirtle.stats.speed.individualValue).to.be.gte(0);
      expect(squirtle.stats.speed.individualValue).to.be.lte(31);
    });

    it('has a nature between 1 and 25', () => {
      expect(squirtle.nature).to.be.gte(1);
      expect(squirtle.nature).to.be.lte(25);
    });
  });

  describe('spawning a Squirtle at Level 18', () => {
    const squirtle = pokemonSpawner.spawn(7, 18);

    it('has the correct move set', () => {
      expect(squirtle.moveIds).to.deep.equal([
        bubble,
        withdraw,
        waterGun,
        bite,
      ]);
    });
  });
});
