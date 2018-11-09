import IRandom from '../Helpers/IRandom';
import Factory from './Factory';
import NotImplementedError from '../Errors/NotImplementedError';

export default class RandomFactory extends Factory<IRandom> {
  protected base(): IRandom {
    return {
      float: () => { throw new NotImplementedError(); },
    };
  }
}
