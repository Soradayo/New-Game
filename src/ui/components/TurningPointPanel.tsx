import { useGameStore } from "../../core/useGameStore";
import { t } from "../../localisation";
import { getChoiceAvailability } from "../../systems/turningPoints";
import type { TurningPointDefinition } from "../../types/game";

export function TurningPointPanel({
  turningPoint,
  onChoose,
}: {
  turningPoint: TurningPointDefinition;
  onChoose: (choiceId: string) => void;
}) {
  const state = useGameStore((store) => store.state);
  const pack = useGameStore((store) => store.data.localisation);

  return (
    <section className="turning-panel">
      <div>
        <div className="text-xs text-zinc-500">{t(pack, "ui.turning.title")}</div>
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
                  {t(pack, "ui.turning.unavailable", { reasons: availability.reasons.join(" / ") })}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
