import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {UserService} from "../../../../source/users/UserService";
import {UserFactory} from "../../../factories/UserFactory";

describe('UserService', () => {
  const userService = new UserService();

  it('can create and fetch a user', (done) => {
    let user = UserFactory.build();
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

  it('stores unicode characters', (done) => {
    let user = UserFactory.build({username: "😃"});
    userService.create(user)
      .then((user) => {
        return userService.get(user.id);
      })
      .then((user) => {
        expect(user.username).to.equal("😃");
        done();
      });
  });
});
