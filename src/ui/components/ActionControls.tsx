import type { ReactNode } from "react";
import { useGameStore } from "../../core/useGameStore";
import { t } from "../../localisation";
import type { GameAction, Stance } from "../../types/game";

export function ActionControls({
  selectedActionId,
  selectedStanceId,
  actions,
  stances,
  isBlocked,
  turningPointPanel,
  onActionChange,
  onStanceChange,
  onNextTurn,
  onAdvanceToImportantEvent,
  onReset,
  onExportSave,
  onImportSave,
  onToggleModPanel,
  children,
}: {
  selectedActionId: string;
  selectedStanceId: string;
  actions: GameAction[];
  stances: Stance[];
  isBlocked: boolean;
  turningPointPanel?: ReactNode;
  onActionChange: (value: string) => void;
  onStanceChange: (value: string) => void;
  onNextTurn: () => void;
  onAdvanceToImportantEvent: () => void;
  onReset: () => void;
  onExportSave: () => void;
  onImportSave: () => void;
  onToggleModPanel: () => void;
  children?: ReactNode;
}) {
  const pack = useGameStore((store) => store.data.localisation);

  return (
    <section className="controls-area grid gap-4">
      {turningPointPanel ? <div className="turning-panel-overlay">{turningPointPanel}</div> : null}
      <ChoiceGroup
        label={t(pack, "ui.actions.action")}
        value={selectedActionId}
        options={actions}
        onChange={onActionChange}
      />
      <ChoiceGroup
        label={t(pack, "ui.actions.stance")}
        value={selectedStanceId}
        options={stances}
        onChange={onStanceChange}
      />
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button className="primary-button" disabled={isBlocked} onClick={onNextTurn}>
          {t(pack, "ui.actions.nextTurn")}
        </button>
        <button className="secondary-button" disabled={isBlocked} onClick={onAdvanceToImportantEvent}>
          {t(pack, "ui.actions.advanceImportant")}
        </button>
        <button className="secondary-button" onClick={onReset}>{t(pack, "ui.actions.reset")}</button>
        <button className="secondary-button" onClick={onExportSave}>{t(pack, "ui.actions.exportSave")}</button>
        <button className="secondary-button" onClick={onImportSave}>{t(pack, "ui.actions.importSave")}</button>
        <button className="secondary-button" onClick={onToggleModPanel}>{t(pack, "ui.mod.title")}</button>
      </div>
      <div className={`mobile-action-bar ${isBlocked ? "mobile-action-bar-hidden" : ""}`}>
        <button className="primary-button mobile-action-button" disabled={isBlocked} onClick={onNextTurn}>
          {t(pack, "ui.actions.nextTurn")}
        </button>
        <button className="secondary-button mobile-action-button" disabled={isBlocked} onClick={onAdvanceToImportantEvent}>
          {t(pack, "ui.actions.advanceImportant")}
        </button>
        <button className="secondary-button mobile-action-button" onClick={onToggleModPanel}>
          {t(pack, "ui.mod.title")}
        </button>
      </div>
      {children}
    </section>
  );
}

function ChoiceGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ id: string; label: string; description: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <section className="rounded border border-zinc-800 bg-zinc-900 p-3">
      <h2 className="text-xs uppercase tracking-wide text-zinc-500">{label}</h2>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={option.id === value}
            className={`choice-button ${option.id === value ? "choice-button-active" : ""}`}
            onClick={() => onChange(option.id)}
          >
            <span className="block text-sm font-semibold">{option.label}</span>
            <span className="mt-1 block text-xs leading-5 text-zinc-400">{option.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
