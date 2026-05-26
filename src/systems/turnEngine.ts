import { getTurnMonths } from "../core/lifePhase";
import { isLifeComplete, STANDARD_TIME_SCALE } from "../core/timeScale";
import type { AbilityKey, GameData, GameState, HistoryEntry } from "../types/game";
import { makeSeed } from "../utils/rng";
import { applyEffects } from "./effects";
import { resolveEvent } from "./events";
import { createTurningPointLog, resolveTurningPoint } from "./turningPoints";

const regionLabels = {
  capital: "首都",
  industrial: "工業地区",
  academic: "学術地区",
  religious: "宗教都市",
  frontier: "辺境",
};

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

  const importantIds = new Set(importantLogs.map((log) => log.id));
  const firstImportantIndex = current.history.findIndex((log) => importantIds.has(log.id));
  const summary = createFastForwardSummary(startState, current, normalLogs);

  return {
    ...current,
    history: insertSummaryLog(current.history, summary, firstImportantIndex).slice(0, 200),
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

  const text = event
    ? renderTemplate(event.template, nextState)
    : "誰かが名付けるほどの出来事はなく、その期間は過ぎていく。";

  const log: HistoryEntry = {
    id: `turn-${turn}`,
    eventId: event?.id,
    turn,
    ageMonths: nextState.player.ageMonths,
    text,
    category: event?.category ?? "daily",
  };

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

function renderTemplate(template: string, state: GameState): string {
  return template
    .replaceAll("{name}", state.player.name)
    .replaceAll("{nation}", state.world.nation)
    .replaceAll("{region}", regionLabels[state.world.region]);
}

function isImportantLog(log: HistoryEntry, data: GameData): boolean {
  if (log.eventId?.startsWith("turning:")) return true;
  return data.events.some((event) => event.id === log.eventId && event.isMajor);
}

function createFastForwardSummary(
  start: GameState,
  end: GameState,
  normalLogs: HistoryEntry[],
): HistoryEntry {
  const moneyDelta = end.player.money - start.player.money;
  const statChanges = summarizeStatChanges(start, end);
  const relationshipDelta = summarizeRelationshipChange(start, end);
  const duration = formatDuration(end.player.ageMonths - start.player.ageMonths);
  const fragments = [`${duration}が過ぎた`];

  if (moneyDelta > 0) fragments.push("所持金は少し増えた");
  if (moneyDelta < 0) fragments.push("所持金は少し減った");
  if (statChanges.length > 0) fragments.push(`${statChanges.join("と")}が伸びた`);
  if (relationshipDelta > 0) fragments.push("人との距離は近づいた");
  if (relationshipDelta < 0) fragments.push("人との距離は少し離れた");
  fragments.push(`${normalLogs.length}件の小さな出来事が起きた`);

  return {
    id: `summary-${start.turn + 1}-${end.turn}`,
    eventId: "fast-forward-summary",
    turn: end.turn,
    ageMonths: end.player.ageMonths,
    text: `${fragments.join("。")}。`,
    category: "daily",
  };
}

function summarizeStatChanges(start: GameState, end: GameState): string[] {
  const labels: Record<AbilityKey, string> = {
    body: "身体",
    mind: "知性",
    craft: "技能",
    social: "社交",
    spirit: "精神",
  };

  return (Object.keys(start.player.stats) as AbilityKey[])
    .filter((key) => end.player.stats[key] - start.player.stats[key] >= 1)
    .map((key) => labels[key]);
}

function summarizeRelationshipChange(start: GameState, end: GameState): number {
  return end.relationships.reduce((sum, relationship) => {
    const previous = start.relationships.find((item) => item.id === relationship.id);
    return sum + relationship.bond - (previous?.bond ?? relationship.bond);
  }, 0);
}

function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const restMonths = months % 12;

  if (years <= 0) return `${restMonths}か月`;
  if (restMonths === 0) return `${years}年`;
  return `${years}年${restMonths}か月`;
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
