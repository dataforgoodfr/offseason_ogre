import cloneDeep from "lodash/cloneDeep";
import { ActionNames } from "../../../utils/types";
import { fillPersonalization } from "../../persona";
import {
  ConsumptionDatum,
  getConsumptionFromProfile,
} from "../../persona/consumption";
import { computeIntermediateValues } from "../../persona/consumption/computing";
import {
  carAges,
  carEnergies,
  hygieneCleaning,
  houseEnergies,
  IntermediateValues,
  houseLighting,
  PersoForm,
  showerTimes,
} from "../Personalization/models/form";
import { availableActions } from "../playerActions/constants/actions";

export {
  computeNewConsumptionData,
  isDirectEnergyConsumption,
  isFossilEnergyConsumption,
  isGreyEnergyConsumption,
};

interface ImpactMatrix {
  personalization: PersoForm;
  calculatedValues?: IntermediateValues;
}

const consumptionConfig: {
  [k in ActionNames]: ConsumptionConfig;
} = {
  [availableActions.REDUCE_PLANE_HALF]: {
    order: 1,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "planeDistance",
        update: (value: number) => value * 0.5,
      }),
    ],
  },
  [availableActions.TRANSPORT_STOP_PLANE]: {
    order: 1,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "planeDistance",
        update: (value: number) => 0,
      }),
    ],
  },
  [availableActions.LOCAL_CONSUMPTION]: {
    order: 1,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "eatingLocal",
        update: (value: boolean) => true,
      }),
    ],
  },
  [availableActions.REDUCE_CLOTHING_HALF]: {
    order: 1,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "clothingQuantity",
        update: (value: boolean) => false,
      }),
    ],
  },
  [availableActions.REDUCE_NUMERIC]: {
    order: 1,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "numericEquipment",
        update: (value: boolean) => false,
      }),
    ],
  },
  [availableActions.STOP_MILK]: {
    order: 1,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "eatingDairies",
        update: (value: boolean) => false,
      }),
    ],
  },
  [availableActions.STOP_EGGS]: {
    order: 1,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "eatingEggs",
        update: (value: boolean) => false,
      }),
    ],
  },
  [availableActions.STOP_MEAT]: {
    order: 1,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "eatingMeat",
        update: (value: boolean) => false,
      }),
    ],
  },
  [availableActions.ZERO_WASTE]: {
    order: 1,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "eatingZeroWaste",
        update: (value: boolean) => true,
      }),
    ],
  },
  [availableActions.REDUCE_TRAIN_HALF]: {
    order: 1,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "trainDistance",
        update: (value: number) => value * 0.5,
      }),
    ],
  },
  [availableActions.DIGITAL_REDUCE_INTERNET_HALF]: {
    order: 1,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "numericWebTimeDay",
        update: (value: boolean) => false,
      }),
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "numericVideoTimeDay",
        update: (value: boolean) => false,
      }),
    ],
  },
  [availableActions.HOUSE_INSTALL_EFFICIENT_ELECTRIC_WOOD_HEATING_SYSTEM]: {
    order: 1,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "calculatedValues",
        name: "heatingConsumptionInvoiceCoeff",
        update: (value) => value * 0.4,
      }),
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "heatingConsumption",
        update: (value: number) => value * 0.4,
      }),
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "heatingEnergy",
        update: (value: string) => houseEnergies.ELECTRICITE.value,
      }),
    ],
  },
  [availableActions.HOUSE_INSULATE_WALLS]: {
    order: 2,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "calculatedValues",
        name: "heatingConsumptionInvoiceCoeff",
        update: (value) => value * 0.75,
      }),
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "heatingConsumption",
        update: (value: number) => value * 0.75,
      }),
    ],
  },
  [availableActions.HOUSE_INSULATE_ROOF]: {
    order: 2,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "calculatedValues",
        name: "heatingConsumptionInvoiceCoeff",
        update: (value) => value * 0.75,
      }),
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "heatingConsumption",
        update: (value: number) => value * 0.75,
      }),
    ],
  },
  [availableActions.HOUSE_CHANGE_WOODWORK_WINDOWS]: {
    order: 2,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "calculatedValues",
        name: "heatingConsumptionInvoiceCoeff",
        update: (value) => value * 0.9,
      }),
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "heatingConsumption",
        update: (value: number) => value * 0.9,
      }),
    ],
  },
  [availableActions.HOUSE_INSTALL_EFFICIENT_VENTILATION_SYSTEM]: {
    order: 2,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "calculatedValues",
        name: "heatingConsumptionInvoiceCoeff",
        update: (value) => value * 0.8,
      }),
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "heatingConsumption",
        update: (value: number) => value * 0.8,
      }),
    ],
  },
  [availableActions.HOUSE_19_DEGREES_MAX]: {
    order: 2,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "calculatedValues",
        name: "heatingConsumptionInvoiceCoeff",
        update: (value) =>
          inputMatrix.personalization.heatingTemperature ? value * 0.86 : value,
      }),
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "heatingConsumption",
        update: (value: number) =>
          inputMatrix.personalization.heatingTemperature ? value * 0.86 : value,
      }),
    ],
  },
  [availableActions.HOUSE_REDUCE_SIZE_HALF]: {
    order: 2,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "calculatedValues",
        name: "heatingConsumptionInvoiceCoeff",
        update: (value) => value * 0.5,
      }),
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "heatingConsumption",
        update: (value: number) => value * 0.5,
      }),
    ],
  },
  [availableActions.HOUSE_STOP_AIR_CONDITIONING]: {
    order: 2,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "airConditionning",
        update: (value: boolean) => false,
      }),
    ],
  },
  [availableActions.HOUSE_ONLY_LEDS]: {
    order: 2,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "lightingSystem",
        update: (value: string) => houseLighting.AMPOULES_LED.value,
      }),
    ],
  },
  [availableActions.HOUSE_ONE_SHOWER_5_MINUTES_MAX]: {
    order: 2,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "showerBath",
        update: (value: string) => hygieneCleaning.DOUCHES.value,
      }),
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "showerNumber",
        update: (value: number) => 1,
      }),
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "showerTime",
        update: (value: string) => showerTimes.MOINS_5.value,
      }),
    ],
  },
  [availableActions.HOUSE_EFFICIENT_HOUSEHOLD_APPLIANCES]: {
    order: 2,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "calculatedValues",
        name: "whiteProductsCoeff",
        update: (value) => value * 0.75,
      }),
    ],
  },
  [availableActions.HOUSE_UNPLUNG_APPLIANCES_ON_STANDBY]: {
    order: 2,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "calculatedValues",
        name: "brownGoodsCoeff",
        update: (value) => value + 0.6,
      }),
    ],
  },
  [availableActions.HOUSE_UNPLUNG_CHARGERS]: {
    order: 2,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "calculatedValues",
        name: "brownGoodsCoeff",
        update: (value) => value + 0.01,
      }),
    ],
  },
  [availableActions.STOP_CANS]: {
    order: 1,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "eatingTinDrink",
        update: (value: number) => 0,
      }),
    ],
  },
  [availableActions.CONSUMPTION_SORT_WASTE]: {
    order: 1,
    profileImpacts: [],
  },
  [availableActions.ELECTRIC_CAR]: {
    order: 1,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "carEnergy",
        update: (value: string) => carEnergies.ELECTRICITE.value,
      }),
    ],
  },
  [availableActions.ECO_DRIVING]: {
    order: 2,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "carDistanceAlone",
        update: (value: number) => value * 0.9,
      }),
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "carDistanceCarsharing",
        update: (value: number) => value * 0.9,
      }),
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "carDistanceHoushold",
        update: (value: number) => value * 0.9,
      }),
    ],
  },
  [availableActions.REDUCE_CAR_20]: {
    order: 2,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "carDistanceAlone",
        update: (value: number) => value * 0.8,
      }),
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "carDistanceCarsharing",
        update: (value: number) => value * 0.8,
      }),
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "carDistanceHoushold",
        update: (value: number) => value * 0.8,
      }),
    ],
  },
  [availableActions.KEEP_CAR_15]: {
    order: 2,
    profileImpacts: [
      (inputMatrix: ImpactMatrix) => ({
        type: "personalization",
        name: "carAge",
        update: (value: string) => carAges.PLUS_15.value,
      }),
    ],
  },
};

type ConsumptionConfig = {
  order: number;
  profileImpacts: ConsumptionUpdate[];
};

type ConsumptionUpdate<
  TType extends "calculatedValues" | "personalization" =
    | "calculatedValues"
    | "personalization"
> = (inputMatrix: ImpactMatrix) => TType extends "calculatedValues"
  ? {
      type: "calculatedValues";
      name: keyof IntermediateValues;
      update: (value: number) => number;
    }
  : {
      type: "personalization";
      name: keyof PersoForm;
      update:
        | ((value: boolean) => boolean)
        | ((value: number) => number)
        | ((value: string) => string);
    };

function computeNewConsumptionData(
  performedActionsNames: ActionNames[],
  personalization: PersoForm
) {
  const newPersonalization = cloneDeep(personalization);

  computeConsumption(
    { personalization: newPersonalization },
    performedActionsNames,
    "personalization"
  );
  const fullPersonalization = fillPersonalization(newPersonalization);

  const intermediateValues = computeIntermediateValues(fullPersonalization);
  computeConsumption(
    {
      personalization: newPersonalization,
      calculatedValues: intermediateValues,
    },
    performedActionsNames,
    "calculatedValues"
  );

  return getConsumptionFromProfile(fullPersonalization, intermediateValues);
}

function computeConsumption(
  inputMatrix: ImpactMatrix,
  performedActionsNames: ActionNames[],
  impactType: keyof ImpactMatrix
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

    config.profileImpacts.forEach((getImpact) => {
      const { type } = getImpact(inputMatrix);
      if (impactType === type) {
        applyPersonalizationImpact(inputMatrix, getImpact);
      }
    });
  });
}

function applyPersonalizationImpact(
  inputMatrix: ImpactMatrix,
  getImpact: ConsumptionUpdate
) {
  const { type, name, update } = getImpact(inputMatrix);
  if (type === "calculatedValues" && inputMatrix.calculatedValues) {
    if (inputMatrix.calculatedValues[name] == null) {
      return;
    }

    Object.assign(inputMatrix.calculatedValues, {
      [name]: update(inputMatrix.calculatedValues[name]),
    });
  }

  if (type === "personalization") {
    if (inputMatrix.personalization[name] == null) {
      return;
    }

    Object.assign(inputMatrix.personalization, {
      [name]: (update as any)(inputMatrix.personalization[name]),
    });
  }
}

function isDirectEnergyConsumption(consumption: ConsumptionDatum): boolean {
  return consumption.type !== "grey";
}

function isFossilEnergyConsumption(consumption: ConsumptionDatum): boolean {
  return consumption.type === "fossil";
}

function isGreyEnergyConsumption(consumption: ConsumptionDatum): boolean {
  return consumption.type === "grey";
}
