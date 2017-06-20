import {IUser} from "../Models/IUser";
import {PasswordHasher} from "./PasswordHasher";
import {injectable} from "inversify";
const User = require("../Sequelize/index").users;

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

  public getByEmailOrUsername(emailOrUsername: string) {
    return User.findOne({
      where: {
        $or: [
          {email: emailOrUsername},
          {username: emailOrUsername},
        ],
      },
    });
  }

  public authenticateUser(emailOrUsername: string, password: string): Promise<IUser> {
    return this.getByEmailOrUsername(emailOrUsername)
      .then((user) => {
        if (!user) {
          return null;
        }

        let hashedPassword = PasswordHasher.hashWithSalt(password, user.salt);
        return hashedPassword === user.password
          ? user
          : null;
      });
  }
}
