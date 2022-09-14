import { getStepIndexById } from "../../constants/steps";
import { productionActionNames } from "../../modules/productionActions/constants";
import { ProductionAction } from "../../modules/productionActions/types";

export { getProductionActionsSeed };

function getProductionActionsSeed(): ProductionAction[] {
  const productionActionsList = [
    {
      name: productionActionNames.BIOMASS,
      type: "terrestrial",
      unit: "percentage",
      min: 0,
      max: 50,
      credibilityThreshold: 25,
      areaEnergy: null,
      totalEnergy: 70.6,
      powerNeededKWh: 3.0,
      lcoe: 0.092,
      order: 2,
      step: getStepIndexById("production-1"),
      helpCardLink:
        "https://drive.google.com/file/d/1uO9Y2oPLsDzs1Mjv1G1bSb8jSTTAynqL/view?usp=sharing",
      currentYearPowerNeedGw: 21.42,
      defaultTeamValue: 10.11,
    },
    {
      name: productionActionNames.ON_SHORE_WIND_TURBINE,
      type: "terrestrial",
      unit: "percentage",
      min: 0,
      max: 20,
      credibilityThreshold: 5.2,
      areaEnergy: null,
      totalEnergy: 408.6,
      powerNeededKWh: 8.18,
      lcoe: 0.0605,
      order: 1,
      step: getStepIndexById("production-1"),
      helpCardLink:
        "https://drive.google.com/file/d/1gx_7fGbfk3dp1oF1DUg8bNwAv-_JG2NZ/view?usp=sharing",
      currentYearPowerNeedGw: 17.05,
      defaultTeamValue: 0.51,
    },
    {
      name: productionActionNames.PHOTOVOLTAIC_FARM,
      type: "terrestrial",
      unit: "area",
      min: 0,
      max: 100,
      credibilityThreshold: 11,
      areaEnergy: 0.24,
      totalEnergy: null,
      powerNeededKWh: 18,
      lcoe: 0.055,
      order: 5,
      step: getStepIndexById("production-1"),
      helpCardLink:
        "https://drive.google.com/file/d/1buRId_oFMdx1NxutSUJB-6ih-JMG8niV/view?usp=sharing",
      currentYearPowerNeedGw: 5.53,
      defaultTeamValue: 1.28,
    },
    {
      name: productionActionNames.PHOTOVOLTAIC_ROOF,
      type: "terrestrial",
      unit: "area",
      min: 0,
      max: 40,
      credibilityThreshold: 31,
      areaEnergy: 0.66,
      totalEnergy: null,
      powerNeededKWh: 18,
      lcoe: 0.1425,
      order: 4,
      step: getStepIndexById("production-1"),
      helpCardLink:
        "https://drive.google.com/file/d/1fuvP46JtmQmKLeY43Iv-W0szE1Rmrajh/view?usp=sharing",
      currentYearPowerNeedGw: 4.53,
      defaultTeamValue: 0.38,
    },
    {
      name: productionActionNames.THERMAL_SOLAR,
      type: "terrestrial",
      unit: "area",
      min: 0,
      max: 10,
      credibilityThreshold: 5,
      areaEnergy: 1.32,
      totalEnergy: null,
      powerNeededKWh: 18,
      lcoe: 0.128,
      order: 3,
      step: getStepIndexById("production-1"),
      helpCardLink:
        "https://drive.google.com/file/d/1Oj7bdAcLpdh97DDnepbtjPmWMWpG39Xn/view?usp=sharing",
      currentYearPowerNeedGw: 1.93,
      defaultTeamValue: 0.08,
    },
  ] as const;

  return productionActionsList.map((action, index) => ({
    id: index,
    ...action,
  }));
}
