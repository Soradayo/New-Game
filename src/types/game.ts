export type LifePhase =
  | "childhood"
  | "youth"
  | "youngAdulthood"
  | "adulthood"
  | "oldAge";

export type AbilityKey =
  | "body"
  | "mind"
  | "craft"
  | "social"
  | "spirit";

export type SocialClass = "lower" | "worker" | "middle" | "upper" | "special";

export type Region =
  | "capital"
  | "industrial"
  | "academic"
  | "religious"
  | "frontier";

export type OrganizationKind =
  | "state"
  | "corporation"
  | "academia"
  | "religion"
  | "underground";

export type Stats = Record<AbilityKey, number>;

export interface Player {
  name: string;
  ageMonths: number;
  socialClass: SocialClass;
  affiliation: string;
  money: number;
  stats: Stats;
  inventory: string[];
}

export interface Relationship {
  id: string;
  name: string;
  role: string;
  bond: number;
}

export interface WorldState {
  nation: string;
  nationArchetype: string;
  region: Region;
  organizations: Record<OrganizationKind, string>;
  pressure: number;
}

export interface HistoryEntry {
  id: string;
  eventId?: string;
  turn: number;
  ageMonths: number;
  text: string;
  category: string;
}

export interface GameState {
  version: string;
  turn: number;
  selectedActionId: string;
  selectedStanceId: string;
  player: Player;
  world: WorldState;
  relationships: Relationship[];
  history: HistoryEntry[];
}

export interface SavePayload extends GameState {}

export type EffectTarget =
  | "money"
  | "world.pressure"
  | `stats.${AbilityKey}`
  | `relationship.${"all" | string}`
  | "inventory.add";

export interface Effect {
  target: EffectTarget;
  value: number | string;
}

export interface Condition {
  target: "ageMonths" | "money" | "world.pressure" | `stats.${AbilityKey}`;
  op: "gt" | "gte" | "lt" | "lte" | "eq";
  value: number;
}

export interface GameAction {
  id: string;
  label: string;
  description: string;
  effects: Effect[];
}

export interface Stance {
  id: string;
  label: string;
  description: string;
  effects: Effect[];
}

export interface EventDefinition {
  id: string;
  category: "daily" | "relationship" | "turningPoint" | "world";
  weight: number;
  cooldownTurns?: number;
  conditions: Condition[];
  effects: Effect[];
  template: string;
}

export interface ItemDefinition {
  id: string;
  label: string;
  description: string;
  effects: Effect[];
}

export interface TraitDefinition {
  id: string;
  label: string;
  description: string;
  tags: string[];
  effects: Effect[];
}

export interface NameData {
  given: string[];
  family: string[];
  npcRoles: string[];
}

export interface GameData {
  actions: GameAction[];
  stances: Stance[];
  events: EventDefinition[];
  items: ItemDefinition[];
  traits: TraitDefinition[];
  names: NameData;
}

export interface ModData {
  actions?: GameAction[];
  stances?: Stance[];
  events?: EventDefinition[];
  items?: ItemDefinition[];
  traits?: TraitDefinition[];
  names?: Partial<NameData>;
}
