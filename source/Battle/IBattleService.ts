import {IBattle} from "../Models/IBattle";

export interface IBattleService {
    getBattle(id: string): IBattle
}
