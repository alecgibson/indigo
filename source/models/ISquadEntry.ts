import {IStoredPokemon} from "./IStoredPokemon";
import {IGeoCoordinates} from "./IGeoCoordinates";

export interface ISquadEntry {
  userId: string;
  pokemon: IStoredPokemon;
  squadOrder: number;
  caughtDate: Date;
  caughtLocation: IGeoCoordinates;
}
