export function createModTemplateJsonc(): string {
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
        // conditions配列は暗黙ANDです。さらに単体conditionとして all / any / not を入れ子にできます。
        {
          "all": [
            { "target": "ageMonths", "op": "gte", "value": 120 },
            { "target": "world.tags", "op": "notHas", "value": "festival-season" }
          ]
        }
      ],
      "effects": [
        { "target": "stats.spirit", "value": 1 },
        // player.traits.add/remove で特性の付与・削除、world.tags.add/remove で世界タグを操作します。
        { "target": "player.traits.add", "value": "mod-rain-reader" },
        { "target": "world.tags.add", "value": "festival-season" }
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

  "npcInteractions": [
    {
      // 関係タブに、NPCへ即時実行できる関与ボタンを追加します。
      // relationship.$target は、ボタンを押した相手自身に置き換わります。
      "id": "mod-share-rumor",
      "labelKey": "mod.npcInteraction.share-rumor.label",
      "descriptionKey": "mod.npcInteraction.share-rumor.description",
      "conditions": [
        { "target": "relationship.$target.trust", "op": "gte", "value": 4 }
      ],
      "effects": [
        // bond/trust/dependency/conflict は対象NPCに反映されます。
        { "target": "trust", "value": 1 },
        { "target": "conflict", "value": 1 },
        // target.lifeTags は対象NPC、player.lifeTags はプレイヤーへタグを付けます。
        { "target": "target.lifeTags.add", "value": "mod.shared-rumor" },
        { "target": "player.lifeTags.add", "value": "mod.rumor-bearer" }
      ],
      "logKey": "mod.npcInteraction.share-rumor.log"
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
        {
          "any": [
            { "target": "stats.mind", "op": "gte", "value": 12 },
            { "target": "player.traits", "op": "has", "value": "mod-rain-reader" }
          ]
        }
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
            { "target": "stats.mind", "value": 1 },
            // lifeTagsは経歴や人生分岐、traitsは性質や獲得特性に使います。
            { "target": "player.lifeTags.add", "value": "career.print-shop-apprentice" },
            // relationship.<id>.traits.add の <id> は初期NPCのrole/idと対応します。
            { "target": "relationship.mentor.traits.add", "value": "mod-rain-reader" }
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
      "mod.npcInteraction.share-rumor.label": "噂を分ける",
      "mod.npcInteraction.share-rumor.description": "信頼できる相手にだけ、街の噂を少し渡す。",
      "mod.npcInteraction.share-rumor.log": "{npc}に噂を分けた。秘密は軽くなるが、影は増える。",
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
