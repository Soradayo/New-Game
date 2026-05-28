import type { Condition } from "./conditions";
import type { Effect } from "./effects";
import type { LocalisationPack } from "./localisation";
import type { AbilityKey, CareerCategory, EducationLevel } from "./primitives";

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

export type NpcInteractionEffectTarget =
  | "bond"
  | "trust"
  | "dependency"
  | "conflict"
  | "money"
  | "world.pressure"
  | `stats.${AbilityKey}`
  | "target.lifeTags.add"
  | "target.lifeTags.remove"
  | "target.traits.add"
  | "target.traits.remove"
  | "player.lifeTags.add"
  | "player.lifeTags.remove"
  | "player.traits.add"
  | "player.traits.remove";

export interface NpcInteractionEffect {
  target: NpcInteractionEffectTarget;
  value: number | string;
}

export interface NpcInteractionDefinition {
  id: string;
  label: string;
  description: string;
  conditions: Condition[];
  effects: NpcInteractionEffect[];
  logKey: string;
  log: string;
}

export interface RawNpcInteractionDefinition {
  id: string;
  labelKey: string;
  descriptionKey: string;
  conditions: Condition[];
  effects: NpcInteractionEffect[];
  logKey: string;
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
  npcInteractions: NpcInteractionDefinition[];
  turningPoints: TurningPointDefinition[];
  names: NameData;
  localisation: LocalisationPack;
}
