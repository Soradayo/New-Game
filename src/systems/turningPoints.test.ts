import { describe, expect, it } from "vitest";
import { createInitialState } from "../core/initialState";
import { baseGameData } from "../data";
import {
  applyTurningPointChoice,
  getChoiceAvailability,
  resolveTurningPoint,
} from "./turningPoints";

describe("turning point system", () => {
  it("guarantees an eligible turning point after its guarantee age", () => {
    const state = {
      ...createInitialState(baseGameData),
      turn: 13,
      player: {
        ...createInitialState(baseGameData).player,
        ageMonths: 150,
      },
    };

    const pending = resolveTurningPoint(state, baseGameData, 0.99);

    expect(pending?.id).toBe("first-school-crossroad");
  });

  it("explains unavailable choices", () => {
    const state = createInitialState(baseGameData);
    const turningPoint = baseGameData.turningPoints.find((item) => item.id === "first-school-crossroad");
    const choice = turningPoint?.choices.find((item) => item.id === "enter-secondary-school");

    expect(choice).toBeDefined();
    const availability = getChoiceAvailability(state, choice!);

    expect(availability.available).toBe(false);
    expect(availability.reasons.length).toBeGreaterThan(0);
  });

  it("applies choice outcomes to player tags, career, effects, and NPC state", () => {
    const initial = createInitialState(baseGameData);
    const state = {
      ...initial,
      turn: 13,
      pendingTurningPoint: {
        id: "first-school-crossroad",
        turn: 13,
        ageMonths: 150,
      },
      player: {
        ...initial.player,
        ageMonths: 150,
      },
    };

    const next = applyTurningPointChoice(state, baseGameData, "support-household");
    const sibling = next.relationships.find((relationship) => relationship.role === "sibling");

    expect(next.pendingTurningPoint).toBeNull();
    expect(next.player.careerCategory).toBe("labor");
    expect(next.player.lifeTags).toContain("education.left-for-work");
    expect(next.player.lifeTags).toContain("turning.first-school-crossroad.support-household");
    expect(next.player.money).toBe(state.player.money + 6);
    expect(sibling?.careerCategory).toBe("labor");
    expect(sibling?.lifeTags).toContain("household-supported");
    expect(next.history[0].sourceType).toBe("turningPoint");
    expect(next.history[0].importance).toBe("turningPoint");
  });
});
