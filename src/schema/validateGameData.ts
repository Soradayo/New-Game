import Ajv2020 from "ajv/dist/2020";
import type { ErrorObject } from "ajv";
import actionSchema from "../../docs/schema/action.schema.json";
import conditionSchema from "../../docs/schema/condition.schema.json";
import effectSchema from "../../docs/schema/effect.schema.json";
import eventSchema from "../../docs/schema/event.schema.json";
import gameDataSchema from "../../docs/schema/game-data.schema.json";
import itemSchema from "../../docs/schema/item.schema.json";
import namesSchema from "../../docs/schema/names.schema.json";
import stanceSchema from "../../docs/schema/stance.schema.json";
import traitSchema from "../../docs/schema/trait.schema.json";
import turningPointSchema from "../../docs/schema/turning-point.schema.json";
import type { GameData, ModData } from "../types/game";

const baseRequiredFields = ["actions", "stances", "events", "items", "traits", "turningPoints", "names"] as const;

const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
});

for (const schema of [
  gameDataSchema,
  effectSchema,
  conditionSchema,
  actionSchema,
  stanceSchema,
  eventSchema,
  itemSchema,
  traitSchema,
  turningPointSchema,
  namesSchema,
]) {
  ajv.addSchema(schema);
}

const validate = ajv.getSchema("https://new-game.local/schema/game-data.schema.json");

export class GameDataValidationError extends Error {
  constructor(errors: ErrorObject[] | string[]) {
    super(formatValidationErrors(errors));
    this.name = "GameDataValidationError";
  }
}

export function validateGameData(input: unknown, mode: "base"): GameData;
export function validateGameData(input: unknown, mode: "mod"): ModData;
export function validateGameData(input: unknown, mode: "base" | "mod"): GameData | ModData {
  if (!validate) {
    throw new GameDataValidationError(["JSONスキーマを読み込めませんでした。"]);
  }

  if (!validate(input)) {
    throw new GameDataValidationError(validate.errors ?? []);
  }

  if (mode === "base") {
    const missing = baseRequiredFields.filter((field) => !hasOwn(input, field));
    if (missing.length > 0) {
      throw new GameDataValidationError(
        missing.map((field) => `base data に ${field} がありません。`),
      );
    }
  }

  return input as GameData | ModData;
}

export function parseAndValidateMod(raw: string): ModData {
  let parsed: unknown;

  try {
    parsed = JSON.parse(stripJsonComments(raw));
  } catch {
    throw new GameDataValidationError(["JSONとして読み込めません。"]);
  }

  return validateGameData(parsed, "mod");
}

function hasOwn(input: unknown, key: string): boolean {
  return typeof input === "object" && input !== null && Object.hasOwn(input, key);
}

export function stripJsonComments(input: string): string {
  let output = "";
  let inString = false;
  let escaped = false;

  for (let index = 0; index < input.length; index += 1) {
    const current = input[index];
    const next = input[index + 1];

    if (inString) {
      output += current;

      if (escaped) {
        escaped = false;
      } else if (current === "\\") {
        escaped = true;
      } else if (current === "\"") {
        inString = false;
      }

      continue;
    }

    if (current === "\"") {
      inString = true;
      output += current;
      continue;
    }

    if (current === "/" && next === "/") {
      while (index < input.length && input[index] !== "\n") {
        index += 1;
      }
      output += "\n";
      continue;
    }

    if (current === "/" && next === "*") {
      index += 2;
      while (index < input.length && !(input[index] === "*" && input[index + 1] === "/")) {
        index += 1;
      }
      index += 1;
      continue;
    }

    output += current;
  }

  return output;
}

function formatValidationErrors(errors: ErrorObject[] | string[]): string {
  if (errors.length === 0) return "データ形式が正しくありません。";

  return errors
    .slice(0, 3)
    .map((error) => typeof error === "string" ? error : formatValidationError(error))
    .join(" / ");
}

function formatValidationError(error: ErrorObject): string {
  const path = error.instancePath || "/";
  const field = error.params && "missingProperty" in error.params
    ? `${path}/${error.params.missingProperty}`
    : path;

  return `${field}: ${error.message ?? "形式が正しくありません。"}`;
}
