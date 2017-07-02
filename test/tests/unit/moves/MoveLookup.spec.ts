import "reflect-metadata";
import { expect } from 'chai';
import 'mocha';
import {MoveLookup} from "../../../../source/moves/MoveLookup";
import {Type} from "../../../../source/models/Type";

describe('MoveLookup', () => {
  const moveLookup = new MoveLookup();

  it('has Pound', () => {
    let pound = moveLookup.byId(1);
    expect(pound.id).to.equal(1);
    expect(pound.name).to.equal('Pound');
  });

  it('has Psycho Boost', () => {
    let psychoBoost = moveLookup.byId(354);
    expect(psychoBoost.id).to.equal(354);
    expect(psychoBoost.name).to.equal('Psycho Boost');
  });

  it('says that Fire Blast is a Fire type move', () => {
    let fireBlast = moveLookup.byId(126);
    expect(fireBlast.name).to.equal('Fire Blast');
    expect(fireBlast.type).to.equal(Type.FIRE);
  });

  it('says that Splash has 40pp', () => {
    let splash = moveLookup.byId(150);
    expect(splash.name).to.equal('Splash');
    expect(splash.pp).to.equal(40);
  });

  it('says that Quick Attack has a priority of 1', () => {
    let quickAttack = moveLookup.byId(98);
    expect(quickAttack.name).to.equal('Quick Attack');
    expect(quickAttack.priority).to.equal(1);
  });
});
