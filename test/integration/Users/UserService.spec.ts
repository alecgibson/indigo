import { expect } from 'chai';
import 'mocha';
import * as UUID from "uuid/v4";
import {UserService} from "../../../source/Users/UserService";
import {IUser} from "../../../source/Models/IUser";

describe('UserService', () => {
  const userService = new UserService();

  it('can create and fetch a user', (done) => {
    let user = testUser();
    userService.create(user)
      .then((user) => {
        userService.get(user.id)
          .then((user) => {
            expect(user.email).to.equal(user.email);
            expect(user.id).to.not.be.null;
            done();
          });
      });
  });

  function testUser(): IUser {
    return {
      email: UUID() + '@example.com',
    };
  }
});