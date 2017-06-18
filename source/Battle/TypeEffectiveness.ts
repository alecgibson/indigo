import {Type} from "../Models/Type";
export class TypeEffectiveness {
    private static readonly offensiveTypeEffectiveness = {
        Normal: {
            Rock: 0.5,
            Steel: 0.5,
            Ghost: 0,
        },
        Fire: {
            Bug: 2,
            Grass: 2,
            Ice: 2,
            Steel: 2,
            Dragon: 0.5,
            Fire: 0.5,
            Rock: 0.5,
            Water: 0.5,
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
            Ghost: 0,
        },
        Water: {
            Fire: 2,
            Ground: 2,
            Rock: 2,
            Dragon: 0.5,
            Grass: 0.5,
            Water: 0.5,
        },
        Flying: {
            Bug: 2,
            Fighting: 2,
            Grass: 2,
            Electric: 0.5,
            Rock: 0.5,
            Steel: 0.5,
        },
        Grass: {
            Ground: 2,
            Rock: 2,
            Water: 2,
            Bug: 0.5,
            Dragon: 0.5,
            Fire: 0.5,
            Flying: 0.5,
            Grass: 0.5,
            Poison: 0.5,
            Steel: 0.5,
        },
        Poison: {
            Grass: 2,
            Poison: 0.5,
            Ground: 0.5,
            Rock: 0.5,
            Ghost: 0.5,
            Steel: 0,
        },
        Electric: {
            Flying: 2,
            Water: 2,
            Dragon: 0.5,
            Electric: 0.5,
            Grass: 0.5,
            Ground: 0,
        },
        Ground: {
            Electric: 2,
            Fire: 2,
            Poison: 2,
            Rock: 2,
            Steel: 2,
            Bug: 0.5,
            Grass: 0.5,
            Flying: 0,
        },
        Psychic: {
            Fighting: 2,
            Poison: 2,
            Psychic: 0.5,
            Steel: 0.5,
            Dark: 0,
        },
        Rock: {
            Bug: 2,
            Fire: 2,
            Flying: 2,
            Ice: 2,
            Fighting: 0.5,
            Ground: 0.5,
            Steel: 0.5,
        },
        Ice: {
            Dragon: 2,
            Flying: 2,
            Grass: 2,
            Ground: 2,
            Fire: 0.5,
            Ice: 0.5,
            Steel: 0.5,
            Water: 0.5,
        },
        Bug: {
            Dark: 2,
            Grass: 2,
            Psychic: 2,
            Fighting: 0.5,
            Fire: 0.5,
            Flying: 0.5,
            Ghost: 0.5,
            Poison: 0.5,
            Steel: 0.5,
        },
        Dragon: {
            Dragon: 2,
            Steel: 0.5,
        },
        Ghost: {
            Ghost: 2,
            Psychic: 2,
            Dark: 0.5,
            Normal: 0,
        },
        Dark: {
            Ghost: 2,
            Psychic: 2,
            Dark: 0.5,
            Fighting: 0.5,
            Steel: 0.5,
        },
        Steel: {
            Ice: 2,
            Rock: 2,
            Electric: 0.5,
            Fire: 0.5,
            Steel: 0.5,
            Water: 0.5,
        },
    };

    public static offensive(moveType: Type, defenderType: Type): number {
        let effectiveness = this.offensiveTypeEffectiveness[Type[moveType]][Type[defenderType]];
        return typeof effectiveness === 'number' ? effectiveness : 1;
    }
}