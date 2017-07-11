import {Gender} from "./Gender";
import {Nature} from "./Nature";

export interface IOwnPokemon {
  id?: string;
  trainerId?: string;
  squadOrder?: number;
  speciesId: number;
  level: number;
  stats: {
    hitPoints: number,
    attack: number,
    defense: number,
    specialAttack: number,
    specialDefense: number,
    speed: number,
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
