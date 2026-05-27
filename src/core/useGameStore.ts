import { create } from "zustand";
import { createInitialState } from "./initialState";
import { getStoredLocale, persistLocale, t } from "../localisation";
import { importSave, exportSave } from "../saves/saveCodec";
import { createContent } from "../systems/content";
import { advanceTurn, advanceUntilImportantEvent } from "../systems/turnEngine";
import { applyTurningPointChoice, hasAvailableTurningPointChoice } from "../systems/turningPoints";
import { createHistoryEntry } from "../systems/history";
import { parseMod } from "../mods/mergeMods";
import type { GameData, GameState, LocaleCode, ModData } from "../types/game";

const STORAGE_KEY = "new-game-save";

interface GameStore {
  data: GameData;
  locale: LocaleCode;
  mods: ModData[];
  state: GameState;
  error: string | null;
  setLocale: (locale: LocaleCode) => void;
  setAction: (actionId: string) => void;
  setStance: (stanceId: string) => void;
  nextTurn: () => void;
  advanceToImportantEvent: () => void;
  chooseTurningPoint: (choiceId: string) => void;
  devJumpToAge: (ageYears: number) => void;
  devForceTurningPoint: () => void;
  reset: () => void;
  exportJson: () => string;
  importJson: (raw: string) => void;
  importModJson: (raw: string) => void;
  clearError: () => void;
}

const initialLocale = getStoredLocale();
const initialMods: ModData[] = [];
const initialData = createContent(initialMods, initialLocale);
const initialState = loadStoredState() ?? createInitialState(initialData, initialData.localisation);

export const useGameStore = create<GameStore>((set, get) => ({
  data: initialData,
  locale: initialLocale,
  mods: initialMods,
  state: initialState,
  error: null,
  setLocale: (locale) => {
    persistLocale(locale);
    const data = createContent(get().mods, locale);
    set({ locale, data, error: null });
  },
  setAction: (actionId) => set(({ state }) => ({ state: { ...state, selectedActionId: actionId } })),
  setStance: (stanceId) => set(({ state }) => ({ state: { ...state, selectedStanceId: stanceId } })),
  nextTurn: () => {
    const next = advanceTurn(get().state, get().data);
    persistState(next);
    set({ state: next, error: null });
  },
  advanceToImportantEvent: () => {
    const next = advanceUntilImportantEvent(get().state, get().data);
    persistState(next);
    set({ state: next, error: null });
  },
  chooseTurningPoint: (choiceId) => {
    try {
      const next = applyTurningPointChoice(get().state, get().data, choiceId);
      persistState(next);
      set({ state: next, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : t(get().data.localisation, "system.error.turningChoiceFailed") });
    }
  },
  devJumpToAge: (ageYears) => {
    const next = {
      ...get().state,
      pendingTurningPoint: null,
      player: {
        ...get().state.player,
        ageMonths: Math.max(72, Math.round(ageYears * 12)),
      },
    };
    persistState(next);
    set({ state: next, error: null });
  },
  devForceTurningPoint: () => {
    const state = get().state;
    const forced = get().data.turningPoints.find((turningPoint) =>
      !state.player.lifeTags.some((tag) => tag.startsWith(`turning.${turningPoint.id}.`)) &&
      hasAvailableTurningPointChoice(state, turningPoint),
    );
    if (!forced) {
      set({ error: t(get().data.localisation, "system.error.noTurningPoint") });
      return;
    }

    const next = {
      ...state,
      pendingTurningPoint: {
        id: forced.id,
        turn: state.turn,
        ageMonths: state.player.ageMonths,
      },
    };
    persistState(next);
    set({ state: next, error: null });
  },
  reset: () => {
    const next = createInitialState(get().data, get().data.localisation);
    persistState(next);
    set({ state: next, error: null });
  },
  exportJson: () => exportSave(get().state),
  importJson: (raw) => {
    try {
      const imported = importSave(raw);
      persistState(imported);
      set({ state: imported, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : t(get().data.localisation, "system.error.importFailed") });
    }
  },
  importModJson: (raw) => {
    try {
      const mod = parseMod(raw);
      const mods = [...get().mods, mod];
      const data = createContent(mods, get().locale);
      const state = {
        ...get().state,
        history: [
          createHistoryEntry({
            id: `mod-${Date.now()}`,
            turn: get().state.turn,
            ageMonths: get().state.player.ageMonths,
            text: t(data.localisation, "system.log.modImported"),
            locKey: "system.log.modImported",
            sourceId: "mod-import",
            sourceType: "system",
          }),
          ...get().state.history,
        ],
      };
      persistState(state);
      set({ mods, data, state, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : t(get().data.localisation, "system.error.modImportFailed") });
    }
  },
  clearError: () => set({ error: null }),
}));

function loadStoredState(): GameState | null {
  if (typeof localStorage === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return importSave(raw);
  } catch {
    return null;
  }
}

function persistState(state: GameState): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, exportSave(state));
}
