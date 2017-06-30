import {inject, injectable} from "inversify";
import {IBattleState} from "../models/IBattleState";
import {OwnedPokemonService} from "../pokemon/OwnedPokemonService";
const Battle = require("../sequelize/index").battles;
const BattleState = require("../sequelize/index").battleStates;

@injectable()
export class BattleService {
  public constructor(@inject(OwnedPokemonService) private ownedPokemon: OwnedPokemonService) {
  }

  // TODO: Throw error where a trainer is already in a battle
  public start(trainer1Id: string, trainer2Id: string): Promise<IBattleState[]> {
    return Promise
      .all([
        this.create(),
        this.ownedPokemon.getActivePokemon(trainer1Id),
        this.ownedPokemon.getActivePokemon(trainer2Id),
      ])
      .then(([battle, activePokemon1, activePokemon2]) => {
        return Promise.all([
          this.createBattleState({
            trainerId: trainer1Id,
            battleId: battle.id,
            activePokemonId: activePokemon1.id,
          }),
          this.createBattleState({
            trainerId: trainer2Id,
            battleId: battle.id,
            activePokemonId: activePokemon2.id,
          }),
        ]);
      });
  }

  public get(battleId: string): Promise<IBattleState[]> {
    return BattleState
      .findAll({
        where: {battleId: battleId},
      })
      .then((results) => {
        return this.mapDatabaseResultsToBattleStates(results);
      });
  }

  private create() {
    return Battle.create({});
  }

  private createBattleState(battleState: IBattleState): Promise<IBattleState> {
    let action = battleState.action ? JSON.stringify(battleState.action) : null;

    return BattleState
      .create({
        trainerId: battleState.trainerId,
        battleId: battleState.battleId,
        action: action,
        activePokemonId: battleState.activePokemonId,
      })
      .then((result) => {
        return this.mapDatabaseResultToBattleState(result);
      });
  }

  private mapDatabaseResultsToBattleStates(results): IBattleState[] {
    return results.map((result) => {
      return this.mapDatabaseResultToBattleState(result);
    });
  }

  private mapDatabaseResultToBattleState(result): IBattleState {
    return {
      trainerId: result.trainerId,
      battleId: result.battleId,
      action: result.action ? JSON.parse(result.action) : null,
      activePokemonId: result.activePokemonId,
    }
  }
}
