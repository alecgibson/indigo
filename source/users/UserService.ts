import {IUser} from "../models/IUser";
import {PasswordHasher} from "./PasswordHasher";
import {inject, injectable} from "inversify";
import {TrainerService} from "../battles/TrainerService";
import {TrainerType} from "../models/TrainerType";
const User = require("../sequelize/index").users;

@injectable()
export class UserService {
  public constructor(@inject(TrainerService) private trainers: TrainerService) {}

  public create(user: IUser): Promise<IUser> {
    // TODO: Validate
    let saltHashPair = PasswordHasher.hash(user.password);

    return this.trainers.create({type: TrainerType.HUMAN})
      .then((trainer) => {
        return User.create({
          trainerId: trainer.id,
          email: user.email,
          username: user.username,
          salt: saltHashPair.salt,
          password: saltHashPair.hash,
        });
    });
  }

  public get(id: string): Promise<IUser> {
    return User.findById(id);
  }

  public getByEmailOrUsername(emailOrUsername: string): Promise<IUser> {
    return User.findOne({
      where: {
        $or: [
          {email: emailOrUsername},
          {username: emailOrUsername},
        ],
      },
    });
  }

  public getByTrainerId(trainerId: string): Promise<IUser> {
    return User.findOne({
      where: {trainerId},
    });
  }

  public update(user: IUser): Promise<IUser> {
    return User.update(
      {
        activeSessionToken: user.activeSessionToken,
        newSessionToken: user.newSessionToken,
      },
      {
        where: {
          id: user.id,
        },
        returning: true,
      })
      .then((results) => {
        let affectedRows = results[1];
        return affectedRows && affectedRows[0];
      });
  }
}
