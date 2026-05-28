import type { ModData } from "../types/game";
import { createModTemplateJsonc } from "./modTemplateJsonc";
import { createModTemplateObject } from "./modTemplateObject";

export function createModTemplate(): ModData {
  return createModTemplateObject();
}

export function createModTemplateJson(): string {
  return createModTemplateJsonc();
}
