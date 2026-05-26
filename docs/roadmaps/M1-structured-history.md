# M1: 構造化履歴ログ

## Summary

履歴ログを、表示済み本文だけでなく、再翻訳、リプレイ、要約表示、因果分析に耐える構造へ拡張する。

このマイルストーンは以後の転機、NPC、世界イベントの土台になる。先にログ構造を固めることで、後続実装で「何が起きたか」を失わないようにする。

## Key Changes

- `HistoryEntry` を構造化する。
  - `text`: 既存互換の表示済み本文。
  - `locKey`: 再翻訳用の文言key。
  - `params`: 表示文生成に使った値。
  - `sourceId`: event、turningPoint、interactionなどの発生元ID。
  - `sourceType`: `event`, `turningPoint`, `npcInteraction`, `world`, `system`, `summary` など。
  - `stateDiff`: 金、能力、関係、タグ、世界値などの変化要約。
  - `importance`: `minor`, `normal`, `major`, `turningPoint`。
  - `summaryGroupId`: 高速進行時に要約ログと実ログを結びつけるID。
- 新規ログは構造化情報から生成する。
- 表示済み `text` は互換と履歴固定のため保持する。
- 高速進行は、要約ログと実ログを両方保持する。
- UIでは要約ログを開閉できるようにする。
- save versionを上げ、旧saveは破棄して新初期状態から開始する。

## Completion Criteria

- 新規ログが構造化情報を持つ。
- 通常ターン、転機、Mod読み込み、高速進行ログが同じ履歴モデルに乗る。
- 高速進行後、要約ログと実ログの対応が追える。
- localisation切替後も、構造化された新規ログは再表示可能な情報を保持する。

## Test Plan

- 構造化ログ生成のunit testを追加する。
- `locKey`, `params`, `sourceId`, `sourceType`, `importance` が保存されることを確認する。
- 高速進行で要約ログと実ログが同じ `summaryGroupId` を持つことを確認する。
- save version不一致時に旧saveが破棄されることを確認する。
- export/import後に構造化履歴が保持されることを確認する。

## Assumptions

- 旧saveの自動移行は行わない。
- 既存履歴の完全再翻訳は1.0範囲外。
- `text` は履歴の固定表示として残し、`locKey` と `params` は再表示・分析用に使う。

