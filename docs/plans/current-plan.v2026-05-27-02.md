# Localisation基盤 実装計画

## Summary
- Paradox系の `localisation` フォルダに近い形で、UI文言・表示名・ゲーム本文を専用フォルダへ集約する。
- 初回は `ja` を完全移行し、`en` は空テンプレートとして同梱する。
- actions/events/turningPoints/items/traits などのデータJSONから日本語本文を抜き、`locKey` 経由で表示する。
- 言語切替UIを追加し、選択言語はゲームセーブではなくUI設定として `localStorage` に保存する。
- 既存履歴ログは生成済みテキストとして保持し、言語変更後は新規ログから選択言語を使う。

## Key Changes
- `src/localisation/` を新設する。
  - `ja.json`: 既存の日本語文言を全て移動する正本。
  - `en.template.json`: 同じkey構造を持つ空文字または未翻訳テンプレート。
  - `index.ts`: locale packの読み込み、選択中locale、翻訳関数、欠落key表示を提供する。
- 文言keyは安定IDベースにする。
  - UI: `ui.header.name`, `ui.actions.nextTurn`, `ui.tabs.history`
  - 表示名: `enum.lifePhase.childhood`, `enum.ability.body`, `enum.region.industrial`
  - content: `action.study.label`, `event.factory-bell.template`, `turning.first-school-crossroad.choice.support-household.outcomeSummary`
  - system log/error: `system.error.oldSave`, `system.log.modImported`, `system.fastForward.moneyUp`
- データJSONは文言フィールドを `locKey` 系へ置き換える。
  - `label` -> `labelKey`
  - `description` -> `descriptionKey`
  - `template` -> `templateKey`
  - 転機choiceの `reason`, `outcomeSummary`, `npcOutcomes.log` もkey化する。
  - `names.given` / `names.family` はlocale依存の生成素材として localisation pack に移す。`names.npcRoles` はIDなので data 側に残す。
- 実行時は raw data + locale pack から従来互換の `GameData` を生成する。
  - systems側は当面 `label`, `description`, `template` を持つhydrated dataを受け取るため、ターン進行ロジックの変更を最小にする。
  - locale切替時は `createContent(mods, locale)` 相当で表示用dataを再生成し、stateは維持する。
- UIに言語設定を追加する。
  - ヘッダーまたは操作領域に小さな `言語` segmented control を置く。
  - 初期選択は `ja`。
  - `en` 選択時、未翻訳keyは `missing:<key>` と表示する。
- Mod対応を更新する。
  - Mod templateは `labelKey` 等を使う形式へ更新する。
  - Mod JSONに `localisation` セクションを追加できるようにする。
  - Mod読み込み時は data と localisation を両方mergeする。
- schema/typeを更新する。
  - TypeScriptに raw definition 型と hydrated runtime 型を分ける。
  - JSON Schemaは `labelKey`, `descriptionKey`, `templateKey`, `localisation` を検証対象にする。
  - `docs/schema/localisation.schema.json` を追加する。

## Test Plan
- Unit tests:
  - `ja.json` の全keyでhydrated dataが作れる。
  - 欠落keyは `missing:<key>` になる。
  - `actions/events/turningPoints/items/traits` の日本語文言が localisation 経由で表示される。
  - locale切替後も `state`, selected action/stance, history は保持される。
  - 言語切替後の新規ログは新localeで生成される。
  - Mod templateがparse/validate/mergeでき、Mod localisationが反映される。
- Build:
  - `npm test`
  - `npm run build`
- Browser smoke:
  - 初期表示は従来どおり日本語。
  - 言語を `en` に切り替えると未翻訳keyが見える。
  - `ja` に戻すと日本語表示へ戻る。
  - 次ターン、転機、タブ、Modパネルが壊れていない。

## Assumptions
- localisation形式はJSON。
- 初回同梱言語は `ja` と `en.template`。
- 既存履歴ログは再翻訳しない。言語変更後の新規ログだけ選択言語を使う。
- localisation key欠落時はfallbackせず、`missing:<key>` を表示する。
- save versionは上げない。言語設定はsave payloadではなくUI設定localStorageで管理する。
