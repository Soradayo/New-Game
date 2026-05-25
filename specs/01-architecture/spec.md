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

