import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { getLifePhase } from "../core/lifePhase";
import { useGameStore } from "../core/useGameStore";
import { createModTemplateJson } from "../mods/createModTemplate";
import { getChoiceAvailability, getPendingTurningPoint } from "../systems/turningPoints";
import type { AbilityKey, LifePhase, TurningPointDefinition } from "../types/game";
import {
  abilityLabels,
  careerCategoryLabels,
  categoryLabels,
  classLabels,
  educationLevelLabels,
  formatMonthsAsAge,
  lifePhaseLabels,
  organizationKindLabels,
  regionLabels,
  roleLabels,
} from "./display";

const tabs = ["history", "relationships", "organization", "inventory", "world state"] as const;
const tabLabels: Record<(typeof tabs)[number], string> = {
  history: "履歴",
  relationships: "関係",
  organization: "組織",
  inventory: "所持品",
  "world state": "世界",
};

export function App() {
  const {
    data,
    state,
    error,
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
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("history");
  const [isModPanelOpen, setIsModPanelOpen] = useState(false);
  const [modDraft, setModDraft] = useState("");
  const saveInputRef = useRef<HTMLInputElement>(null);
  const modInputRef = useRef<HTMLInputElement>(null);
  const lifePhase = getLifePhase(state.player.ageMonths);
  const visibleLogs = useMemo(() => state.history.slice(0, 5), [state.history]);
  const pendingTurningPoint = getPendingTurningPoint(state, data);

  const createTemplate = () => {
    setModDraft(createModTemplateJson());
    setIsModPanelOpen(true);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-4 py-4">
        <Header lifePhase={lifePhase} />

        {error ? <ErrorBanner message={error} /> : null}

        <div className="grid flex-1 gap-4 lg:grid-cols-[220px_1fr_280px]">
          <Panel title="能力">
            <AbilityList stats={state.player.stats} />
          </Panel>

          <Panel title="人生の記録">
            <div className="h-64 space-y-3 overflow-y-auto pr-2">
              {visibleLogs.map((entry) => (
                <article key={entry.id} className="border-l border-zinc-700 pl-3">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">
                    第{entry.turn}期 / {formatMonthsAsAge(entry.ageMonths)} /{" "}
                    {categoryLabels[entry.category as keyof typeof categoryLabels] ?? entry.category}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-zinc-200">{entry.text}</p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="人間関係">
            <div className="space-y-3">
              {state.relationships.map((relationship) => (
                <div key={relationship.id}>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span>{relationship.name}</span>
                    <span className="text-zinc-400">{relationship.bond.toFixed(0)}</span>
                  </div>
                  <div className="text-xs text-zinc-500">
                    {roleLabels[relationship.role] ?? relationship.role} /{" "}
                    {careerCategoryLabels[relationship.careerCategory]}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <section className="controls-area grid gap-4">
          {pendingTurningPoint ? (
            <div className="turning-panel-overlay">
              <TurningPointPanel turningPoint={pendingTurningPoint} onChoose={chooseTurningPoint} />
            </div>
          ) : null}
          <ChoiceGroup
            label="行動"
            value={state.selectedActionId}
            options={data.actions}
            onChange={setAction}
          />
          <ChoiceGroup
            label="姿勢"
            value={state.selectedStanceId}
            options={data.stances}
            onChange={setStance}
          />
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button className="primary-button" disabled={Boolean(pendingTurningPoint)} onClick={nextTurn}>
              次の期間へ
            </button>
            <button className="secondary-button" disabled={Boolean(pendingTurningPoint)} onClick={advanceToImportantEvent}>
              重要な出来事まで
            </button>
            <button className="secondary-button" onClick={reset}>最初から</button>
            <button className="secondary-button" onClick={() => downloadSave(exportJson())}>保存を書き出す</button>
            <button className="secondary-button" onClick={() => saveInputRef.current?.click()}>保存を読み込む</button>
            <button className="secondary-button" onClick={() => setIsModPanelOpen((value) => !value)}>Mod</button>
          </div>
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
        </section>

        <section className="rounded border border-zinc-800 bg-zinc-900/70">
          <div className="flex flex-wrap border-b border-zinc-800">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? "tab-button-active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>
          <TabContent activeTab={activeTab} />
        </section>

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

function Header({ lifePhase }: { lifePhase: LifePhase }) {
  const state = useGameStore((store) => store.state);

  return (
    <header className="grid gap-3 rounded border border-zinc-800 bg-zinc-900 px-4 py-3 md:grid-cols-6">
      <HeaderItem label="名前" value={state.player.name} />
      <HeaderItem label="年齢" value={`${formatMonthsAsAge(state.player.ageMonths)} / ${lifePhaseLabels[lifePhase]}`} />
      <HeaderItem label="階級" value={classLabels[state.player.socialClass]} />
      <HeaderItem label="教育" value={educationLevelLabels[state.player.educationLevel]} />
      <HeaderItem label="職域" value={careerCategoryLabels[state.player.careerCategory]} />
      <HeaderItem label="所持金" value={`${state.player.money.toFixed(0)}コイン`} />
    </header>
  );
}

function HeaderItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="text-sm font-medium text-zinc-100">{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded border border-zinc-800 bg-zinc-900/80 p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">{title}</h2>
      {children}
    </section>
  );
}

function AbilityList({ stats }: { stats: Record<AbilityKey, number> }) {
  return (
    <div className="space-y-3">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span>{abilityLabels[key as AbilityKey]}</span>
            <span className="text-zinc-400">{value.toFixed(1)}</span>
          </div>
          <div className="h-2 rounded bg-zinc-800">
            <div className="h-2 rounded bg-cyan-500" style={{ width: `${Math.min(100, value)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TurningPointPanel({
  turningPoint,
  onChoose,
}: {
  turningPoint: TurningPointDefinition;
  onChoose: (choiceId: string) => void;
}) {
  const state = useGameStore((store) => store.state);

  return (
    <section className="turning-panel">
      <div>
        <div className="text-xs text-zinc-500">転機</div>
        <h2 className="mt-1 text-lg font-bold">{turningPoint.label}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-300">{turningPoint.description}</p>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {turningPoint.choices.map((choice) => {
          const availability = getChoiceAvailability(state, choice);

          return (
            <button
              key={choice.id}
              type="button"
              className={`turning-choice ${availability.available ? "" : "turning-choice-disabled"}`}
              disabled={!availability.available}
              onClick={() => onChoose(choice.id)}
            >
              <span className="block text-sm font-bold">{choice.label}</span>
              <span className="mt-2 block text-xs leading-5 text-zinc-400">{choice.description}</span>
              <span className="mt-3 block text-xs leading-5">{choice.outcomeSummary}</span>
              {!availability.available ? (
                <span className="mt-3 block text-xs text-zinc-500">
                  選べない: {availability.reasons.join(" / ")}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ModPanel({
  draft,
  onDraftChange,
  onCreateTemplate,
  onExport,
  onImportDraft,
  onImportFile,
}: {
  draft: string;
  onDraftChange: (value: string) => void;
  onCreateTemplate: () => void;
  onExport: () => void;
  onImportDraft: () => void;
  onImportFile: () => void;
}) {
  return (
    <section className="mod-panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold">Mod</h2>
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            テンプレートを作成し、JSONとして書き出すか、この欄の内容をそのまま読み込めます。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="secondary-button" type="button" onClick={onCreateTemplate}>テンプレート作成</button>
          <button className="secondary-button" type="button" onClick={onExport}>エクスポート</button>
          <button className="secondary-button" type="button" onClick={onImportDraft} disabled={!draft.trim()}>この内容を読み込む</button>
          <button className="secondary-button" type="button" onClick={onImportFile}>ファイルを読み込む</button>
        </div>
      </div>
      <textarea
        className="mod-editor"
        spellCheck={false}
        value={draft}
        onChange={(event) => onDraftChange(event.currentTarget.value)}
        placeholder="テンプレート作成を押すと、Mod JSONの雛形が入ります。"
      />
    </section>
  );
}

function DevPanel({
  onJumpToYouth,
  onJumpToOldAge,
  onJumpToEnding,
  onForceTurningPoint,
}: {
  onJumpToYouth: () => void;
  onJumpToOldAge: () => void;
  onJumpToEnding: () => void;
  onForceTurningPoint: () => void;
}) {
  return (
    <section className="dev-panel">
      <div>
        <h2 className="text-xs font-bold text-zinc-400">DEV</h2>
        <p className="mt-1 text-xs text-zinc-500">テスト用の時間操作です。</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="secondary-button" type="button" onClick={onJumpToYouth}>18歳へ</button>
        <button className="secondary-button" type="button" onClick={onJumpToOldAge}>65歳へ</button>
        <button className="secondary-button" type="button" onClick={onJumpToEnding}>80歳へ</button>
        <button className="secondary-button" type="button" onClick={onForceTurningPoint}>転機を出す</button>
      </div>
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

function TabContent({ activeTab }: { activeTab: (typeof tabs)[number] }) {
  const { data, state } = useGameStore();

  if (activeTab === "relationships") {
    return (
      <div className="grid gap-3 p-4 md:grid-cols-3">
        {state.relationships.map((relationship) => (
          <div key={relationship.id} className="rounded border border-zinc-800 p-3">
            <div className="font-medium">{relationship.name}</div>
            <div className="text-sm text-zinc-500">{roleLabels[relationship.role] ?? relationship.role}</div>
            <div className="mt-2 text-sm">絆 {relationship.bond.toFixed(0)}</div>
            <div className="mt-1 text-xs text-zinc-500">
              {educationLevelLabels[relationship.educationLevel]} / {careerCategoryLabels[relationship.careerCategory]}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === "organization") {
    return (
      <div className="grid gap-2 p-4 md:grid-cols-2">
        {Object.entries(state.world.organizations).map(([kind, name]) => (
          <div key={kind} className="flex justify-between gap-4 text-sm">
            <span className="text-zinc-500">{organizationKindLabels[kind as keyof typeof organizationKindLabels]}</span>
            <span>{name}</span>
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === "inventory") {
    return (
      <div className="grid gap-3 p-4 md:grid-cols-3">
        {state.player.inventory.map((itemId) => {
          const item = data.items.find((entry) => entry.id === itemId);
          return (
            <div key={itemId} className="rounded border border-zinc-800 p-3">
              <div className="font-medium">{item?.label ?? itemId}</div>
              <div className="mt-1 text-sm text-zinc-500">{item?.description ?? "不明な所持品。"}</div>
            </div>
          );
        })}
      </div>
    );
  }

  if (activeTab === "world state") {
    return (
      <div className="grid gap-3 p-4 md:grid-cols-4">
        <HeaderItem label="国家" value={state.world.nation} />
        <HeaderItem label="類型" value={state.world.nationArchetype} />
        <HeaderItem label="地域" value={regionLabels[state.world.region]} />
        <HeaderItem label="緊張" value={state.world.pressure.toFixed(1)} />
      </div>
    );
  }

  return (
    <div className="max-h-72 space-y-3 overflow-auto p-4">
      {state.history.map((entry) => (
        <p key={entry.id} className="text-sm leading-6 text-zinc-300">
          <span className="text-zinc-500">第{entry.turn}期</span> {entry.text}
        </p>
      ))}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-100">
      {message}
    </div>
  );
}

function downloadSave(json: string) {
  downloadJson(json, "new-game-save-ja.json");
}

function downloadJson(json: string, filename: string) {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function readFile(file: File | undefined, onRead: (raw: string) => void) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    if (typeof reader.result === "string") onRead(reader.result);
  });
  reader.readAsText(file);
}
