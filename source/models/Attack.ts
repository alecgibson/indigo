import {IMove} from "./IMove";
import {IStoredPokemon} from "./IStoredPokemon";

export class Attack {
    public attacker: IStoredPokemon;
    public defender: IStoredPokemon;
    public move: IMove;

    private constructor(attacker: IStoredPokemon) {
        this.attacker = attacker;
    }

    public static by(attacker: IStoredPokemon): Attack {
        return new Attack(attacker);
    }

    public using(move: IMove): Attack {
        this.move = move;
        return this;
    }

    public on(defender: IStoredPokemon): Attack {
        this.defender = defender;
        return this;
    }
}