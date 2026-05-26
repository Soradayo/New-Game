import { describe, expect, it } from "vitest";
import { baseRawGameData } from "../data";
import { mergeGameData, parseMod } from "./mergeMods";

describe("mod merging", () => {
  it("merges traits from mods", () => {
    const mod = parseMod(JSON.stringify({
      traits: [
        {
          id: "quiet",
          labelKey: "mod.trait.quiet.label",
          descriptionKey: "mod.trait.quiet.description",
          tags: ["temperament"],
          effects: [
            { target: "stats.spirit", value: 1 },
          ],
        },
      ],
      localisation: {
        ja: {
          "mod.trait.quiet.label": "寡黙",
          "mod.trait.quiet.description": "言葉よりも沈黙を選ぶ。",
        },
      },
    }));

    const merged = mergeGameData(baseRawGameData, [mod]);

    expect(merged.traits.some((trait) => trait.id === "quiet")).toBe(true);
  });

  it("replaces base traits with matching mod ids", () => {
    const mod = parseMod(JSON.stringify({
      traits: [
        {
          id: "observant",
          labelKey: "mod.trait.observant.label",
          descriptionKey: "mod.trait.observant.description",
          tags: ["perception"],
          effects: [
            { target: "stats.mind", value: 2 },
          ],
        },
      ],
      localisation: {
        ja: {
          "mod.trait.observant.label": "鋭い観察眼",
          "mod.trait.observant.description": "細部に気づきやすい。",
        },
      },
    }));

    const merged = mergeGameData(baseRawGameData, [mod]);
    const trait = merged.traits.find((entry) => entry.id === "observant");

    expect(trait?.labelKey).toBe("mod.trait.observant.label");
    expect(merged.traits.filter((entry) => entry.id === "observant")).toHaveLength(1);
  });

  it("merges and replaces turning points from mods", () => {
    const baseTurningPoint = baseRawGameData.turningPoints[0];
    const mod = parseMod(JSON.stringify({
      turningPoints: [
        {
          ...baseTurningPoint,
          labelKey: "mod.turning.replacement.label",
        },
      ],
      localisation: {
        ja: {
          "mod.turning.replacement.label": "Modの転機",
        },
      },
    }));

    const merged = mergeGameData(baseRawGameData, [mod]);
    const turningPoint = merged.turningPoints.find((entry) => entry.id === baseTurningPoint.id);

    expect(turningPoint?.labelKey).toBe("mod.turning.replacement.label");
    expect(merged.turningPoints.filter((entry) => entry.id === baseTurningPoint.id)).toHaveLength(1);
  });
});
