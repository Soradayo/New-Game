import { create } from "zustand";
import { createInitialState } from "./initialState";
import { importSave, exportSave } from "../saves/saveCodec";
import { createContent } from "../systems/content";
import { advanceTurn } from "../systems/turnEngine";
import type { GameData, GameState, ModData } from "../types/game";

const STORAGE_KEY = "new-game-save";

interface GameStore {
  data: GameData;
  state: GameState;
  error: string | null;
  setAction: (actionId: string) => void;
  setStance: (stanceId: string) => void;
  nextTurn: () => void;
  reset: () => void;
  exportJson: () => string;
  importJson: (raw: string) => void;
  importMod: (mod: ModData) => void;
  clearError: () => void;
}

const initialData = createContent();
const initialState = loadStoredState() ?? createInitialState(initialData);

export const useGameStore = create<GameStore>((set, get) => ({
  data: initialData,
  state: initialState,
  error: null,
  setAction: (actionId) => set(({ state }) => ({ state: { ...state, selectedActionId: actionId } })),
  setStance: (stanceId) => set(({ state }) => ({ state: { ...state, selectedStanceId: stanceId } })),
  nextTurn: () => {
    const next = advanceTurn(get().state, get().data);
    persistState(next);
    set({ state: next, error: null });
  },
  reset: () => {
    const next = createInitialState(get().data);
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
      set({ error: error instanceof Error ? error.message : "読み込みに失敗しました。" });
    }
  },
  importMod: (mod) => {
    const data = createContent([mod]);
    const state = {
      ...get().state,
      history: [
        {
          id: `mod-${Date.now()}`,
          turn: get().state.turn,
          ageMonths: get().state.player.ageMonths,
          text: "Modの記録が世界に折り込まれた。",
          category: "world",
        },
        ...get().state.history,
      ],
    };
    persistState(state);
    set({ data, state, error: null });
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
