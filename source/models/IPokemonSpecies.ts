import {Type} from "./Type";
import {GrowthRate} from "./GrowthRate";
import {Habitat} from "./Habitats";
import {EncounterRate} from "./EncounterRate";
import {MoveLearnMethod} from "./MoveLearnMethod";
import {EvolutionTrigger} from "./EvolutionTrigger";

// TODO: Abilities
export interface IPokemonSpecies {
  id: number;
  identifier: string;
  name: string;
  genus: string;
  sortOrder: number;
  height: number;
  weight: number;
  types: Type[];
  baseExperience: number;
  stats: {
    hitPoints: IPokemonBaseStat;
    attack: IPokemonBaseStat;
    defense: IPokemonBaseStat;
    specialAttack: IPokemonBaseStat;
    specialDefense: IPokemonBaseStat;
    speed: IPokemonBaseStat;
  };
  captureRate: number;
  growthRate: GrowthRate;
  genderRate: number;
  habitat: Habitat;
  encounterRate: EncounterRate;
  moves: IPokemonMove[];
  evolution?: IPokemonEvolution;
}

export interface IPokemonBaseStat {
  base: number;
  effortValue: number;
}

export interface IPokemonMove {
  id: number;
  method: MoveLearnMethod;
  level: number;
}

export interface IPokemonEvolution {
  evolvedPokemonId: number;
  trigger: EvolutionTrigger;
  level?: number;
  triggerItemId?: number;
}
