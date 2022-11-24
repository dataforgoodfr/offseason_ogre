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

const heatingEnergyToCoeff = {
  [houseEnergies.GAZ]: heatingEnergyCoeffs.GAZ,
  [houseEnergies.FIOUL]: heatingEnergyCoeffs.FIOUL,
  [houseEnergies.BOIS]: heatingEnergyCoeffs.BOIS,
  [houseEnergies.ELECTRICITE]: heatingEnergyCoeffs.ELECTRICITE,
};

const carAgeToCoeff = {
  [carAges.MOINS_5]: 3,
  [carAges.CINQ_DIX]: 2,
  [carAges.DIX_QUINZE]: 1,
  [carAges.PLUS_15]: 1,
};

const showerTimesToCoeff = {
  [showerTimes.MOINS_5]: 0.5,
  [showerTimes.CINQ_DIX]: 0.75,
  [showerTimes.DIX_QUINZE]: 1.25,
  [showerTimes.PLUS_15]: 2,
};

const getCoeff = (configName: string, mapping: any) => (key: string) => {
  const coeff = mapping[key];
  if (coeff == null) {
    throw new Error(`Invalid personalization value for ${configName}: ${key}`);
  }

  return coeff;
};

export const getCarAgeCoeff = getCoeff("car age", carAgeToCoeff);
export const getShowerTimeCoeff = getCoeff("shower time", showerTimesToCoeff);
export const getHeatingEnergyCoeff = getCoeff(
  "heating energy",
  heatingEnergyToCoeff
);

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
