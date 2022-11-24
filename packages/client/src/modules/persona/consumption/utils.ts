import {
  houseEnergies,
  showerTimes,
  carAges,
  cleaning,
  PersoForm,
} from "../../play/Personalization/models/form";
import {
  DAYS_IN_YEAR,
  heatingEnergyCoeffs,
  whiteProductsConstants,
} from "./constants";

export const getHeatingConsumption = (
  personalization: PersoForm,
  heatingConsumptionInvoiceCoeff: number
) => {
  const { heatingInvoice, heatingConsumption, numberAdults } = personalization;
  if (heatingInvoice === 0) {
    return heatingConsumption / (DAYS_IN_YEAR * numberAdults);
  }

  if (heatingConsumption === 0) {
    return heatingConsumptionInvoiceCoeff / (DAYS_IN_YEAR * numberAdults);
  }
  return (
    (heatingConsumptionInvoiceCoeff + heatingConsumption) /
    2 /
    (DAYS_IN_YEAR * numberAdults)
  );
};

export const getHeatingConsumptionInvoiceCoeff = (
  personalization: PersoForm
) => {
  const { heatingInvoice, heatingEnergy } = personalization;
  return heatingInvoice / getHeatingEnergyCoeff(heatingEnergy);
};

const getHeatingEnergyCoeff = (energy: string) => {
  if (energy === houseEnergies.GAZ) {
    return heatingEnergyCoeffs.GAZ;
  } else if (energy === houseEnergies.FIOUL) {
    return heatingEnergyCoeffs.FIOUL;
  } else if (energy === houseEnergies.BOIS) {
    return heatingEnergyCoeffs.BOIS;
  } else if (energy === houseEnergies.ELECTRICITE) {
    return heatingEnergyCoeffs.ELECTRICITE;
  }
  throw new Error(
    `Invalid personalization value for heating energy: ${energy}`
  );
};

export const getShowerTimeCoeff = (time: string) => {
  if (time === showerTimes.MOINS_5) {
    return 0.5;
  } else if (time === showerTimes.CINQ_DIX) {
    return 0.75;
  } else if (time === showerTimes.DIX_QUINZE) {
    return 1.25;
  } else if (time === showerTimes.PLUS_15) {
    return 2;
  }
  throw new Error(`Invalid personalization value for shower time: ${time}`);
};

export const getCarAgeCoeff = (carAge: string) => {
  if (carAge === carAges.MOINS_5) {
    return 3;
  } else if (carAge === carAges.CINQ_DIX) {
    return 0.75;
  } else if (carAge === carAges.DIX_QUINZE) {
    return 1.25;
  } else if (carAge === carAges.PLUS_15) {
    return 2;
  }
  throw new Error(`Invalid personalization value for car age: ${carAge}`);
};

export const getWhiteProductsCoeff = (personalization: PersoForm) => {
  const {
    cookingKettle,
    cookingPlateTime,
    cookingOvenTime,
    cleaningWashingTime,
    cleaningDryerTime,
    cleaningDishwasherTime,
    refrigeratorNumber,
    freezerNumber,
  } = personalization;

  const result = [];
  if (cookingKettle) {
    result.push(whiteProductsConstants.COOKING_KETTLE);
  }

  result.push(cookingPlateTime * whiteProductsConstants.COOKING_PLATE);
  result.push(cookingOvenTime * whiteProductsConstants.COOKING_OVEN);
  result.push(cleaningWashingTime * whiteProductsConstants.CLEANING_WASHING);
  result.push(cleaningDryerTime * whiteProductsConstants.CLEANING_DRYER);
  result.push(
    cleaningDishwasherTime * whiteProductsConstants.CLEANING_DISHWASHER
  );
  result.push(refrigeratorNumber * whiteProductsConstants.REFRIGERATOR);
  result.push(freezerNumber * whiteProductsConstants.FREEZER);
  result.push(whiteProductsConstants.GLOBAL);
  return result.reduce((a, b) => a + b, 0);
};

export const getShowerBathCoeff = (personalization: PersoForm) => {
  const { showerBath, showerNumber, showerTime } = personalization;
  if (showerBath === cleaning.BAINS) {
    return 5;
  }
  return showerNumber * getShowerTimeCoeff(showerTime) * 2.8;
};
