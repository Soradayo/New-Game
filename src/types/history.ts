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
