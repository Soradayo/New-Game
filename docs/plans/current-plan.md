# プラン文書化運用と転機システム実装計画

## Summary
- 実装前に `docs/plans/` を新設し、作業中に参照する現行計画を `docs/plans/current-plan.md` として保存する。
- 今後、新しい版のプランを作る時は、既存の `current-plan.md` を日付＋番号つきファイルへコピー/リネームしてバックアップする。
- その後、前回合意した「転機・経歴・NPC人生システム」の縦切り実装に入る。

## Plan Document Rules
- 現行プラン:
  - `docs/plans/current-plan.md`
  - 常に次に実装する合意済み計画を置く。
  - 作業中はこのファイルを参照元にする。
- 旧版バックアップ:
  - 形式: `docs/plans/current-plan.vYYYY-MM-DD-XX.md`
  - 例: `docs/plans/current-plan.v2026-05-26-01.md`
  - 新しいプランを作る前に、現行プランをこの形式で退避する。
- 初回作成:
  - `docs/plans/` がなければ作成する。
  - `current-plan.md` に今回の「転機・経歴・NPC人生システム 全体方針と次フェーズ計画」を保存する。
  - 初回は旧版がないためバックアップは作らない。

## Implementation Changes
- 転機システム:
  - `pendingTurningPoint` をゲーム状態に追加し、未選択の転機がある間は通常ターン進行を止める。
  - 転機は最低保証つきランダムで発火する。
  - 選択結果は経歴タグ、教育段階、職業カテゴリ、能力、金、関係、NPC状態へ反映する。
- データ/Mod:
  - `turningPoints` データを追加し、JSON Schema + Ajv 検証対象にする。
  - choiceには選択条件、不可理由、抽象的な結果説明、効果、付与タグを持たせる。
- Player/NPC:
  - Playerに `educationLevel`, `careerCategory`, `lifeTags` を追加する。
  - NPC/Relationshipに軽量人生状態を追加する。
- UI:
  - 転機発生時は白黒基調の割り込みパネルを表示する。
  - 選べない選択肢も表示し、理由を添える。
  - 効果予告は数値ではなく抽象表現にする。
- Save:
  - save versionを上げる。
  - 旧saveは読み込まず、日本語版の新初期状態から開始する。

## Test Plan
- `npm test`
  - 転機候補の条件判定。
  - 最低保証つきランダム発火。
  - 選択不可理由の生成。
  - choice適用による経歴タグ、教育段階、職業カテゴリ、NPC状態の変化。
  - turningPoints Mod検証。
  - 旧save versionの破棄。
- `npm run build`
- Browser smoke:
  - 転機パネルが出る。
  - 選ぶまで次ターンへ進めない。
  - 選択後にログ、状態、タグが更新される。
  - reload後も新save構造で復元される。

## Assumptions
- プラン文書の保存場所は `docs/plans/`。
- 現行プラン名は `current-plan.md`。
- バックアップ名は `current-plan.vYYYY-MM-DD-XX.md`。
- まず実装する縦切りは、進学転機1種、職業転機1種、NPC変化、保存、Mod検証まで。
