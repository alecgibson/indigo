import {Nature} from "./Nature";
import {Gender} from "./Gender";
import {OwnerType} from "./OwnerType";

export interface IPokemonDatabase {
  id?: string;
  ownerType?: OwnerType;
  ownerId?: string;
  speciesId: number;
  level: number;
  stats: {
    hitPoints: IPokemonStat,
    attack: IPokemonStat,
    specialAttack: IPokemonStat,
    defense: IPokemonStat,
    specialDefense: IPokemonStat,
    speed: IPokemonStat,
  };
  moveIds: number[];
  gender: Gender;
  nature: Nature;
}

export interface IPokemonStat {
  individualValue: number;
  effortValue: number;
}