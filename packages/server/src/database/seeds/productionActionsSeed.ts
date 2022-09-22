import { PointsInterval } from "@prisma/client";
import { database } from "..";
import { GameStepId, getStepIndexById } from "../../constants/steps";
import { productionActionNames } from "../../modules/productionActions/constants";
import { ProductionAction } from "../../modules/productionActions/types";
import { Seed } from "../types";

export { seed, pointsIntervalSeed };

const seed: Seed<ProductionAction> = {
  seeder: (productionAction) =>
    database.productionAction.upsert({
      where: {
        id: productionAction.id,
      },
      update: productionAction,
      create: productionAction,
    }),
  data: getProductionActionsData(),
};

const pointsIntervalSeed: Seed<PointsInterval> = {
  seeder: (pointsInterval) =>
    database.pointsInterval.upsert({
      where: {
        id: pointsInterval.id,
      },
      update: pointsInterval,
      create: pointsInterval,
    }),
  data: getPointsIntervalData(),
};

function getProductionActionsData(): ProductionAction[] {
  return [
    ...getProductionActionsDataForProductionStep1().actions,
    ...getProductionActionsDataForProductionStep2().actions,
    ...getProductionActionsDataForProductionStep3().actions,
  ].map((action, index) => ({
    ...action,
    id: index,
  }));
}

function getPointsIntervalData() {
  const productionActions = getProductionActionsData();
  return [
    ...getProductionActionsDataForProductionStep1().points,
    ...getProductionActionsDataForProductionStep2().points,
    ...getProductionActionsDataForProductionStep3().points,
  ].map(({ min, max, points, actionName }, index) => ({
    min,
    max,
    points,
    productionActionId:
      productionActions?.find((action) => action.name === actionName)?.id || 0,
    id: index,
  }));
}

function getProductionActionsDataForProductionStep1(): {
  actions: ProductionAction[];
  points: any[];
} {
  const productionActions = [
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
      helpCardLink:
        "https://drive.google.com/file/d/1uO9Y2oPLsDzs1Mjv1G1bSb8jSTTAynqL/view?usp=sharing",
      currentYearPowerNeedGw: 21.42,
      defaultTeamValue: 10.11,
      pointsInterval: [
        {
          min: 0,
          max: 25,
          points: 1500,
        },
      ],
      isPlayable: true,
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
      helpCardLink:
        "https://drive.google.com/file/d/1gx_7fGbfk3dp1oF1DUg8bNwAv-_JG2NZ/view?usp=sharing",
      currentYearPowerNeedGw: 17.05,
      defaultTeamValue: 0.51,
      pointsInterval: [
        {
          min: 1,
          max: 3,
          points: 1500,
        },
        {
          min: 3,
          max: 6,
          points: 750,
        },
      ],
      isPlayable: true,
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
      helpCardLink:
        "https://drive.google.com/file/d/1buRId_oFMdx1NxutSUJB-6ih-JMG8niV/view?usp=sharing",
      currentYearPowerNeedGw: 5.53,
      defaultTeamValue: 1.28,
      pointsInterval: [
        {
          min: 2,
          max: 5,
          points: 1000,
        },
        {
          min: 5,
          max: 10,
          points: 500,
        },
      ],
      isPlayable: true,
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
      helpCardLink:
        "https://drive.google.com/file/d/1fuvP46JtmQmKLeY43Iv-W0szE1Rmrajh/view?usp=sharing",
      currentYearPowerNeedGw: 4.53,
      defaultTeamValue: 0.38,
      pointsInterval: [
        {
          min: 2,
          max: 11,
          points: 1000,
        },
        {
          min: 11,
          max: 32,
          points: 500,
        },
      ],
      isPlayable: true,
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
      helpCardLink:
        "https://drive.google.com/file/d/1Oj7bdAcLpdh97DDnepbtjPmWMWpG39Xn/view?usp=sharing",
      currentYearPowerNeedGw: 1.93,
      defaultTeamValue: 0.08,
      pointsInterval: [
        {
          min: 3,
          max: 6,
          points: 1500,
        },
        {
          min: 6,
          max: 8,
          points: 750,
        },
      ],
      isPlayable: true,
    },
  ] as const;

  const actions = getActions(productionActions, "production-1");

  const points = getPointsIntervals(productionActions);

  return { actions, points };
}

function getProductionActionsDataForProductionStep2(): {
  actions: ProductionAction[];
  points: any[];
} {
  const productionActions = [
    {
      name: productionActionNames.HYDRAULIC,
      type: "offshore",
      unit: "percentage",
      min: 0,
      max: 100,
      credibilityThreshold: 100,
      areaEnergy: null,
      totalEnergy: 2.67,
      powerNeededKWh: 9.55,
      lcoe: 0.02,
      order: 1,
      helpCardLink: "",
      currentYearPowerNeedGw: 25.51,
      defaultTeamValue: 100,
      pointsInterval: [],
      isPlayable: false,
    },
    {
      name: productionActionNames.GEOTHERMAL,
      type: "offshore",
      unit: "percentage",
      min: 0,
      max: 100,
      credibilityThreshold: 5,
      areaEnergy: null,
      totalEnergy: 1.1,
      powerNeededKWh: 2.81,
      lcoe: 0.034,
      order: 1,
      helpCardLink:
        "https://drive.google.com/file/d/18JUYq-sToYw9Nbr8HpLAylKnHsiU3zQ7/view?usp=sharing",
      currentYearPowerNeedGw: 0.0152,
      defaultTeamValue: 0.49,
      pointsInterval: [
        {
          min: 1,
          max: 6,
          points: 1000,
        },
      ],
      isPlayable: true,
    },
    {
      name: productionActionNames.OFF_SHORE_WIND_TURBINE,
      type: "offshore",
      unit: "percentage",
      min: 0,
      max: 20,
      credibilityThreshold: 6,
      areaEnergy: null,
      totalEnergy: 144,
      powerNeededKWh: 8.18,
      lcoe: 0.0805,
      order: 2,
      helpCardLink:
        "https://drive.google.com/file/d/1F1QYdy321llo8QiEEwwlM4xMlM0IFxaL/view?usp=sharing",
      currentYearPowerNeedGw: 3.3,
      defaultTeamValue: 0.28,
      pointsInterval: [
        {
          min: 1,
          max: 3,
          points: 1500,
        },
        {
          min: 3,
          max: 6,
          points: 750,
        },
      ],
      isPlayable: true,
    },
    {
      name: productionActionNames.TIDAL,
      type: "offshore",
      unit: "percentage",
      min: 0,
      max: 12,
      credibilityThreshold: 2.6,
      areaEnergy: null,
      totalEnergy: 11.3,
      powerNeededKWh: 10.8,
      lcoe: 0.275,
      order: 4,
      helpCardLink:
        "https://drive.google.com/file/d/1zbCSipobSdAa2-43ytpU7VU2zUcB659u/view?usp=sharing",
      currentYearPowerNeedGw: 0.2405,
      defaultTeamValue: 0.197,
      pointsInterval: [
        {
          min: 0.5,
          max: 3,
          points: 1000,
        },
        {
          min: 3,
          max: 12,
          points: 500,
        },
      ],
      isPlayable: true,
    },
    {
      name: productionActionNames.WAVE,
      type: "offshore",
      unit: "percentage",
      min: 0,
      max: 100,
      credibilityThreshold: 80,
      areaEnergy: null,
      totalEnergy: 4.8,
      powerNeededKWh: 2.7,
      lcoe: 0.0805,
      order: 3,
      helpCardLink:
        "https://drive.google.com/file/d/1gfeb6hjWG0IIimKpHtjJ_91h38hw2T4I/view?usp=sharing",
      currentYearPowerNeedGw: 0.00045,
      defaultTeamValue: 0.00347,
      pointsInterval: [
        {
          min: 1,
          max: 30,
          points: 1000,
        },
        {
          min: 30,
          max: 81,
          points: 500,
        },
      ],
      isPlayable: true,
    },
  ] as const;

  const actions = getActions(productionActions, "production-2");

  const points = getPointsIntervals(productionActions);

  return { actions, points };
}

function getProductionActionsDataForProductionStep3(): {
  actions: ProductionAction[];
  points: any[];
} {
  const productionActions = [
    {
      name: productionActionNames.NUCLEAR,
      type: "nuclear",
      unit: "percentage",
      min: 0,
      max: 1000,
      credibilityThreshold: 200,
      areaEnergy: null,
      totalEnergy: 16.06,
      powerNeededKWh: 3.82,
      lcoe: 0.095,
      order: 1,
      helpCardLink:
        "https://drive.google.com/file/d/1266O8HqYV6QwbfZH_MeYVIWsre_KnGBf/view?usp=sharing",
      currentYearPowerNeedGw: 61.4,
      defaultTeamValue: 100,
      pointsInterval: [
        {
          min: 0,
          max: 120,
          points: 1000,
        },
        {
          min: 200,
          max: 99999,
          points: -500,
        },
      ],
      isPlayable: true,
    },
  ] as const;

  const actions = getActions(productionActions, "production-3");
  const points = getPointsIntervals(productionActions);

  return { actions, points };
}

function getActions(productionActions: readonly any[], stepId: GameStepId) {
  return productionActions.map((action, index) => {
    const { pointsInterval, ...actionWithoutPoints } = action;
    return {
      ...actionWithoutPoints,
      id: index,
      step: getStepIndexById(stepId),
    };
  });
}

function getPointsIntervals(productionActions: readonly any[]) {
  return productionActions
    .map(({ pointsInterval, name }) =>
      pointsInterval.map((pi: any) => ({ ...pi, actionName: name }))
    )
    .flat()
    .map((pointsInterval, index) => ({ ...pointsInterval, id: index }));
}
