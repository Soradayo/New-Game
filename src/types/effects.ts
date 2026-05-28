import type { AbilityKey } from "./primitives";

export type EffectTarget =
  | "money"
  | "world.pressure"
  | "world.region"
  | "world.tags.add"
  | "world.tags.remove"
  | "affiliation"
  | `stats.${AbilityKey}`
  | `relationship.${"all" | string}`
  | "relationship.all.lifeTags.add"
  | "relationship.all.lifeTags.remove"
  | "relationship.all.traits.add"
  | "relationship.all.traits.remove"
  | `relationship.${string}.lifeTags.add`
  | `relationship.${string}.lifeTags.remove`
  | `relationship.${string}.traits.add`
  | `relationship.${string}.traits.remove`
  | `relationship.${string}.affiliation`
  | `relationship.${string}.careerCategory`
  | `relationship.${string}.educationLevel`
  | `relationship.${string}.trust`
  | `relationship.${string}.dependency`
  | `relationship.${string}.conflict`
  | "player.lifeTags.add"
  | "player.lifeTags.remove"
  | "player.traits.add"
  | "player.traits.remove"
  | "inventory.add";

export interface Effect {
  target: EffectTarget;
  value: number | string;
}
