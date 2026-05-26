import { useGameStore } from "../../core/useGameStore";
import { t } from "../../localisation";

export function ModPanel({
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
  const pack = useGameStore((store) => store.data.localisation);

  return (
    <section className="mod-panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold">{t(pack, "ui.mod.title")}</h2>
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            {t(pack, "ui.mod.description")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="secondary-button" type="button" onClick={onCreateTemplate}>{t(pack, "ui.mod.createTemplate")}</button>
          <button className="secondary-button" type="button" onClick={onExport}>{t(pack, "ui.mod.export")}</button>
          <button className="secondary-button" type="button" onClick={onImportDraft} disabled={!draft.trim()}>{t(pack, "ui.mod.importDraft")}</button>
          <button className="secondary-button" type="button" onClick={onImportFile}>{t(pack, "ui.mod.importFile")}</button>
        </div>
      </div>
      <textarea
        className="mod-editor"
        spellCheck={false}
        value={draft}
        onChange={(event) => onDraftChange(event.currentTarget.value)}
        placeholder={t(pack, "ui.mod.placeholder")}
      />
    </section>
  );
}
