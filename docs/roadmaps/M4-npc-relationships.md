# M4: NPC関係と主体的関与

## Summary

NPCを単なる背景ではなく、プレイヤーが主体的に関与できる対象にする。現状の「知らない人間が知らないことをしている」状態から、NPCがプレイヤー人生の一部として読める状態へ進める。

## Key Changes

- NPC状態を拡張する。
  - `ageMonths`
  - `educationLevel`
  - `careerCategory`
  - `affiliation`
  - `lifeTags`
  - `traits`
  - `bond`
  - `trust`
  - `dependency`
  - `conflict`
- NPCへの関与行動を追加する。
  - 支援する。
  - 相談する。
  - 距離を置く。
  - 誘う。
  - 庇う。
  - 裏切る。
  - 紹介する。
- NPC関与は通常行動とは別枠、または関係タブ内の選択として扱う。
- 関与結果はNPC人生、プレイヤーのタグ、関係値、後続イベント条件に反映する。
- NPCとの関係変化は構造化ログに残す。

## Completion Criteria

- プレイヤーが特定NPCを選び、主体的な関与行動を実行できる。
- 関与結果がNPC状態とプレイヤー状態に反映される。
- NPC関与によって後続イベントや転機条件が変わる。
- NPCログが履歴上で個人の人生の一部として読める。

## Test Plan

- NPC関与actionの条件判定。
- 関与実行による `bond`, `trust`, `dependency`, `conflict`, tags の変化。
- NPC状態を条件にしたイベント発火。
- NPC関与ログの構造化。
- export/import後にNPC状態が保持されること。

## Assumptions

- NPCは準プレイヤー級の完全AIにはしない。
- 毎ターン独自行動より、プレイヤー関与とイベント反映を重視する。
- 関係タブはM4以降、単なる表示ではなく操作面になる。

