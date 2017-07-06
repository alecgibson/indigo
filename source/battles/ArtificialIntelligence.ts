import {inject, injectable} from "inversify";
import {OwnedPokemonService} from "../pokemon/OwnedPokemonService";
import {Async} from "../utilities/Async";
import {IBattleMoveAction} from "../models/IBattleMoveAction";
import {Random} from "../utilities/Random";
import {BattleActionType} from "../models/BattleActionType";
import {IBattleAction} from "../models/IBattleAction";

@injectable()
export class ArtificialIntelligence {
  public constructor(@inject(OwnedPokemonService) private ownedPokemon: OwnedPokemonService) {}

  public pickAction(trainerId: string, battleId: string): Promise<IBattleAction> {
    return Async.do(function* () {
      const activePokemon = yield this.ownedPokemon.getActivePokemon(trainerId);
      const moveIndex = Random.integerExclusive(0, activePokemon.moveIds.length);

      const action: IBattleMoveAction = {
        trainerId: trainerId,
        battleId: battleId,
        moveId: activePokemon.moveIds[moveIndex],
        type: BattleActionType.MOVE,
      };

      return action;
    }.bind(this));
  }
}
