import { AchievementName } from "../../../utils/types";
import { ConditionEngineCondition } from "../gameEngines/conditionEngine";

export { ACHIEVEMENTS_CONFIG };

// TODO: should be moved to database.
const ACHIEVEMENTS_CONFIG: Array<{
  name: AchievementName;
  successConditions: ConditionEngineCondition[];
}> = [
  //   {
  //     name: "choseToInsulateHome",
  //     successConditions: [
  //       { "consumptionAction.houseInsulateRoof.isPerformed": { _eq: true } },
  //       { "consumptionAction.houseInsulateWalls.isPerformed": { _eq: true } },
  //     ],
  //   },
  {
    name: "choseToKeepCarForLongTime",
    successConditions: [
      { "consumptionAction.keepCar15.isPerformed": { _eq: true } },
    ],
  },
  //   {
  //     name: "choseToReduceComfortTemperature",
  //     successConditions: [
  //       { "consumptionAction.house19DegreesMax.isPerformed": { _eq: true } },
  //     ],
  //   },
  {
    name: "choseToStopMeat",
    successConditions: [
      { "consumptionAction.stopMeat.isPerformed": { _eq: true } },
    ],
  },
  {
    name: "choseToStopPlane",
    successConditions: [
      { "consumptionAction.transportStopPlane.isPerformed": { _eq: true } },
    ],
  },
  {
    name: "choseToSwitchToElectricCar",
    successConditions: [
      { "consumptionAction.electricCar.isPerformed": { _eq: true } },
    ],
  },
  {
    name: "choseToSwitchToTinyHome",
    successConditions: [
      { "consumptionAction.houseReduceSizeHalf.isPerformed": { _eq: true } },
    ],
  },
  //   {
  //     name: "directEnergyConsumptionLessThanHalfCountryMean",
  //     successConditions: [{ "energy.direct": { _lte: 25 } }],
  //   },
  {
    name: "noFossilInDirectEnergyConsumption",
    successConditions: [{ "energy.fossil": { _eq: 0 } }],
  },
  {
    name: "consumptionAndProductionBalanced",
    successConditions: [
      {
        "production.total": {
          _gte: {
            _ref: "consumption.total",
          },
        },
      },
    ],
  },
  {
    name: "gameFinished",
    successConditions: [],
  },
  {
    name: "nuclearProductionCredible",
    successConditions: [{ "production.nuclearPowerNeed": { _lte: 51 } }],
  },
  {
    name: "nuclearProductionExcessive",
    successConditions: [{ "production.nuclearPowerNeed": { _gte: 120 } }],
  },
  {
    name: "offshoreWindTurbineProductionCredible",
    successConditions: [
      { "production.offshoreWindTurbinePowerNeed": { _lte: 60 } },
    ],
  },
  {
    name: "onshoreWindTurbineProductionCredible",
    successConditions: [
      { "production.onshoreWindTurbinePowerNeed": { _lte: 100 } },
    ],
  },
];
