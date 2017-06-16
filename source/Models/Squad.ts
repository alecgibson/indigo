import {IPokemon} from "./IPokemon";

export class Squad {
    private _squadMembers: IPokemon[];
    private _activePokemonIndex: number;

    public pokemonById(id: string): IPokemon {
        return this._squadMembers.find((squadMember) => {
            return squadMember.id === id;
        });
    }

    public activePokemon(index?: number): IPokemon {
        if (typeof index === 'number') {
            if (index > 0 && index < this._squadMembers.length) {
                this._activePokemonIndex = index;
            }
        } else {
            return this._squadMembers[this._activePokemonIndex];
        }
    }
}
