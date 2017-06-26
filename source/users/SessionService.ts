import {inject, injectable} from "inversify";
import {UserService} from "./UserService";
import {PasswordHasher} from "./PasswordHasher";
import {IUser} from "../models/IUser";
import * as uuidv4 from "uuid/v4";
const User = require("../sequelize/index").users;

@injectable()
export class SessionService {
  public constructor(
    @inject(UserService) private users: UserService,
  ) {}

  public getNewSessionToken(emailOrUsername: string, password: string): Promise<string> {
    return this.users.getByEmailOrUsername(emailOrUsername)
      .then((user) => {
        if (!user) {
          return null;
        }

        let hashedPassword = PasswordHasher.hashWithSalt(password, user.salt);
        return hashedPassword === user.password
          ? user
          : null;
      })
      .then((user) => {
        return this.generateNewSessionToken(user);
      })
      .then((user) => {
        return user && user.newSessionToken;
      });
  }

  public validateNewSessionToken(newSessionToken: string): Promise<IUser> {
    if (!newSessionToken) {
      return Promise.resolve(null);
    }

    return this.getByNewSessionToken(newSessionToken)
      .then((user) => {
        if (!user) {
          return null;
        }

        user.activeSessionToken = user.newSessionToken;
        user.newSessionToken = uuidv4();
        return this.users.update(user);
      });
  }

  public validateActiveSessionToken(user: IUser): Promise<boolean> {
    return User.count({
      where: {
        activeSessionToken: user.activeSessionToken,
      }
    }).then((count) => {
      return !!count;
    })
  }

  private getByNewSessionToken(newSessionToken: string): Promise<IUser> {
    return User.findOne({
      where: {
        newSessionToken: newSessionToken
      }
    });
  }

  private generateNewSessionToken(user: IUser): Promise<IUser> {
    if (!user) {
      return Promise.resolve(null);
    }

    user.newSessionToken = uuidv4();
    return this.users.update(user);
  }
}