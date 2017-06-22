import { expect } from 'chai';
import 'mocha';
import {PokemonLookup} from "../../../../source/Pokemon/PokemonLookup";
import {EvolutionTrigger} from "../../../../source/Models/EvolutionTrigger";
import {Type} from "../../../../source/Models/Type";

describe('PokemonLookup', () => {
  const pokemonLookup = new PokemonLookup();

  it('contains a Bulbasaur', () => {
    let bulbasaur = pokemonLookup.byId(1);
    expect(bulbasaur.id).to.equal(1);
    expect(bulbasaur.name).to.equal('Bulbasaur');
    expect(bulbasaur.types).to.deep.equal([Type.GRASS, Type.POISON]);
  });

  it('evolves Pikachu into Raichu', () => {
    let pikachu = pokemonLookup.byId(25);
    expect(pikachu.evolution.evolvedPokemonId).to.equal(26);
    expect(pikachu.evolution.trigger).to.equal(EvolutionTrigger.USE_ITEM);
    // TODO: Check that it needs a Thunderstone
  });
});
