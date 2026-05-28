import type { ModData } from "../types/game";

export function createModTemplateObject(): ModData {
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
          {
            all: [
              { target: "ageMonths", op: "gte", value: 120 },
              { target: "world.tags", op: "notHas", value: "festival-season" },
            ],
          },
        ],
        effects: [
          { target: "stats.spirit", value: 1 },
          { target: "player.traits.add", value: "mod-rain-reader" },
          { target: "world.tags.add", value: "festival-season" },
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
    npcInteractions: [
      {
        id: "mod-share-rumor",
        labelKey: "mod.npcInteraction.share-rumor.label",
        descriptionKey: "mod.npcInteraction.share-rumor.description",
        conditions: [
          { target: "relationship.$target.trust", op: "gte", value: 4 },
        ],
        effects: [
          { target: "trust", value: 1 },
          { target: "conflict", value: 1 },
          { target: "target.lifeTags.add", value: "mod.shared-rumor" },
          { target: "player.lifeTags.add", value: "mod.rumor-bearer" },
        ],
        logKey: "mod.npcInteraction.share-rumor.log",
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
              { target: "player.lifeTags.add", value: "career.print-shop-apprentice" },
              { target: "relationship.mentor.traits.add", value: "mod-rain-reader" },
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
        "mod.npcInteraction.share-rumor.label": "噂を分ける",
        "mod.npcInteraction.share-rumor.description": "信頼できる相手にだけ、街の噂を少し渡す。",
        "mod.npcInteraction.share-rumor.log": "{npc}に噂を分けた。秘密は軽くなるが、影は増える。",
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
