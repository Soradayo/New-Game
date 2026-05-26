import type {
  AbilityKey,
  GameState,
  HistoryEntry,
  HistoryImportance,
  HistoryParamValue,
  HistorySourceType,
  HistoryStateDiff,
} from "../types/game";

export function createHistoryEntry({
  id,
  turn,
  ageMonths,
  text,
  locKey,
  params,
  sourceId,
  sourceType,
  importance = "normal",
  stateDiff,
  summaryGroupId,
  hiddenBySummary,
}: {
  id: string;
  turn: number;
  ageMonths: number;
  text: string;
  locKey?: string;
  params?: Record<string, HistoryParamValue>;
  sourceId: string;
  sourceType: HistorySourceType;
  importance?: HistoryImportance;
  stateDiff?: HistoryStateDiff[];
  summaryGroupId?: string;
  hiddenBySummary?: boolean;
}): HistoryEntry {
  return {
    id,
    turn,
    ageMonths,
    text,
    ...(locKey ? { locKey } : {}),
    ...(params ? { params } : {}),
    sourceId,
    sourceType,
    importance,
    ...(stateDiff && stateDiff.length > 0 ? { stateDiff } : {}),
    ...(summaryGroupId ? { summaryGroupId } : {}),
    ...(hiddenBySummary ? { hiddenBySummary } : {}),
  };
}

export function summarizeStateDiff(before: GameState, after: GameState): HistoryStateDiff[] {
  const diffs: HistoryStateDiff[] = [];
  const moneyDelta = after.player.money - before.player.money;
  const pressureDelta = after.world.pressure - before.world.pressure;
  const relationshipDelta = summarizeRelationshipDelta(before, after);
  const tagDelta = after.player.lifeTags.length - before.player.lifeTags.length;
  const inventoryDelta = after.player.inventory.length - before.player.inventory.length;

  if (moneyDelta !== 0) {
    diffs.push({
      target: "money",
      before: before.player.money,
      after: after.player.money,
      delta: moneyDelta,
    });
  }

  for (const key of Object.keys(before.player.stats) as AbilityKey[]) {
    const delta = after.player.stats[key] - before.player.stats[key];
    if (delta === 0) continue;

    diffs.push({
      target: "stats",
      label: key,
      before: before.player.stats[key],
      after: after.player.stats[key],
      delta,
    });
  }

  if (relationshipDelta !== 0) {
    diffs.push({
      target: "relationships",
      label: "all",
      delta: relationshipDelta,
    });
  }

  if (pressureDelta !== 0) {
    diffs.push({
      target: "world",
      label: "pressure",
      before: before.world.pressure,
      after: after.world.pressure,
      delta: pressureDelta,
    });
  }

  if (tagDelta !== 0) {
    diffs.push({
      target: "tags",
      label: "player.lifeTags",
      before: before.player.lifeTags.length,
      after: after.player.lifeTags.length,
      delta: tagDelta,
    });
  }

  if (inventoryDelta !== 0) {
    diffs.push({
      target: "inventory",
      before: before.player.inventory.length,
      after: after.player.inventory.length,
      delta: inventoryDelta,
    });
  }

  return diffs;
}

function summarizeRelationshipDelta(before: GameState, after: GameState): number {
  return after.relationships.reduce((sum, relationship) => {
    const previous = before.relationships.find((item) => item.id === relationship.id);
    return sum + relationship.bond - (previous?.bond ?? relationship.bond);
  }, 0);
}
