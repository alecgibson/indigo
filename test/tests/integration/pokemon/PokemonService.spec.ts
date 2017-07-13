import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {PokemonService} from "../../../../source/pokemon/PokemonService";
import {StoredPokemonFactory} from "../../../factories/StoredPokemonFactory";
import {TrainerFactory} from "../../../factories/TrainerFactory";
import {MoveLookup} from "../../../../source/moves/MoveLookup";
import {PokemonLookup} from "../../../../source/pokemon/PokemonLookup";

describe('PokemonService', () => {
  const moveLookup = new MoveLookup();
  const pokemonLookup = new PokemonLookup();
  const pokemonService = new PokemonService(moveLookup, pokemonLookup);

  it('can create and fetch a Pokemon', (done) => {
    TrainerFactory.create()
      .then((trainer) => {
        let pokemon = StoredPokemonFactory.build({trainerId: trainer.id});
        pokemonService.create(pokemon)
          .then((createdPokemon) => {
            return createdPokemon.id;
          })
          .then((pokemonId) => {
            return pokemonService.get(pokemonId);
          })
          .then((fetchedPokemon) => {
            expect(fetchedPokemon.id).to.be.ok;
            pokemon.id = fetchedPokemon.id;
            expect(fetchedPokemon).to.deep.equal(pokemon);
            done();
          });
      });
  });
});