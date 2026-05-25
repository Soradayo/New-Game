# イベントシステム

## 概要

イベントは創発的な人生の物語を生みます。

イベントは重み付きで、データ駆動です。

## 要件

イベントは必ず次を満たします:

- JSON-based である
- weighted probability を使う
- mods をサポートする
- 短く、解釈しやすい

イベント頻度は変化しなければなりません。

重大イベントはまれでなければなりません。

## 設計

イベント構造:

- conditions
- weight
- effects
- text template

カテゴリ:

- daily
- relationship
- turning point
- world

関係変化は、おおよそ MTTH 3ターンを目標にします。

ログは簡潔に保ちます。
