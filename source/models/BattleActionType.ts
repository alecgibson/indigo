// The ordering in this enum is important: it's the priority with which
// moves are executed
export enum BattleActionType {
  MOVE,
  USE_ITEM,
  SWITCH,
  FLEE,
}
