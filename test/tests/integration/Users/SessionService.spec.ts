import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {SessionService} from "../../../../source/users/SessionService";
import {UserService} from "../../../../source/users/UserService";
import {UserFactory} from "../../../factories/UserFactory";

describe("SessionService", () => {
  const userService = new UserService();
  const sessionService = new SessionService(userService);

  it("can authenticate by username", (done) => {
    let password = 'password';
    let user = UserFactory.build({password: password});
    userService.create(user)
      .then((user) => {
        return sessionService.getNewSessionToken(user.username, password);
      })
      .then((token) => {
        expect(token).to.be.ok;
        expect(token.length).to.be.above(0);
        done();
      });
  });

  it("can authenticate by email", (done) => {
    let password = 'password';
    let user = UserFactory.build({password: password});
    userService.create(user)
      .then((user) => {
        return sessionService.getNewSessionToken(user.email, password);
      })
      .then((token) => {
        expect(token).to.be.ok;
        expect(token.length).to.be.above(0);
        done();
      });
  });

  it("does not authenticate the wrong password", (done) => {
    let password = 'password';
    let user = UserFactory.build({password: password});
    userService.create(user)
      .then((user) => {
        return sessionService.getNewSessionToken(user.email, 'wrongpassword');
      })
      .then((token) => {
        expect(token).to.be.null;
        done();
      });
  });

  it("validates a user with a new session token", (done) => {
    let user = UserFactory.build();
    userService.create(user)
      .then(() => {
        return sessionService.getNewSessionToken(user.email, user.password);
      })
      .then((token) => {
        return sessionService.validateNewSessionToken(token);
      })
      .then((authenticatedUser) => {
        expect(authenticatedUser).to.be.ok;
        expect(authenticatedUser.username).to.equal(user.username);
        done();
      });
  });

  it("only allows a new session token to be used once", (done) => {
    let user = UserFactory.build();
    userService.create(user)
      .then(() => {
        return sessionService.getNewSessionToken(user.email, user.password);
      })
      .then((token) => {
        return sessionService.validateNewSessionToken(token)
          .then((authenticatedUser) => {
            expect(authenticatedUser).to.be.ok;
            expect(authenticatedUser.username).to.equal(user.username);
          })
          .then(() => { return token });
      })
      .then((usedToken) => {
        sessionService.validateNewSessionToken(usedToken)
          .then((authenticatedUser) => {
            expect(authenticatedUser).to.be.null;
            done();
          });
      });
  });

  it("makes the validated new session into the active session", (done) => {
    let user = UserFactory.build();
    userService.create(user)
      .then(() => {
        return sessionService.getNewSessionToken(user.email, user.password);
      })
      .then((token) => {
        return sessionService.validateNewSessionToken(token)
          .then((authenticatedUser) => {
            expect(authenticatedUser).to.be.ok;
            expect(authenticatedUser.username).to.equal(user.username);
            return authenticatedUser;
          });
      })
      .then((authenticatedUser) => {
        sessionService.validateActiveSessionToken(authenticatedUser)
          .then((isValid) => {
            expect(isValid).to.be.true;
            done();
          });
      });
  });

  it("invalidates old sessions when validating a second session", (done) => {
    let user = UserFactory.build();
    userService.create(user)
      .then(() => {
        return sessionService.getNewSessionToken(user.email, user.password);
      })
      .then((token) => {
        return sessionService.validateNewSessionToken(token)
          .then((authenticatedUser) => {
            expect(authenticatedUser).to.be.ok;
            expect(authenticatedUser.username).to.equal(user.username);
            return authenticatedUser;
          });
      })
      .then((authenticatedUser) => {
        return sessionService.validateActiveSessionToken(authenticatedUser)
          .then((isValid) => {
            expect(isValid).to.be.true;
            return authenticatedUser;
          });
      })
      .then((userAuthenticatedWithOldSession) => {
        return sessionService.getNewSessionToken(user.email, user.password)
          .then((token) => {
            return sessionService.validateNewSessionToken(token);
          })
          .then(() => {
            return userAuthenticatedWithOldSession;
          });
      })
      .then((userAuthenticatedWithOldSession) => {
        sessionService.validateActiveSessionToken(userAuthenticatedWithOldSession)
          .then((isValid) => {
            expect(isValid).to.be.false;
            done();
          });
      });
  });
});
