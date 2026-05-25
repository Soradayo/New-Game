import type { Condition, GameState } from "../types/game";

export function matchesCondition(state: GameState, condition: Condition): boolean {
  const actual = readConditionValue(state, condition.target);

  switch (condition.op) {
    case "gt":
      return actual > condition.value;
    case "gte":
      return actual >= condition.value;
    case "lt":
      return actual < condition.value;
    case "lte":
      return actual <= condition.value;
    case "eq":
      return actual === condition.value;
  }
}

export function readConditionValue(state: GameState, target: Condition["target"]): number {
  if (target === "ageMonths") return state.player.ageMonths;
  if (target === "money") return state.player.money;
  if (target === "world.pressure") return state.world.pressure;

  const stat = target.replace("stats.", "") as keyof typeof state.player.stats;
  return state.player.stats[stat];
}
