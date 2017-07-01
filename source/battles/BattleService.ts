import {inject, injectable} from "inversify";
import {IBattleState} from "../models/IBattleState";
import {OwnedPokemonService} from "../pokemon/OwnedPokemonService";
import {IStoredPokemon} from "../models/IStoredPokemon";
import {Transaction} from "sequelize";
const Battle = require("../sequelize/index").battles;
const BattleState = require("../sequelize/index").battleStates;
const sequelize = require("../sequelize/index").sequelize;

@injectable()
export class BattleService {
  public constructor(@inject(OwnedPokemonService) private ownedPokemon: OwnedPokemonService) {
  }

  // TODO: Handle error where a trainer is already in a battle
  public start(trainer1Id: string, trainer2Id: string): Promise<IBattleState[]> {
    return sequelize.transaction(transaction => {
      return Promise
        .all([
          this.create(transaction),
          this.ownedPokemon.getActivePokemon(trainer1Id, transaction),
          this.ownedPokemon.getActivePokemon(trainer2Id, transaction),
        ])
        .then(([battle, activePokemon1, activePokemon2]) => {
          return Promise.all([
            this.createBattleState(
              {
                trainerId: trainer1Id,
                battleId: battle.id,
                activePokemonId: activePokemon1.id,
              },
              transaction
            ),
            this.createBattleState(
              {
                trainerId: trainer2Id,
                battleId: battle.id,
                activePokemonId: activePokemon2.id,
              },
              transaction
            ),
          ]);
        });
    });
  }

  public get(battleId: string): Promise<IBattleState[]> {
    return BattleState
      .findAll({where: {battleId}})
      .then((results) => {
        return this.mapDatabaseResultsToBattleStates(results);
      });
  }

  public getTrainerBattleState(trainerId: string): Promise<IBattleState> {
    return BattleState.findOne({where: {trainerId}})
      .then((result) => {
        return this.mapDatabaseResultToBattleState(result);
      });
  }

  private create(transaction: Transaction) {
    return Battle.create({}, {transaction});
  }

  private createBattleState(battleState: IBattleState, transaction: Transaction): Promise<IBattleState> {
    let action = battleState.action ? JSON.stringify(battleState.action) : null;

    return BattleState
      .create({
          trainerId: battleState.trainerId,
          battleId: battleState.battleId,
          action: action,
          activePokemonId: battleState.activePokemonId,
        },
        {transaction})
      .then((result) => {
        return this.mapDatabaseResultToBattleState(result);
      });
  }

  private mapDatabaseResultsToBattleStates(results): Map<string, IBattleState> {
    return results.reduce((map, result) => {
      map[result.trainerId] = this.mapDatabaseResultToBattleState(result);
      return map;
    }, {});
  }

  private mapDatabaseResultToBattleState(result): IBattleState {
    if (!result) {
      return null;
    }

    return {
      trainerId: result.trainerId,
      battleId: result.battleId,
      action: result.action ? JSON.parse(result.action) : null,
      activePokemonId: result.activePokemonId,
    }
  }
}
