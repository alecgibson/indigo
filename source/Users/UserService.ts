import {IUser} from "../Models/IUser";
import {PasswordHasher} from "./PasswordHasher";
import {injectable} from "inversify";
const User = require("../Sequelize/index").users;
const uuidv4 = require('uuid/v4');

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

  public getNewSessionToken(emailOrUsername: string, password: string): Promise<string> {
    return this.getByEmailOrUsername(emailOrUsername)
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
    return this.getByNewSessionToken(newSessionToken)
      .then((user) => {
        if (!user) {
          return null;
        }

        user.activeSessionToken = user.newSessionToken;
        user.newSessionToken = uuidv4();
        return this.update(user);
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
    return this.update(user);
  }
}
