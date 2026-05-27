# M2後始末 実装計画: 因果モデルの境界強化

## Summary
- Game Studioレビューで出た P1/P2 をまとめて修正する。
- 状態に表示文言が混ざる問題を解消し、`affiliation` / tags / traits を内部IDとして扱う。
- Mod schemaを厳格化し、壊れたcondition/effectが実行時に無音で混ざらないようにする。
- save構造の意味が変わるため、save versionを `0.6-causality-hardening` に上げ、旧saveは破棄する。

## Key Changes
- `player.affiliation` / `relationship.affiliation` の初期値は表示文ではなく `"none"` にする。
- UIでは `affiliation.<id>.label` または既存 `world.affiliation.none` を解決し、欠落時はIDを表示する。
- `lifeTags` / `world.tags` は `tag.<id>.label` をlocalisationから解決し、欠落時はIDを表示する。
- 右側の人間関係パネルでは `lifeTags` と `traits` を混在表示せず、短い別行表示に分ける。
- 転機中のモバイルsticky操作バーは非表示、または転機overlayより下のz-indexにして、割り込み選択を優先する。
- `readConditionValue()` が `undefined` を返す場合、`eq` / `neq` / 数値比較 / membership はすべてfalseにする。
- `all` / `any` はschemaで `minItems: 1` を要求する。
- `condition.schema.json` は numeric / string / list condition を `oneOf` で分離する。
- `effect.schema.json` は target種別ごとに value型を分離する。
- `world.region`, `educationLevel`, `careerCategory` は既存enum値のみ許可する。
- `relationship.all.affiliation/careerCategory/educationLevel` はschemaで拒否する。
- `SAVE_VERSION` を `0.6-causality-hardening` に更新する。
- import時に tags/traits/lifeTags が string[] で、`affiliation` が空でないstringであることを検証する。

## Test Plan
- Unit tests:
  - 初期 `affiliation` が `"none"` で、UI表示は日本語の「なし」になる。
  - `affiliation eq "none"` が成立する。
  - 存在しない `relationship.<id>.* neq ...` がfalseになる。
  - 不正effectをschemaで拒否する。
  - 不正conditionをschemaで拒否する。
  - `relationship.all.affiliation` 系effectをschemaで拒否する。
  - save importで string[] 以外の tags/traits を拒否する。
  - `0.5-causality` 以前のsaveを拒否する。
- UI tests:
  - lifeTags / world.tags がlocalisation経由で表示され、未翻訳IDでも落ちない。
  - 人間関係パネルで経歴タグと特性が区別される。
  - モバイル幅で転機中にsticky操作バーが転機選択を覆わない。
- Verification:
  - `npm test`
  - `npm run build`
  - Playwright smoke: 初期表示、転機表示、タグ表示、言語切替、console error/warningなし。

## Assumptions
- P3の「因果情報を所持品タブから独立させる」再設計はM3前のUI整理に回す。
- tagsは `tag.<id>.label` のlocalisation解決を標準とし、欠落時はID表示にする。
- `affiliation` は当面自由な内部ID文字列を許すが、既知IDはlocalisationで表示名を持たせる。
- Runtime側ではschemaを通過したデータを前提にしつつ、save importだけは破損データ防御を強める。
