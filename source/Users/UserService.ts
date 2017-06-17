import {IUser} from "../Models/IUser";
var User = require("../Sequelize/index").users;
import * as UUID from "uuid/v4";

export class UserService {
  public create(user: IUser) {
    return User.create({
      id: UUID(),
      email: user.email,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  public get(id: string) {
    return User.findById(id);
  }
}
