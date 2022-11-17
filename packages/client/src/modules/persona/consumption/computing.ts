import {
  carEnergies,
  houseEnergies,
  lighting,
} from "../../play/Personalization/models/form";
import {
  consumptionFood,
  consumptionGrey,
  consumptionGreyNumeric,
  consumptionGreyOther,
  consumptionGreyTransport,
  DAYS_IN_YEAR,
  lightingConstants,
  transportCoeffs,
} from "./constants";
import {
  getCarAgeCoeff,
  getHeatingConsumption,
  getHeatingConsumptionInvoiceCoeff,
  getShowerBathCoeff,
  getWhiteProductsCoeff,
} from "./utils";

export const getFossilCarConsumption = (profile: any) => {
  const {
    carEnergy,
    numberAdults,
    numberKids,
    carConsumption,
    carDistanceAlone,
    carDistanceHoushold,
    carDistanceCarsharing,
  } = profile;
  if (
    ![carEnergies.DIESEL, carEnergies.GPL, carEnergies.HYBRIDE].includes(
      carEnergy
    )
  ) {
    return 0;
  }

  return (
    (((carDistanceAlone / DAYS_IN_YEAR +
      carDistanceHoushold / (DAYS_IN_YEAR * (numberAdults + numberKids))) *
      carConsumption) /
      100 +
      (carDistanceCarsharing * transportCoeffs.MEAN_FOSSIL_CAR_CONSUMPTION) /
        100 /
        DAYS_IN_YEAR) *
    10
  );
};

export const getFossilHeatingConsumption = (profile: any) => {
  const { heatingEnergy } = profile;
  const heatingConsumptionInvoiceCoeff =
    getHeatingConsumptionInvoiceCoeff(profile);

  if (![houseEnergies.FIOUL, houseEnergies.GAZ].includes(heatingEnergy)) {
    return 0;
  }
  return getHeatingConsumption(profile, heatingConsumptionInvoiceCoeff);
};

export const getPlaneConsumption = (profile: any) => {
  const { planeDistance } = profile;
  return (planeDistance / 365) * transportCoeffs.PLANE;
};

export const getAirConditionningConsumption = (profile: any) => {
  const { airConditionning, aCDaysNb, aCRoomNb } = profile;

  if (!airConditionning) {
    return 0;
  }
  return (aCRoomNb * aCDaysNb * 0.6 * 12) / DAYS_IN_YEAR;
};

export const getBrownGoodsConsumption = (profile: any) => {
  const { numericEquipment } = profile;
  if (numericEquipment) {
    return 7.5;
  }
  return 5;
};

export const getCleanCookConsumption = (profile: any) => {
  return getWhiteProductsCoeff(profile) + getShowerBathCoeff(profile);
};

export const getElectricCarConsumption = (profile: any) => {
  const {
    carEnergy,
    carDistanceAlone,
    carDistanceHoushold,
    carDistanceCarsharing,
    numberAdults,
    numberKids,
  } = profile;
  if (carEnergy !== carEnergies.ELECTRICITE) {
    return 0;
  }
  return (
    (carDistanceAlone / DAYS_IN_YEAR +
      carDistanceHoushold / (DAYS_IN_YEAR * (numberAdults + numberKids)) +
      carDistanceCarsharing / DAYS_IN_YEAR) *
    transportCoeffs.ELECTRIC_CAR
  );
};

export const getLightConsumption = (profile: any) => {
  const { lightingSystem } = profile;
  if (lightingSystem === lighting.AMPOULES_LED) {
    return lightingConstants.LED;
  }
  return lightingConstants.OTHER;
};

export const getNoCarbonHeatingConsumption = (profile: any) => {
  const { heatingEnergy } = profile;
  const heatingConsumptionInvoiceCoeff =
    getHeatingConsumptionInvoiceCoeff(profile);

  if (
    ![houseEnergies.BOIS, houseEnergies.ELECTRICITE].includes(heatingEnergy)
  ) {
    return 0;
  }
  return getHeatingConsumption(profile, heatingConsumptionInvoiceCoeff);
};

export const getTrainConsumption = (profile: any) => {
  const { trainDistance } = profile;
  return (trainDistance / 365) * transportCoeffs.TRAIN;
};

export const getFoodConsumption = (profile: any) => {
  const {
    eatingVegan,
    eatingVegetables,
    eatingDairies,
    eatingEggs,
    eatingMeat,
    eatingTinDrink,
    eatingZeroWaste,
    eatingCatNumber,
    eatingDogNumber,
    eatingHorse,
  } = profile;
  const result = [];
  if (eatingVegan) {
    result.push(consumptionFood.VEGAN);
  } else {
    if (eatingVegetables) {
      result.push(consumptionFood.VEGETABLES);
    }
    if (eatingDairies) {
      result.push(consumptionFood.DAIRIES);
    }
    if (eatingEggs) {
      result.push(consumptionFood.EGGS);
    }
    if (eatingMeat) {
      result.push(consumptionFood.MEAT);
    }
  }
  if (!eatingZeroWaste) {
    result.push(consumptionFood.ZERO_WASTE);
  }
  if (eatingHorse) {
    result.push(consumptionFood.HORSE);
  }

  result.push(eatingTinDrink * consumptionFood.TIN_DRINK);
  result.push(eatingCatNumber * consumptionFood.CAT);
  result.push(eatingDogNumber * consumptionFood.DOG);
  result.push(consumptionFood.GLOBAL);

  return result.reduce((a, b) => a + b, 0);
};

export const getGreyCarConsumption = (profile: any) => {
  const { car, carEnergy, carAge } = profile;

  if (!car) {
    return 0;
  }
  return (
    consumptionGrey.CAR *
    (carEnergy === carEnergies.ELECTRICITE ? 1.2 : 1) *
    getCarAgeCoeff(carAge)
  );
};

export const getGreyNumericConsumption = (profile: any) => {
  const { numericEquipment, numericWebTimeDay, numericVideoTimeDay } = profile;

  return (
    consumptionGreyNumeric.EQUIPMENT_GLOBAL *
      (numericEquipment
        ? consumptionGreyNumeric.EQUIPMENT_TRUE
        : consumptionGreyNumeric.EQUIPMENT_FALSE) *
      1.5 +
    consumptionGreyNumeric.WEB_GLOBAL *
      (numericWebTimeDay
        ? consumptionGreyNumeric.WEB_TRUE
        : consumptionGreyNumeric.WEB_FALSE) *
      (numericVideoTimeDay
        ? consumptionGreyNumeric.VIDEO_TRUE
        : consumptionGreyNumeric.VIDEO_FALSE)
  );
};

export const getGreyOther = (profile: any) => {
  const { eatingLocal, clothingQuantity } = profile;

  return (
    consumptionGreyOther.OTHER_GLOBAL *
    (1 -
      (eatingLocal
        ? consumptionGreyOther.LOCAL_TRUE
        : consumptionGreyOther.LOCAL_FALSE) -
      (clothingQuantity
        ? consumptionGreyOther.CLOTHING_TRUE
        : consumptionGreyOther.CLOTHING_FALSE))
  );
};

export const getGreyTransport = (profile: any) => {
  const { eatingLocal, clothingQuantity } = profile;

  return (
    consumptionGreyTransport.GLOBAL *
    (1 -
      (eatingLocal
        ? consumptionGreyTransport.LOCAL_TRUE
        : consumptionGreyTransport.LOCAL_FALSE) -
      (clothingQuantity
        ? consumptionGreyTransport.CLOTHING_TRUE
        : consumptionGreyTransport.CLOTHING_FALSE))
  );
};
