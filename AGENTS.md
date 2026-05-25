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

