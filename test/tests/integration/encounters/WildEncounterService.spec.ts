import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {WildEncounterService} from "../../../../source/encounters/WildEncounterService";
import {WildEncounterFactory} from "../../../factories/WildEncounterFactory";
import {RoughCoordinates} from "../../../../source/models/RoughCoordinates";
import {TrainerService} from "../../../../source/battles/TrainerService";
import {BattleService} from "../../../../source/battles/BattleService";
import {PokemonSpawner} from "../../../../source/pokemon/PokemonSpawner";
import {PokemonLookup} from "../../../../source/pokemon/PokemonLookup";
import {MoveLookup} from "../../../../source/moves/MoveLookup";
import * as sinon from "sinon";
import {PokemonService} from "../../../../source/pokemon/PokemonService";
import {Async} from "../../../../source/utilities/Async";
import {TrainerFactory} from "../../../factories/TrainerFactory";
import {WebSocketService} from "../../../../source/users/WebSocketService";
import {UserService} from "../../../../source/users/UserService";
import {UserFactory} from "../../../factories/UserFactory";
import {Random} from "../../../../source/utilities/Random";

describe('WildEncounterService', () => {
  const trainerService = new TrainerService();
  const battleService = sinon.createStubInstance(BattleService);
  const pokemonLookup = new PokemonLookup();
  const moveLookup = new MoveLookup();
  const pokemonSpawner = new PokemonSpawner(pokemonLookup, moveLookup);
  const pokemonService = new PokemonService(moveLookup, pokemonLookup);
  const userService = new UserService(trainerService);
  const wildEncounterService = new WildEncounterService(
    trainerService,
    battleService,
    pokemonSpawner,
    pokemonService,
    userService,
  );

  beforeEach(() => {
    battleService.start.reset();
  });

  it('can store and fetch a wild encounter', (done) => {
    let encounter = WildEncounterFactory.build();
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

  describe('with a wild encounter at the London Eye', () => {
    let londonEyeLocation = new RoughCoordinates(51.5033241, -0.1196115);
    let imaxLocation = new RoughCoordinates(51.5048155, -0.1136632);

    it('fetches it by location when I am also at the London Eye', (done) => {
      let encounter = WildEncounterFactory.build({
        cartesianMetres: londonEyeLocation.toCartesianMetres(),
      });
      const user = UserFactory.build();
      wildEncounterService.create(encounter)
        .then((createdEncounter) => {
          return wildEncounterService.getByLocation(londonEyeLocation, user.id)
            .then((fetchedEncounters) => {
              let encounterIds = fetchedEncounters.map((encounter) => encounter.id);
              createdEncounter.id;
              expect(encounterIds).to.contain(createdEncounter.id);
              done();
            });
        });
    });

    it('does not fetch it by location when I am at the IMAX', (done) => {
      let encounter = WildEncounterFactory.build({
        cartesianMetres: londonEyeLocation.toCartesianMetres(),
      });
      const user = UserFactory.build();
      wildEncounterService.create(encounter)
        .then((createdEncounter) => {
          return wildEncounterService.getByLocation(imaxLocation, user.id)
            .then((fetchedEncounters) => {
              let encounterIds = fetchedEncounters.map((encounter) => encounter.id);
              expect(encounterIds).to.not.contain(createdEncounter.id);
              done();
            });
        });
    });

    it('does not fetch it by location after the end time when I am at the London Eye', (done) => {
      let endTime = new Date();
      endTime.setMinutes(endTime.getMinutes() - 1);

      let encounter = WildEncounterFactory.build({
        endTime: endTime,
        cartesianMetres: londonEyeLocation.toCartesianMetres(),
      });
      const trainer = TrainerFactory.build();
      wildEncounterService.create(encounter)
        .then((createdEncounter) => {
          return wildEncounterService.getByLocation(londonEyeLocation, trainer.id)
            .then((fetchedEncounters) => {
              let encounterIds = fetchedEncounters.map((encounter) => encounter.id);
              expect(encounterIds).to.not.contain(createdEncounter.id);
              done();
            });
        });
    });

    it('does not fetch it if I have already seen it', (done) => {
      Async.test(function* () {
        const encounter = yield WildEncounterFactory.create({
          cartesianMetres: londonEyeLocation.toCartesianMetres(),
        });

        const user = yield UserFactory.create();

        yield wildEncounterService.markAsSeen(user.id, encounter.id);

        const encounters = yield wildEncounterService.getByLocation(londonEyeLocation, user.id);
        const encounterIds = encounters.map(fetchedEncounter => fetchedEncounter.id);
        expect(encounterIds).to.not.contain(encounter.id);
        done();
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
    });
  });

  describe('starting a battle', () => {
    it('starts a battle', (done) => {
      Async.test(function*() {
        const encounter = yield WildEncounterFactory.create();
        const user = yield UserFactory.create();

        yield wildEncounterService.startBattle(user.id, encounter.id);

        expect(battleService.start.calledOnce).to.be.true;
        done();
      });
    });

    it('does not start a battle if the encounter has been seen', (done) => {
      Async.test(function*() {
        const encounter = yield WildEncounterFactory.create();
        const user = yield UserFactory.create();

        let hasSeen = yield wildEncounterService.userHasSeen(user.id, encounter.id);
        expect(hasSeen).to.be.false;
        yield wildEncounterService.startBattle(user.id, encounter.id);
        hasSeen = yield wildEncounterService.userHasSeen(user.id, encounter.id);
        expect(hasSeen).to.be.true;

        wildEncounterService.startBattle(user.id, encounter.id)
          .catch(() => {
            // Expect this to throw
            done();
          });
      });
    })
  });
});
