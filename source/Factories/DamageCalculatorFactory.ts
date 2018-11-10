import IDamageCalculator from '../Moves/IDamageCalculator';
import Factory from './Factory';
import NotImplementedError from '../Errors/NotImplementedError';

export default class DamageCalculatorFactory extends Factory<IDamageCalculator> {
  protected base(): IDamageCalculator {
    return {
      calculate: () => { throw new NotImplementedError(); },
    };
  }
}
