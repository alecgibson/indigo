import {expect} from 'chai';
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

  describe("authenticating a user", () => {
    it("can authenticate by username", (done) => {
      let password = 'password';
      let user = testUser({password: password});
      userService.create(user)
        .then((user) => {
          userService.authenticateUser(user.username, password)
            .then((isValid) => {
              expect(isValid).to.be.true;
              done();
            });
        });
    });

    it("can authenticate by email", (done) => {
      let password = 'password';
      let user = testUser({password: password});
      userService.create(user)
        .then((user) => {
          userService.authenticateUser(user.email, password)
            .then((isValid) => {
              expect(isValid).to.be.true;
              done();
            });
        });
    });

    it("does not authenticate the wrong password", (done) => {
      let password = 'password';
      let user = testUser({password: password});
      userService.create(user)
        .then((user) => {
          userService.authenticateUser(user.email, 'wrongpassword')
            .then((isValid) => {
              expect(isValid).to.be.false;
              done();
            });
        });
    });
  });

  function testUser(extraOptions?): IUser {
    return Object.assign({
      email: UUID() + '@example.com',
      username: UUID(),
      password: 'password',
    }, extraOptions);
  }
});