import { useGameStore } from "../../core/useGameStore";
import { t } from "../../localisation";
import type { LifePhase, LocaleCode } from "../../types/game";
import {
  careerCategoryLabel,
  classLabel,
  educationLevelLabel,
  formatMonthsAsAge,
  lifePhaseLabel,
} from "../display";

export function Header({
  lifePhase,
  locale,
  onLocaleChange,
}: {
  lifePhase: LifePhase;
  locale: LocaleCode;
  onLocaleChange: (locale: LocaleCode) => void;
}) {
  const state = useGameStore((store) => store.state);
  const pack = useGameStore((store) => store.data.localisation);

  return (
    <header className="grid gap-3 rounded border border-zinc-800 bg-zinc-900 px-4 py-3 md:grid-cols-7">
      <HeaderItem label={t(pack, "ui.header.name")} value={state.player.name} />
      <HeaderItem label={t(pack, "ui.header.age")} value={`${formatMonthsAsAge(pack, state.player.ageMonths)} / ${lifePhaseLabel(pack, lifePhase)}`} />
      <HeaderItem label={t(pack, "ui.header.class")} value={classLabel(pack, state.player.socialClass)} />
      <HeaderItem label={t(pack, "ui.header.education")} value={educationLevelLabel(pack, state.player.educationLevel)} />
      <HeaderItem label={t(pack, "ui.header.career")} value={careerCategoryLabel(pack, state.player.careerCategory)} />
      <HeaderItem label={t(pack, "ui.header.money")} value={t(pack, "ui.header.moneyValue", { value: state.player.money.toFixed(0) })} />
      <div>
        <div className="text-xs uppercase tracking-wide text-zinc-500">{t(pack, "ui.language.label")}</div>
        <div className="mt-1 flex gap-1">
          {(["ja", "en"] as const).map((code) => (
            <button
              key={code}
              type="button"
              className={`tab-button px-2 py-1 ${locale === code ? "tab-button-active" : ""}`}
              onClick={() => onLocaleChange(code)}
            >
              {t(pack, `ui.language.${code}`)}
            </button>
          ))}
        </div>
      </div>
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
