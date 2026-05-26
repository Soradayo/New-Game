# 完成版1.0 ロードマップ

## 目的

完成版1.0は「一生を完走でき、選択の因果、NPCとの関係、世界変動、Mod導線、中規模コンテンツを備えた公開可能版」とする。

中核体験は「人生の因果」。転機、NPCへの主体的関与、世界変化、構造化ログが互いに接続され、プレイヤーが後から一人の人生として読み返せることを重視する。

## 文書運用

- `docs/roadmaps/` は長期ロードマップの保存場所。
- `docs/plans/` は直近実装計画の保存場所。
- `docs/plans/current-plan.md` には、このロードマップから切り出した次の具体実装計画だけを置く。
- 長期方針を更新する場合は、このディレクトリ内の該当マイルストーン文書を更新する。

## マイルストーン一覧

| Milestone | 文書 | 目的 |
| --- | --- | --- |
| M1 | [M1-structured-history.md](./M1-structured-history.md) | 構造化履歴ログ |
| M2 | [M2-causality-model.md](./M2-causality-model.md) | 因果モデルの整理 |
| M3 | [M3-turning-points-and-life-events.md](./M3-turning-points-and-life-events.md) | 転機と人生イベント |
| M4 | [M4-npc-relationships.md](./M4-npc-relationships.md) | NPC関係と主体的関与 |
| M5 | [M5-world-simulation.md](./M5-world-simulation.md) | 世界シミュレーションと世界イベント |
| M6 | [M6-mod-and-content-expansion.md](./M6-mod-and-content-expansion.md) | Mod導線とコンテンツ拡充 |
| M7 | [M7-ui-replay-qa.md](./M7-ui-replay-qa.md) | UI完成、リプレイ、QA |

## イベント実装方針

イベント実装は一括ではなく、役割ごとに分ける。

- M3: 個人史、関係性、進学、就職、所属、転機に接続する前後イベント。
- M5: 世界情勢、組織勢力、社会圧、景気、弾圧、宗教、労働運動などのイベント。
- M6: 量の拡充、バリエーション追加、Modサンプル、年代・階級・職業の穴埋め。

この分割により、M3では人生の分岐を先に感じられ、M5では世界が人生を曲げる感覚を追加できる。

## 1.0 目標量

- events: 100前後
- turningPoints: 20前後
- traits: 40前後
- items: 30前後

全コンテンツは localisation key 経由に統一する。

