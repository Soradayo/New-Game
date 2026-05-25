import { getTurnMonths } from "../core/lifePhase";
import type { GameData, GameState, HistoryEntry } from "../types/game";
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

export function advanceTurn(state: GameState, data: GameData): GameState {
  if (state.pendingTurningPoint) return state;

  const action = data.actions.find((item) => item.id === state.selectedActionId);
  const stance = data.stances.find((item) => item.id === state.selectedStanceId);
  const turn = state.turn + 1;
  const ageMonths = state.player.ageMonths + getTurnMonths(state.player.ageMonths);

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

  return {
    ...stateWithLog,
    pendingTurningPoint,
    history: [
      ...(turningPointLog ? [turningPointLog] : []),
      ...stateWithLog.history,
    ].slice(0, 200),
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
