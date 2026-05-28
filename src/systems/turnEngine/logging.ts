import { t } from "../../localisation";
import type { AbilityKey, GameData, GameState, HistoryEntry } from "../../types/game";
import { createHistoryEntry, summarizeStateDiff } from "../history";

export function createTemplateParams(state: GameState, data: GameData): Record<string, string> {
  return {
    name: state.player.name,
    nation: state.world.nation,
    region: t(data.localisation, `enum.region.${state.world.region}`),
  };
}

export function renderTemplate(template: string, params: Record<string, string>): string {
  return template
    .replaceAll("{name}", params.name)
    .replaceAll("{nation}", params.nation)
    .replaceAll("{region}", params.region);
}

export function isImportantLog(log: HistoryEntry, data: GameData): boolean {
  if (log.importance === "turningPoint" || log.importance === "major") return true;
  return log.sourceType === "event" && data.events.some((event) => event.id === log.sourceId && event.isMajor);
}

export function createFastForwardSummary(
  start: GameState,
  end: GameState,
  normalLogs: HistoryEntry[],
  data: GameData,
  summaryGroupId: string,
): HistoryEntry {
  const moneyDelta = end.player.money - start.player.money;
  const statChanges = summarizeStatChanges(start, end, data);
  const relationshipDelta = summarizeRelationshipChange(start, end);
  const duration = formatDuration(end.player.ageMonths - start.player.ageMonths, data);
  const fragments = [t(data.localisation, "system.fastForward.elapsed", { duration })];

  if (moneyDelta > 0) fragments.push(t(data.localisation, "system.fastForward.moneyUp"));
  if (moneyDelta < 0) fragments.push(t(data.localisation, "system.fastForward.moneyDown"));
  if (statChanges.length > 0) {
    fragments.push(t(data.localisation, "system.fastForward.statsUp", {
      stats: statChanges.join(t(data.localisation, "system.fastForward.statsSeparator")),
    }));
  }
  if (relationshipDelta > 0) fragments.push(t(data.localisation, "system.fastForward.relationshipUp"));
  if (relationshipDelta < 0) fragments.push(t(data.localisation, "system.fastForward.relationshipDown"));
  fragments.push(t(data.localisation, "system.fastForward.smallEvents", { count: normalLogs.length }));

  return createHistoryEntry({
    id: `summary-${start.turn + 1}-${end.turn}`,
    turn: end.turn,
    ageMonths: end.player.ageMonths,
    text: `${fragments.join("。")}。`,
    locKey: "system.fastForward.summary",
    params: { count: normalLogs.length, duration },
    sourceId: "fast-forward-summary",
    sourceType: "summary",
    importance: "normal",
    stateDiff: summarizeStateDiff(start, end),
    summaryGroupId,
  });
}

export function insertSummaryLog(
  history: HistoryEntry[],
  summary: HistoryEntry,
  firstImportantIndex: number,
): HistoryEntry[] {
  if (firstImportantIndex < 0) return [summary, ...history];

  return [
    ...history.slice(0, firstImportantIndex + 1),
    summary,
    ...history.slice(firstImportantIndex + 1),
  ];
}

function summarizeStatChanges(start: GameState, end: GameState, data: GameData): string[] {
  return (Object.keys(start.player.stats) as AbilityKey[])
    .filter((key) => end.player.stats[key] - start.player.stats[key] >= 1)
    .map((key) => t(data.localisation, `enum.ability.${key}`));
}

function summarizeRelationshipChange(start: GameState, end: GameState): number {
  return end.relationships.reduce((sum, relationship) => {
    const previous = start.relationships.find((item) => item.id === relationship.id);
    return sum + relationship.bond - (previous?.bond ?? relationship.bond);
  }, 0);
}

function formatDuration(months: number, data: GameData): string {
  const years = Math.floor(months / 12);
  const restMonths = months % 12;

  if (years <= 0) return t(data.localisation, "format.duration.months", { months: restMonths });
  if (restMonths === 0) return t(data.localisation, "format.duration.years", { years });
  return t(data.localisation, "format.duration.yearsMonths", { years, months: restMonths });
}
