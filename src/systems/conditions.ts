import type { AtomicCondition, Condition, ConditionTarget, GameState } from "../types/game";

export function matchesCondition(state: GameState, condition: Condition): boolean {
  if ("all" in condition) {
    return condition.all.every((child) => matchesCondition(state, child));
  }

  if ("any" in condition) {
    return condition.any.some((child) => matchesCondition(state, child));
  }

  if ("not" in condition) {
    return !matchesCondition(state, condition.not);
  }

  return matchesAtomicCondition(state, condition);
}

function matchesAtomicCondition(state: GameState, condition: AtomicCondition): boolean {
  const actual = readConditionValue(state, condition.target);
  if (actual === undefined) return false;

  switch (condition.op) {
    case "gt":
      return isNumericComparison(actual, condition.value) && actual > Number(condition.value);
    case "gte":
      return isNumericComparison(actual, condition.value) && actual >= Number(condition.value);
    case "lt":
      return isNumericComparison(actual, condition.value) && actual < Number(condition.value);
    case "lte":
      return isNumericComparison(actual, condition.value) && actual <= Number(condition.value);
    case "eq":
      return actual === condition.value;
    case "neq":
      return actual !== condition.value;
    case "has":
      return Array.isArray(actual) && typeof condition.value === "string" && actual.includes(condition.value);
    case "notHas":
      return Array.isArray(actual) && typeof condition.value === "string" && !actual.includes(condition.value);
  }
}

type ConditionActual = number | string | string[] | undefined;

export function readConditionValue(state: GameState, target: ConditionTarget): ConditionActual {
  if (target === "ageMonths") return state.player.ageMonths;
  if (target === "money") return state.player.money;
  if (target === "world.pressure") return state.world.pressure;
  if (target === "educationLevel") return state.player.educationLevel;
  if (target === "careerCategory") return state.player.careerCategory;
  if (target === "socialClass") return state.player.socialClass;
  if (target === "affiliation") return state.player.affiliation;
  if (target === "world.region") return state.world.region;
  if (target === "player.lifeTags") return state.player.lifeTags;
  if (target === "player.traits") return state.player.traits;
  if (target === "world.tags") return state.world.tags;

  if (target.startsWith("relationship.")) {
    return readRelationshipValue(state, target);
  }

  const stat = target.replace("stats.", "") as keyof typeof state.player.stats;
  return state.player.stats[stat];
}

function readRelationshipValue(state: GameState, target: ConditionTarget): ConditionActual {
  const [, relationshipId, field] = target.split(".");
  const relationship = state.relationships.find((entry) => entry.id === relationshipId);
  if (!relationship) return undefined;

  switch (field) {
    case "bond":
      return relationship.bond;
    case "trust":
      return relationship.trust;
    case "dependency":
      return relationship.dependency;
    case "conflict":
      return relationship.conflict;
    case "careerCategory":
      return relationship.careerCategory;
    case "educationLevel":
      return relationship.educationLevel;
    case "affiliation":
      return relationship.affiliation;
    case "lifeTags":
      return relationship.lifeTags;
    case "traits":
      return relationship.traits;
    default:
      return undefined;
  }
}

function isNumericComparison(actual: ConditionActual, value: number | string): actual is number {
  return typeof actual === "number" && typeof value === "number";
}
