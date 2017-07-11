import {injectable} from "inversify";
import {ITrainer} from "../models/ITrainer";
import {Transaction} from "sequelize";
const Trainers = require("../sequelize/index").trainers;

@injectable()
export class TrainerService {
  public create(trainer: ITrainer, transaction?: Transaction) {
    return Trainers
      .create({
        type: trainer.type,
      }, {
        transaction: transaction,
      })
      .then(result => {
        return this.mapDatabaseResultToTrainer(result);
      });
  }

  public get(id: string): ITrainer {
    return Trainers.findById(id)
      .then(result => {
        return this.mapDatabaseResultToTrainer(result);
      });
  }

  private mapDatabaseResultToTrainer(result): ITrainer {
    if (!result) {
      return null;
    }

    const trainer: ITrainer = {
      id: result.id,
      type: result.type,
    };

    return trainer;
  }
}
