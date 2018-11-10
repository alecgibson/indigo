import PokemonFactory from '../Factories/PokemonFactory';
import IPokemon from '../Pokemon/IPokemon';
import BattleTurn from './BattleTurn';
import IBattleState from './IBattleState';
import BattleStateFactory from '../Factories/BattleStateFactory';
import Attack from '../Moves/Attack';
import MoveLookup from '../Moves/MoveLookup';
import AttackBattleAction from './Actions/AttackBattleAction';
import BattleAction from './Actions/BattleAction';
import { expect } from 'chai';
import IBattleEvent from './Events/IBattleEvent';
import { BattleEventType } from './Events/BattleEventType';
import IAttackBattleEvent from './Events/IAttackBattleEvent';
import IDamageCalculator from '../Moves/IDamageCalculator';
import DamageCalculatorFactory from '../Factories/DamageCalculatorFactory';

describe('BattleTurn', () => {
  const moves = new MoveLookup();
  let damageCalculator: IDamageCalculator;

  beforeEach(() => {
    damageCalculator = new DamageCalculatorFactory().build();
  });

  describe('a fast Charmander using scratch and a slow Magikarp using splash', () => {
    let charmander: IPokemon;
    let magikarp: IPokemon;
    let startingState: IBattleState;
    let scratchAction: BattleAction;
    let splashAction: BattleAction;
    let turn: BattleTurn;
    let events: IBattleEvent[];

    beforeEach(() => {
      damageCalculator = new DamageCalculatorFactory().build((c: IDamageCalculator) => {
        c.calculate = () => 5;
      });

      charmander = new PokemonFactory().build((p: IPokemon) => {
        p.id = 'charmander';
        p.speciesId = 4;
        p.stats.speed.current = 50;
        p.stats.hitPoints.current = 10;
      });

      magikarp = new PokemonFactory().build((p: IPokemon) => {
        p.id = 'magikarp';
        p.speciesId = 129;
        p.stats.speed.current = 5;
        p.stats.hitPoints.current = 10;
      });

      const scratch = moves.byId(10);
      const scratchAttack = Attack.by(charmander).using(scratch).on(magikarp);
      scratchAction = new AttackBattleAction(damageCalculator, scratchAttack);

      const splash = moves.byId(150);
      const splashAttack = Attack.by(magikarp).using(splash).on(charmander);
      splashAction = new AttackBattleAction(damageCalculator, splashAttack);

      startingState = new BattleStateFactory().build((s: IBattleState) => {
        s.turn = 1;
        s.pokemonsById = { charmander, magikarp };
      });

      turn = new BattleTurn(startingState, splashAction, scratchAction);
      events = turn.events();
    });

    it('returns two attack events', () => {
      const eventTypes = events.map((event: IBattleEvent) => event.type);
      expect(eventTypes).to.deep.equal([BattleEventType.Attack, BattleEventType.Attack]);
    });

    it('Charmander attacks first', () => {
      const firstAttack = events[0] as IAttackBattleEvent;
      const secondAttack = events[1] as IAttackBattleEvent;

      expect(firstAttack.attack.attacker.speciesId).to.equal(charmander.speciesId);
      expect(secondAttack.attack.attacker.speciesId).to.equal(magikarp.speciesId);
    });

    it('Magikarp loses health after the first attack', () => {
      const magikarpHealthAfterFirstAttack = events[0].state.pokemonsById.magikarp.stats.hitPoints.current;
      const magikarpHealthAfterSecondAttack = events[1].state.pokemonsById.magikarp.stats.hitPoints.current;

      expect(magikarpHealthAfterFirstAttack).to.equal(5);
      expect(magikarpHealthAfterSecondAttack).to.equal(5);
    });
  });
});
