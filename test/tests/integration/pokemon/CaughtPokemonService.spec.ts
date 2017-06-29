import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {CaughtPokemonService} from "../../../../source/pokemon/CaughtPokemonService";
import {UserFactory} from "../../../factories/UserFactory";
import {StoredPokemonFactory} from "../../../factories/StoredPokemonFactory";
import {RoughCoordinates} from "../../../../source/models/RoughCoordinates";
import {PokemonService} from "../../../../source/pokemon/PokemonService";

describe('CaughtPokemonService', () => {
  const pokemonService = new PokemonService();
  const caughtPokemonService = new CaughtPokemonService(pokemonService);
  const catchLocation = new RoughCoordinates(51.5033241, -0.1196115);

  describe('Adding a new Pokemon', () => {
    describe('to an empty squad', () => {
      it('adds the Pokemon as the first member', (done) => {
        createUserAndPokemon()
          .then(([user, pokemon]) => {
            caughtPokemonService.addPokemon(user.id, pokemon.id, catchLocation)
              .then(() => {
                return caughtPokemonService.getSquad(user.id);
              })
              .then((squad) => {
                expect(squad).to.have.length(1);
                expect(squad[0].pokemon).to.deep.equal(pokemon);
                done();
              });
          })
      });
    });

    describe('to a squad of 6', () => {
      it('does not add the Pokemon to the squad', (done) => {
        UserFactory.create()
          .then((user) => {
            createFullSquad(user.id)
              .then(() => {
                return StoredPokemonFactory.create();
              })
              .then((pokemon) => {
                caughtPokemonService.addPokemon(user.id, pokemon.id, catchLocation)
                  .then(() => {
                    return caughtPokemonService.getSquad(user.id);
                  })
                  .then((squad) => {
                    expect(squad).to.have.length(6);
                    let pokemonIds = squad.map((squadMember) => squadMember.pokemon.id);
                    expect(pokemonIds).not.to.contain(pokemon.id);
                    done();
                  });
              })
          });
      });
    });
  });

  function createUserAndPokemon() {
    return Promise.all([
      UserFactory.create(),
      StoredPokemonFactory.create(),
    ]);
  }

  function createFullSquad(userId: string) {
    let promises = [];
    for (let i = 0; i < 6; i++) {
      let promise = StoredPokemonFactory.create()
        .then((pokemon) => {
          return caughtPokemonService.addPokemon(userId, pokemon.id, catchLocation)
        });
      promises.push(promise);
    }
    return Promise.all(promises);
  }
});
