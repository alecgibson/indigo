import { expect } from 'chai';
import 'mocha';
import {PokemonLookup} from "../../../../source/pokemon/PokemonLookup";
import {EvolutionTrigger} from "../../../../source/models/EvolutionTrigger";
import {Type} from "../../../../source/models/Type";
import {EncounterRate} from "../../../../source/models/EncounterRate";
import {GrowthRate} from "../../../../source/models/GrowthRate";

describe('PokemonLookup', () => {
  const pokemonLookup = new PokemonLookup();

  it('has a Bulbasaur', () => {
    let bulbasaur = pokemonLookup.byId(1);
    expect(bulbasaur.id).to.equal(1);
    expect(bulbasaur.name).to.equal('Bulbasaur');
    expect(bulbasaur.types).to.deep.equal([Type.GRASS, Type.POISON]);
    expect(bulbasaur.growthRate).to.equal(GrowthRate.MEDIUM_SLOW);
    expect(bulbasaur.genderRate).to.equal(1);
  });

  it('has a Mew', () => {
    let mew = pokemonLookup.byId(151);
    expect(mew.id).to.equal(151);
    expect(mew.name).to.equal('Mew');
  });

  it('says Mewtwo should never be encountered', () => {
    let mewtwo = pokemonLookup.byId(150);
    expect(mewtwo.encounterRate).to.equal(EncounterRate.NEVER);
  });

  it('says Pikachu evolves into Raichu', () => {
    let pikachu = pokemonLookup.byId(25);
    expect(pikachu.evolution.evolvedPokemonId).to.equal(26);
    expect(pikachu.evolution.trigger).to.equal(EvolutionTrigger.USE_ITEM);
    // TODO: Check that it needs a Thunderstone
  });

  it('says Charmander evolves at level 16', () => {
    let charmander = pokemonLookup.byId(4);
    expect(charmander.evolution.trigger).to.equal(EvolutionTrigger.LEVEL_UP);
    expect(charmander.evolution.level).to.equal(16);
  });

  it('says Kadabra evolves through trade', () => {
    let kadabra = pokemonLookup.byId(64);
    expect(kadabra.evolution.trigger).to.equal(EvolutionTrigger.TRADE);
  });

  describe('getting the minimum level', () => {
    it('for a Charmander is 1', () => {
      let minimumLevel = pokemonLookup.minimumLevel(4);
      expect(minimumLevel).to.equal(1);
    });

    it('for a Charmeleon is 16', () => {
      let minimumLevel = pokemonLookup.minimumLevel(5);
      expect(minimumLevel).to.equal(16);
    });

    it('for a Charizard is 36', () => {
      let minimumLevel = pokemonLookup.minimumLevel(6);
      expect(minimumLevel).to.equal(36);
    });
  });
});
