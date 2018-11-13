import { StatType } from './StatType';

export default interface IPokemonStat {
  type: StatType;
  current?: number;
  total?: number;
  individualValue?: number;
  effortValue?: number;
  stage?: number;
}
