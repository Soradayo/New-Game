import { getTurnMonths } from "../../core/lifePhase";
import { isLifeComplete, STANDARD_TIME_SCALE } from "../../core/timeScale";
import { t } from "../../localisation";
import type { GameData, GameState, HistoryEntry } from "../../types/game";
import { makeSeed } from "../../utils/rng";
import { applyEffects } from "../effects";
import { resolveEvent } from "../events";
import { createHistoryEntry, summarizeStateDiff } from "../history";
import { createTurningPointLog } from "../turningPoints/logs";
import { resolveTurningPoint } from "../turningPoints/resolver";
import { createTemplateParams, renderTemplate } from "./logging";
import {
  applyGrowth,
  applyNpcBehavior,
  applyPassiveUpdates,
  applyRelationshipDrift,
} from "./progression";

export interface TurnResult {
  state: GameState;
  addedLogs: HistoryEntry[];
  stoppedByImportantEvent: boolean;
}

export function advanceTurn(state: GameState, data: GameData): GameState {
  return advanceTurnDetailed(state, data).state;
}

export function advanceTurnDetailed(state: GameState, data: GameData): TurnResult {
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
