export const DAYS_IN_YEAR = 365;

export const heatingEnergyCoeffs = {
  GAZ: 0.07,
  FIOUL: 0.087,
  BOIS: 0.07,
  ELECTRICITE: 0.15,
};

export const whiteProductsConstants = {
  COOKING_KETTLE: 0.726,
  COOKING_PLATE: 3,
  COOKING_OVEN: 3,
  CLEANING_WASHING: 3,
  CLEANING_DRYER: 3,
  CLEANING_DISHWASHER: 2.5,
  REFRIGERATOR: 0.48,
  FREEZER: 2.16,
  GLOBAL: 0.396,
};

export const lightingConstants = {
  LED: 2,
  OTHER: 4,
};

export const numericEquipment = {
  YES: 7.5,
  NO: 5,
};

export const transportCoeffs = {
  ELECTRIC_CAR: 0.45,
  MEAN_FOSSIL_CAR_CONSUMPTION: 0.07,
  TRAIN: 0.133,
  PLANE: 0.41,
};

export const consumptionGrey = {
  HOUSE: 3,
  PUBLIC_SERVICE: 7.97,
  CAR: 14,
};

export const consumptionFood = {
  VEGAN: 1.5,
  VEGETABLES: 1.5,
  DAIRIES: 1.5,
  EGGS: 1,
  MEAT: 4,
  TIN_DRINK: 0.6,
  ZERO_WASTE: 4,
  CAT: 2,
  DOG: 9,
  HORSE: 17,
  GLOBAL: 2.9,
};

export const consumptionGreyOther = {
  OTHER_GLOBAL: 36,
  LOCAL_TRUE: 0.15,
  LOCAL_FALSE: 0,
  CLOTHING_TRUE: 0,
  CLOTHING_FALSE: 0.15,
};

export const consumptionGreyNumeric = {
  EQUIPMENT_GLOBAL: 3,
  EQUIPMENT_TRUE: 1.5,
  EQUIPMENT_FALSE: 1,
  WEB_GLOBAL: 3,
  WEB_TRUE: 1.15,
  WEB_FALSE: 1,
  VIDEO_TRUE: 1.15,
  VIDEO_FALSE: 1,
};

export const consumptionGreyTransport = {
  GLOBAL: 12,
  LOCAL_TRUE: 0.1,
  LOCAL_FALSE: 0,
  CLOTHING_TRUE: 0,
  CLOTHING_FALSE: 0.1,
};
