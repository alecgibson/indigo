import {IUser} from "../../source/models/IUser";
import * as uuidv4 from "uuid/v4";

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
}
