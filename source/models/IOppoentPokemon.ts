import {Gender} from "./Gender";

export interface IOppoentPokemon {
  id?: string;
  trainerId?: string;
  speciesId: number;
  level: number;
  gender: Gender;
  hitPointFraction: number;
}
