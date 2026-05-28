# M4後始末 実装計画: NPC関与UIと因果の締め

## Summary
- M4初回実装は維持し、保存構造・Mod形式・NPC関与データ形式は変更しない。
- 後始末の主目的は、関係タブの過密さを解消し、NPC関与が「操作できる関係」として読みやすくなる状態に整えること。
- 関係タブは「NPC一覧 + 選択NPCの詳細/関与パネル」へ変更する。
- save version は `0.7-npc-interactions` のまま据え置く。

## Key Changes
- 関係タブUIを整理する。
  - NPCカードには名前、役割、絆/信頼/依存/対立、タグ概要だけを表示する。
  - NPCカードを選択すると、同一タブ内の詳細パネルにそのNPCの経歴、特性、所属、関与ボタンを表示する。
  - モバイルでは一覧の下に詳細パネルを置き、7関与ボタンがNPCごとに重複表示されないようにする。
- NPC関与の可用性表示を改善する。
  - 実行済み、条件不足、実行可能をボタン状態と短い文言で区別する。
  - disabled理由は `getNpcInteractionAvailability` の結果をUIで表示できる形に整える。
  - 関与実行後は選択NPCの詳細と右側の関係一覧が即時更新される。
- 因果の読み返しを少し強化する。
  - `npcInteraction` ログは履歴上で薄い種別ラベルを出す。
  - stateDiff の `bond/trust/dependency/conflict` は日本語表示名で読めるようにする。
  - follow-upイベントは既存7件を維持し、追加コンテンツ増量はM4拡張またはM6へ回す。
- 既存仕様は維持する。
  - NPC関与は即時実行。
  - 各NPCにつき1ターン1回。
  - 右側の人間関係パネルは操作なしの概要一覧のまま。
  - save version、JSON Schema、Mod templateの構造は変更しない。

## Test Plan
- Unit tests:
  - `getNpcInteractionAvailability` が実行済み/条件不足/実行可能を区別する。
  - NPC関与ログの `stateDiff` が `bond/trust/dependency/conflict` を保持する。
  - save export/import は `0.7-npc-interactions` のまま通る。
- UI tests:
  - 関係タブでNPCを選択すると詳細パネルが切り替わる。
  - 選択NPCだけに関与ボタンが表示される。
  - 関与実行後、同じNPCのボタンがdisabledになり、次ターン後に再実行可能になる。
- Verification:
  - `npm test`
  - `npm run build`
  - Playwright smokeで、初期表示、関係タブ、NPC選択、関与実行、次ターン後の再実行、モバイル幅、console warning/errorなしを確認する。
  - 証跡スクショを `.tmp/playwright/m4-cleanup-*.png` に保存し、完了報告で提示する。

## Assumptions
- 今回はM4の体験面の後始末であり、NPC自律AIや新しい関与種類は追加しない。
- 関係UIは「選択式詳細」を採用する。
- M5の世界シミュレーション設計にはまだ入らない。
- 既存のM4実装差分と前回リファクタ差分はユーザー作業として保持し、巻き戻さない。
