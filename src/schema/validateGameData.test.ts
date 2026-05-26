import { describe, expect, it } from "vitest";
import { baseRawGameData } from "../data";
import { parseMod } from "../mods/mergeMods";
import { validateGameData } from "./validateGameData";

describe("game data schema validation", () => {
  it("accepts the base game data", () => {
    expect(() => validateGameData(baseRawGameData, "base")).not.toThrow();
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
