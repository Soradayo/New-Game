# M1 実装計画: 構造化履歴ログ

## Summary
- `HistoryEntry` を表示文中心から構造化ログへ移行する。
- 既存の `eventId` / `category` は廃止し、`sourceId` / `sourceType` / `importance` / `locKey` / `params` / `stateDiff` に置き換える。
- 高速進行では、要約ログと実ログを同じ `summaryGroupId` で結び、UIでは要約を開閉して実ログを確認できるようにする。
- save versionは `0.4-history` に上げ、旧saveは読み込まず新初期状態から開始する。

## Key Changes
- `HistoryEntry` を次の形へ更新する。
  - `id`, `turn`, `ageMonths`, `text`
  - `locKey?: string`
  - `params?: Record<string, string | number>`
  - `sourceId: string`
  - `sourceType: "event" | "turningPoint" | "npcInteraction" | "world" | "system" | "summary"`
  - `importance: "minor" | "normal" | "major" | "turningPoint"`
  - `stateDiff?: HistoryStateDiff[]`
  - `summaryGroupId?: string`
  - `hiddenBySummary?: boolean`
- `HistoryStateDiff` はM1では要約差分に留める。
- hydrated `EventDefinition` に `templateKey` を残し、通常イベントログの `locKey` として保持する。
- 転機ログ、転機選択ログ、NPC転機ログ、Mod読み込みログ、openingログ、no-eventログ、高速進行要約ログをすべて新モデルで生成する。
- `events.ts` と `turnEngine.ts` の既存 `eventId` 参照は `sourceId/sourceType` に置換する。
- 高速進行の実ログは削除せず、同じ `summaryGroupId` と `hiddenBySummary: true` を付ける。
- import時に新HistoryEntry必須フィールドの最低限検証を追加する。

## UI Changes
- 履歴タブで `sourceType` と `importance` を使い、ログ種別を判別できるようにする。
- `hiddenBySummary` の実ログは通常一覧では折りたたむ。
- summaryログには開閉ボタンを表示する。
- 開いた場合、同じ `summaryGroupId` を持つ実ログを時系列で表示する。
- 既存の白黒基調を維持し、見た目の大きな再設計はしない。

## Test Plan
- Unit tests:
  - 通常イベントログが `sourceType: "event"`, `sourceId`, `locKey`, `params`, `importance` を持つ。
  - major eventが `importance: "major"` になる。
  - no-eventログが `sourceType: "system"` で生成される。
  - 転機発生ログと転機選択ログが `sourceType: "turningPoint"` になる。
  - Mod読み込みログが `sourceType: "system"` になる。
  - cooldownと直前重複回避が `sourceId/sourceType` で動く。
  - 高速進行でsummaryログと実ログが同じ `summaryGroupId` を持つ。
  - 高速進行の実ログに `hiddenBySummary: true` が付く。
  - save export/importで構造化履歴が保持される。
  - `0.3-ja` 以前のsaveが拒否される。
- UI tests:
  - 履歴にsummaryログが表示される。
  - summaryを開くと実ログが表示される。
  - summaryを閉じると実ログが隠れる。
- Build:
  - `npm test`
  - `npm run build`

## Assumptions
- `eventId` / `category` はM1で廃止し、テストも新フィールド前提に更新する。
- 旧saveの自動移行はしない。
- `text` は履歴固定表示として残す。
- M1では完全なbefore/after diffは作らず、要約差分だけ保存する。
- 既存履歴の完全再翻訳UIはM1範囲外。新規ログが再翻訳可能な情報を持つところまでを対象にする。
