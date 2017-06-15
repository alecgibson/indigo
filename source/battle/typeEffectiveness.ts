import {Type} from "../models/type";
export class TypeEffectiveness {
    private static readonly offensiveTypeEffectiveness = {
        Normal: {
            Rock: 0.5,
            Steel: 0.5,
            Ghost: 0
        },
        Fire: {
            Bug: 2,
            Grass: 2,
            Ice: 2,
            Steel: 2,
            Dragon: 0.5,
            Fire: 0.5,
            Rock: 0.5,
            Water: 0.5
        },
        Fighting: {
            Normal: 2,
            Ice: 2,
            Dark: 2,
            Rock: 2,
            Steel: 2,
            Poison: 0.5,
            Flying: 0.5,
            Bug: 0.5,
            Psychic: 0.5,
            Ghost: 0
        },
        Water: {
            Fire: 2,
            Ground: 2,
            Rock: 2,
            Dragon: 0.5,
            Grass: 0.5,
            Water: 0.5
        },
        Flying: {
            Bug: 2,
            Fighting: 2,
            Grass: 2,
            Electric: 0.5,
            Rock: 0.5,
            Steel: 0.5
        },
        Grass: {
            // TODO finish
        }
    };

    public static offensive(moveType: Type, defenderType: Type): number {
        return this.offensiveTypeEffectiveness[Type[moveType]][Type[defenderType]] || 1;
    }
}