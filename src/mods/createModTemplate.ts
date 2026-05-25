import type { ModData } from "../types/game";

export function createModTemplate(): ModData {
  return {
    actions: [
      {
        id: "mod-observe-town",
        label: "街を観察する",
        description: "通りの変化と、人々の噂に目を向ける。",
        effects: [
          { target: "stats.mind", value: 1 },
          { target: "stats.social", value: 1 },
        ],
      },
    ],
    events: [
      {
        id: "mod-rainy-notice",
        category: "daily",
        weight: 3,
        cooldownTurns: 4,
        conditions: [
          { target: "ageMonths", op: "gte", value: 120 },
        ],
        effects: [
          { target: "stats.spirit", value: 1 },
        ],
        template: "{region}に雨が続く。濡れた掲示板の文字だけが、妙にはっきり見える。",
      },
    ],
    traits: [
      {
        id: "mod-rain-reader",
        label: "雨読み",
        description: "雨の日の街から、わずかな変化を読み取る。",
        tags: ["background"],
        effects: [
          { target: "stats.mind", value: 1 },
        ],
      },
    ],
    turningPoints: [
      {
        id: "mod-apprentice-printer",
        label: "印刷所の誘い",
        description: "活字の匂いがする小さな仕事場から、見習いの話が届く。",
        category: "career",
        weight: 2,
        ageWindow: {
          minMonths: 168,
          maxMonths: 240,
          guaranteedByMonths: 216,
        },
        conditions: [
          { target: "stats.mind", op: "gte", value: 12 },
        ],
        choices: [
          {
            id: "enter-print-shop",
            label: "印刷所に入る",
            description: "活字と紙束の間で、言葉を運ぶ仕事を覚える。",
            requirements: [
              {
                condition: { target: "stats.mind", op: "gte", value: 12 },
                reason: "読み書きの力がまだ足りない。",
              },
            ],
            outcomeSummary: "事務と職人仕事のあいだに、小さな道が開く。",
            effects: [
              { target: "money", value: 4 },
              { target: "stats.craft", value: 1 },
              { target: "stats.mind", value: 1 },
            ],
            grantsTags: ["career.print-shop-apprentice"],
            careerCategory: "clerical",
          },
        ],
      },
    ],
    names: {
      given: ["ノア"],
      family: ["活字通り"],
      npcRoles: ["printer"],
    },
  };
}

export function createModTemplateJson(): string {
  return `{
  // ModファイルはJSONCとして扱えます。//行コメント と /* ブロックコメント */ が使えます。
  // idは内部IDです。英数字とハイフンで書き、他のidと重ならないようにしてください。
  // label / description / template / reason は画面に出る文章なので、日本語で自由に書けます。

  "actions": [
    {
      // 行動ボタンを追加します。effectsは選んだターンに毎回反映されます。
      "id": "mod-observe-town",
      "label": "街を観察する",
      "description": "通りの変化と、人々の噂に目を向ける。",
      "effects": [
        // stats.mind は知性、stats.social は社交です。valueを増やすと能力が伸びます。
        { "target": "stats.mind", "value": 1 },
        { "target": "stats.social", "value": 1 }
      ]
    }
  ],

  "events": [
    {
      // 通常イベントを追加します。weightが大きいほど選ばれやすくなります。
      "id": "mod-rainy-notice",
      "category": "daily",
      "weight": 3,
      // cooldownTurns は同じイベントが再登場するまでの待ちターン数です。
      "cooldownTurns": 4,
      "conditions": [
        // ageMonthsは月齢です。120なら10歳以上で発生します。
        { "target": "ageMonths", "op": "gte", "value": 120 }
      ],
      "effects": [
        { "target": "stats.spirit", "value": 1 }
      ],
      // templateでは {name}, {region}, {nation} が使えます。
      "template": "{region}に雨が続く。濡れた掲示板の文字だけが、妙にはっきり見える。"
    }
  ],

  "traits": [
    {
      // traitsは経歴や性質のタグ定義です。現段階では主にMod作者向けの定義として使います。
      "id": "mod-rain-reader",
      "label": "雨読み",
      "description": "雨の日の街から、わずかな変化を読み取る。",
      "tags": ["background"],
      "effects": [
        { "target": "stats.mind", "value": 1 }
      ]
    }
  ],

  "turningPoints": [
    {
      // 転機イベントを追加します。発生すると、選ぶまで次の期間へ進めません。
      "id": "mod-apprentice-printer",
      "label": "印刷所の誘い",
      "description": "活字の匂いがする小さな仕事場から、見習いの話が届く。",
      "category": "career",
      "weight": 2,
      "ageWindow": {
        // minMonthsからmaxMonthsの間に候補になります。guaranteedByMonths以降は最低保証の対象です。
        "minMonths": 168,
        "maxMonths": 240,
        "guaranteedByMonths": 216
      },
      "conditions": [
        // 転機そのものが候補になる条件です。
        { "target": "stats.mind", "op": "gte", "value": 12 }
      ],
      "choices": [
        {
          // 選択肢です。requirementsを満たさない場合は、理由つきで選べない状態になります。
          "id": "enter-print-shop",
          "label": "印刷所に入る",
          "description": "活字と紙束の間で、言葉を運ぶ仕事を覚える。",
          "requirements": [
            {
              "condition": { "target": "stats.mind", "op": "gte", "value": 12 },
              "reason": "読み書きの力がまだ足りない。"
            }
          ],
          // outcomeSummaryは選択肢に表示される、数値を隠した結果説明です。
          "outcomeSummary": "事務と職人仕事のあいだに、小さな道が開く。",
          "effects": [
            { "target": "money", "value": 4 },
            { "target": "stats.craft", "value": 1 },
            { "target": "stats.mind", "value": 1 }
          ],
          // grantsTagsは選択後に人生へ刻まれる経歴タグです。後続イベントの条件に使えます。
          "grantsTags": ["career.print-shop-apprentice"],
          // careerCategoryは職域を変更します。例: labor, clerical, academic, religious, state, underground, mercantile
          "careerCategory": "clerical"
        }
      ]
    }
  ],

  "names": {
    // 名前やNPC roleの候補を追加します。
    "given": ["ノア"],
    "family": ["活字通り"],
    "npcRoles": ["printer"]
  }
}
`;
}
