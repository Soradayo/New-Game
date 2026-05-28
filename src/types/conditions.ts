import type { AbilityKey } from "./primitives";

export type ConditionOp = "gt" | "gte" | "lt" | "lte" | "eq" | "neq" | "has" | "notHas";

export type ConditionTarget =
  | "ageMonths"
  | "money"
  | "world.pressure"
  | `stats.${AbilityKey}`
  | `relationship.${string}.bond`
  | `relationship.${string}.trust`
  | `relationship.${string}.dependency`
  | `relationship.${string}.conflict`
  | "educationLevel"
  | "careerCategory"
  | "socialClass"
  | "affiliation"
  | `relationship.${string}.careerCategory`
  | `relationship.${string}.educationLevel`
  | `relationship.${string}.affiliation`
  | "world.region"
  | "player.lifeTags"
  | "player.traits"
  | `relationship.${string}.lifeTags`
  | `relationship.${string}.traits`
  | "world.tags";

export interface AtomicCondition {
  target: ConditionTarget;
  op: ConditionOp;
  value: number | string;
}

export type Condition =
  | AtomicCondition
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition };
