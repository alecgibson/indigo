const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const yaml = require('js-yaml');

let movesCsv = fs.readFileSync('data/moves.csv');
let moveNamesCsv = fs.readFileSync('data/move_names.csv');
let moveStatChangesCsv = fs.readFileSync('data/move_meta_stat_changes.csv');
let moveMetaCsv = fs.readFileSync('data/move_meta.csv');

let parserOptions = {
  columns: true,
  auto_parse: true,
};

let moveData = parse(movesCsv, parserOptions);
let moveNamesData = parse(moveNamesCsv, parserOptions);
let moveStatChangesData = parse(moveStatChangesCsv, parserOptions);
let moveMetaData = parse(moveMetaCsv, parserOptions);

let moveNamesById = moveNamesData.reduce((map, moveName) => {
  if (moveName.local_language_id === 9) {
    map[moveName.move_id] = moveName.name;
  }
  return map;
}, {});

let statChangesById = moveStatChangesData.reduce((map, statChange) => {
  map[statChange.move_id] = map[statChange.move_id] || [];
  map[statChange.move_id].push({
    statId: statChange.stat_id,
    change: statChange.change,
  });
  return map;
});

let moveMetaById = moveMetaData.reduce((map, meta) => {
  map[meta.move_id] = {
    categoryId: meta.meta_category_id,
    ailmentId: meta.meta_ailment_id,
    minimumHits: meta.min_hits,
    maximumHits: meta.max_hits,
    minimumTurns: meta.min_turns,
    maximumTurns: meta.max_turns,
    drain: meta.drain,
    healing: meta.healing,
    criticalRate: meta.crit_rate,
    ailmentChance: meta.ailment_chance,
    flinchChance: meta.flinch_chance,
    statChance: meta.stat_chance,
  };
  return map;
}, {});

let moves = moveData
  .filter((move) => {
    return move.generation_id <= 3
      && move.id < 1000; // Ignore "shadow" moves
  })
  .map((moveData) => {
    console.log(`Process ${moveData.identifier}`);

    let move = {
      id: moveData.id,
      identifier: moveData.identifier,
      name: moveNamesById[moveData.id],
      type: moveData.type_id,
      power: moveData.power,
      pp: moveData.pp,
      accuracy: moveData.accuracy,
      priority: moveData.priority,
      damageCategory: moveData.damage_class_id,
      effectId: moveData.effect_id,
    };

    Object.assign(move, moveMetaById[moveData.id]);

    if (moveData.effect_chance) {
      move.effectChance = moveData.effect_chance;
    }

    let statChange = statChangesById[moveData.id];
    if (statChange) {
      move.statChanges = statChange;
    }

    return move;
  });

moves.forEach((move) => {
  let paddedId = ("000" + move.id).substr(-3);

  fs.writeFileSync(`data/moves/${paddedId}-${move.identifier}.yaml`, yaml.safeDump(move));
});
