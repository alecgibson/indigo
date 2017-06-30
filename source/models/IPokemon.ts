import {Type} from "./Type";

// TODO REMOVE
export interface IPokemon {
  id: string;
  level: number;
  attack: number;
  specialAttack: number;
  defence: number;
  specialDefence: number;
  types: Type[];
  moveIds: number[];
  hitPoints: number;
  trainerId: string;
}
