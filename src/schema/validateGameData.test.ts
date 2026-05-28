import { describe, expect, it } from "vitest";
import { baseRawGameData } from "../data";
import { parseMod } from "../mods/mergeMods";
import { validateGameData } from "./validateGameData";

describe("game data schema validation", () => {
  it("accepts the base game data", () => {
    expect(() => validateGameData(baseRawGameData, "base")).not.toThrow();
  });

  it("accepts organization turning points in base data", () => {
    expect(baseRawGameData.turningPoints.some((turningPoint) =>
      turningPoint.category === "organization",
    )).toBe(true);
    expect(() => validateGameData(baseRawGameData, "base")).not.toThrow();
  });

  it("includes the M3 content volume in base data", () => {
    expect(baseRawGameData.turningPoints.length).toBeGreaterThanOrEqual(10);
    expect(baseRawGameData.events.length).toBeGreaterThanOrEqual(40);
    expect(baseRawGameData.turningPoints.some((turningPoint) =>
      turningPoint.id === "public-reputation",
    )).toBe(true);
    expect(baseRawGameData.events.some((event) => event.id === "underground-package")).toBe(true);
  });

  it("includes and validates M4 NPC interactions", () => {
    expect(baseRawGameData.npcInteractions.map((interaction) => interaction.id)).toEqual([
      "support",
      "consult",
      "keep-distance",
      "invite",
      "cover",
      "betray",
      "introduce",
    ]);
    expect(() => parseMod(JSON.stringify({
      npcInteractions: [
        {
          id: "test-share-secret",
          labelKey: "test.npc.shareSecret.label",
          descriptionKey: "test.npc.shareSecret.description",
          conditions: [
            { target: "relationship.$target.trust", op: "gte", value: 1 },
          ],
          effects: [
            { target: "trust", value: 1 },
            { target: "target.lifeTags.add", value: "test.shared-secret" },
          ],
          logKey: "test.npc.shareSecret.log",
        },
      ],
    }))).not.toThrow();
  });

  it("rejects a mod with an invalid event category", () => {
    expect(() => parseMod(JSON.stringify({
      events: [
        {
          id: "bad-category",
          category: "strange",
          weight: 1,
          conditions: [],
          effects: [],
          templateKey: "test.bad.template",
        },
      ],
    }))).toThrow("/events/0/category");
  });

  it("rejects a mod with an invalid effect target", () => {
    expect(() => parseMod(JSON.stringify({
      actions: [
        {
          id: "bad-action",
          labelKey: "test.bad.label",
          descriptionKey: "test.bad.description",
          effects: [
            { target: "stats.luck", value: 1 },
          ],
        },
      ],
    }))).toThrow("/actions/0/effects/0/target");
  });

  it("rejects a mod with an invalid condition target", () => {
    expect(() => parseMod(JSON.stringify({
      events: [
        {
          id: "bad-condition-target",
          category: "daily",
          weight: 1,
          conditions: [
            { target: "relationship.all.traits", op: "has", value: "witness" },
          ],
          effects: [],
          templateKey: "test.bad.template",
        },
      ],
    }))).toThrow("/events/0/conditions/0");
  });

  it("rejects condition op and value combinations that do not match the target kind", () => {
    for (const condition of [
      { target: "money", op: "has", value: "coin" },
      { target: "player.traits", op: "gt", value: 1 },
      { target: "world.region", op: "gte", value: 1 },
      { all: [] },
      { any: [] },
    ]) {
      expect(() => parseMod(JSON.stringify({
        events: [
          {
            id: "bad-condition-shape",
            category: "daily",
            weight: 1,
            conditions: [condition],
            effects: [],
            templateKey: "test.bad.template",
          },
        ],
      }))).toThrow("/events/0/conditions/0");
    }
  });

  it("rejects effect values that do not match the target kind", () => {
    for (const effect of [
      { target: "money", value: "5" },
      { target: "inventory.add", value: 1 },
      { target: "world.region", value: "moon" },
      { target: "relationship.mentor.educationLevel", value: "pirate" },
      { target: "relationship.all.affiliation", value: "guild" },
      { target: "relationship.mentor.trust", value: "high" },
    ]) {
      expect(() => parseMod(JSON.stringify({
        actions: [
          {
            id: "bad-effect-shape",
            labelKey: "test.bad.label",
            descriptionKey: "test.bad.description",
            effects: [effect],
          },
        ],
      }))).toThrow("/actions/0/effects/0");
    }
  });

  it("rejects invalid NPC interaction effects", () => {
    expect(() => parseMod(JSON.stringify({
      npcInteractions: [
        {
          id: "bad-npc-effect",
          labelKey: "test.badNpc.label",
          descriptionKey: "test.badNpc.description",
          conditions: [],
          effects: [
            { target: "trust", value: "high" },
          ],
          logKey: "test.badNpc.log",
        },
      ],
    }))).toThrow("/npcInteractions/0/effects/0");
  });

  it("rejects a mod with an invalid turning point choice career category", () => {
    const baseTurningPoint = baseRawGameData.turningPoints[0];

    expect(() => parseMod(JSON.stringify({
      turningPoints: [
        {
          ...baseTurningPoint,
          choices: [
            {
              ...baseTurningPoint.choices[0],
              careerCategory: "pirate",
            },
          ],
        },
      ],
    }))).toThrow("/turningPoints/0/choices/0/careerCategory");
  });
});
