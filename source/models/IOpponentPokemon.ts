import {Gender} from "./Gender";

export interface IOpponentPokemon {
  id: string;
  name: string;
  trainerId: string;
  speciesId: number;
  level: number;
  gender: Gender;
  hitPointFraction: number;
}
