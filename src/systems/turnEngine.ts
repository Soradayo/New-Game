import { getTurnMonths } from "../core/lifePhase";
import { isLifeComplete, STANDARD_TIME_SCALE } from "../core/timeScale";
import { t } from "../localisation";
import type { AbilityKey, GameData, GameState, HistoryEntry } from "../types/game";
import { makeSeed } from "../utils/rng";
import { applyEffects } from "./effects";
import { resolveEvent } from "./events";
import { createHistoryEntry, summarizeStateDiff } from "./history";
import { createTurningPointLog, resolveTurningPoint } from "./turningPoints";

interface TurnResult {
  state: GameState;
  addedLogs: HistoryEntry[];
  stoppedByImportantEvent: boolean;
}

export function advanceTurn(state: GameState, data: GameData): GameState {
  return advanceTurnDetailed(state, data).state;
}

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

function advanceTurnDetailed(state: GameState, data: GameData): TurnResult {
  if (state.pendingTurningPoint || isLifeComplete(state.player.ageMonths)) {
    return {
      state,
      addedLogs: [],
      stoppedByImportantEvent: Boolean(state.pendingTurningPoint) || isLifeComplete(state.player.ageMonths),
    };
  }

  const previousHistoryIds = new Set(state.history.map((entry) => entry.id));
  const action = data.actions.find((item) => item.id === state.selectedActionId);
  const stance = data.stances.find((item) => item.id === state.selectedStanceId);
  const turn = state.turn + 1;
  const ageMonths = Math.min(
    state.player.ageMonths + getTurnMonths(state.player.ageMonths),
    STANDARD_TIME_SCALE.endAgeMonths,
  );

  let nextState: GameState = {
    ...state,
    turn,
    player: {
      ...state.player,
      ageMonths,
    },
  };

  nextState = applyPassiveUpdates(nextState);
  if (action) nextState = applyEffects(nextState, action.effects);
  nextState = applyGrowth(nextState);
  if (stance) nextState = applyEffects(nextState, stance.effects);
  nextState = applyRelationshipDrift(nextState);

  const event = resolveEvent(nextState, data.events, makeSeed(turn, "event"));
  if (event) nextState = applyEffects(nextState, event.effects);

  nextState = applyNpcBehavior(nextState);

  const params = createTemplateParams(nextState, data);
  const text = event
    ? renderTemplate(event.template, params)
    : t(data.localisation, "system.log.noEvent");

  const log = createHistoryEntry({
    id: `turn-${turn}`,
    turn,
    ageMonths: nextState.player.ageMonths,
    text,
    locKey: event?.templateKey ?? "system.log.noEvent",
    params: event ? params : undefined,
    sourceId: event?.id ?? "no-event",
    sourceType: event ? "event" : "system",
    importance: event?.isMajor ? "major" : "normal",
    stateDiff: summarizeStateDiff(state, nextState),
  });

  const stateWithLog = {
    ...nextState,
    history: [log, ...nextState.history].slice(0, 200),
  };
  const pendingTurningPoint = resolveTurningPoint(
    stateWithLog,
    data,
    makeSeed(turn, "turning-point"),
  );
  const turningPointLog = pendingTurningPoint ? createTurningPointLog(pendingTurningPoint, data) : null;
  const finalState = {
    ...stateWithLog,
    pendingTurningPoint,
    history: [
      ...(turningPointLog ? [turningPointLog] : []),
      ...stateWithLog.history,
    ].slice(0, 200),
  };
  const addedLogs = finalState.history.filter((entry) => !previousHistoryIds.has(entry.id));

  return {
    state: finalState,
    addedLogs,
    stoppedByImportantEvent: Boolean(pendingTurningPoint) ||
      isLifeComplete(finalState.player.ageMonths) ||
      Boolean(event?.isMajor),
  };
}

function applyPassiveUpdates(state: GameState): GameState {
  return {
    ...state,
    world: {
      ...state.world,
      pressure: Math.min(100, state.world.pressure + 0.2),
    },
  };
}

function applyGrowth(state: GameState): GameState {
  return {
    ...state,
    player: {
      ...state.player,
      stats: {
        ...state.player.stats,
        mind: Math.min(100, state.player.stats.mind + 0.1),
      },
    },
  };
}

function applyRelationshipDrift(state: GameState): GameState {
  if (state.turn % 3 !== 0) return state;

  return {
    ...state,
    relationships: state.relationships.map((relationship, index) => ({
      ...relationship,
      bond: Math.max(-100, Math.min(100, relationship.bond + (index % 2 === 0 ? 1 : -1))),
    })),
  };
}

function applyNpcBehavior(state: GameState): GameState {
  return {
    ...state,
    relationships: state.relationships.map((relationship) => {
      if (relationship.role !== "mentor") return relationship;
      return {
        ...relationship,
        bond: Math.min(100, relationship.bond + 0.5),
      };
    }),
  };
}

function createTemplateParams(state: GameState, data: GameData): Record<string, string> {
  return {
    name: state.player.name,
    nation: state.world.nation,
    region: t(data.localisation, `enum.region.${state.world.region}`),
  };
}

function renderTemplate(template: string, params: Record<string, string>): string {
  return template
    .replaceAll("{name}", params.name)
    .replaceAll("{nation}", params.nation)
    .replaceAll("{region}", params.region);
}

function isImportantLog(log: HistoryEntry, data: GameData): boolean {
  if (log.importance === "turningPoint" || log.importance === "major") return true;
  return log.sourceType === "event" && data.events.some((event) => event.id === log.sourceId && event.isMajor);
}

function createFastForwardSummary(
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

function insertSummaryLog(
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
