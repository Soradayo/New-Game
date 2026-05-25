import { describe, expect, it } from "vitest";
import { parseMod } from "./mergeMods";
import { createModTemplateJson } from "./createModTemplate";
import { stripJsonComments } from "../schema/validateGameData";

describe("mod template", () => {
  it("creates a template that can be loaded as a mod", () => {
    const mod = parseMod(createModTemplateJson());

    expect(mod.actions?.[0]?.id).toBe("mod-observe-town");
    expect(mod.turningPoints?.[0]?.id).toBe("mod-apprentice-printer");
  });

  it("keeps comment-like text inside strings while stripping template comments", () => {
    const raw = `{
      // this comment should disappear
      "template": "https://example.test/path // this text should stay",
      "description": "block /* text */ should stay"
    }`;

    const stripped = stripJsonComments(raw);
    const parsed = JSON.parse(stripped) as { template: string; description: string };

    expect(parsed.template).toContain("// this text should stay");
    expect(parsed.description).toContain("/* text */");
    expect(stripped).not.toContain("this comment should disappear");
  });
});
