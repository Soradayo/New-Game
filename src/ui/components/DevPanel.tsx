import { useGameStore } from "../../core/useGameStore";
import { t } from "../../localisation";

export function DevPanel({
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
  const pack = useGameStore((store) => store.data.localisation);

  return (
    <section className="dev-panel">
      <div>
        <h2 className="text-xs font-bold text-zinc-400">{t(pack, "ui.dev.title")}</h2>
        <p className="mt-1 text-xs text-zinc-500">{t(pack, "ui.dev.description")}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="secondary-button" type="button" onClick={onJumpToYouth}>{t(pack, "ui.dev.jumpYouth")}</button>
        <button className="secondary-button" type="button" onClick={onJumpToOldAge}>{t(pack, "ui.dev.jumpOldAge")}</button>
        <button className="secondary-button" type="button" onClick={onJumpToEnding}>{t(pack, "ui.dev.jumpEnding")}</button>
        <button className="secondary-button" type="button" onClick={onForceTurningPoint}>{t(pack, "ui.dev.forceTurningPoint")}</button>
      </div>
    </section>
  );
}
