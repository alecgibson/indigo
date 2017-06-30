import {ITrainer} from "../../source/models/ITrainer";
import {TrainerType} from "../../source/models/TrainerType";
import {TrainerService} from "../../source/battles/TrainerService";

export class TrainerFactory {
  public static build(overrides?): ITrainer {
    return Object.assign({
      type: TrainerType.HUMAN,
    }, overrides);
  }

  public static create(overrides?): Promise<ITrainer> {
    let trainer = TrainerFactory.build(overrides);
    let trainerService = new TrainerService();
    return trainerService.create(trainer);
  }
}
