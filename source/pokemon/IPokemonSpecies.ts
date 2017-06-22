import {Type} from "../models/Type";
import {GrowthRate} from "../models/GrowthRate";
import {Habitat} from "../models/Habitats";
import {EncounterRate} from "../models/EncounterRate";
import {MoveLearnMethod} from "../models/MoveLearnMethod";
import {EvolutionTrigger} from "../models/EvolutionTrigger";

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
  stats: IPokemonStats;
  captureRate: number;
  growthRate: GrowthRate;
  genderRate: number;
  habitat: Habitat;
  encounterRate: EncounterRate;
  evolution?: IPokemonEvolution;
}

export interface IPokemonStats {
  hitPoints: IPokemonStat;
  attack: IPokemonStat;
  defense: IPokemonStat;
  specialAttack: IPokemonStat;
  specialDefense: IPokemonStat;
  speed: IPokemonStat;
}

export interface IPokemonStat {
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
