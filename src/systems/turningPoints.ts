import type {
  GameData,
  GameState,
  HistoryEntry,
  PendingTurningPoint,
  TurningPointChoice,
  TurningPointDefinition,
} from "../types/game";
import { t } from "../localisation";
import { applyEffects } from "./effects";
import { matchesCondition } from "./conditions";
import { createHistoryEntry, summarizeStateDiff } from "./history";

const TURNING_POINT_TRIGGER_CHANCE = 0.35;

export interface ChoiceAvailability {
  choice: TurningPointChoice;
  available: boolean;
  reasons: string[];
}

export function resolveTurningPoint(
  state: GameState,
  data: GameData,
  randomValue: number,
): PendingTurningPoint | null {
  if (state.pendingTurningPoint) return null;

  const candidates = data.turningPoints.filter((turningPoint) =>
    isTurningPointEligible(state, turningPoint),
  );
  if (candidates.length === 0) return null;

  const guaranteed = candidates.filter((turningPoint) =>
    state.player.ageMonths >= turningPoint.ageWindow.guaranteedByMonths,
  );
  if (guaranteed.length > 0) {
    const selected = chooseWeighted(guaranteed, randomValue);
    return createPendingTurningPoint(selected, state);
  }

  if (randomValue > TURNING_POINT_TRIGGER_CHANCE) return null;

  const selected = chooseWeighted(candidates, randomValue / TURNING_POINT_TRIGGER_CHANCE);
  return createPendingTurningPoint(selected, state);
}

export function getPendingTurningPoint(
  state: GameState,
  data: GameData,
): TurningPointDefinition | null {
  if (!state.pendingTurningPoint) return null;
  return data.turningPoints.find((turningPoint) => turningPoint.id === state.pendingTurningPoint?.id) ?? null;
}

export function getChoiceAvailability(
  state: GameState,
  choice: TurningPointChoice,
): ChoiceAvailability {
  const reasons = choice.requirements
    .filter((requirement) => !matchesCondition(state, requirement.condition))
    .map((requirement) => requirement.reason);

  return {
    choice,
    available: reasons.length === 0,
    reasons,
  };
}

export function applyTurningPointChoice(
  state: GameState,
  data: GameData,
  choiceId: string,
): GameState {
  const turningPoint = getPendingTurningPoint(state, data);
  if (!turningPoint) return state;

  const choice = turningPoint.choices.find((item) => item.id === choiceId);
  if (!choice) {
    throw new Error(t(data.localisation, "system.error.turningChoiceFailed"));
  }

  const availability = getChoiceAvailability(state, choice);
  if (!availability.available) {
    throw new Error(availability.reasons[0] ?? t(data.localisation, "system.error.turningChoiceFailed"));
  }

  let nextState = applyEffects(state, choice.effects);
  nextState = applyChoiceState(nextState, turningPoint, choice);
  nextState = applyNpcOutcomes(nextState, choice);

  const logs = createChoiceLogs(state, nextState, turningPoint, choice, data);

  return {
    ...nextState,
    pendingTurningPoint: null,
    history: [...logs, ...nextState.history].slice(0, 200),
  };
}

export function createTurningPointLog(
  pending: PendingTurningPoint,
  data: GameData,
): HistoryEntry | null {
  const turningPoint = data.turningPoints.find((item) => item.id === pending.id);
  if (!turningPoint) return null;

  return createHistoryEntry({
    id: `turning-${pending.turn}-${pending.id}`,
    turn: pending.turn,
    ageMonths: pending.ageMonths,
    text: t(data.localisation, "system.log.turningAppeared", {
      label: turningPoint.label,
      description: turningPoint.description,
    }),
    locKey: "system.log.turningAppeared",
    params: {
      label: turningPoint.label,
      description: turningPoint.description,
    },
    sourceId: pending.id,
    sourceType: "turningPoint",
    importance: "turningPoint",
  });
}

function isTurningPointEligible(state: GameState, turningPoint: TurningPointDefinition): boolean {
  const ageMonths = state.player.ageMonths;
  const alreadyResolved = state.player.lifeTags.some((tag) =>
    tag === `turning.${turningPoint.id}` || tag.startsWith(`turning.${turningPoint.id}.`),
  );

  return !alreadyResolved &&
    ageMonths >= turningPoint.ageWindow.minMonths &&
    ageMonths <= turningPoint.ageWindow.maxMonths &&
    turningPoint.conditions.every((condition) => matchesCondition(state, condition));
}

function chooseWeighted(
  candidates: TurningPointDefinition[],
  randomValue: number,
): TurningPointDefinition {
  const totalWeight = candidates.reduce((sum, turningPoint) => sum + turningPoint.weight, 0);
  let cursor = randomValue * totalWeight;

  for (const turningPoint of candidates) {
    cursor -= turningPoint.weight;
    if (cursor <= 0) return turningPoint;
  }

  return candidates.at(-1) ?? candidates[0];
}

function createPendingTurningPoint(
  turningPoint: TurningPointDefinition,
  state: GameState,
): PendingTurningPoint {
  return {
    id: turningPoint.id,
    turn: state.turn,
    ageMonths: state.player.ageMonths,
  };
}

function applyChoiceState(
  state: GameState,
  turningPoint: TurningPointDefinition,
  choice: TurningPointChoice,
): GameState {
  const lifeTags = unique([
    ...state.player.lifeTags,
    `turning.${turningPoint.id}.${choice.id}`,
    ...choice.grantsTags,
  ]);

  return {
    ...state,
    player: {
      ...state.player,
      educationLevel: choice.educationLevel ?? state.player.educationLevel,
      careerCategory: choice.careerCategory ?? state.player.careerCategory,
      lifeTags,
    },
  };
}

function applyNpcOutcomes(state: GameState, choice: TurningPointChoice): GameState {
  const outcomes = choice.npcOutcomes ?? [];
  if (outcomes.length === 0) return state;

  return {
    ...state,
    relationships: state.relationships.map((relationship) => {
      const outcome = outcomes.find((item) => item.role === relationship.role || item.role === relationship.id);
      if (!outcome) return relationship;

      return {
        ...relationship,
        educationLevel: outcome.educationLevel ?? relationship.educationLevel,
        careerCategory: outcome.careerCategory ?? relationship.careerCategory,
        bond: clamp(relationship.bond + (outcome.bond ?? 0), -100, 100),
        lifeTags: unique([...relationship.lifeTags, ...(outcome.grantsTags ?? [])]),
      };
    }),
  };
}

function createChoiceLogs(
  beforeState: GameState,
  state: GameState,
  turningPoint: TurningPointDefinition,
  choice: TurningPointChoice,
  data: GameData,
): HistoryEntry[] {
  const mainLog = createHistoryEntry({
    id: `turning-choice-${state.turn}-${turningPoint.id}-${choice.id}`,
    turn: state.turn,
    ageMonths: state.player.ageMonths,
    text: t(data.localisation, "system.log.turningChoice", {
      label: choice.label,
      summary: choice.outcomeSummary,
    }),
    locKey: "system.log.turningChoice",
    params: {
      label: choice.label,
      summary: choice.outcomeSummary,
    },
    sourceId: `${turningPoint.id}:${choice.id}`,
    sourceType: "turningPoint",
    importance: "turningPoint",
    stateDiff: summarizeStateDiff(beforeState, state),
  });

  const npcLogs = (choice.npcOutcomes ?? [])
    .filter((outcome) => outcome.log)
    .map<HistoryEntry>((outcome, index) => createHistoryEntry({
      id: `turning-npc-${state.turn}-${turningPoint.id}-${choice.id}-${index}`,
      turn: state.turn,
      ageMonths: state.player.ageMonths,
      text: outcome.log ?? "",
      sourceId: `${turningPoint.id}:${choice.id}:npc:${outcome.role}`,
      sourceType: "turningPoint",
      importance: "turningPoint",
    }));

  return [mainLog, ...npcLogs];
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
