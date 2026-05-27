# M3 実装計画: 進路・所属の転機と人生イベント縦切り

## Summary
- M3は全量ではなく「縦切り拡張」として実装する。
- 重点は進路と所属。進学、職業、組織所属、思想の分岐を増やし、選択ごとにログ・タグ・関係・能力・世界圧が変わる状態を作る。
- 目標量は turningPoints 6件前後、events 20件前後。M3ロードマップ目標量の残りは後続のM3増補またはM6へ回す。
- Playwright証跡スクショは `.tmp/playwright/` に保存し、完了報告で主要画像をMarkdown画像として提示する。

## Key Changes
- `turningPoints` に education / career / organization / relationship 寄りの転機を追加し、合計6件前後にする。
- `organization` categoryを `TurningPointDefinition` 型とJSON Schemaへ追加する。
- choiceは既存形式を維持し、条件、不可理由、結果説明、effects、grantsTags、NPC影響を持たせる。
- eventsを20件前後まで追加する。
- 追加イベントはM2のcondition DSLを使い、`lifeTags`, `traits`, `educationLevel`, `careerCategory`, `affiliation`, `relationship.*` によって人生差分が出るようにする。
- 追加する転機、choice、イベント、不可理由、NPCログ、タグ表示名を `ja.json` に追加し、`en.template.json` に同keyを空値で追加する。
- save構造は変えないため、save versionは `0.6-causality-hardening` のまま運用する。

## Test Plan
- Unit tests:
  - `organization` categoryのturningPointがschema validationを通る。
  - 新規転機の条件判定と選択不可理由が期待通り出る。
  - choice適用で educationLevel / careerCategory / affiliation / lifeTags / relationship / world.pressure が変化する。
  - 新規イベントが条件に応じて出現し、条件不一致では除外される。
  - 追加data全体が `validateGameData(baseRawGameData, "base")` を通る。
- Build:
  - `npm test`
  - `npm run build`
- Playwright smoke:
  - 初期表示、転機表示、転機選択後、モバイル表示を確認する。
  - 証跡スクショを `.tmp/playwright/m3-initial.png`, `.tmp/playwright/m3-turning.png`, `.tmp/playwright/m3-after-choice.png`, `.tmp/playwright/m3-mobile.png` として保存し、最終回答に画像として提示する。

## Assumptions
- 今回はM3の第一縦切りであり、M3ロードマップの最終目標量までは入れない。
- 重点は「進路と所属」。人間関係そのものへの主体的関与はM4で扱う。
- 世界情勢の大規模変動、組織勢力値、戦争・弾圧・景気などはM5へ回す。
- 追加コンテンツはすべてlocalisation key経由にする。
- Playwright証跡は一時成果物として `.tmp/playwright/` に置き、git管理には含めない。
