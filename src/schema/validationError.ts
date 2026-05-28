import type { ErrorObject } from "ajv";
import { baseLocalisation, DEFAULT_LOCALE, t } from "../localisation";

export class GameDataValidationError extends Error {
  constructor(errors: ErrorObject[] | string[]) {
    super(formatValidationErrors(errors));
    this.name = "GameDataValidationError";
  }
}

function formatValidationErrors(errors: ErrorObject[] | string[]): string {
  if (errors.length === 0) return t(baseLocalisation[DEFAULT_LOCALE], "system.error.invalidData");

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

  return `${field}: ${error.message ?? t(baseLocalisation[DEFAULT_LOCALE], "system.error.invalidFormat")}`;
}
