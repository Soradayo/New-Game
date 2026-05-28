import Ajv2020 from "ajv/dist/2020";
import actionSchema from "../../docs/schema/action.schema.json";
import conditionSchema from "../../docs/schema/condition.schema.json";
import effectSchema from "../../docs/schema/effect.schema.json";
import eventSchema from "../../docs/schema/event.schema.json";
import gameDataSchema from "../../docs/schema/game-data.schema.json";
import itemSchema from "../../docs/schema/item.schema.json";
import localisationSchema from "../../docs/schema/localisation.schema.json";
import namesSchema from "../../docs/schema/names.schema.json";
import npcInteractionSchema from "../../docs/schema/npc-interaction.schema.json";
import stanceSchema from "../../docs/schema/stance.schema.json";
import traitSchema from "../../docs/schema/trait.schema.json";
import turningPointSchema from "../../docs/schema/turning-point.schema.json";

const GAME_DATA_SCHEMA_ID = "https://new-game.local/schema/game-data.schema.json";

const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
});

for (const schema of [
  gameDataSchema,
  effectSchema,
  conditionSchema,
  actionSchema,
  stanceSchema,
  eventSchema,
  itemSchema,
  localisationSchema,
  traitSchema,
  npcInteractionSchema,
  turningPointSchema,
  namesSchema,
]) {
  ajv.addSchema(schema);
}

export const validateGameDataShape = ajv.getSchema(GAME_DATA_SCHEMA_ID);
