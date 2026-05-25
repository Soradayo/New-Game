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

