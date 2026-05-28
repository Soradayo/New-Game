import { isLifeComplete, STANDARD_TIME_SCALE } from "../../core/timeScale";
import type { GameData, GameState, HistoryEntry } from "../../types/game";
import { advanceTurnDetailed } from "./advance";
import {
  createFastForwardSummary,
  insertSummaryLog,
  isImportantLog,
} from "./logging";

export function advanceUntilImportantEvent(
  state: GameState,
  data: GameData,
  maxTurns = STANDARD_TIME_SCALE.maxFastForwardTurns,
): GameState {
  if (state.pendingTurningPoint || isLifeComplete(state.player.ageMonths)) return state;

  const startState = state;
  let current = state;
  const normalLogs: HistoryEntry[] = [];
  const importantLogs: HistoryEntry[] = [];

  for (let index = 0; index < maxTurns; index += 1) {
    const result = advanceTurnDetailed(current, data);
    if (result.state === current) break;

    current = result.state;

    for (const log of result.addedLogs) {
      if (isImportantLog(log, data)) {
        importantLogs.push(log);
      } else {
        normalLogs.push(log);
      }
    }

    if (result.stoppedByImportantEvent || isLifeComplete(current.player.ageMonths)) break;
  }

  if (current === startState || normalLogs.length === 0) return current;

  const summaryGroupId = `summary-${startState.turn + 1}-${current.turn}`;
  const normalIds = new Set(normalLogs.map((log) => log.id));
  const importantIds = new Set(importantLogs.map((log) => log.id));
  const historyWithHiddenLogs = current.history.map((log) =>
    normalIds.has(log.id)
      ? { ...log, summaryGroupId, hiddenBySummary: true }
      : log,
  );
  const firstImportantIndex = historyWithHiddenLogs.findIndex((log) => importantIds.has(log.id));
  const summary = createFastForwardSummary(startState, current, normalLogs, data, summaryGroupId);

  return {
    ...current,
    history: insertSummaryLog(historyWithHiddenLogs, summary, firstImportantIndex).slice(0, 200),
  };
}
