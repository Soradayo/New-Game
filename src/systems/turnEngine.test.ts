import { describe, expect, it } from "vitest";
import { createInitialState } from "../core/initialState";
import { STANDARD_TIME_SCALE } from "../core/timeScale";
import { baseGameData } from "../data";
import type { GameData } from "../types/game";
import { advanceUntilImportantEvent } from "./turnEngine";

describe("fast-forward turn engine", () => {
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
          template: "重大な出来事が起きた。",
        },
      ],
    };

    const next = advanceUntilImportantEvent(state, data);

    expect(next.turn).toBe(1);
    expect(next.history[0].eventId).toBe("major-test");
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
          template: "小さな出来事。",
        },
      ],
    };

    const next = advanceUntilImportantEvent(state, data, 3);

    expect(next.turn).toBe(3);
    expect(next.history[0].eventId).toBe("fast-forward-summary");
    expect(next.history[0].text).toContain("3件の小さな出来事");
    expect(next.history.filter((entry) => entry.eventId === "small-test")).toHaveLength(3);
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
    expect(next.history[0].eventId).toBe("turning:first-school-crossroad");
    expect(next.history[1].eventId).toBe("fast-forward-summary");
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
