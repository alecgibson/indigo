import {IUser} from "../models/IUser";
import {PasswordHasher} from "./PasswordHasher";
import {injectable} from "inversify";
const User = require("../sequelize/index").users;

@injectable()
export class UserService {
  public create(user: IUser): Promise<IUser> {
    let saltHashPair = PasswordHasher.hash(user.password);
    return User.create({
      email: user.email,
      username: user.username,
      salt: saltHashPair.salt,
      password: saltHashPair.hash,
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
