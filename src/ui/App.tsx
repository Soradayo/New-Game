import { useEffect, useMemo, useRef, useState } from "react";
import { getLifePhase } from "../core/lifePhase";
import { useGameStore } from "../core/useGameStore";
import { createModTemplateJson } from "../mods/createModTemplate";
import { getPendingTurningPoint } from "../systems/turningPoints";
import { t } from "../localisation";
import { ActionControls } from "./components/ActionControls";
import { AbilityPanel } from "./components/AbilityPanel";
import { ErrorBanner } from "./components/ErrorBanner";
import { Header } from "./components/Header";
import { DevPanel } from "./components/DevPanel";
import { InfoTabs } from "./components/InfoTabs";
import { LifeLogPanel } from "./components/LifeLogPanel";
import { ModPanel } from "./components/ModPanel";
import { RelationshipsPanel } from "./components/RelationshipsPanel";
import { TurningPointPanel } from "./components/TurningPointPanel";
import { downloadJson, downloadSave, readFile } from "./fileIo";
import type { TabKey } from "./tabs";

export function App() {
  const {
    data,
    state,
    error,
    locale,
    setLocale,
    setAction,
    setStance,
    nextTurn,
    advanceToImportantEvent,
    chooseTurningPoint,
    devJumpToAge,
    devForceTurningPoint,
    reset,
    exportJson,
    importJson,
    importModJson,
  } = useGameStore();
  const [activeTab, setActiveTab] = useState<TabKey>("history");
  const [isModPanelOpen, setIsModPanelOpen] = useState(false);
  const [modDraft, setModDraft] = useState("");
  const saveInputRef = useRef<HTMLInputElement>(null);
  const modInputRef = useRef<HTMLInputElement>(null);
  const lifePhase = getLifePhase(state.player.ageMonths);
  const visibleLogs = useMemo(() => state.history.slice(0, 5), [state.history]);
  const pendingTurningPoint = getPendingTurningPoint(state, data);

  useEffect(() => {
    document.title = t(data.localisation, "ui.document.title");
  }, [data.localisation]);

  const createTemplate = () => {
    setModDraft(createModTemplateJson());
    setIsModPanelOpen(true);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-4 py-4">
        <Header lifePhase={lifePhase} locale={locale} onLocaleChange={setLocale} />

        {error ? <ErrorBanner message={error} /> : null}

        <div className="grid flex-1 gap-4 lg:grid-cols-[220px_1fr_280px]">
          <AbilityPanel stats={state.player.stats} />
          <LifeLogPanel entries={visibleLogs} />
          <RelationshipsPanel relationships={state.relationships} />
        </div>

        <ActionControls
          selectedActionId={state.selectedActionId}
          selectedStanceId={state.selectedStanceId}
          actions={data.actions}
          stances={data.stances}
          isBlocked={Boolean(pendingTurningPoint)}
          turningPointPanel={
            pendingTurningPoint ? (
              <TurningPointPanel turningPoint={pendingTurningPoint} onChoose={chooseTurningPoint} />
            ) : null
          }
          onActionChange={setAction}
          onStanceChange={setStance}
          onNextTurn={nextTurn}
          onAdvanceToImportantEvent={advanceToImportantEvent}
          onReset={reset}
          onExportSave={() => downloadSave(exportJson())}
          onImportSave={() => saveInputRef.current?.click()}
          onToggleModPanel={() => setIsModPanelOpen((value) => !value)}
        >
          {isModPanelOpen ? (
            <ModPanel
              draft={modDraft}
              onDraftChange={setModDraft}
              onCreateTemplate={createTemplate}
              onExport={() => downloadJson(modDraft || createModTemplateJson(), "new-game-mod-template.jsonc")}
              onImportDraft={() => importModJson(modDraft)}
              onImportFile={() => modInputRef.current?.click()}
            />
          ) : null}
          {import.meta.env.DEV ? (
            <DevPanel
              onJumpToYouth={() => devJumpToAge(18)}
              onJumpToOldAge={() => devJumpToAge(65)}
              onJumpToEnding={() => devJumpToAge(80)}
              onForceTurningPoint={devForceTurningPoint}
            />
          ) : null}
        </ActionControls>

        <InfoTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <input
          ref={saveInputRef}
          className="hidden"
          type="file"
          accept="application/json,.json,.jsonc"
          onChange={(event) => readFile(event.currentTarget.files?.[0], importJson)}
        />
        <input
          ref={modInputRef}
          className="hidden"
          type="file"
          accept="application/json,.json,.jsonc"
          onChange={(event) => readFile(event.currentTarget.files?.[0], (raw) => {
            setModDraft(raw);
            setIsModPanelOpen(true);
            importModJson(raw);
          })}
        />
      </section>
    </main>
  );
}
