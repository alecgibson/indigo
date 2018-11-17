import IRandom from '../Helpers/IRandom';
import Factory from './Factory';

export default class RandomFactory extends Factory<IRandom> {
  protected base(): IRandom {
    return {
      float: () => 1,
      integer: () => 1,
    };
  }
}
