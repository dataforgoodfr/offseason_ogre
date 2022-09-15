import cloneDeep from "lodash/cloneDeep";
import flatten from "lodash/flatten";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import { ActionNames } from "../../../utils/types";
import {
  ConsumptionDatum,
  ConsumptionName,
  ConsumptionType,
} from "../../persona/consumption";
import { Persona } from "../../persona/persona";
import { availableActions } from "../playerActions/constants/actions";

export { computeNewConsumptionData };

const consumptionConfig: {
  [k in ActionNames]: ConsumptionConfig;
} = {
  [availableActions.REDUCE_PLANE_HALF]: {
    order: 1,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "fossil",
        name: "plane",
        factor: 0.5,
      }),
    ],
  },
  [availableActions.TRANSPORT_STOP_PLANE]: {
    order: 1,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "fossil",
        name: "plane",
        factor: 0,
      }),
    ],
  },
  [availableActions.LOCAL_CONSUMPTION]: {
    order: 1,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "grey",
        name: "greyOther",
        term: -5.4,
      }),
      (matrix: ConsumptionMatrix) => ({
        type: "grey",
        name: "greyTransport",
        term: -1.2,
      }),
    ],
  },
  [availableActions.REDUCE_CLOTHING_HALF]: {
    order: 1,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "grey",
        name: "greyOther",
        term: -5.4,
      }),
      (matrix: ConsumptionMatrix) => ({
        type: "grey",
        name: "greyTransport",
        term: -1.2,
      }),
    ],
  },
  [availableActions.REDUCE_NUMERIC]: {
    order: 1,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "grey",
        name: "greyNumeric",
        term: -3,
      }),
    ],
  },
  [availableActions.STOP_MILK]: {
    order: 1,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "mixte",
        name: "food",
        term: -1.5,
      }),
    ],
  },
  [availableActions.STOP_EGGS]: {
    order: 1,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "mixte",
        name: "food",
        term: -1,
      }),
    ],
  },
  [availableActions.STOP_MEAT]: {
    order: 1,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "mixte",
        name: "food",
        term: -4,
      }),
    ],
  },
  [availableActions.ZERO_WASTE]: {
    order: 1,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "mixte",
        name: "food",
        term: -4,
      }),
    ],
  },
  [availableActions.REDUCE_TRAIN_HALF]: {
    order: 1,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "renewable",
        name: "train",
        factor: 0.5,
      }),
    ],
  },
  [availableActions.DIGITAL_REDUCE_INTERNET_HALF]: {
    order: 1,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "grey",
        name: "greyNumeric",
        term: -0.9675,
      }),
    ],
  },
  [availableActions.HOUSE_INSTALL_EFFICIENT_ELECTRIC_WOOD_HEATING_SYSTEM]: {
    order: 1,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "renewable",
        name: "noCarbonHeating",
        // If player had already installed efficient system before the game, then use initial value of `renewable/noCarbonHeating`.
        // Else use initial value of `fossil/fossilHeating`.
        set:
          matrix["renewable"]["noCarbonHeating"].value ||
          matrix["fossil"]["fossilHeating"].value,
        factor: 0.4,
      }),
      (matrix: ConsumptionMatrix) => ({
        type: "fossil",
        name: "fossilHeating",
        factor: 0,
      }),
    ],
  },
  [availableActions.HOUSE_INSULATE_WALLS]: {
    order: 2,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "fossil",
        name: "fossilHeating",
        factor: 0.75,
      }),
      (matrix: ConsumptionMatrix) => ({
        type: "renewable",
        name: "noCarbonHeating",
        factor: 0.75,
      }),
    ],
  },
  [availableActions.HOUSE_INSULATE_ROOF]: {
    order: 2,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "fossil",
        name: "fossilHeating",
        factor: 0.75,
      }),
      (matrix: ConsumptionMatrix) => ({
        type: "renewable",
        name: "noCarbonHeating",
        factor: 0.75,
      }),
    ],
  },
  [availableActions.HOUSE_CHANGE_WOODWORK_WINDOWS]: {
    order: 2,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "fossil",
        name: "fossilHeating",
        factor: 0.9,
      }),
      (matrix: ConsumptionMatrix) => ({
        type: "renewable",
        name: "noCarbonHeating",
        factor: 0.9,
      }),
    ],
  },
  [availableActions.HOUSE_INSTALL_EFFICIENT_VENTILATION_SYSTEM]: {
    order: 2,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "fossil",
        name: "fossilHeating",
        factor: 0.8,
      }),
      (matrix: ConsumptionMatrix) => ({
        type: "renewable",
        name: "noCarbonHeating",
        factor: 0.8,
      }),
    ],
  },
  [availableActions.HOUSE_19_DEGREES_MAX]: {
    order: 2,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "fossil",
        name: "fossilHeating",
        factor: 0.86,
      }),
      (matrix: ConsumptionMatrix) => ({
        type: "renewable",
        name: "noCarbonHeating",
        factor: 0.86,
      }),
    ],
  },
  [availableActions.HOUSE_REDUCE_SIZE_HALF]: {
    order: 2,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "fossil",
        name: "fossilHeating",
        factor: 0.5,
      }),
      (matrix: ConsumptionMatrix) => ({
        type: "renewable",
        name: "noCarbonHeating",
        factor: 0.5,
      }),
    ],
  },
  [availableActions.HOUSE_STOP_AIR_CONDITIONING]: {
    order: 2,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "renewable",
        name: "airConditionning",
        factor: 0,
      }),
    ],
  },
  [availableActions.HOUSE_ONLY_LEDS]: {
    order: 2,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "renewable",
        name: "light",
        factor: 0.5,
      }),
    ],
  },
  [availableActions.HOUSE_ONE_SHOWER_5_MINUTES_MAX]: {
    order: 2,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "renewable",
        name: "cleanCook",
        term: -0.7,
      }),
    ],
  },
  [availableActions.HOUSE_EFFICIENT_HOUSEHOLD_APPLIANCES]: {
    order: 2,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "renewable",
        name: "cleanCook",
        term: -3.82,
      }),
    ],
  },
  [availableActions.HOUSE_UNPLUNG_APPLIANCES_ON_STANDBY]: {
    order: 2,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "renewable",
        name: "brownGoods",
        term: -0.6,
      }),
    ],
  },
  [availableActions.HOUSE_UNPLUNG_CHARGERS]: {
    order: 2,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "renewable",
        name: "brownGoods",
        term: -0.01,
      }),
    ],
  },
  [availableActions.STOP_CANS]: {
    order: 1,
    impacts: [],
  },
  [availableActions.CONSUMPTION_SORT_WASTE]: {
    order: 1,
    impacts: [],
  },
  [availableActions.ELECTRIC_CAR]: {
    order: 1,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "renewable",
        name: "electricCar",
        // If player had already switched to electric car before the game, then use initial value of `renewable/electricCar`.
        // Else use initial value of `fossil/fossilCar`.
        set:
          matrix["renewable"]["electricCar"].value ||
          matrix["fossil"]["fossilCar"].value,
      }),
      (matrix: ConsumptionMatrix) => ({
        type: "fossil",
        name: "fossilCar",
        factor: 0,
      }),
      (matrix: ConsumptionMatrix) => ({
        type: "grey",
        name: "greyCar",
        factor: 1.2,
      }),
    ],
  },
  [availableActions.ECO_DRIVING]: {
    order: 2,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "fossil",
        name: "fossilCar",
        factor: 0.9,
      }),
      (matrix: ConsumptionMatrix) => ({
        type: "renewable",
        name: "electricCar",
        factor: 0.9,
      }),
    ],
  },
  [availableActions.REDUCE_CAR_20]: {
    order: 2,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "fossil",
        name: "fossilCar",
        factor: 0.8,
      }),
      (matrix: ConsumptionMatrix) => ({
        type: "renewable",
        name: "electricCar",
        factor: 0.8,
      }),
    ],
  },
  [availableActions.KEEP_CAR_15]: {
    order: 2,
    impacts: [
      (matrix: ConsumptionMatrix) => ({
        type: "grey",
        name: "greyCar",
        term: -28,
      }),
    ],
  },
};

type ConsumptionConfig = {
  order: number;
  impacts: ConsumptionConfigGetImpact[];
};
type ConsumptionConfigGetImpact = (matrix: ConsumptionMatrix) => {
  type: ConsumptionType;
  name: ConsumptionName;
  factor?: number;
  term?: number;
  set?: number;
};

function computeNewConsumptionData(
  basePersona: Persona,
  performedActionsNames: ActionNames[]
) {
  const consumptionMatrix = buildConsumptionMatrix(
    cloneDeep(basePersona.consumption)
  );

  computeConsumption(consumptionMatrix, performedActionsNames);

  return flattenConsumptionMatrix(consumptionMatrix);
}

function computeConsumption(
  consumptionMatrix: ConsumptionMatrix,
  performedActionsNames: ActionNames[]
) {
  const performedActionsNamesSorted = performedActionsNames.sort(
    (actionNameA, actionNameB) =>
      (consumptionConfig[actionNameA]?.order || 0) -
      (consumptionConfig[actionNameB]?.order || 0)
  );

  performedActionsNamesSorted.forEach((actionName) => {
    const config = consumptionConfig[actionName];

    if (!config) {
      return;
    }

    config.impacts.forEach((getImpact) =>
      computeConsumptionImpact(consumptionMatrix, getImpact)
    );
  });
}

function computeConsumptionImpact(
  consumptionMatrix: ConsumptionMatrix,
  getImpact: ConsumptionConfigGetImpact
) {
  const { type, name, factor, term, set } = getImpact(consumptionMatrix);
  const target = consumptionMatrix[type]?.[name];

  if (!target) {
    console.error(
      `Could not find consumption for type ${type} and name ${name}`
    );
    return;
  }

  let targetValue = target.value;

  if (set != null) {
    targetValue = set;
  }

  if (factor != null) {
    targetValue *= factor;
  } else if (term != null) {
    targetValue += term;
  }

  consumptionMatrix[type][name].value = Math.max(targetValue, 0);
}

type ConsumptionMatrix = Record<
  ConsumptionType,
  Record<ConsumptionName, ConsumptionDatum>
>;

function buildConsumptionMatrix(consumptionData: readonly ConsumptionDatum[]) {
  return Object.fromEntries(
    map(groupBy(consumptionData, "type"), (consumptionByType, type) => [
      type,
      Object.fromEntries(
        map(groupBy(consumptionByType, "name"), (consumptionByName, name) => [
          name,
          consumptionByName[0],
        ])
      ),
    ])
    // Typing required since `groupBy` is not correctly typed.
  ) as unknown as ConsumptionMatrix;
}

function flattenConsumptionMatrix(consumptionMatrix: ConsumptionMatrix) {
  return flatten(
    map(consumptionMatrix, (consumptionsByType) =>
      map(consumptionsByType, (consumptionsByName) => consumptionsByName)
    )
  );
}
