import { baseLocalisation, DEFAULT_LOCALE, t } from "../localisation";
import type { ModData, RawGameData } from "../types/game";
import { stripJsonComments } from "./jsonc";
import { validateGameDataShape } from "./schemaRegistry";
import { GameDataValidationError } from "./validationError";

export { stripJsonComments } from "./jsonc";
export { GameDataValidationError } from "./validationError";

const baseRequiredFields = ["actions", "stances", "events", "items", "traits", "npcInteractions", "turningPoints", "names"] as const;

export function validateGameData(input: unknown, mode: "base"): RawGameData;
export function validateGameData(input: unknown, mode: "mod"): ModData;
export function validateGameData(input: unknown, mode: "base" | "mod"): RawGameData | ModData {
  if (!validateGameDataShape) {
    throw new GameDataValidationError([t(baseLocalisation[DEFAULT_LOCALE], "system.error.schemaMissing")]);
  }

  if (!validateGameDataShape(input)) {
    throw new GameDataValidationError(validateGameDataShape.errors ?? []);
  }

  if (mode === "base") {
    const missing = baseRequiredFields.filter((field) => !hasOwn(input, field));
    if (missing.length > 0) {
      throw new GameDataValidationError(
        missing.map((field) => t(baseLocalisation[DEFAULT_LOCALE], "system.error.missingBaseField", { field })),
      );
    }
  }

  return input as RawGameData | ModData;
}

export function parseAndValidateMod(raw: string): ModData {
  let parsed: unknown;

  try {
    parsed = JSON.parse(stripJsonComments(raw));
  } catch {
    throw new GameDataValidationError([t(baseLocalisation[DEFAULT_LOCALE], "system.error.jsonParse")]);
  }

  return validateGameData(parsed, "mod");
}

function hasOwn(input: unknown, key: string): boolean {
  return typeof input === "object" && input !== null && Object.hasOwn(input, key);
}
