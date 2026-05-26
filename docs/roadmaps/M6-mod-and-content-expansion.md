# M6: Mod導線とコンテンツ拡充

## Summary

M3とM5で作ったイベント群を増補し、完成版1.0の中規模コンテンツ量へ到達させる。同時に、Mod作者が構造を理解しやすい導線を整える。

## Key Changes

- Mod導線を整備する。
  - テンプレート作成。
  - schema検証。
  - 日本語エラー表示。
  - docs整備。
  - サンプルMod同梱。
- アプリ内JSONエディタは1.0範囲外とする。
- 編集は外部エディタ前提にする。
- M3/M5で入れたイベント群を増補する。
- 足りない年代、階級、職業、地域、関係性の穴を埋める。
- 全コンテンツをlocalisation key経由に統一する。

## Content Target

- events: 100前後。
- turningPoints: 20前後。
- traits: 40前後。
- items: 30前後。

## Completion Criteria

- Mod templateから有効なModを作れる。
- 壊れたModはschema validationで拒否され、日本語エラーが出る。
- サンプルModが読み込める。
- 1.0目標量に近いコンテンツが揃う。
- コンテンツが特定年代や階級に偏りすぎていない。

## Test Plan

- Mod templateのparse/validate/merge。
- サンプルModの読込。
- 壊れたModの拒否。
- localisation付きModの表示。
- 追加コンテンツのschema validation。
- 複数周回でイベント分布に明らかな破綻がないこと。

## Assumptions

- スクリプトModは1.0範囲外。
- JSON-only方針を維持する。
- Mod制作体験は、アプリ内編集より「理解しやすいテンプレートとエラー」を優先する。

