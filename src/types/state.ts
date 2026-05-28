import type {
  CareerCategory,
  EducationLevel,
  OrganizationKind,
  Region,
  SocialClass,
  Stats,
} from "./primitives";
import type { HistoryEntry } from "./history";

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
  trust: number;
  dependency: number;
  conflict: number;
  lastInteractionTurn: number | null;
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

export interface PendingTurningPoint {
  id: string;
  turn: number;
  ageMonths: number;
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
