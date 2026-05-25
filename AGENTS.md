# AI エージェント向け作業指示（PowerShell 5.1 / NoProfile）

# 

# \- 適用範囲: このファイルが置かれたフォルダ配下すべて。

# 

# \- UTF-8 実行ラッパ（必須・毎回付与）

# &#x20; - 形式（`<COMMAND>` を実コマンドに置換）:

# &#x20;   - `\[Console]::InputEncoding=\[Text.UTF8Encoding]::new($false); \[Console]::OutputEncoding=\[Text.UTF8Encoding]::new($false); $OutputEncoding=\[Text.UTF8Encoding]::new($false); chcp 65001 > $null; \& { <COMMAND> }`

# 

# \- ファイル書き込みの Encoding 指定（必須）

# &#x20; - `Out-File -Encoding utf8` / `Set-Content -Encoding utf8` / `Add-Content -Encoding utf8`



# 

# AGENTS.md

## プロジェクト概要

このプロジェクトは、ブラウザで動作するオフライン対応のテキスト駆動ライフシミュレーションゲームです。

プレイヤーは、産業化、資本主義、宗教制度、台頭する革命思想に影響を受けた、近代に近い架空世界で一生を過ごします。

目的は勝利ではありません。ひとつの人生を解釈することです。

このプロジェクトは、リプレイ性、因果、創発的な物語、Mod対応を重視します。

## 中核思想

優先すること:

* プレイヤーによる解釈
* リプレイ性
* 因果
* 創発的な物語
* 軽量なアーキテクチャ
* JSON-driven content
* Modしやすさ
* 保守性
* 小さく再利用しやすいコンポーネント

避けること:

* ハードコードされた分岐ロジック
* 巨大なファイル
* 過剰な継承
* 現実らしさのための複雑すぎるシミュレーション
* 不要な抽象化
* ゲームエンジン風の過剰設計
* ランタイムAI生成コンテンツ

## 技術ルール

スタック:

* TypeScript
* React
* Vite
* Zustand
* TailwindCSS

ゲームは完全にオフラインで動作しなければなりません。

ゲームエンジンは導入しません。

コードはモジュール化し、小さなファイルに分割します。

純粋関数を優先します。

## Data-first architecture

ゲームコンテンツはデータ駆動でなければなりません。

可能な限り、すべてのコンテンツはJSONに置きます。

例:

* events
* traits
* organizations
* nations
* items
* text templates

ゲームコンテンツをソースコードにハードコードすることは避けます。

ロジックはコンテンツを直接記述するのではなく、データを解釈します。

## Mod対応

Modは第一級の要件です。

Modはプレーンテキストエディタで作成できなければなりません。

ModはJSONだけで作れるべきです。

MVPでは、Lua、JS実行、evalなどのスクリプト言語は使いません。

ゲーム起動時に base data と mod data をマージします。

## イベントシステムのルール

ネストした条件分岐より、重み付き計算を優先します。

if/else の連鎖は避けます。

使用するもの:

* conditions
* weights
* effects
* templates

イベントは解釈しやすく、短く、再利用しやすいものにします。

結果を説明しすぎないようにします。

プレイヤーの想像の余地を残します。

## UI方針

テキストファーストのUIにします。

キャラクター画像は使いません。

数値はゲームプレイを支えますが、ログを主役にします。

ログは簡潔に保ちます。

長すぎる散文は避けます。

## 保存

必須機能:

* autosave
* import save
* export save

JSON export は必須です。

version フィールドを使い、後方互換性を考慮します。

## コーディングスタイル

ファイルは小さく保ちます。

責務は積極的に分割します。

組み合わせ可能なシステムを優先します。

「god class」は作りません。

常に Codex のコンテキスト効率を意識します。

