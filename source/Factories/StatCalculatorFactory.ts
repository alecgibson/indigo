import Factory from './Factory';
import IStatCalculator from '../Moves/IStatCalculator';

export default class StatCalculatorFactory extends Factory<IStatCalculator> {
  protected base(): IStatCalculator {
    return {
      apply: () => {},
      accuracyMultiplier: () => 1,
    };
  }
}
