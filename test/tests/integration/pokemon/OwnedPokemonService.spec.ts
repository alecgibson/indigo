import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {StoredPokemonFactory} from "../../../factories/StoredPokemonFactory";
import {PokemonService} from "../../../../source/pokemon/PokemonService";
import {TrainerFactory} from "../../../factories/TrainerFactory";
import {OwnedPokemonService} from "../../../../source/pokemon/OwnedPokemonService";
import {TrainerType} from "../../../../source/models/TrainerType";
import {Async} from "../../../../source/utilities/Async";

describe('OwnedPokemonService', () => {
  const pokemonService = new PokemonService();
  const ownedPokemonService = new OwnedPokemonService(pokemonService);

  describe('Adding a new Pokemon', () => {
    describe('to an empty squad', () => {
      it('adds the Pokemon as the first member', (done) => {
        createTrainerAndPokemon()
          .then(([trainer, pokemon]) => {
            ownedPokemonService.transferPokemonTo(trainer.id, pokemon.id)
              .then(() => {
                return ownedPokemonService.getSquad(trainer.id);
              })
              .then((squad) => {
                expect(squad).to.have.length(1);
                pokemon.trainerId = trainer.id;
                expect(squad[0]).to.deep.equal(pokemon);
                done();
              });
          });
      });
    });

    describe('to a squad of 6', () => {
      it('does not add the Pokemon to the squad', (done) => {
        createTrainerAndPokemon()
          .then(([trainer, pokemon]) => {
            createFullSquad(trainer.id)
              .then(() => {
                ownedPokemonService.transferPokemonTo(trainer.id, pokemon.id)
                  .then(() => {
                    return ownedPokemonService.getSquad(trainer.id);
                  })
                  .then((squad) => {
                    expect(squad).to.have.length(6);
                    let pokemonIds = squad.map((squadMember) => squadMember.id);
                    expect(pokemonIds).not.to.contain(pokemon.id);
                    done();
                  });
              })
          });
      });
    });
  });

  describe('fetching the active Pokemon', () => {
    it('fetches the first non-fainted squad member', (done) => {
      Async.do(function* () {
        const trainer = yield TrainerFactory.create();
        const squad = yield createFullSquad(trainer.id);

        let activePokemon = yield ownedPokemonService.getActivePokemon(trainer.id);

        expect(activePokemon.squadOrder).to.equal(1);
        expect(activePokemon).to.deep.equal(squad[0]);

        activePokemon.currentValues.hitPoints = 0;
        yield pokemonService.update(activePokemon);

        activePokemon = yield ownedPokemonService.getActivePokemon(trainer.id);
        expect(activePokemon.squadOrder).to.equal(2);
        expect(activePokemon).to.deep.equal(squad[1]);

        done();
      });
    });
  });

  function createTrainerAndPokemon() {
    return Promise.all([
      TrainerFactory.create(),
      TrainerFactory.create({type: TrainerType.WILD_ENCOUNTER})
        .then((trainer) => {
          return StoredPokemonFactory.create({trainerId: trainer.id});
        }),
    ]);
  }

  function createFullSquad(trainerId: string) {
    let promises = [];
    for (let i = 1; i <= 6; i++) {
      let promise = StoredPokemonFactory.create({
        trainerId: trainerId,
        squadOrder: i,
      });
      promises.push(promise);
    }
    return Promise.all(promises);
  }
});
