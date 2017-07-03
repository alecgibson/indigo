import {inject, injectable} from "inversify";
import {IBattleState} from "../models/IBattleState";
import {OwnedPokemonService} from "../pokemon/OwnedPokemonService";
import {Transaction} from "sequelize";
import {IBattleAction} from "../models/IBattleAction";
import {BattleTurnProcessor} from "./BattleTurnProcessor";
import {IBattleTurnProcessor} from "./IBattleTurnProcessor";
import {Async} from "../utilities/Async";
const Battle = require("../sequelize/index").battles;
const BattleState = require("../sequelize/index").battleStates;
const sequelize = require("../sequelize/index").sequelize;
const Sequelize = require("../sequelize/index").Sequelize;

@injectable()
export class BattleService {
  public constructor(@inject(OwnedPokemonService) private ownedPokemon: OwnedPokemonService,
                     @inject(BattleTurnProcessor) private battleTurn: IBattleTurnProcessor) {
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

  public get(battleId: string, transaction?: Transaction): Promise<Map<string, IBattleState>> {
    return BattleState
      .findAll({
        where: {battleId},
        transaction: transaction,
      })
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

  public submitAction(action: IBattleAction) {
    return Async.do(function* () {
      let battleStatesWithActions = yield this.writeActionAndGetActions(action);

      if (battleStatesWithActions.length === 2) {
        let turnResponse = yield this.battleTurn.process(battleStatesWithActions);
        yield this.clearActions(action.battleId);
        return turnResponse;
      }
    }.bind(this));
  }

  public clearActions(battleId: string) {
    return BattleState.update(
      {
        action: null,
      },
      {
        where: {battleId},
      }
    );
  }

  private writeActionAndGetActions(action: IBattleAction) {
    return sequelize
      .transaction(
        {
          isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
          type: Sequelize.Transaction.TYPES.EXCLUSIVE,
        },
        (transaction) => {
          return this.addActionToState(action, transaction)
            .then((updatedState) => {
              if (!updatedState) {
                return Promise.reject('Invalid action submitted');
              } else {
                return this.get(action.battleId, transaction);
              }
            })
            .then((battleStatesByTrainerId) => {
              return Object.keys(battleStatesByTrainerId)
                .reduce((values, key) => {
                  values.push(battleStatesByTrainerId[key]);
                  return values;
                }, [])
                .filter((battleState) => !!battleState.action);
            });
        })
      .catch((error) => {
        // TODO: This feels inelegant - is there a better way? Maybe have a row lock on the Battles table?
        // Here we have to catch a serialization error from trying to write
        // to a locked table, and then retry
        if (error.name === 'SequelizeDatabaseError' && error.parent.code === '40001') {
          return this.writeActionAndGetActions(action);
        }
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

  private addActionToState(action: IBattleAction, transaction: Transaction): Promise<IBattleAction> {
    return BattleState
      .update(
        {
          action: JSON.stringify(action),
        },
        {
          where: {
            trainerId: action.trainerId,
            battleId: action.battleId,
            action: null,
          },
          transaction: transaction,
        }
      )
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
