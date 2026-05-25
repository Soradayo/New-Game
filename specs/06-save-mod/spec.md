# 保存とModシステム

## 概要

保存の可搬性とMod対応は第一級の機能です。

## 要件

保存システムは必ず次をサポートします:

- autosave
- import
- export

JSON export は必須です。

Modは必ず次を満たします:

- JSON-only である
- テキストエディタで扱える
- 動的に読み込める

## 設計

保存例:

{
  "version": "0.1",
  "player": {},
  "world": {},
  "history": [],
  "turn": 0
}

Mods:

mods/

- my_mod/
  - events.json
  - items.json
  - traits.json
