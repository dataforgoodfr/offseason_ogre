import achievements from "./achievements.json";
import common from "./common.json";
import consumptionActions from "./consumption-actions.json";
import countries from "./countries.json";
import productionActions from "./production-actions.json";

export default {
  achievements,
  common,
  "consumption-actions": consumptionActions,
  countries,
  "production-actions": productionActions,
} as const;
