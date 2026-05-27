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

  it("does not trigger a turning point when every choice is unavailable", () => {
    const initial = createInitialState(baseGameData);
    const state = {
      ...initial,
      turn: 64,
      player: {
        ...initial.player,
        ageMonths: 468,
        affiliation: "corporation",
        careerCategory: "clerical" as const,
        stats: {
          ...initial.player.stats,
          social: 10,
          spirit: 10,
        },
      },
    };

    const pending = resolveTurningPoint(state, baseGameData, 0.99);

    expect(pending?.id).not.toBe("public-reputation");
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

  it("applies organization choices to affiliation and career state", () => {
    const initial = createInitialState(baseGameData);
    const state = {
      ...initial,
      turn: 30,
      pendingTurningPoint: {
        id: "patronage-invitation",
        turn: 30,
        ageMonths: 240,
      },
      player: {
        ...initial.player,
        ageMonths: 240,
        educationLevel: "secondary" as const,
        stats: {
          ...initial.player.stats,
          mind: 15,
        },
      },
      relationships: initial.relationships.map((relationship) =>
        relationship.id === "mentor" ? { ...relationship, bond: 14 } : relationship,
      ),
    };

    const turningPoint = baseGameData.turningPoints.find((item) => item.id === "patronage-invitation");
    expect(turningPoint?.category).toBe("organization");

    const choice = turningPoint?.choices.find((item) => item.id === "academy-recommendation");
    const availability = getChoiceAvailability(state, choice!);
    expect(availability.available).toBe(true);

    const next = applyTurningPointChoice(state, baseGameData, "academy-recommendation");

    expect(next.player.affiliation).toBe("academy");
    expect(next.player.careerCategory).toBe("academic");
    expect(next.player.lifeTags).toContain("affiliation.academy-protege");
    expect(next.world.pressure).toBe(state.world.pressure);
  });

  it("applies late M3 reputation choices to affiliation, career, tags, and world pressure", () => {
    const initial = createInitialState(baseGameData);
    const state = {
      ...initial,
      turn: 64,
      pendingTurningPoint: {
        id: "public-reputation",
        turn: 64,
        ageMonths: 468,
      },
      player: {
        ...initial.player,
        ageMonths: 468,
        careerCategory: "underground" as const,
        stats: {
          ...initial.player.stats,
          social: 16,
          spirit: 15,
        },
      },
      world: {
        ...initial.world,
        pressure: 8,
      },
    };

    const turningPoint = baseGameData.turningPoints.find((item) => item.id === "public-reputation");
    const choice = turningPoint?.choices.find((item) => item.id === "underground-contact");
    const availability = getChoiceAvailability(state, choice!);
    expect(availability.available).toBe(true);

    const next = applyTurningPointChoice(state, baseGameData, "underground-contact");

    expect(next.player.affiliation).toBe("underground");
    expect(next.player.careerCategory).toBe("underground");
    expect(next.player.lifeTags).toContain("reputation.underground-contact");
    expect(next.player.lifeTags).toContain("turning.public-reputation.underground-contact");
    expect(next.world.pressure).toBe(12);
  });
});
