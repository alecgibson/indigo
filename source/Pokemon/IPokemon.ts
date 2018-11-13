import IPokemonStat from './IPokemonStat';
import { Gender } from './Gender';
import { Nature } from './Nature';

export default interface IPokemon {
  id?: string;
  trainerId?: string;
  squadOrder?: number;
  speciesId: number;
  level: number;
  stats: {
    hitPoints: IPokemonStat;
    attack: IPokemonStat;
    defense: IPokemonStat;
    specialAttack: IPokemonStat;
    specialDefense: IPokemonStat;
    speed: IPokemonStat;
    accuracy: IPokemonStat;
    evasion: IPokemonStat;
  };
  moveIds: number[];
  gender: Gender;
  nature: Nature;
  abilityId: number;
}
