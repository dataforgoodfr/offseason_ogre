import { sumReducer } from "../../../lib/array";
import { ActionNames, PlayerActions } from "../../../utils/types";
import { PersoForm } from "../Personalization/models/form";
import { availableActions } from "../playerActions/constants/actions";

export { computeConsumptionPoints };

interface ScoreConfig {
  hasEarnedPoints: (
    personalization: PersoForm,
    isPlayerActionPerformed: (actionName: ActionNames) => boolean
  ) => boolean;
  points: number;
  step: 1 | 3;
}

const PERSONALIZATION_TO_SCORE_CONFIG: Partial<
  Record<keyof PersoForm, ScoreConfig>
> = {
  /*******************
   * Step 1
   ******************/
  clothingQuantity: {
    hasEarnedPoints: (personalization: PersoForm) =>
      !personalization.clothingQuantity,
    points: 200,
    step: 1,
  },
  eatingDairies: {
    hasEarnedPoints: (personalization: PersoForm) =>
      !personalization.eatingDairies && !personalization.eatingVegan,
    points: 100,
    step: 1,
  },
  eatingEggs: {
    hasEarnedPoints: (personalization: PersoForm) =>
      !personalization.eatingEggs && !personalization.eatingVegan,
    points: 100,
    step: 1,
  },
  eatingLocal: {
    hasEarnedPoints: (personalization: PersoForm) =>
      personalization.eatingLocal,
    points: 200,
    step: 1,
  },
  eatingMeat: {
    hasEarnedPoints: (personalization: PersoForm) =>
      !personalization.eatingMeat && !personalization.eatingVegan,
    points: 100,
    step: 1,
  },
  eatingVegan: {
    hasEarnedPoints: (personalization: PersoForm) =>
      personalization.eatingVegan,
    points: 400,
    step: 1,
  },
  eatingZeroWaste: {
    hasEarnedPoints: (personalization: PersoForm) =>
      personalization.eatingZeroWaste,
    points: 200,
    step: 1,
  },
  planeDistance: {
    hasEarnedPoints: (personalization: PersoForm) =>
      personalization.planeDistance === 0,
    points: 400,
    step: 1,
  },
  /*******************
   * Step 3
   ******************/
  heatingTemperature: {
    hasEarnedPoints: (personalization: PersoForm) =>
      !personalization.heatingTemperature,
    points: 200,
    step: 3,
  },
  heatPump: {
    hasEarnedPoints: (personalization: PersoForm) => personalization.heatPump,
    points: 200,
    step: 3,
  },
} as const;

const PLAYER_ACTIONS_TO_SCORE_CONFIG: Partial<
  Record<ActionNames, ScoreConfig>
> = {
  /*******************
   * Step 1
   ******************/
  [availableActions.ECO_DRIVING]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) =>
      !personalization.eatingLocal &&
      isPlayerActionPerformed(availableActions.ECO_DRIVING),
    points: 200,
    step: 1,
  },
  [availableActions.LOCAL_CONSUMPTION]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) =>
      !personalization.eatingLocal &&
      isPlayerActionPerformed(availableActions.LOCAL_CONSUMPTION),
    points: 200,
    step: 1,
  },
  [availableActions.REDUCE_CAR_20]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) => isPlayerActionPerformed(availableActions.REDUCE_CAR_20),
    points: 300,
    step: 1,
  },
  [availableActions.REDUCE_CLOTHING_HALF]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) =>
      personalization.clothingQuantity &&
      isPlayerActionPerformed(availableActions.REDUCE_CLOTHING_HALF),
    points: 200,
    step: 1,
  },
  [availableActions.REDUCE_NUMERIC]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) => isPlayerActionPerformed(availableActions.REDUCE_NUMERIC),
    points: 200,
    step: 1,
  },
  [availableActions.REDUCE_PLANE_HALF]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) =>
      personalization.planeDistance > 0 &&
      isPlayerActionPerformed(availableActions.REDUCE_PLANE_HALF),
    points: 200,
    step: 1,
  },
  [availableActions.STOP_EGGS]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) =>
      personalization.eatingEggs &&
      isPlayerActionPerformed(availableActions.STOP_EGGS),
    points: 100,
    step: 1,
  },
  [availableActions.STOP_MEAT]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) =>
      personalization.eatingMeat &&
      isPlayerActionPerformed(availableActions.STOP_MEAT),
    points: 200,
    step: 1,
  },
  [availableActions.STOP_MILK]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) =>
      personalization.eatingDairies &&
      isPlayerActionPerformed(availableActions.STOP_MILK),
    points: 100,
    step: 1,
  },
  [availableActions.ZERO_WASTE]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) =>
      !personalization.eatingZeroWaste &&
      isPlayerActionPerformed(availableActions.ZERO_WASTE),
    points: 200,
    step: 1,
  },
  /*******************
   * Step 3
   ******************/
  [availableActions.HOUSE_19_DEGREES_MAX]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) =>
      personalization.heatingTemperature &&
      isPlayerActionPerformed(availableActions.HOUSE_19_DEGREES_MAX),
    points: 200,
    step: 3,
  },
  [availableActions.HOUSE_CHANGE_WOODWORK_WINDOWS]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) =>
      isPlayerActionPerformed(availableActions.HOUSE_CHANGE_WOODWORK_WINDOWS),
    points: 300,
    step: 3,
  },
  [availableActions.HOUSE_EFFICIENT_HOUSEHOLD_APPLIANCES]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) =>
      isPlayerActionPerformed(
        availableActions.HOUSE_EFFICIENT_HOUSEHOLD_APPLIANCES
      ),
    points: 100,
    step: 3,
  },
  [availableActions.HOUSE_INSTALL_EFFICIENT_ELECTRIC_WOOD_HEATING_SYSTEM]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) =>
      !personalization.heatPump &&
      isPlayerActionPerformed(
        availableActions.HOUSE_INSTALL_EFFICIENT_ELECTRIC_WOOD_HEATING_SYSTEM
      ),
    points: 200,
    step: 3,
  },
  [availableActions.HOUSE_INSTALL_EFFICIENT_VENTILATION_SYSTEM]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) =>
      isPlayerActionPerformed(
        availableActions.HOUSE_INSTALL_EFFICIENT_VENTILATION_SYSTEM
      ),
    points: 300,
    step: 3,
  },
  [availableActions.HOUSE_INSULATE_ROOF]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) => isPlayerActionPerformed(availableActions.HOUSE_INSULATE_ROOF),
    points: 300,
    step: 3,
  },
  [availableActions.HOUSE_INSULATE_WALLS]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) => isPlayerActionPerformed(availableActions.HOUSE_INSULATE_WALLS),
    points: 300,
    step: 3,
  },
  [availableActions.HOUSE_REDUCE_SIZE_HALF]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) => isPlayerActionPerformed(availableActions.HOUSE_REDUCE_SIZE_HALF),
    points: 600,
    step: 3,
  },
  [availableActions.TRANSPORT_STOP_PLANE]: {
    hasEarnedPoints: (
      personalization: PersoForm,
      isPlayerActionPerformed: (actionName: ActionNames) => boolean
    ) => isPlayerActionPerformed(availableActions.TRANSPORT_STOP_PLANE),
    points: 200,
    step: 3,
  },
} as const;

function computeConsumptionPoints(
  personalization: PersoForm,
  performedPlayerAction: PlayerActions[],
  step: number
) {
  return evaluateScoreConfigs(
    getScoreConfigs(),
    step,
    personalization,
    getIsPlayerActionPerformedChecker(performedPlayerAction)
  );
}

function getScoreConfigs() {
  return [
    ...Object.values(PERSONALIZATION_TO_SCORE_CONFIG),
    ...Object.values(PLAYER_ACTIONS_TO_SCORE_CONFIG),
  ];
}

function getIsPlayerActionPerformedChecker(
  performedPlayerAction: PlayerActions[]
) {
  const playerActionsToIsPerformed = Object.fromEntries(
    performedPlayerAction.map((performedAction) => [
      performedAction.action.name,
      performedAction.isPerformed,
    ])
  );

  const isPlayerActionPerformed = (actionName: ActionNames) =>
    !!playerActionsToIsPerformed[actionName];

  return isPlayerActionPerformed;
}

function evaluateScoreConfigs(
  scoreConfigs: ScoreConfig[],
  step: number,
  personalization: PersoForm,
  isPlayerActionPerformed: (actionName: ActionNames) => boolean
) {
  return scoreConfigs
    .filter((scoreConfig) => scoreConfig.step <= step)
    .map((scoreConfig) =>
      getPoints(scoreConfig, personalization, isPlayerActionPerformed)
    )
    .reduce(sumReducer, 0);
}

function getPoints(
  scoreConfig: ScoreConfig,
  personalization: PersoForm,
  isPlayerActionPerformed: (actionName: ActionNames) => boolean
) {
  return scoreConfig.hasEarnedPoints(personalization, isPlayerActionPerformed)
    ? scoreConfig.points
    : 0;
}
