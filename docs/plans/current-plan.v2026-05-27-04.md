# M1後始末 実装計画

## Summary
- M1で導入した構造化ログを、プレイヤー向けに読みやすく整える。
- Game Studioレビューで見えたモバイル導線の弱さを、下部sticky操作バーで補う。
- Playwright確認で残った `.tmp/` を運用上の一時成果物として整理し、gitに混ざらない状態にする。
- M2の因果モデル実装へ進む前に、M1の体験面と作業環境の粗を落とす。

## Key Changes
- 通常ログでは `[出来事 / 通常]` のような機械的表示を隠す。
- `turningPoint`, `summary`, `major`, `world`, `npcInteraction` のように意味がある場合だけ、薄い種別ラベルを表示する。
- `LifeLogPanel` と履歴タブで同じ判定方針を使う。
- `内訳を表示` / `内訳を閉じる` をリンク風ではなく、小さな白黒ボタンとして表示する。
- モバイル幅では `次の期間へ`, `重要な出来事まで`, `Mod` を画面下部stickyに表示する。
- sticky操作バーは転機発生中には通常進行ボタンをdisabledにする。
- デスクトップでは既存の操作配置を維持し、余計な重複表示を避ける。
- `.tmp/` を `.gitignore` に追加する。
- Playwrightの一時出力先は今後も `.tmp/playwright` を使う前提にする。

## Test Plan
- Unit/UI tests:
  - 通常ログでは種別ラベルが表示されない。
  - summaryログでは種別ラベルと開閉ボタンが表示される。
  - summaryを開くと `hiddenBySummary` の実ログが表示され、閉じると隠れる。
- Build:
  - `npm test`
  - `npm run build`
- Playwright smoke:
  - 初期表示が崩れない。
  - `重要な出来事まで` 後に要約ログが表示される。
  - 要約ログの開閉ができる。
  - 390px幅で下部sticky操作バーが表示され、主操作が画面初期状態から到達可能。
  - console error/warning がない。

## Assumptions
- M1後始末では履歴データ構造そのものは変更しない。
- save versionは変更しない。
- M2の因果モデル、traits拡張、NPC関与システムには入らない。
- モバイルstickyには主要操作だけを置き、保存/読込/リセットは既存操作領域に残す。
