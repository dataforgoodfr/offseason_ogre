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
  profile: PersoForm,
  heatingConsumptionInvoiceCoeff: number
) => {
  const { heatingInvoice, heatingConsumption, numberAdults } = profile;
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

export const getHeatingConsumptionInvoiceCoeff = (profile: PersoForm) => {
  const { heatingInvoice, heatingEnergy } = profile;
  return (
    parseFloat(
      (heatingInvoice / getHeatingEnergyCoeff(heatingEnergy))?.toFixed(2)
    ) || 0
  );
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
  throw new Error(`Invalid profile value for heating energy: ${energy}`);
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
  throw new Error(`Invalid profile value for shower time: ${time}`);
};

export const getCarAgeCoeff = (carAge: string) => {
  if (carAge === carAges.MOINS_5) {
    return 3;
  } else if (carAge === carAges.CINQ_DIX) {
    return 2;
  } else if (carAge === carAges.DIX_QUINZE) {
    return 1;
  } else if (carAge === carAges.PLUS_15) {
    return 1;
  }
  throw new Error(`Invalid profile value for car age: ${carAge}`);
};

export const getWhiteProductsCoeff = (profile: PersoForm) => {
  const {
    cookingKettle,
    cookingPlateTime,
    cookingOvenTime,
    cleaningWashingTime,
    cleaningDryerTime,
    cleaningDishwasherTime,
    refrigeratorNumber,
    freezerNumber,
  } = profile;

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

export const getShowerBathCoeff = (profile: PersoForm) => {
  const { showerBath, showerNumber, showerTime } = profile;
  if (showerBath === cleaning.BAINS) {
    return 5;
  }
  return showerNumber * getShowerTimeCoeff(showerTime) * 2.8;
};
