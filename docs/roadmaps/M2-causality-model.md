# M2: 因果モデルの整理

## Summary

プレイヤー、NPC、世界が共通して参照できる因果軸を整理する。以後のイベント、転機、NPC関与、世界変動が同じ条件・効果モデルで扱えるようにする。

ここでは大量コンテンツを入れず、後続の人生イベント実装に耐える状態モデルを固める。

## Key Changes

- 共通の因果軸を整理する。
  - `lifeTags`
  - `traits`
  - `educationLevel`
  - `careerCategory`
  - `socialClass`
  - `affiliation`
  - relationship tags
  - world tags
- `conditions` を拡張する。
  - player状態を参照できる。
  - relationship状態を参照できる。
  - world状態を参照できる。
- `effects` を拡張する。
  - player tags / traits の付与・削除。
  - relationship tags / traits / bond の変化。
  - world tags / world values の変化。
- traitsは獲得、喪失、表示、条件判定まで実装する。
- 複雑なtraits自動発火ルールは後続に回し、1.0では条件・効果として扱う。

## Completion Criteria

- イベントと転機が、プレイヤー・NPC・世界の状態を条件にできる。
- イベントと転機が、プレイヤー・NPC・世界の状態を変更できる。
- traitsがUIに表示され、条件・効果で扱える。
- schema、Mod template、unit testsが拡張済み。

## Test Plan

- player tag / trait 条件のunit test。
- relationship tag / trait 条件のunit test。
- world tag / value 条件のunit test。
- effectsで各状態が変化することを確認する。
- 不正なcondition/effect targetをschema validationで拒否する。

## Assumptions

- 状態軸は増やしすぎず、まずイベント分岐に必要な最小セットにする。
- tagsは内部IDとして英語を維持する。
- 表示名はlocalisationに寄せる。

