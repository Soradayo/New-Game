import { useGameStore } from "../../core/useGameStore";
import { t } from "../../localisation";

export function TagBlock({ label, values }: { label: string; values: string[] }) {
  const pack = useGameStore((store) => store.data.localisation);

  return (
    <div className="rounded border border-zinc-800 p-3">
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.length > 0 ? values.map((value) => (
          <span key={value} className="border border-zinc-700 px-2 py-1 text-xs text-zinc-300">
            {value}
          </span>
        )) : (
          <span className="text-sm text-zinc-500">{t(pack, "ui.tags.empty")}</span>
        )}
      </div>
    </div>
  );
}

export function TagLine({ label, values }: { label: string; values: string[] }) {
  const pack = useGameStore((store) => store.data.localisation);
  const displayValues = values.length > 0 ? values.join(" / ") : t(pack, "ui.tags.empty");

  return (
    <div className="mt-1 text-xs text-zinc-600">
      {label}: {displayValues}
    </div>
  );
}
