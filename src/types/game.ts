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

export type EducationLevel =
  | "none"
  | "primary"
  | "secondary"
  | "vocational"
  | "higher"
  | "nightSchool";

export type CareerCategory =
  | "none"
  | "labor"
  | "clerical"
  | "academic"
  | "religious"
  | "state"
  | "underground"
  | "mercantile";

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
  educationLevel: EducationLevel;
  careerCategory: CareerCategory;
  lifeTags: string[];
  traits: string[];
  stats: Stats;
  inventory: string[];
}

export interface Relationship {
  id: string;
  name: string;
  role: string;
  bond: number;
  ageMonths: number;
  educationLevel: EducationLevel;
  careerCategory: CareerCategory;
  affiliation: string;
  lifeTags: string[];
  traits: string[];
}

export interface WorldState {
  nation: string;
  nationArchetype: string;
  region: Region;
  organizations: Record<OrganizationKind, string>;
  pressure: number;
  tags: string[];
}

export type HistorySourceType =
  | "event"
  | "turningPoint"
  | "npcInteraction"
  | "world"
  | "system"
  | "summary";

export type HistoryImportance = "minor" | "normal" | "major" | "turningPoint";

export type HistoryParamValue = string | number;

export interface HistoryStateDiff {
  target: "money" | "stats" | "relationships" | "world" | "tags" | "inventory";
  label?: string;
  before?: number | string;
  after?: number | string;
  delta?: number;
}

export interface HistoryEntry {
  id: string;
  turn: number;
  ageMonths: number;
  text: string;
  locKey?: string;
  params?: Record<string, HistoryParamValue>;
  sourceId: string;
  sourceType: HistorySourceType;
  importance: HistoryImportance;
  stateDiff?: HistoryStateDiff[];
  summaryGroupId?: string;
  hiddenBySummary?: boolean;
}

export interface GameState {
  version: string;
  turn: number;
  selectedActionId: string;
  selectedStanceId: string;
  pendingTurningPoint: PendingTurningPoint | null;
  player: Player;
  world: WorldState;
  relationships: Relationship[];
  history: HistoryEntry[];
}

export interface SavePayload extends GameState {}

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
  | "player.lifeTags.add"
  | "player.lifeTags.remove"
  | "player.traits.add"
  | "player.traits.remove"
  | "inventory.add";

export interface Effect {
  target: EffectTarget;
  value: number | string;
}

export type LocaleCode = "ja" | "en";

export type LocalisationValue = string | string[];

export type LocalisationPack = Record<string, LocalisationValue>;

export type ConditionOp = "gt" | "gte" | "lt" | "lte" | "eq" | "neq" | "has" | "notHas";

export type ConditionTarget =
  | "ageMonths"
  | "money"
  | "world.pressure"
  | `stats.${AbilityKey}`
  | `relationship.${string}.bond`
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

export interface GameAction {
  id: string;
  label: string;
  description: string;
  effects: Effect[];
}

export interface RawGameAction {
  id: string;
  labelKey: string;
  descriptionKey: string;
  effects: Effect[];
}

export interface Stance {
  id: string;
  label: string;
  description: string;
  effects: Effect[];
}

export interface RawStance {
  id: string;
  labelKey: string;
  descriptionKey: string;
  effects: Effect[];
}

export interface EventDefinition {
  id: string;
  category: "daily" | "relationship" | "turningPoint" | "world" | "career";
  weight: number;
  isMajor?: boolean;
  cooldownTurns?: number;
  conditions: Condition[];
  effects: Effect[];
  templateKey: string;
  template: string;
}

export interface RawEventDefinition {
  id: string;
  category: EventDefinition["category"];
  weight: number;
  isMajor?: boolean;
  cooldownTurns?: number;
  conditions: Condition[];
  effects: Effect[];
  templateKey: string;
}

export interface AgeWindow {
  minMonths: number;
  maxMonths: number;
  guaranteedByMonths: number;
}

export interface ChoiceRequirement {
  condition: Condition;
  reason: string;
}

export interface RawChoiceRequirement {
  condition: Condition;
  reasonKey: string;
}

export interface NpcOutcome {
  role: string;
  educationLevel?: EducationLevel;
  careerCategory?: CareerCategory;
  grantsTags?: string[];
  bond?: number;
  log?: string;
}

export interface RawNpcOutcome {
  role: string;
  educationLevel?: EducationLevel;
  careerCategory?: CareerCategory;
  grantsTags?: string[];
  bond?: number;
  logKey?: string;
}

export interface TurningPointChoice {
  id: string;
  label: string;
  description: string;
  requirements: ChoiceRequirement[];
  outcomeSummary: string;
  effects: Effect[];
  grantsTags: string[];
  educationLevel?: EducationLevel;
  careerCategory?: CareerCategory;
  npcOutcomes?: NpcOutcome[];
}

export interface RawTurningPointChoice {
  id: string;
  labelKey: string;
  descriptionKey: string;
  requirements: RawChoiceRequirement[];
  outcomeSummaryKey: string;
  effects: Effect[];
  grantsTags: string[];
  educationLevel?: EducationLevel;
  careerCategory?: CareerCategory;
  npcOutcomes?: RawNpcOutcome[];
}

export interface TurningPointDefinition {
  id: string;
  label: string;
  description: string;
  category: "education" | "career" | "relationship" | "organization" | "world";
  weight: number;
  ageWindow: AgeWindow;
  conditions: Condition[];
  choices: TurningPointChoice[];
}

export interface RawTurningPointDefinition {
  id: string;
  labelKey: string;
  descriptionKey: string;
  category: TurningPointDefinition["category"];
  weight: number;
  ageWindow: AgeWindow;
  conditions: Condition[];
  choices: RawTurningPointChoice[];
}

export interface PendingTurningPoint {
  id: string;
  turn: number;
  ageMonths: number;
}

export interface ItemDefinition {
  id: string;
  label: string;
  description: string;
  effects: Effect[];
}

export interface RawItemDefinition {
  id: string;
  labelKey: string;
  descriptionKey: string;
  effects: Effect[];
}

export interface TraitDefinition {
  id: string;
  label: string;
  description: string;
  tags: string[];
  effects: Effect[];
}

export interface RawTraitDefinition {
  id: string;
  labelKey: string;
  descriptionKey: string;
  tags: string[];
  effects: Effect[];
}

export interface NameData {
  given: string[];
  family: string[];
  npcRoles: string[];
}

export interface RawNameData {
  npcRoles: string[];
}

export interface GameData {
  actions: GameAction[];
  stances: Stance[];
  events: EventDefinition[];
  items: ItemDefinition[];
  traits: TraitDefinition[];
  turningPoints: TurningPointDefinition[];
  names: NameData;
  localisation: LocalisationPack;
}

export interface ModData {
  actions?: RawGameAction[];
  stances?: RawStance[];
  events?: RawEventDefinition[];
  items?: RawItemDefinition[];
  traits?: RawTraitDefinition[];
  turningPoints?: RawTurningPointDefinition[];
  names?: Partial<RawNameData>;
  localisation?: Partial<Record<LocaleCode, LocalisationPack>>;
}

export interface RawGameData {
  actions: RawGameAction[];
  stances: RawStance[];
  events: RawEventDefinition[];
  items: RawItemDefinition[];
  traits: RawTraitDefinition[];
  turningPoints: RawTurningPointDefinition[];
  names: RawNameData;
  localisation?: Partial<Record<LocaleCode, LocalisationPack>>;
}
