import type { ModData } from "../types/game";

export function createModTemplate(): ModData {
  return {
    actions: [
      {
        id: "mod-observe-town",
        labelKey: "mod.action.observe-town.label",
        descriptionKey: "mod.action.observe-town.description",
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
        isMajor: false,
        cooldownTurns: 4,
        conditions: [
          { target: "ageMonths", op: "gte", value: 120 },
        ],
        effects: [
          { target: "stats.spirit", value: 1 },
        ],
        templateKey: "mod.event.rainy-notice.template",
      },
    ],
    traits: [
      {
        id: "mod-rain-reader",
        labelKey: "mod.trait.rain-reader.label",
        descriptionKey: "mod.trait.rain-reader.description",
        tags: ["background"],
        effects: [
          { target: "stats.mind", value: 1 },
        ],
      },
    ],
    turningPoints: [
      {
        id: "mod-apprentice-printer",
        labelKey: "mod.turning.apprentice-printer.label",
        descriptionKey: "mod.turning.apprentice-printer.description",
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
            labelKey: "mod.turning.apprentice-printer.choice.enter-print-shop.label",
            descriptionKey: "mod.turning.apprentice-printer.choice.enter-print-shop.description",
            requirements: [
              {
                condition: { target: "stats.mind", op: "gte", value: 12 },
                reasonKey: "mod.turning.apprentice-printer.choice.enter-print-shop.requirement.0.reason",
              },
            ],
            outcomeSummaryKey: "mod.turning.apprentice-printer.choice.enter-print-shop.outcomeSummary",
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
      npcRoles: ["printer"],
    },
    localisation: {
      ja: {
        "mod.action.observe-town.label": "街を観察する",
        "mod.action.observe-town.description": "通りの変化と、人々の噂に目を向ける。",
        "mod.event.rainy-notice.template": "{region}に雨が続く。濡れた掲示板の文字だけが、妙にはっきり見える。",
        "mod.trait.rain-reader.label": "雨読み",
        "mod.trait.rain-reader.description": "雨の日の街から、わずかな変化を読み取る。",
        "mod.turning.apprentice-printer.label": "印刷所の誘い",
        "mod.turning.apprentice-printer.description": "活字の匂いがする小さな仕事場から、見習いの話が届く。",
        "mod.turning.apprentice-printer.choice.enter-print-shop.label": "印刷所に入る",
        "mod.turning.apprentice-printer.choice.enter-print-shop.description": "活字と紙束の間で、言葉を運ぶ仕事を覚える。",
        "mod.turning.apprentice-printer.choice.enter-print-shop.requirement.0.reason": "読み書きの力がまだ足りない。",
        "mod.turning.apprentice-printer.choice.enter-print-shop.outcomeSummary": "事務と職人仕事のあいだに、小さな道が開く。",
      },
      en: {},
    },
  };
}

export function createModTemplateJson(): string {
  return `{
  // ModファイルはJSONCとして扱えます。//行コメント と /* ブロックコメント */ が使えます。
  // idは内部IDです。英数字とハイフンで書き、他のidと重ならないようにしてください。
  // labelKey / descriptionKey / templateKey は localisation 内の文言keyを指します。

  "actions": [
    {
      // 行動ボタンを追加します。effectsは選んだターンに毎回反映されます。
      "id": "mod-observe-town",
      "labelKey": "mod.action.observe-town.label",
      "descriptionKey": "mod.action.observe-town.description",
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
      // isMajorをtrueにすると、「重要な出来事まで」の自動進行がこのイベントで止まります。
      "isMajor": false,
      "cooldownTurns": 4,
      "conditions": [
        { "target": "ageMonths", "op": "gte", "value": 120 }
      ],
      "effects": [
        { "target": "stats.spirit", "value": 1 }
      ],
      // templateKeyでは {name}, {region}, {nation} を含む文言をlocalisation側に置けます。
      "templateKey": "mod.event.rainy-notice.template"
    }
  ],

  "traits": [
    {
      "id": "mod-rain-reader",
      "labelKey": "mod.trait.rain-reader.label",
      "descriptionKey": "mod.trait.rain-reader.description",
      "tags": ["background"],
      "effects": [
        { "target": "stats.mind", "value": 1 }
      ]
    }
  ],

  "turningPoints": [
    {
      "id": "mod-apprentice-printer",
      "labelKey": "mod.turning.apprentice-printer.label",
      "descriptionKey": "mod.turning.apprentice-printer.description",
      "category": "career",
      "weight": 2,
      "ageWindow": {
        "minMonths": 168,
        "maxMonths": 240,
        "guaranteedByMonths": 216
      },
      "conditions": [
        { "target": "stats.mind", "op": "gte", "value": 12 }
      ],
      "choices": [
        {
          "id": "enter-print-shop",
          "labelKey": "mod.turning.apprentice-printer.choice.enter-print-shop.label",
          "descriptionKey": "mod.turning.apprentice-printer.choice.enter-print-shop.description",
          "requirements": [
            {
              "condition": { "target": "stats.mind", "op": "gte", "value": 12 },
              "reasonKey": "mod.turning.apprentice-printer.choice.enter-print-shop.requirement.0.reason"
            }
          ],
          "outcomeSummaryKey": "mod.turning.apprentice-printer.choice.enter-print-shop.outcomeSummary",
          "effects": [
            { "target": "money", "value": 4 },
            { "target": "stats.craft", "value": 1 },
            { "target": "stats.mind", "value": 1 }
          ],
          "grantsTags": ["career.print-shop-apprentice"],
          "careerCategory": "clerical"
        }
      ]
    }
  ],

  "names": {
    // npcRolesは内部IDです。表示名は enum.role.<id> を localisation に追加してください。
    "npcRoles": ["printer"]
  },

  "localisation": {
    "ja": {
      "mod.action.observe-town.label": "街を観察する",
      "mod.action.observe-town.description": "通りの変化と、人々の噂に目を向ける。",
      "mod.event.rainy-notice.template": "{region}に雨が続く。濡れた掲示板の文字だけが、妙にはっきり見える。",
      "mod.trait.rain-reader.label": "雨読み",
      "mod.trait.rain-reader.description": "雨の日の街から、わずかな変化を読み取る。",
      "mod.turning.apprentice-printer.label": "印刷所の誘い",
      "mod.turning.apprentice-printer.description": "活字の匂いがする小さな仕事場から、見習いの話が届く。",
      "mod.turning.apprentice-printer.choice.enter-print-shop.label": "印刷所に入る",
      "mod.turning.apprentice-printer.choice.enter-print-shop.description": "活字と紙束の間で、言葉を運ぶ仕事を覚える。",
      "mod.turning.apprentice-printer.choice.enter-print-shop.requirement.0.reason": "読み書きの力がまだ足りない。",
      "mod.turning.apprentice-printer.choice.enter-print-shop.outcomeSummary": "事務と職人仕事のあいだに、小さな道が開く。"
    },
    "en": {
      // 翻訳を追加すると、言語設定がenの時に使われます。
    }
  }
}
`;
}
