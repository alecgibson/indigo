import {inject, injectable} from "inversify";
import {IBattleState} from "../models/IBattleState";
import {OwnedPokemonService} from "../pokemon/OwnedPokemonService";
import {Transaction} from "sequelize";
import {IBattleAction} from "../models/IBattleAction";
import {BattleTurnProcessor} from "./BattleTurnProcessor";
import {IBattleTurnProcessor} from "./IBattleTurnProcessor";
import {Async} from "../utilities/Async";
import {BattleStatus} from "../models/BattleStatus";
import {IBattle} from "../models/IBattle";
import {Objects} from "../utilities/Objects";
import {TrainerType} from "../models/TrainerType";
import {ArtificialIntelligence} from "./ArtificialIntelligence";
const Battle = require("../sequelize/index").battles;
const BattleState = require("../sequelize/index").battleStates;
const Trainer = require("../sequelize/index").trainers;
const sequelize = require("../sequelize/index").sequelize;

@injectable()
export class BattleService {
  public constructor(@inject(OwnedPokemonService) private ownedPokemon: OwnedPokemonService,
                     @inject(BattleTurnProcessor) private battleTurn: IBattleTurnProcessor,
                     @inject(ArtificialIntelligence) private artificialIntelligence) {
  }

  // TODO: Handle error where a trainer is already in a battle
  public start(trainer1Id: string, trainer2Id: string, providedTransaction?: Transaction): Promise<IBattle> {
    return sequelize.transaction(newTransaction => {
      const transaction = providedTransaction || newTransaction;

      return Async.do(function*() {
        const [battle, activePokemon1, activePokemon2] = yield Promise.all([
          this.create(transaction),
          this.ownedPokemon.getActivePokemon(trainer1Id, transaction),
          this.ownedPokemon.getActivePokemon(trainer2Id, transaction),
        ]);

        const battleStates = yield Promise.all([
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

        const createdBattle: IBattle = {
          id: battle.id,
          status: BattleStatus.IN_PROGRESS,
          statesByTrainerId: Objects.group(battleStates, 'trainerId'),
        };

        return createdBattle;
      }.bind(this));
    });
  }

  public get(battleId: string, transaction?: Transaction): Promise<IBattle> {
    return BattleState
      .findAll({
        where: {battleId},
        transaction: transaction,
      })
      .then((results) => {
        if (!results.length) {
          return null;
        }

        const battle: IBattle = {
          id: battleId,
          status: BattleStatus.IN_PROGRESS,
          statesByTrainerId: this.mapDatabaseResultsToBattleStates(results),
        };

        return battle;
      });
  }

  public getTrainerBattleState(trainerId: string): Promise<IBattleState> {
    return BattleState.findOne({where: {trainerId}})
      .then((result) => {
        return this.mapDatabaseResultToBattleState(result);
      });
  }

  public submitAction(action: IBattleAction) {
    return Async.do(function*() {
      const battleId = action.battleId;
      const battle = yield this.writeActionAndGetBattle(action);

      const battleStatesWithActions = Objects.values(battle.statesByTrainerId)
        .filter(battle => !!battle.action);

      const otherTrainerId = Object.keys(battle.statesByTrainerId).find(trainerId => trainerId !== action.trainerId);
      const otherTrainerIsAComputer = yield this.trainerIsComputer(otherTrainerId);

      if (battleStatesWithActions.length === 2) {
        const turnResponse = yield this.battleTurn.process(battle, battleStatesWithActions);

        yield this.clearActions(action.battleId);

        if (turnResponse.battle.status === BattleStatus.FINISHED) {
          yield this.destroy(battleId);
        }

        return turnResponse;
      } else if (otherTrainerIsAComputer) {
        const computerAction = yield this.artificialIntelligence.pickAction(otherTrainerId, battleId);
        return this.submitAction(computerAction);
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

  private writeActionAndGetBattle(action: IBattleAction): Promise<IBattle> {
    const battleService = this;

    return sequelize.transaction(
      (transaction) => {
        return Async.do(function*() {
          yield battleService.lockBattle(action.battleId, transaction);

          const updatedState = yield battleService.addActionToState(action, transaction);
          if (!updatedState) {
            return Promise.reject('Invalid action submitted');
          }

          return battleService.get(action.battleId, transaction);
        });
      });
  }

  private create(transaction: Transaction) {
    return Battle.create({}, {transaction});
  }

  private destroy(id: string) {
    return sequelize.transaction(transaction => {
      return Async.do(function*() {

        const battle = yield this.get(id, transaction);
        const trainerIdCriteria = Object.keys(battle.statesByTrainerId).map(trainerId => {
          return {id: trainerId};
        });

        yield Battle.destroy({
          where: {id: id},
          transaction: transaction,
        });

        yield Trainer.destroy({
          where: {
            $not: {type: TrainerType.HUMAN},
            $or: trainerIdCriteria,
          },
          transaction: transaction,
        });
      }.bind(this));
    });
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

  private lockBattle(battleId: string, transaction: Transaction) {
    return Battle.findOne({
      where: {id: battleId},
      transaction: transaction,
      lock: transaction.LOCK.UPDATE,
    });
  }

  private trainerIsComputer(trainerId: string): Promise<boolean> {
    return Trainer.findById(trainerId)
      .then(result => result.type !== TrainerType.HUMAN);
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
