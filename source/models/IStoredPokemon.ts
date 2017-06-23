import {Nature} from "./Nature";
import {Gender} from "./Gender";
import {OwnerType} from "./OwnerType";

export interface IStoredPokemon {
  id?: string;
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
}

export interface IPokemonStat {
  value: number;
  individualValue: number;
  effortValue: number;
}
