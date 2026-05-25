分割はかなり良い判断です。



Codexは巨大1ファイル仕様書より、



「役割ごとに分かれた小さいMarkdown」



の方が安定します。AGENTS.mdで全体ルールを固定し、仕様を複数Markdownに分けるのはCodex向きの運用です。



あなたのケースなら、



/specs

&#x20; /00-project

&#x20; /01-architecture

&#x20; /02-core-loop

&#x20; /03-world

&#x20; /04-events

&#x20; /05-ui

&#x20; /06-save-mod

&#x20; /07-mvp

AGENTS.md



くらいがちょうど良いです。



以下、そのまま保存できる内容にします。



AGENTS.md

\# AGENTS.md



\## Project overview



This project is a browser-based, offline, text-driven life simulation game.



The player lives through a full life in a near-modern fictional world inspired by industrialization, capitalism, religious institutions, and emerging revolutionary ideas.



The goal is not victory. The goal is interpretation of a life.



The project prioritizes replayability, causality, emergent storytelling, and mod support.



\## Core philosophy



Prioritize:



\- player interpretation

\- replayability

\- causality

\- emergent narratives

\- lightweight architecture

\- JSON-driven content

\- mod friendliness

\- maintainability

\- small reusable components



Avoid:



\- hardcoded branching logic

\- giant files

\- excessive inheritance

\- complex simulation for realism

\- unnecessary abstraction

\- engine-style overengineering

\- AI-generated runtime content



\## Technical rules



Stack:



\- TypeScript

\- React

\- Vite

\- Zustand

\- TailwindCSS



The game must work fully offline.



Do not introduce game engines.



Keep code modular and split into small files.



Prefer pure functions.



\## Data-first architecture



Game content MUST be data-driven.



All content should live in JSON whenever possible.



Examples:



\- events

\- traits

\- organizations

\- nations

\- items

\- text templates



Avoid hardcoded game content in source code.



Logic should interpret data rather than encode content.



\## Mod support



Modding is a first-class requirement.



Mods must be creatable using plain text editors.



Mods should require JSON only.



No scripting language (Lua, JS execution, eval) for MVP.



Game startup should merge base data + mod data.



\## Event system rules



Prefer weighted calculations over nested conditions.



Avoid if/else chains.



Use:



\- conditions

\- weights

\- effects

\- templates



Events should be interpretable, short, and reusable.



Do not over-explain outcomes.



Leave room for player imagination.



\## UI philosophy



Text-first UI.



No character graphics.



Numbers support gameplay but logs are primary.



Keep logs concise.



Avoid long prose.



\## Saving



Must support:



\- autosave

\- import save

\- export save



JSON export is mandatory.



Backward compatibility should be considered using version fields.



\## Coding style



Keep files small.



Split responsibilities aggressively.



Prefer composable systems.



Never create “god classes”.



Always think about Codex context efficiency.

/specs/00-project/spec.md

\# Project Overview



\## Overview



A browser-based text-driven life simulation game.



The player experiences a full life from childhood to old age in a fictional near-modern world inspired by industrialization, capitalism, religion, and emerging revolutionary ideologies.



The player is not trying to win.



The purpose is to interpret a life.



Failure, suffering, poverty, and death are part of the experience.



\## Requirements



The game MUST:



\- be single-player

\- run offline

\- support high replayability

\- support long-term save files

\- support JSON-based mods

\- avoid runtime AI generation

\- generate emergent stories through systems



The game SHOULD:



\- encourage player imagination

\- create memorable life trajectories

\- make failure narratively meaningful



\## Design



Core loop:



observe → choose → consequence → interpretation



The game prioritizes systems over authored narratives.



Gameplay is driven by:



\- weighted events

\- relationships

\- organizations

\- social pressure

\- gradual progression

/specs/01-architecture/spec.md

\# Architecture



\## Overview



The game uses a lightweight modular architecture.



Game logic and content are separated.



The architecture prioritizes maintainability, mod support, and Codex context efficiency.



\## Requirements



The architecture MUST:



\- avoid game engines

\- be componentized

\- split files aggressively

\- separate content from logic

\- support JSON-first content



\## Design



Suggested structure:



src/



\- core/

\- systems/

\- ui/

\- data/

\- mods/

\- saves/

\- utils/

\- types/



Core systems:



\- turn engine

\- event resolver

\- save system

\- NPC simulation



Game content lives in JSON.



Source code interprets content instead of hardcoding it.

/specs/02-core-loop/spec.md

\# Core Gameplay Loop



\## Overview



Gameplay is turn-based.



Each turn represents a period of life.



Time resolution changes depending on life stage.



\## Requirements



Life phases MUST exist:



\- childhood

\- youth

\- young adulthood

\- adulthood

\- old age



Turn speed MUST vary by phase.



Each turn MUST allow:



\- action selection

\- stance selection

\- optional item usage



\## Design



Life phases:



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



Turn order:



1\. age progression

2\. passive state updates

3\. player action

4\. growth

5\. relationship updates

6\. event resolution

7\. NPC behavior

8\. log generation

/specs/03-world/spec.md

\# World Design



\## Overview



The setting is a fictional near-modern world.



Names are procedurally generated.



No real countries exist.



\## Requirements



World systems MUST include:



\- nations

\- organizations

\- social class

\- regions



\## Design



Nation archetypes:



\- imperial

\- commercial

\- religious

\- revolutionary

\- frontier



Organizations:



\- state

\- corporations

\- academia

\- religion

\- underground



Class:



\- lower

\- worker

\- middle

\- upper

\- special



Regions:



\- capital

\- industrial

\- academic

\- religious

\- frontier

/specs/04-events/spec.md

\# Event System



\## Overview



Events generate emergent life stories.



Events are weighted and data-driven.



\## Requirements



Events MUST:



\- be JSON-based

\- use weighted probability

\- support mods

\- remain short and interpretable



Event frequency MUST vary.



Major events MUST be rare.



\## Design



Event structure:



\- conditions

\- weight

\- effects

\- text template



Categories:



\- daily

\- relationship

\- turning point

\- world



Relationship changes target approximately MTTH 3 turns.



Logs should remain concise.

/specs/05-ui/spec.md

\# UI



\## Overview



UI is text-first.



Character graphics are intentionally excluded.



\## Requirements



UI MUST display:



\- character information

\- stats

\- event logs

\- actions

\- relationships



\## Design



Top:



\- name

\- age

\- class

\- affiliation

\- money



Left:



\- abilities



Center:



\- logs



Bottom:



\- actions

\- stance



Right:



\- relationships



Tabs:



\- history

\- relationships

\- organization

\- inventory

\- world state

/specs/06-save-mod/spec.md

\# Save and Mod System



\## Overview



Save portability and modding are first-class features.



\## Requirements



Save system MUST support:



\- autosave

\- import

\- export



JSON export is mandatory.



Mods MUST:



\- be JSON-only

\- work with text editors

\- load dynamically



\## Design



Save example:



{

&#x20; "version": "0.1",

&#x20; "player": {},

&#x20; "world": {},

&#x20; "history": \[],

&#x20; "turn": 0

}



Mods:



mods/



\- my\_mod/

&#x20; - events.json

&#x20; - items.json

&#x20; - traits.json

/specs/07-mvp/spec.md

\# MVP



\## Overview



The MVP defines the first completed playable version.



\## Requirements



MVP MUST include:



\- full life playthrough

\- 5 actions

\- 5 stances

\- relationships

\- procedural NPCs

\- weighted events

\- event logs

\- save/load

\- JSON export/import

\- offline support

\- mod loading



Approximate scope:



\- 50 events

\- 20 items



\## Design



Non-goals:



\- multiplayer

\- graphics

\- animation

\- runtime AI generation

\- scripting mods

\- complex simulation realism



これをそのままリポジトリに置いて、



「specsを読み、Phase1(MVP骨格)を実装して」



とCodexに渡すのが最初の一手としてかなり安定です。AGENTS.mdでルール固定＋小さいspec分割が、長期開発では最も壊れにくいです。



続けて開発する場合はこのまま続ければおK?



はい。ただし少し整理します。



結論：



この会話を続けてもよいが、「仕様策定」と「実装支援」を分離した方が良い



です。



理由はコンテキスト有限性。



今の会話は思想〜MVP仕様まで大量に積み上がっています。



このまま数十ターン続けると、



古い仕様が埋もれる

微妙な前提ズレ

Codex用仕様との不一致



が起きやすい。



推奨運用。



1\. 今の会話



用途：



「ゲームデザイン会議」



ここでは：



新システム

数値思想

イベント原理

プレイ感

世界観

MVP変更



だけ決める。



つまり上流設計。



2\. Codex



用途：



実装



例えば：



specsを読んでPhase1を作れ



など。



3\. 新チャット（重要）



用途：



実装レビュー



例：



このディレクトリ構造どう？

eventResolver.tsが肥大化した



など。



コード品質用。



つまり役割分離。



このチャット

→ 設計



Codex

→ 実装



別チャット

→ コードレビュー



これがかなり安定します。



ただし、



このまま続けてOK？



に対する直接回答は、



Yes



です。



少なくともあと数十ターン程度なら問題ない。



ただし、

次以降は：



「仕様を決める」



に寄せた方が良い。



おすすめの次テーマ（優先順）



JSONスキーマ詳細（最重要）

イベントテンプレ設計

NPC生成ルール

名前生成方式

人物特性（trait）設計

UIワイヤーフレーム

数値バランス初期値



特に、



JSONスキーマ



は最優先。



ここが悪いとMod文化が死にます。



codexにこのチャットを読み込ませる方法はない？そのまま移植してしまいたい……



OpenAI/Codex関連は仕様が変わりやすいので、現時点の公式情報を確認してから、実用的な移植方法に絞って答えます。



思考時間: 5s



現状、Codexにこのチャットを“そのまま自動で読み込ませる”方法は基本的にありません。



実用的な方法は3つです。



このチャットで作ったMarkdown群をリポジトリに置く

CodexはAGENTS.mdをプロジェクト指示として読む設計です。公式にも、AGENTS.mdでリポジトリ固有の指示を与える運用が案内されています。

これが一番安定です。

ChatGPTのデータエクスポートを使う

ChatGPT設定の「Data Controls」から会話履歴をエクスポートできます。公式ヘルプにも手順があります。

ただし、エクスポートJSONをそのままCodexに読ませるより、今回のように仕様Markdownへ要約・分割した方が有効です。

この会話内容をコピペして/docs/conversation-notes.mdに置く

“生ログ”として保管する用途ならありです。ただしCodexの作業指示としては冗長なので、メインはAGENTS.mdとspecs/にしてください。



推奨構成はこれです。



AGENTS.md

specs/

&#x20; 00-project/spec.md

&#x20; 01-architecture/spec.md

&#x20; 02-core-loop/spec.md

&#x20; 03-world/spec.md

&#x20; 04-events/spec.md

&#x20; 05-ui/spec.md

&#x20; 06-save-mod/spec.md

&#x20; 07-mvp/spec.md

docs/

&#x20; conversation-notes.md  ← 任意



Codexへの最初の指示はこれで十分です。



Read AGENTS.md and all files under specs/.

Implement Phase 1 of the MVP: project setup, core turn loop skeleton, text-first UI skeleton, save/export/import skeleton.

Do not implement graphics. Keep files small and modular.



このチャット全部を移植するより、前回出した分割Markdownを正本として扱う方が安全です。


## 2026-05-25 メモ: 転機イベント

転機イベントでは、プレイヤーに人生上の大きな選択をさせる。

例:
- 学校に進むのか、進まないのか。
- どのような職業に就くのか。

通常ターンの小さな行動選択とは別に、転機イベントは進路、所属、階級、職業、長期的な可能性を変える分岐として扱う。
