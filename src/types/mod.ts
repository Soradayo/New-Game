import type {
  RawEventDefinition,
  RawGameAction,
  RawItemDefinition,
  RawNameData,
  RawNpcInteractionDefinition,
  RawStance,
  RawTraitDefinition,
  RawTurningPointDefinition,
} from "./content";
import type { LocaleCode, LocalisationPack } from "./localisation";

export interface ModData {
  actions?: RawGameAction[];
  stances?: RawStance[];
  events?: RawEventDefinition[];
  items?: RawItemDefinition[];
  traits?: RawTraitDefinition[];
  npcInteractions?: RawNpcInteractionDefinition[];
  turningPoints?: RawTurningPointDefinition[];
  names?: Partial<RawNameData>;
  localisation?: Partial<Record<LocaleCode, LocalisationPack>>;
}

export interface RawGameData {
  actions: RawGameAction[];
  stances: RawStance[];
  events: RawEventDefinition[];
  items: RawItemDefinition[];
  traits: RawTraitDefinition[];
  npcInteractions: RawNpcInteractionDefinition[];
  turningPoints: RawTurningPointDefinition[];
  names: RawNameData;
  localisation?: Partial<Record<LocaleCode, LocalisationPack>>;
}
