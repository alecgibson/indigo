import { StatType } from '../Pokemon/StatType';

export default interface IStatChange {
  statId: StatType;
  change: number;
}
