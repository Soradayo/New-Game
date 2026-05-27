# M2 実装計画: 因果モデルと条件式DSL

## Summary
- プレイヤー、NPC、世界が共通して使える因果軸を追加する。
- `conditions` は既存配列ANDを維持しつつ、単体conditionに `all` / `any` / `not` を持てる最小DSLへ拡張する。
- traitsは「所有状態 + 条件判定 + effectsによる付与/削除」まで実装し、常時効果や自動発火はまだ入れない。
- save versionは状態構造が変わるため `0.5-causality` に上げ、旧saveは破棄する。

## Key Changes
- `Player` に `traits: string[]` を追加する。
- `Relationship` に `traits: string[]`, `affiliation: string` を追加する。
- `WorldState` に `tags: string[]` を追加する。
- 既存の `lifeTags` は維持し、経歴・人生分岐タグとして扱う。
- `Condition` は既存形式 `{ target, op, value }` に加え、`{ all: Condition[] }`, `{ any: Condition[] }`, `{ not: Condition }` を受け付ける。
- `conditions: Condition[]` は引き続き暗黙ANDとして扱う。
- condition targetを数値、文字列等価、リスト所属判定へ拡張する。
- effect targetを player / relationship / relationship.all / world のタグ・traits・所属・進路変更へ拡張する。
- traits / lifeTags / world tags をUIに表示する。
- `condition.schema.json` と `effect.schema.json` を拡張し、Mod templateにもDSLとタグ・trait付与例を追加する。
- `SAVE_VERSION = "0.5-causality"` に更新し、旧saveは読み込まない。

## Test Plan
- Unit tests:
  - `all`, `any`, `not` が期待通り判定される。
  - numeric/string/list conditionが判定される。
  - player lifeTags / traits の付与・削除。
  - relationship lifeTags / traits / affiliation / career / education の変更。
  - world tags / region の変更。
  - traits所有状態がsave export/importで保持される。
  - 旧save versionが拒否される。
  - 不正なcondition/effect targetがschema validationで拒否される。
- UI tests:
  - プレイヤー/NPC/world tagsとtraitsが表示される。
  - 未知trait idが落ちずに表示される。
- Build:
  - `npm test`
  - `npm run build`
- Playwright smoke:
  - 初期表示が崩れない。
  - 転機選択後、タグやtraits表示領域が破綻しない。
  - console error/warning がない。

## Assumptions
- `conditions: []` は今まで通り「条件なし」とする。
- 既存データはなるべくそのまま動かす。
- traitsの常時effects反映、自動獲得、自動喪失はM2範囲外。
- NPCへの主体的関与はM4範囲外。
- 世界値の本格拡張はM5範囲外。ただし `world.tags` と `world.region` はM2で条件・効果対象にする。
