# コアゲームループ

## 概要

ゲームプレイはターン制です。

各ターンは人生の一定期間を表します。

時間の解像度はライフステージによって変わります。

## 要件

ライフフェーズは必ず存在します:

- childhood
- youth
- young adulthood
- adulthood
- old age

ターン速度はフェーズごとに変化しなければなりません。

各ターンでは必ず次を選べます:

- action selection
- stance selection
- optional item usage

## 設計

ライフフェーズ:

Childhood:

6 months per turn

Youth:

3 months per turn

Young adulthood:

half-month per turn

Adulthood:

1 month per turn

Old age:

1 year per turn

ターン順:

1. age progression
2. passive state updates
3. player action
4. growth
5. relationship updates
6. event resolution
7. NPC behavior
8. log generation
