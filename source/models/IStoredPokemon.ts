import {Nature} from "./Nature";
import {Gender} from "./Gender";

export interface IStoredPokemon {
  id?: string;
  trainerId?: string;
  squadOrder?: number;
  speciesId: number;
  level: number;
  stats: {
    hitPoints: IPokemonStat,
    attack: IPokemonStat,
    defense: IPokemonStat,
    specialAttack: IPokemonStat,
    specialDefense: IPokemonStat,
    speed: IPokemonStat,
  };
  moveIds: number[];
  gender: Gender;
  nature: Nature;
  abilityId: number;
  currentValues: {
    hitPoints: number;
    pp: any;
  }
}

export interface IPokemonStat {
  value: number;
  individualValue: number;
  effortValue: number;
}
