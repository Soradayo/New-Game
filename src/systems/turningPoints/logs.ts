import type {
  GameData,
  HistoryEntry,
  PendingTurningPoint,
  TurningPointChoice,
  TurningPointDefinition,
} from "../../types/game";
import { t } from "../../localisation";
import { createHistoryEntry, summarizeStateDiff } from "../history";
import type { GameState } from "../../types/game";

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

export function createChoiceLogs(
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
