import {IUser} from "../../source/models/IUser";
import * as uuidv4 from "uuid/v4";
import {UserService} from "../../source/users/UserService";
import {TrainerService} from "../../source/battles/TrainerService";

export class UserFactory {
  public static build(overrides?): IUser {
    let id = uuidv4();

    return Object.assign({
      id: id,
      email: `${id}@example.com`,
      username: id,
      password: 'password',
    }, overrides);
  }

  public static create(overrides?) {
    let user = UserFactory.build(overrides);
    let trainerService = new TrainerService();
    let userService = new UserService(trainerService);
    return userService.create(user);
  }
}
