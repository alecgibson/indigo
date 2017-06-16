import {IBattleService} from "../IBattleService";
import {IBattle} from "../../Models/IBattle";
import {DamageCalculator} from "../DamageCalculator";
import {Attack} from "../../Models/Attack";
import {IPokemon} from "../../Models/IPokemon";
import {IMoveLookup} from "../../Moves/IMoveLookup";
import {IMoveAction} from "../../Models/IMoveAction";
import {IPokemonService} from "../../Pokemon/IPokemonService";
import {BattleState} from "../../Models/BattleState";
import {IMoveActionResponse} from "../../Models/IMoveActionResponse";

export class moveActionHandler {
    public constructor(
        private battleService: IBattleService,
        private moveLookup: IMoveLookup,
        private damageCalculator: DamageCalculator,
        private pokemonService: IPokemonService,
    ) {}

    public handle(action: IMoveAction): IMoveActionResponse {
        let battle = this.battleService.getBattle(action.battleId);

        if (this.actionIsInvalid(action, battle)) {
            return;
        }

        let damage = this.calculateDamage(action, battle);
        this.applyDamage(damage, action, battle);
        this.updateBattle(battle);
    }

    private actionIsInvalid(action: IMoveAction, battle: IBattle): boolean {
        if (action.battleId !== battle.id) {
            return true;
        }

        if (battle.state !== BattleState.InProgress) {
            return true;
        }

        if (action.attackingTrainerId !== battle.nextTurnTrainerId) {
            return true;
        }

        // TODO: Check attacker and defender are active Pokemon

        if (!battle.pokemonById[action.attackingPokemonId]) {
            return true;
        }

        if (!battle.pokemonById[action.defendingPokemonId]) {
            return true;
        }

        let attackingPokemon = this.attackingPokemon(action, battle);
        let pokemonHasMove = attackingPokemon.moveIds.indexOf(action.moveId) > -1;
        if (!pokemonHasMove) {
            return true;
        }
    }

    private calculateDamage(action: IMoveAction, battle: IBattle): number {
        let attackingPokemon = this.attackingPokemon(action, battle);
        let defendingPokemon = this.defendingPokemon(action, battle);
        let move = this.moveLookup.byId(action.moveId);
        let attack = Attack.by(attackingPokemon).using(move).on(defendingPokemon);
        return this.damageCalculator.calculate(attack);
    }

    private applyDamage(damage: number, action: IMoveAction, battle: IBattle) {
        let defendingPokemon = this.defendingPokemon(action, battle);
        defendingPokemon.hitPoints = Math.max(defendingPokemon.hitPoints - damage, 0);
        this.pokemonService.updatePokemon(defendingPokemon);
    }

    private updateBattle(battle: IBattle) {
        // Check for any fainting
        // Check if trainer has any Pokemon left
    }

    private attackingPokemon(action: IMoveAction, battle: IBattle): IPokemon {
        return battle.squadsByTrainer[action.attackingTrainerId].
    }

    private defendingPokemon(action: IMoveAction, battle: IBattle): IPokemon {
        return battle.pokemonById[action.defendingPokemonId];
    }
}
