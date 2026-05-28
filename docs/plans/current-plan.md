# M4実装計画: NPC関係と主体的関与

## Summary
- 懸念は、M4がNPC完全シミュレーションへ膨らむこと、即時実行の連打でバランスが崩れること、関与が後続イベントに接続されず数字操作で終わること。
- M4初回は「関係タブ内でNPCを選び、即時に1回関与でき、その結果がNPC状態・ログ・後続条件に残る」縦切りに絞る。
- NPC関与は即時実行。ただし各NPCにつき1ターン1回まで。
- save構造を変えるため、save versionを上げ、旧saveは破棄する。

## Key Changes
- NPC状態を拡張する。
  - `Relationship` に `trust`, `dependency`, `conflict`, `lastInteractionTurn` を追加する。
  - 初期NPCにも各値を設定する。
  - save version は `0.7-npc-interactions` に上げ、import時に新フィールドを検証する。
- `npcInteractions` データを追加する。
  - base dataに `support`, `consult`, `keep-distance`, `invite`, `cover`, `betray`, `introduce` の7種を入れる。
  - 各interactionは `id`, `labelKey`, `descriptionKey`, `conditions`, `effects`, `logKey` を持つ。
  - effectsは対象NPCへの `bond/trust/dependency/conflict` 変化、NPC tags/traits、player tags/traits、money/stats/world pressure を扱えるようにする。
- 実行システムを追加する。
  - `performNpcInteraction(state, data, relationshipId, interactionId)` を作る。
  - 条件不一致、存在しないNPC、同一NPCへの同ターン再実行は日本語エラーにする。
  - 実行結果は即時にstateへ反映し、`sourceType: "npcInteraction"` の構造化ログを追加する。
- UIは関係タブ内に置く。
  - 関係タブでNPCカードごとに関与ボタンを表示する。
  - 実行済みNPCのボタンはそのターン中disabledにする。
  - 右側の人間関係パネルは一覧表示のまま維持し、操作は増やさない。
- 後続イベントを追加する。
  - 支援、相談、距離、庇護、裏切り、紹介に対応する少数のfollow-up eventを追加する。
  - NPC状態やinteractionで付与されたtagsを条件にし、関与が人生ログに戻ってくるようにする。

## Public Interfaces
- `GameState.relationships[]` は新フィールドを持つ。
- `GameData` / `RawGameData` / `ModData` に `npcInteractions` を追加する。
- Storeに `performNpcInteraction(relationshipId, interactionId)` を追加する。
- JSON Schemaに `npc-interaction.schema.json` を追加し、`game-data.schema.json` から検証する。
- Mod templateに `npcInteractions` と localisation の記述例を追加する。
- 既存の通常行動、姿勢、転機、イベント、Mod import形式は維持する。

## Test Plan
- Unit tests:
  - NPC関与の条件判定、同一NPCへの1ターン1回制限。
  - `bond/trust/dependency/conflict`, tags, traits, money/stats/world effects の反映。
  - `sourceType: "npcInteraction"` の構造化ログ生成。
  - NPC関与後のfollow-up event発火。
  - save export/importで新NPC状態が保持される。
  - `0.6-causality-hardening` 以前のsaveが拒否される。
  - `npcInteractions` Mod schema validation。
- UI tests:
  - 関係タブに関与ボタンが表示される。
  - 実行後に同じNPCのボタンがdisabledになる。
  - ログと関係値が即時更新される。
- Verification:
  - `npm test`
  - `npm run build`
  - Playwright smoke: 関係タブ、NPC関与、ログ更新、次ターン後の再実行、モバイル幅、console warning/errorなし。
  - 証跡スクショを `.tmp/playwright/` に保存する。

## Assumptions
- M4初回ではNPCの毎ターン自律AIは作らない。
- NPC関与は即時実行、各NPC1回/ターン。
- 関与UIは関係タブ内に置く。
- M4ではNPC関与の因果を優先し、大規模な世界変動や組織勢力値はM5へ回す。
