import achievements from "./achievements.json";
import common from "./common.json";
import consumptionActions from "./consumption-actions.json";
import countries from "./countries.json";

export default {
  achievements,
  common,
  "consumption-actions": consumptionActions,
  countries,
} as const;
