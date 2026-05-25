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

