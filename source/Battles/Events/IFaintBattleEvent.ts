import IBattleEvent from './IBattleEvent';
import { BattleEventType } from './BattleEventType';
import IPokemon from '../../Pokemon/IPokemon';

export default interface IAttackBattleEvent extends IBattleEvent {
  type: BattleEventType.Faint;
  faintedPokemon: IPokemon;
}
