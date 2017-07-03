import {IStoredPokemon, IPokemonStat} from "../models/IStoredPokemon";
import {Random} from "../utilities/Random";
import {StatCalculator} from "./StatCalculator";
import {StatType} from "../models/StatType";
import {Nature} from "../models/Nature";
import {inject, injectable} from "inversify";
import {PokemonLookup} from "./PokemonLookup";
import {IPokemonSpecies} from "../models/IPokemonSpecies";
import {MoveLearnMethod} from "../models/MoveLearnMethod";
import {Gender} from "../models/Gender";
import {MoveLookup} from "../moves/MoveLookup";

@injectable()
export class PokemonSpawner {
  public constructor(@inject(PokemonLookup) private pokemonLookup: PokemonLookup,
                     @inject(MoveLookup) private moveLookup: MoveLookup) {
  }

  public spawn(speciesId: number, level: number): IStoredPokemon {
    let species = this.pokemonLookup.byId(speciesId);
    let nature = this.randomNature();

    let hitPoints = this.createStat(
      StatType.HIT_POINTS,
      species.stats.hitPoints.base,
      level,
      nature,
    );

    let moveIds = this.generateMoveIdsForLevel(species, level);
    let movePp = moveIds.reduce((map, moveId) => {
      let move = this.moveLookup.byId(moveId);
      map[moveId] = move.pp;
      return map;
    }, {});

    return {
      speciesId: speciesId,
      level: level,
      stats: {
        hitPoints: hitPoints,
        attack: this.createStat(
          StatType.ATTACK,
          species.stats.attack.base,
          level,
          nature,
        ),
        defense: this.createStat(
          StatType.DEFENSE,
          species.stats.defense.base,
          level,
          nature,
        ),
        specialAttack: this.createStat(
          StatType.SPECIAL_ATTACK,
          species.stats.specialAttack.base,
          level,
          nature,
        ),
        specialDefense: this.createStat(
          StatType.SPECIAL_DEFENSE,
          species.stats.specialDefense.base,
          level,
          nature,
        ),
        speed: this.createStat(
          StatType.SPEED,
          species.stats.speed.base,
          level,
          nature,
        )
      },
      moveIds: this.generateMoveIdsForLevel(species, level),
      gender: this.randomGender(species),
      nature: nature,
      abilityId: this.randomAbilityId(species),
      currentValues: {
        hitPoints: hitPoints.value,
        pp: movePp,
      }
    };
  }

  private randomNature(): Nature {
    return Random.integerInclusive(1, 25);
  }

  private createStat(statType: StatType,
                     baseValue: number,
                     level: number,
                     nature: Nature): IPokemonStat {
    let individualValue = this.randomIndividualValue();
    let effortValue = 0;
    let value = StatCalculator.calculate(
      statType,
      baseValue,
      individualValue,
      effortValue,
      level,
      nature,
    );

    return {
      value: value,
      individualValue: individualValue,
      effortValue: effortValue,
    };
  }

  private randomIndividualValue(): number {
    return Random.integerInclusive(0, 31);
  }

  private generateMoveIdsForLevel(species: IPokemonSpecies, level: number): number[] {
    return species.moves
      .filter((move) => {
        return move.method === MoveLearnMethod.LEVEL_UP
          && move.level <= level;
      })
      .sort(function sortByDescendingLevelAndOrder(a, b) {
        let sortByLevel = b.level - a.level;
        return sortByLevel ? sortByLevel : b.order - a.order;
      })
      .slice(0, 4)
      .sort(function sortByAscendingLevel(a, b) {
        return a.level - b.level;
      })
      .map((move) => {
        return move.id
      });
  }

  private randomGender(species: IPokemonSpecies): Gender {
    if (species.genderRate === -1) {
      return Gender.NONE;
    }

    let chanceOfBeingFemale = species.genderRate / 8;
    if (Random.float() < chanceOfBeingFemale) {
      return Gender.FEMALE;
    } else {
      return Gender.MALE;
    }
  }

  private randomAbilityId(species: IPokemonSpecies): number {
    let nonHiddenAbilities = species.abilities.filter((ability) => !ability.hidden);
    return Random.element(nonHiddenAbilities).id;
  }
}
