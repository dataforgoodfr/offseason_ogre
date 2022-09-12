import { TeamAction } from "../../../utils/types";
import { productionNames } from "./production";

export { TEAM_ACTIONS_MOCKS };

const TEAM_ACTIONS_MOCKS: TeamAction[] = [
  {
    value: 10.11,
    isTouched: true,
    action: {
      name: productionNames.biomass,
      unit: "percentage",
      min: 0,
      max: 50,
      credibilityThreshold: 25,
      totalEnergy: 70.6,
      powerNeededKWh: 3.0,
      lcoe: 0.092,
      currentYearPowerNeedGw: 21.42,
    },
  },
  {
    value: 0.51,
    isTouched: false,
    action: {
      name: productionNames.onshoreWindTurbine,
      unit: "percentage",
      min: 0,
      max: 20,
      credibilityThreshold: 5.2,
      totalEnergy: 408.6,
      powerNeededKWh: 8.18,
      lcoe: 0.0605,
      currentYearPowerNeedGw: 17.05,
    },
  },
  {
    value: 1.28,
    isTouched: true,
    action: {
      name: productionNames.photovoltaicFarm,
      unit: "area",
      min: 0,
      max: 100,
      credibilityThreshold: 11,
      areaEnergy: 0.24,
      powerNeededKWh: 18,
      lcoe: 0.055,
      currentYearPowerNeedGw: 5.53,
    },
  },
  {
    value: 0.38,
    isTouched: false,
    action: {
      name: productionNames.photovoltaicRoof,
      unit: "area",
      min: 0,
      max: 40,
      credibilityThreshold: 31,
      areaEnergy: 0.66,
      powerNeededKWh: 18,
      lcoe: 0.1425,
      currentYearPowerNeedGw: 4.53,
    },
  },
  {
    value: 5.08,
    isTouched: true,
    action: {
      name: productionNames.thermalSolar,
      unit: "area",
      min: 0,
      max: 10,
      credibilityThreshold: 5,
      areaEnergy: 1.32,
      powerNeededKWh: 18,
      lcoe: 0.128,
      currentYearPowerNeedGw: 1.93,
    },
  },
];
