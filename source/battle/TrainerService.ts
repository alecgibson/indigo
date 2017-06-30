import {injectable} from "inversify";
import {ITrainer} from "../models/ITrainer";
const Trainers = require("../sequelize/index").trainers;

@injectable()
export class TrainerService {
  public create(trainer: ITrainer) {
    return Trainers.create({
      type: trainer.type,
    });
  }
}
