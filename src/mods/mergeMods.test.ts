import { describe, expect, it } from "vitest";
import { baseGameData } from "../data";
import { mergeGameData, parseMod } from "./mergeMods";

describe("mod merging", () => {
  it("merges traits from mods", () => {
    const mod = parseMod(JSON.stringify({
      traits: [
        {
          id: "quiet",
          label: "寡黙",
          description: "言葉よりも沈黙を選ぶ。",
          tags: ["temperament"],
          effects: [
            { target: "stats.spirit", value: 1 },
          ],
        },
      ],
    }));

    const merged = mergeGameData(baseGameData, [mod]);

    expect(merged.traits.some((trait) => trait.id === "quiet")).toBe(true);
  });

  it("replaces base traits with matching mod ids", () => {
    const mod = parseMod(JSON.stringify({
      traits: [
        {
          id: "observant",
          label: "鋭い観察眼",
          description: "細部に気づきやすい。",
          tags: ["perception"],
          effects: [
            { target: "stats.mind", value: 2 },
          ],
        },
      ],
    }));

    const merged = mergeGameData(baseGameData, [mod]);
    const trait = merged.traits.find((entry) => entry.id === "observant");

    expect(trait?.label).toBe("鋭い観察眼");
    expect(merged.traits.filter((entry) => entry.id === "observant")).toHaveLength(1);
  });

  it("merges and replaces turning points from mods", () => {
    const baseTurningPoint = baseGameData.turningPoints[0];
    const mod = parseMod(JSON.stringify({
      turningPoints: [
        {
          ...baseTurningPoint,
          label: "Modの転機",
        },
      ],
    }));

    const merged = mergeGameData(baseGameData, [mod]);
    const turningPoint = merged.turningPoints.find((entry) => entry.id === baseTurningPoint.id);

    expect(turningPoint?.label).toBe("Modの転機");
    expect(merged.turningPoints.filter((entry) => entry.id === baseTurningPoint.id)).toHaveLength(1);
  });
});
