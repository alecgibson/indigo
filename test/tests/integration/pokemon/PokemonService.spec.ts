import {expect} from 'chai';
import 'mocha';
import {PokemonService} from "../../../../source/pokemon/PokemonService";
import {StoredPokemonFactory} from "../../../factories/StoredPokemonFactory";

describe('PokemonService', () => {
  const pokemonService = new PokemonService();

  it('can create and fetch a Pokemon', (done) => {
    let pokemon = StoredPokemonFactory.build();
    pokemonService.create(pokemon)
      .then((createdPokemon) => {
        return createdPokemon.id;
      })
      .then((pokemonId) => {
        return pokemonService.get(pokemonId);
      })
      .then((fetchedPokemon) => {
        expect(fetchedPokemon.id).to.be.ok;
        expect(fetchedPokemon.speciesId).to.equal(pokemon.speciesId);
        expect(fetchedPokemon.stats.hitPoints.value).to.equal(pokemon.stats.hitPoints.value);
        done();
      });
  });
});