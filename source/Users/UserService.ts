import {IUser} from "../Models/IUser";
import {PasswordHasher} from "./PasswordHasher";
const User = require("../Sequelize/index").users;

export class UserService {
  public create(user: IUser) {
    let saltHashPair = PasswordHasher.hash(user.password);

    return User.create({
      email: user.email,
      username: user.username,
      salt: saltHashPair.salt,
      password: saltHashPair.hash,
    });
  }

  public get(id: string) {
    return User.findById(id);
  }
}
