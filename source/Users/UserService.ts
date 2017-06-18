import {IUser} from "../Models/IUser";
const User = require("../Sequelize/index").users;

export class UserService {
  public create(user: IUser) {
    return User.create({
      email: user.email,
    });
  }

  public get(id: string) {
    return User.findById(id);
  }
}
