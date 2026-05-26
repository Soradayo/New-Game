import { t, tList } from ".";
import type {
  GameData,
  LocalisationPack,
  RawGameData,
  RawTurningPointChoice,
} from "../types/game";

export function hydrateGameData(data: RawGameData, pack: LocalisationPack): GameData {
  return {
    actions: data.actions.map((action) => ({
      ...action,
      label: t(pack, action.labelKey),
      description: t(pack, action.descriptionKey),
    })),
    stances: data.stances.map((stance) => ({
      ...stance,
      label: t(pack, stance.labelKey),
      description: t(pack, stance.descriptionKey),
    })),
    events: data.events.map((event) => ({
      ...event,
      template: t(pack, event.templateKey),
    })),
    items: data.items.map((item) => ({
      ...item,
      label: t(pack, item.labelKey),
      description: t(pack, item.descriptionKey),
    })),
    traits: data.traits.map((trait) => ({
      ...trait,
      label: t(pack, trait.labelKey),
      description: t(pack, trait.descriptionKey),
    })),
    turningPoints: data.turningPoints.map((turningPoint) => ({
      ...turningPoint,
      label: t(pack, turningPoint.labelKey),
      description: t(pack, turningPoint.descriptionKey),
      choices: turningPoint.choices.map((choice) => hydrateChoice(choice, pack)),
    })),
    names: {
      given: tList(pack, "names.given"),
      family: tList(pack, "names.family"),
      npcRoles: data.names.npcRoles,
    },
    localisation: pack,
  };
}

function hydrateChoice(choice: RawTurningPointChoice, pack: LocalisationPack): GameData["turningPoints"][number]["choices"][number] {
  return {
    ...choice,
    label: t(pack, choice.labelKey),
    description: t(pack, choice.descriptionKey),
    outcomeSummary: t(pack, choice.outcomeSummaryKey),
    requirements: choice.requirements.map((requirement) => ({
      condition: requirement.condition,
      reason: t(pack, requirement.reasonKey),
    })),
    npcOutcomes: choice.npcOutcomes?.map((outcome) => ({
      ...outcome,
      log: outcome.logKey ? t(pack, outcome.logKey) : undefined,
    })),
  };
}
