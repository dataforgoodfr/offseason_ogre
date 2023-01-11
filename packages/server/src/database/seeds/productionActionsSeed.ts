import { PointsInterval } from "@prisma/client";
import { database } from "..";
import { GameStepId, getStepIndexById } from "../../constants/steps";
import { productionActionNames } from "../../modules/productionActions/constants";
import {
  ProductionAction,
  ProductionActionSeed,
} from "../../modules/productionActions/types";
import { Seed } from "../types";

export { seed, pointsIntervalSeed };

type ProductionActionWithPointInterval = ProductionAction & {
  pointsInterval: PointsInterval[];
};

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
  points: (Omit<PointsInterval, "productionActionId"> & {
    actionName: string;
  })[];
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
        "https://drive.google.com/file/d/1WOj-ls4MYiSOIJFS0Q2_ZP6-kHf94Ov0/view?usp=share_link",
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
        "https://drive.google.com/file/d/1NpLcrqOY7-5ZFEKjtNQivrTERcDMCRYZ/view?usp=share_link",
      currentYearPowerNeedGw: 19.5,
      defaultTeamValue: 0.58,
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
        "https://drive.google.com/file/d/12r9aO1uFmGgHx7L0tk-CZAo3p_d22gI-/view?usp=share_link",
      currentYearPowerNeedGw: 7.2,
      defaultTeamValue: 1.67,
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
        "https://drive.google.com/file/d/1U9hpXWuDESVZPBKwaoxgDdBkXB-uEd3E/view?usp=share_link",
      currentYearPowerNeedGw: 8,
      defaultTeamValue: 0.67,
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
        "https://drive.google.com/file/d/1ozMY1hlYDbUCuCRZxyWbQrupEBnOaqDv/view?usp=share_link",
      currentYearPowerNeedGw: 2.5,
      defaultTeamValue: 0.1,
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
  ] as ProductionActionWithPointInterval[];

  const actions = getActions(productionActions, "production-1");

  const points = getPointsIntervals(productionActions);

  return { actions, points };
}

function getProductionActionsDataForProductionStep2(): {
  actions: ProductionAction[];
  points: (Omit<PointsInterval, "productionActionId"> & {
    actionName: string;
  })[];
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
        "https://drive.google.com/file/d/17M08Ru_shloc0ULvPPjhuZaif4el72S-/view?usp=share_link",
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
        "https://drive.google.com/file/d/14mn5P-IHY85Iee9Q-qw1367iin0nRB6F/view?usp=share_link",
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
        "https://drive.google.com/file/d/1eAaPXSn4YMCWRcyF0ELArsu0Jrb5-nIa/view?usp=share_link",
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
        "https://drive.google.com/file/d/1LtFLAxHnU6CquXhSp1N0N9ZZjsH2P4MF/view?usp=share_link",
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
  ] as ProductionActionWithPointInterval[];

  const actions = getActions(productionActions, "production-2");

  const points = getPointsIntervals(productionActions);

  return { actions, points };
}

function getProductionActionsDataForProductionStep3(): {
  actions: ProductionAction[];
  points: (Omit<PointsInterval, "productionActionId"> & {
    actionName: string;
  })[];
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
        "https://drive.google.com/file/d/1g2lYTDT0x0kdcqlohWzfMK_VVItQQtCO/view?usp=share_link",
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
  ] as ProductionActionWithPointInterval[];

  const actions = getActions(productionActions, "production-3");
  const points = getPointsIntervals(productionActions);

  return { actions, points };
}

function getActions(
  productionActions: ProductionActionWithPointInterval[],
  stepId: GameStepId
) {
  return productionActions.map((action, index) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pointsInterval, ...actionWithoutPoints } = action;
    return {
      ...actionWithoutPoints,
      id: index,
      step: getStepIndexById(stepId),
    };
  });
}

function getPointsIntervals(
  productionActions: readonly ProductionActionSeed[]
) {
  return productionActions
    .flatMap(({ pointsInterval, name }) =>
      pointsInterval.map(
        (pi: Omit<PointsInterval, "id" | "productionActionId">) => ({
          ...pi,
          actionName: name,
        })
      )
    )
    .map((pointsInterval, index) => ({ ...pointsInterval, id: index }));
}
