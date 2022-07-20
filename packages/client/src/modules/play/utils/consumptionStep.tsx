import { ConsumptionDatum } from "../../persona/consumption";
import { persona } from "../../persona/persona";
import { availableActions } from "../playerActions/constants/actions";

export { computeConsumptionChoices };

function computeConsumptionChoices(
  { name, type, value }: ConsumptionDatum,
  performedActionsNames: string[]
) {
  if (performedActionsNames.includes(availableActions.REDUCE_PLANE_HALF)) {
    if (type === "fossil" && name === "plane") {
      value = value * 0.5;
    }
  }
  if (performedActionsNames.includes(availableActions.LOCAL_CONSUMPTION)) {
    if (type === "grey" && name === "greyOther") {
      value = value > 5.4 ? value - 5.4 : 0;
    }
    if (type === "grey" && name === "greyTransport") {
      value = value > 1.2 ? value - 1.2 : 0;
    }
  }
  if (performedActionsNames.includes(availableActions.REDUCE_CLOTHING_HALF)) {
    if (type === "grey" && name === "greyOther") {
      value = value > 5.4 ? value - 5.4 : 0;
    }
    if (type === "grey" && name === "greyTransport") {
      value = value > 1.2 ? value - 1.2 : 0;
    }
  }
  if (performedActionsNames.includes(availableActions.REDUCE_NUMERIC)) {
    if (type === "grey" && name === "greyNumeric") {
      value = value > 3 ? value - 3 : 0;
    }
  }
  if (performedActionsNames.includes(availableActions.STOP_MILK)) {
    if (type === "mixte" && name === "food") {
      value = value > 1.5 ? value - 1.5 : 0;
    }
  }
  if (performedActionsNames.includes(availableActions.STOP_EGGS)) {
    if (type === "mixte" && name === "food") {
      value = value > 1 ? value - 1 : 0;
    }
  }
  if (performedActionsNames.includes(availableActions.STOP_MEAT)) {
    if (type === "mixte" && name === "food") {
      value = value > 4 ? value - 4 : 0;
    }
  }
  if (performedActionsNames.includes(availableActions.ZERO_WASTE)) {
    if (type === "mixte" && name === "food") {
      value = value > 4 ? value - 4 : 0;
    }
  }
  if (performedActionsNames.includes(availableActions.REDUCE_TRAIN_HALF)) {
    if (type === "renewable" && name === "train") {
      value = value * 0.5;
    }
  }

  // Check type of car before checking driving habits
  if (performedActionsNames.includes(availableActions.ELECTRIC_CAR)) {
    if (type === "renewable" && name === "electricCar") {
      value =
        persona.consumption.find(
          (c) => c.type === "fossil" && c.name === "fossilCar"
        )?.value ?? 0;
    }
    if (type === "fossil" && name === "fossilCar") {
      value = 0;
    }
  }
  if (performedActionsNames.includes(availableActions.ECO_DRIVING)) {
    if (type === "fossil" && name === "fossilCar") {
      value = value * 0.9;
    }
    if (type === "renewable" && name === "electricCar") {
      value = value * 0.9;
    }
  }
  if (performedActionsNames.includes(availableActions.REDUCE_CAR_20)) {
    if (type === "fossil" && name === "fossilCar") {
      value = value * 0.8;
    }
    if (type === "renewable" && name === "electricCar") {
      value = value * 0.8;
    }
  }
  if (performedActionsNames.includes(availableActions.KEEP_CAR_15)) {
    if (type === "grey" && name === "greyCar") {
      value = value > 28 ? value - 28 : 0;
    }
  }
  return { name, type, value };
}
