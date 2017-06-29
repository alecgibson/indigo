import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {WildEncounterService} from "../../../../source/encounters/WildEncounterService";
import {StoredPokemonFactory} from "../../../factories/StoredPokemonFactory";
import {WildEncounterFactory} from "../../../factories/WildEncounterFactory";
import {RoughCoordinates} from "../../../../source/models/RoughCoordinates";
import {PokemonService} from "../../../../source/pokemon/PokemonService";

describe('WildEncounterService', () => {
  const wildEncounterService = new WildEncounterService();
  const pokemonService = new PokemonService();

  it('can store and fetch a wild encounter', (done) => {
    StoredPokemonFactory.create()
      .then((pokemon) => {
        let encounter = WildEncounterFactory.build({pokemonId: pokemon.id});
        wildEncounterService.create(encounter)
          .then((createdEncounter) => {
            return createdEncounter.id;
          })
          .then((encounterId) => {
            return wildEncounterService.get(encounterId);
          })
          .then((fetchedEncounter) => {
            expect(fetchedEncounter.id).to.be.ok;
            encounter.id = fetchedEncounter.id;
            expect(fetchedEncounter).to.deep.equal(encounter);
            done();
          });
      });
  });

  describe('with a wild encounter at the London Eye', () => {
    let londonEyeLocation = new RoughCoordinates(51.5033241, -0.1196115);
    let imaxLocation = new RoughCoordinates(51.5048155, -0.1136632);

    it('fetches it by location when I am also at the London Eye', (done) => {
      StoredPokemonFactory.create()
        .then((pokemon) => {
          let encounter = WildEncounterFactory.build({
            pokemonId: pokemon.id,
            cartesianMetres: londonEyeLocation.toCartesianMetres(),
          });
          wildEncounterService.create(encounter)
            .then(() => {
              return wildEncounterService.getByLocation(londonEyeLocation);
            })
            .then((fetchedEncounters) => {
              let pokemonIds = fetchedEncounters.map((encounter) => encounter.pokemonId);
              expect(pokemonIds).to.contain(encounter.pokemonId);
              done();
            });
        });
    });

    it('does not fetch it by location when I am at the IMAX', (done) => {
      StoredPokemonFactory.create()
        .then((pokemon) => {
          let encounter = WildEncounterFactory.build({
            pokemonId: pokemon.id,
            cartesianMetres: londonEyeLocation.toCartesianMetres(),
          });
          wildEncounterService.create(encounter)
            .then(() => {
              return wildEncounterService.getByLocation(imaxLocation);
            })
            .then((fetchedEncounters) => {
              let pokemonIds = fetchedEncounters.map((encounter) => encounter.pokemonId);
              expect(pokemonIds).to.not.contain(encounter.pokemonId);
              done();
            });
        });
    });

    it('does not fetch it by location after the end time when I am at the London Eye', (done) => {
      StoredPokemonFactory.create()
        .then((pokemon) => {
          let endTime = new Date();
          endTime.setMinutes(endTime.getMinutes() - 1);

          let encounter = WildEncounterFactory.build({
            pokemonId: pokemon.id,
            endTime: endTime,
            cartesianMetres: londonEyeLocation.toCartesianMetres(),
          });

          wildEncounterService.create(encounter)
            .then(() => {
              return wildEncounterService.getByLocation(londonEyeLocation);
            })
            .then((fetchedEncounters) => {
              let pokemonIds = fetchedEncounters.map((encounter) => encounter.pokemonId);
              expect(pokemonIds).to.not.contain(encounter.pokemonId);
              done();
            });
        });
    });
  });

  describe('garbage collecting', () => {
    describe('a current encounter', () => {
      let endTime = new Date();
      endTime.setMinutes(endTime.getMinutes() + 2);

      it('does not delete it', (done) => {
        WildEncounterFactory.create({endTime: endTime})
          .then((createdEncounter) => {
            return wildEncounterService.garbageCollect()
              .then(() => {
                return createdEncounter.id;
              });
          })
          .then((encounterId) => {
            return wildEncounterService.get(encounterId);
          })
          .then((fetchedEncounter) => {
            expect(fetchedEncounter).to.be.ok;
            done();
          });
      });
    });

    describe('an old encounter', () => {
      let endTime = new Date();
      endTime.setMinutes(endTime.getMinutes() - 2);

      it('deletes it', (done) => {
        WildEncounterFactory.create({endTime: endTime})
          .then((createdEncounter) => {
            return wildEncounterService.garbageCollect()
              .then(() => {
                return createdEncounter.id;
              });
          })
          .then((encounterId) => {
            return wildEncounterService.get(encounterId);
          })
          .then((fetchedEncounter) => {
            expect(fetchedEncounter).to.be.null;
            done();
          });
      });

      it('deletes the associated Pokemon', (done) => {
        StoredPokemonFactory.create()
          .then((pokemon) => {
            let encounter = WildEncounterFactory.build({pokemonId: pokemon.id, endTime: endTime});
            wildEncounterService.create(encounter)
              .then(() => {
                return wildEncounterService.garbageCollect();
              })
              .then(() => {
                return pokemonService.get(pokemon.id);
              })
              .then((pokemon) => {
                expect(pokemon).to.be.null;
                done();
              });
          });
      });
    });
  });
});
