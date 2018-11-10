import IAttack from './IAttack';

export default interface IDamageCalculator {
  calculate(attack: IAttack): number;
}
