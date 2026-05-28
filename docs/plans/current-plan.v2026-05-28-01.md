# 肥大化コード分割リファクタリング計画

## Summary
- 目的は挙動変更なしで、肥大化したコードを責務単位へ分割すること。
- 最初の実装対象は `turningPoints.ts`, `turnEngine.ts`, `InfoTabs.tsx`, `types/game.ts`, `validateGameData.ts`, `createModTemplate.ts`。
- 公開 import path と既存Store/UI APIは維持する。save versionは上げない。
- 実装前に `docs/plans/current-plan.md` をバックアップし、この計画へ差し替える。

## Key Changes
- systems層:
  - `src/systems/turningPoints.ts` は façade として残し、内部を `resolver`, `availability`, `applyChoice`, `logs`, `utils` へ分割する。
  - `src/systems/turnEngine.ts` も façade として残し、内部を `advance`, `progression`, `logging`, `fastForward` へ分割する。
  - `effects.ts` は今回は大分割せず、必要なら `applyEffects` だけ公開する前提の小整理に留める。
- UI層:
  - `InfoTabs.tsx` をタブ単位へ分割する。
  - `HistoryTab`, `RelationshipsTab`, `OrganizationTab`, `InventoryTab`, `WorldStateTab`, `InfoItem`, `TagBlock` を作る。
  - `ActionControls.tsx` は次点で、`ChoiceGroup`, 通常操作列, モバイル操作バー, 転機overlayへ分ける。
  - `styles.css` は今回は分割しない。CSS順序による白黒UIの回帰リスクが高いため。
- data/schema/types層:
  - `src/types/game.ts` は互換用 façade として残し、内部型を `primitives`, `state`, `history`, `conditions`, `effects`, `content`, `localisation`, `mod` へ分割する。
  - `validateGameData.ts` は `schemaRegistry`, `jsonc`, `validationError`, `validateGameData` へ分ける。
  - `createModTemplate.ts` は template object と JSONC文字列生成を分ける。
- 守る互換:
  - 既存の `../types/game`, `../systems/turningPoints`, `../systems/turnEngine` import path は維持。
  - Mod JSON形式、schema `$id`, localisation fallback, JSONCコメント許容、save構造は変更しない。
  - `resolveTurningPoint`, `applyTurningPointChoice`, `advanceTurn`, `advanceUntilImportantEvent`, `validateGameData`, `parseAndValidateMod` の公開名は維持。

## Parallel Work Assignment
- Worker A: systems分割
  - 担当: `turningPoints.ts`, `turnEngine.ts`
  - 書き込み範囲: `src/systems/turningPoints/*`, `src/systems/turnEngine/*`, 既存 façade files, 関連 tests
- Worker B: UI分割
  - 担当: `InfoTabs.tsx`, 必要なら `ActionControls.tsx`
  - 書き込み範囲: `src/ui/components/*`, UI helper files
- Worker C: types/schema/mod分割
  - 担当: `types/game.ts`, `validateGameData.ts`, `createModTemplate.ts`
  - 書き込み範囲: `src/types/*`, `src/schema/*`, `src/mods/*`
- 親エージェント:
  - plan保存、差分統合、循環import確認、最終テスト、Playwright確認を行う。
  - 既存未コミット変更はユーザー作業として扱い、巻き戻さない。

## Test Plan
- `npm test`
  - 既存49テストを維持。
  - 転機: 保証年齢、全choice不可除外、選択後state/logが不変。
  - 早送り: summary, major event, turning point停止が不変。
  - schema/mod: JSONC parsing, invalid condition/effect rejection, template importが不変。
  - UI: タブ切替、summary開閉、関係/組織/所持品/世界タブ表示が不変。
- `npm run build`
  - façade re-export後の型解決と循環importを確認。
- Playwright smoke:
  - desktop初期表示、転機表示、転機選択後、タブ全種、Modパネル、モバイル幅、言語切替。
  - 証跡スクショは `.tmp/playwright/` に保存し、完了報告で提示する。

## Assumptions
- 今回はリファクタのみ。ゲーム仕様、保存形式、Mod形式、UIデザインは変えない。
- CSS分割とschema `$defs` 共通化は別フェーズに回す。
- ファイル分割後も façade を残し、既存importを書き換える範囲を最小化する。
