import { describe, expect, it } from "vitest";
import { createInitialState } from "../core/initialState";
import { baseGameData } from "../data";
import { applyEffects } from "./effects";

describe("effects", () => {
  it("applies player, relationship, world, and inventory effects", () => {
    const state = createInitialState(baseGameData);
    const next = applyEffects(state, [
      { target: "money", value: 5 },
      { target: "stats.mind", value: 3 },
      { target: "relationship.all", value: 2 },
      { target: "world.pressure", value: 4 },
      { target: "inventory.add", value: "worn-tools" },
    ]);

    expect(next.player.money).toBe(state.player.money + 5);
    expect(next.player.stats.mind).toBe(state.player.stats.mind + 3);
    expect(next.relationships[0].bond).toBe(state.relationships[0].bond + 2);
    expect(next.world.pressure).toBe(state.world.pressure + 4);
    expect(next.player.inventory).toContain("worn-tools");
  });

  it("applies causality tag, trait, relationship, and world effects", () => {
    const state = createInitialState(baseGameData);
    const next = applyEffects(state, [
      { target: "player.lifeTags.add", value: "career.print-shop-apprentice" },
      { target: "player.traits.add", value: "observant" },
      { target: "player.lifeTags.remove", value: "unused" },
      { target: "relationship.mentor.lifeTags.add", value: "mentor.school-contact" },
      { target: "relationship.mentor.traits.add", value: "stubborn" },
      { target: "relationship.mentor.affiliation", value: "school" },
      { target: "relationship.mentor.careerCategory", value: "academic" },
      { target: "relationship.mentor.educationLevel", value: "higher" },
      { target: "relationship.all.traits.add", value: "witness" },
      { target: "world.tags.add", value: "strike-rumor" },
      { target: "world.region", value: "capital" },
      { target: "affiliation", value: "academy" },
    ]);
    const mentor = next.relationships.find((relationship) => relationship.id === "mentor");

    expect(next.player.lifeTags).toContain("career.print-shop-apprentice");
    expect(next.player.traits).toContain("observant");
    expect(mentor?.lifeTags).toContain("mentor.school-contact");
    expect(mentor?.traits).toContain("stubborn");
    expect(mentor?.traits).toContain("witness");
    expect(mentor?.affiliation).toBe("school");
    expect(mentor?.careerCategory).toBe("academic");
    expect(mentor?.educationLevel).toBe("higher");
    expect(next.relationships.every((relationship) => relationship.traits.includes("witness"))).toBe(true);
    expect(next.world.tags).toContain("strike-rumor");
    expect(next.world.region).toBe("capital");
    expect(next.player.affiliation).toBe("academy");

    const removed = applyEffects(next, [
      { target: "player.traits.remove", value: "observant" },
      { target: "relationship.all.traits.remove", value: "witness" },
      { target: "world.tags.remove", value: "strike-rumor" },
    ]);

    expect(removed.player.traits).not.toContain("observant");
    expect(removed.relationships.every((relationship) => !relationship.traits.includes("witness"))).toBe(true);
    expect(removed.world.tags).not.toContain("strike-rumor");
  });
});
