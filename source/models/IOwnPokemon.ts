import {Gender} from "./Gender";
import {Nature} from "./Nature";

export interface IOwnPokemon {
  id: string;
  name: string;
  trainerId: string;
  squadOrder: number;
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
  moves: IOwnPokemonMove[];
  gender: Gender;
  nature: Nature;
  abilityId: number;
  currentValues: {
    hitPoints: number;
    pp: any;
  }
}

export interface IOwnPokemonMove {
  id: number;
  name: string;
  currentPowerPoints: number;
  maxPowerPoints: number;
}
