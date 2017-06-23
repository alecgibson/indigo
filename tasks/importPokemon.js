const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const yaml = require('js-yaml');

const NUMBER_OF_POKEMON = 151;

let pokemonCsv = fs.readFileSync('data/pokemon_tweaked_unofficial.csv', 'utf8');
let pokemonSpeciesCsv = fs.readFileSync('data/pokemon_species.csv', 'utf8');
let pokemonEvolutionCsv = fs.readFileSync('data/pokemon_evolution.csv', 'utf8');
let pokemonMovesCsv = fs.readFileSync('data/pokemon_moves.csv', 'utf8');
let pokemonStatsCsv = fs.readFileSync('data/pokemon_stats.csv', 'utf8');
let pokemonTypesCsv = fs.readFileSync('data/pokemon_types.csv', 'utf8');
let pokemonNamesCsv = fs.readFileSync('data/pokemon_species_names.csv', 'utf8');

let parserOptions = {
  columns: true,
  auto_parse: true,
};

let pokemonsData = parse(pokemonCsv, parserOptions);
let species = parse(pokemonSpeciesCsv, parserOptions);
let evolutions = parse(pokemonEvolutionCsv, parserOptions);
let pokemonMoves = parse(pokemonMovesCsv, parserOptions);
let stats = parse(pokemonStatsCsv, parserOptions);
let pokemonTypes = parse(pokemonTypesCsv, parserOptions);
let pokemonNames = parse(pokemonNamesCsv, parserOptions);

let evolutionsByEvolvedSpeciesId = evolutions.reduce((map, evolution) => {
  map[evolution.evolved_species_id] = evolution;
  return map;
}, {});

let pokemonMovesByPokemonId = pokemonMoves.reduce((map, move) => {
  // Find the FireRed/LeafGreen version group
  if (move.version_group_id === 7) {
    map[move.pokemon_id] = map[move.pokemon_id] || [];
    map[move.pokemon_id].push(move);
  }
  return map;
}, {});

let statsByPokemonId = stats.reduce((map, stat) => {
  map[stat.pokemon_id] = map[stat.pokemon_id] || {};
  let pokemonStat = {
    base: stat.base_stat,
    effortValue: stat.effort,
  };
  switch (stat.stat_id) {
    case 1:
      map[stat.pokemon_id].hitPoints = pokemonStat;
      break;
    case 2:
      map[stat.pokemon_id].attack = pokemonStat;
      break;
    case 3:
      map[stat.pokemon_id].defense = pokemonStat;
      break;
    case 4:
      map[stat.pokemon_id].specialAttack = pokemonStat;
      break;
    case 5:
      map[stat.pokemon_id].specialDefense = pokemonStat;
      break;
    case 6:
      map[stat.pokemon_id].speed = pokemonStat;
  }
  return map;
}, {});

let typesByPokemonId = pokemonTypes.reduce((map, type) => {
  map[type.pokemon_id] = map[type.pokemon_id] || [];
  map[type.pokemon_id].push(type.type_id);
  return map;
}, {});

let namesByPokemonId = pokemonNames.reduce((map, name) => {
  // Find English names
  if (name.local_language_id === 9) {
    map[name.pokemon_species_id] = {
      name: name.name,
      genus: name.genus,
    };
  }
  return map;
}, {});

let pokemons = [''];
for (let i = 0; i < NUMBER_OF_POKEMON; i++) {
  console.log(`Process Pokemon #${i+1}`);
  let pokemonData = pokemonsData[i];
  let specie = species[i];
  let baseStats = statsByPokemonId[pokemonData.id];
  let types = typesByPokemonId[pokemonData.id];
  let name = namesByPokemonId[pokemonData.id];

  let pokemon = {
    id: pokemonData.id,
    identifier: pokemonData.identifier,
    name: name.name,
    genus: name.genus,
    sortOrder: pokemonData.order,
    height: pokemonData.height,
    weight: pokemonData.weight,
    types: types,
    baseExperience: pokemonData.base_experience,
    stats: baseStats,
    captureRate: specie.capture_rate,
    growthRate: specie.growth_rate_id,
    genderRate: specie.gender_rate,
    habitat: specie.habitat_id,
    encounterRate: pokemonData.unofficial_encounter_rate,
  };

  let moves = pokemonMovesByPokemonId[pokemonData.id];
  pokemon.moves = moves.map((move) => {
    let pokemonMove = {
      id: move.move_id,
      method: move.pokemon_move_method_id,
      level: move.level,
    };

    pokemonMove.order = move.order || 1;

    return pokemonMove;
  });

  if (specie.evolves_from_species_id && pokemons[specie.evolves_from_species_id]) {
    let evolution = evolutionsByEvolvedSpeciesId[pokemonData.id];
    pokemons[specie.evolves_from_species_id].evolution = {
      evolvedPokemonId: pokemonData.id,
      trigger: evolution.evolution_trigger_id,
    };

    if (evolution.trigger_item_id) {
      pokemons[specie.evolves_from_species_id].evolution.triggerItemId = evolution.trigger_item_id;
    }
    if (evolution.minimum_level) {
      pokemons[specie.evolves_from_species_id].evolution.level = evolution.minimum_level;
    }
  }

  pokemons.push(pokemon);
}

pokemons.forEach((pokemon) => {
  if (!pokemon) {
    return;
  }

  let paddedId = ("000" + pokemon.id).substr(-3);

  fs.writeFileSync(`data/pokemon/${paddedId}-${pokemon.identifier}.yaml`, yaml.safeDump(pokemon));
});
