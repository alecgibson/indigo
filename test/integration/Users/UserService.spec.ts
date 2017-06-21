import "reflect-metadata";
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
        return userService.get(user.id);
      })
      .then((user) => {
        expect(user.email).to.equal(user.email);
        expect(user.id).to.be.ok;
        done();
      });
  });

  describe("authenticating a user", () => {
    it("can authenticate by username", (done) => {
      let password = 'password';
      let user = testUser({password: password});
      userService.create(user)
        .then((user) => {
          return userService.getNewSessionToken(user.username, password);
        })
        .then((token) => {
          expect(token).to.be.ok;
          expect(token.length).to.be.above(0);
          done();
        });
    });

    it("can authenticate by email", (done) => {
      let password = 'password';
      let user = testUser({password: password});
      userService.create(user)
        .then((user) => {
          return userService.getNewSessionToken(user.email, password);
        })
        .then((token) => {
          expect(token).to.be.ok;
          expect(token.length).to.be.above(0);
          done();
        });
    });

    it("does not authenticate the wrong password", (done) => {
      let password = 'password';
      let user = testUser({password: password});
      userService.create(user)
        .then((user) => {
          return userService.getNewSessionToken(user.email, 'wrongpassword');
        })
        .then((token) => {
          expect(token).to.be.null;
          done();
        });
    });

    it("validates a user with a new session token", (done) => {
      let user = testUser();
      userService.create(user)
        .then(() => {
          return userService.getNewSessionToken(user.email, user.password);
        })
        .then((token) => {
          return userService.validateNewSessionToken(token);
        })
        .then((authenticatedUser) => {
          expect(authenticatedUser).to.be.ok;
          expect(authenticatedUser.username).to.equal(user.username);
          done();
        });
    });

    it("only allows a new session token to be used once", (done) => {
      let user = testUser();
      userService.create(user)
        .then(() => {
          return userService.getNewSessionToken(user.email, user.password);
        })
        .then((token) => {
          return userService.validateNewSessionToken(token)
            .then((authenticatedUser) => {
              expect(authenticatedUser).to.be.ok;
              expect(authenticatedUser.username).to.equal(user.username);
            })
            .then(() => { return token });
        })
        .then((usedToken) => {
          userService.validateNewSessionToken(usedToken)
            .then((authenticatedUser) => {
              expect(authenticatedUser).to.be.null;
              done();
            });
        });
    });

    it("after validating a new session, the token becomes the active session", (done) => {
      let user = testUser();
      userService.create(user)
        .then(() => {
          return userService.getNewSessionToken(user.email, user.password);
        })
        .then((token) => {
          return userService.validateNewSessionToken(token)
            .then((authenticatedUser) => {
              expect(authenticatedUser).to.be.ok;
              expect(authenticatedUser.username).to.equal(user.username);
              return authenticatedUser;
            });
        })
        .then((authenticatedUser) => {
          userService.validateActiveSessionToken(authenticatedUser)
            .then((isValid) => {
              expect(isValid).to.be.true;
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