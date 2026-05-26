import { describe, expect, it } from "vitest";
import { createInitialState } from "../core/initialState";
import { STANDARD_TIME_SCALE } from "../core/timeScale";
import { baseGameData } from "../data";
import type { GameData } from "../types/game";
import { advanceTurn, advanceUntilImportantEvent } from "./turnEngine";

describe("fast-forward turn engine", () => {
  it("creates structured no-event logs", () => {
    const state = createInitialState(baseGameData);
    const next = advanceTurn(state, { ...baseGameData, events: [], turningPoints: [] });

    expect(next.history[0].sourceType).toBe("system");
    expect(next.history[0].sourceId).toBe("no-event");
    expect(next.history[0].locKey).toBe("system.log.noEvent");
    expect(next.history[0].importance).toBe("normal");
  });

  it("stops when a major event occurs", () => {
    const state = createInitialState(baseGameData);
    const data: GameData = {
      ...baseGameData,
      turningPoints: [],
      events: [
        {
          id: "major-test",
          category: "world",
          weight: 1,
          isMajor: true,
          conditions: [],
          effects: [],
          templateKey: "test.major",
          template: "重大な出来事が起きた。",
        },
      ],
    };

    const next = advanceUntilImportantEvent(state, data);

    expect(next.turn).toBe(1);
    expect(next.history[0].sourceType).toBe("event");
    expect(next.history[0].sourceId).toBe("major-test");
    expect(next.history[0].locKey).toBe("test.major");
    expect(next.history[0].importance).toBe("major");
  });

  it("adds a summary while keeping non-major logs when the max turn limit is reached", () => {
    const state = createInitialState(baseGameData);
    const data: GameData = {
      ...baseGameData,
      turningPoints: [],
      events: [
        {
          id: "small-test",
          category: "daily",
          weight: 1,
          conditions: [],
          effects: [],
          templateKey: "test.small",
          template: "小さな出来事。",
        },
      ],
    };

    const next = advanceUntilImportantEvent(state, data, 3);

    expect(next.turn).toBe(3);
    expect(next.history[0].sourceType).toBe("summary");
    expect(next.history[0].sourceId).toBe("fast-forward-summary");
    expect(next.history[0].text).toContain("3件の小さな出来事");
    const smallLogs = next.history.filter((entry) => entry.sourceType === "event" && entry.sourceId === "small-test");
    expect(smallLogs).toHaveLength(3);
    expect(smallLogs.every((entry) => entry.summaryGroupId === next.history[0].summaryGroupId)).toBe(true);
    expect(smallLogs.every((entry) => entry.hiddenBySummary)).toBe(true);
  });

  it("stops when a turning point appears and places the summary after the turning point log", () => {
    const initial = createInitialState(baseGameData);
    const state = {
      ...initial,
      player: {
        ...initial.player,
        ageMonths: 144,
      },
    };
    const data: GameData = {
      ...baseGameData,
      events: [],
    };

    const next = advanceUntilImportantEvent(state, data);

    expect(next.pendingTurningPoint?.id).toBe("first-school-crossroad");
    expect(next.history[0].sourceType).toBe("turningPoint");
    expect(next.history[0].sourceId).toBe("first-school-crossroad");
    expect(next.history[1].sourceType).toBe("summary");
    expect(next.history[1].sourceId).toBe("fast-forward-summary");
  });

  it("stops at the life end age", () => {
    const initial = createInitialState(baseGameData);
    const state = {
      ...initial,
      player: {
        ...initial.player,
        ageMonths: STANDARD_TIME_SCALE.endAgeMonths - 12,
      },
    };

    const next = advanceUntilImportantEvent(state, { ...baseGameData, events: [], turningPoints: [] });

    expect(next.player.ageMonths).toBe(STANDARD_TIME_SCALE.endAgeMonths);
  });
});
