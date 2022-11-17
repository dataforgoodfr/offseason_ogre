import { deepFreeze } from "../../lib/array";
import {
  consumptionGrey,
  DAYS_IN_YEAR,
  heatingEnergyCoeffs,
  lightingConstants,
  numericEquipment,
  transportCoeffs,
  whiteProductsConstants,
} from "../common/constants/consumption";
import { carbonPerKwh } from "../play/constants/consumption";
import {
  carAges,
  carEnergies,
  houseEnergies,
  lighting,
  showerTimes,
} from "../play/Personalization/models/form";

export { getConsumptionFromProfile };
export type { ConsumptionDatum, ConsumptionName, ConsumptionType };

interface ConsumptionDatum {
  name: ConsumptionName;
  type: ConsumptionType;
  value: number;
  carbonProduction: CarbonProduction;
  carbonProductionPerKwh?: number;
}
type ConsumptionName =
  | "fossilCar"
  | "fossilHeating"
  | "plane"
  | "airConditionning"
  | "brownGoods"
  | "cleanCook"
  | "electricCar"
  | "light"
  | "noCarbonHeating"
  | "train"
  | "food"
  | "greyCar"
  | "greyHouse"
  | "greyNumeric"
  | "greyOther"
  | "greyTransport"
  | "servicePublic";
type ConsumptionType = "fossil" | "grey" | "mixte" | "renewable";
type CarbonProduction = "electric" | "fossil";

const computeConsumption = (
  profile: any,
  heatingConsumptionInvoiceCoeff: number
) => {
  return deepFreeze([
    ...getFossilEnergies(profile, heatingConsumptionInvoiceCoeff),
    ...getGreyEnergies(profile),
    ...getMixteEnergies(profile),
    ...getRenewableEnergies(profile, heatingConsumptionInvoiceCoeff),
  ]) as readonly ConsumptionDatum[];
};

function getFossilEnergies(
  profile: any,
  heatingConsumptionInvoiceCoeff: number
): (ConsumptionDatum & { type: "fossil" })[] {
  const energies = [
    {
      name: "fossilCar",
      carbonProductionPerKwh: carbonPerKwh.FOSSIL_CAR,
      value: [
        carEnergies.DIESEL,
        carEnergies.GPL,
        carEnergies.HYBRIDE,
      ].includes(profile.carEnergy)
        ? (((profile.carDistanceAlone / DAYS_IN_YEAR +
            profile.carDistanceHoushold /
              (DAYS_IN_YEAR * (profile.numberAdults + profile.numberKids))) *
            profile.carConsumption) /
            100 +
            (profile.carDistanceCarsharing *
              transportCoeffs.MEAN_FOSSIL_CAR_CONSUMPTION) /
              100 /
              DAYS_IN_YEAR) *
          10
        : 0,
    },
    {
      name: "fossilHeating",
      carbonProductionPerKwh: carbonPerKwh.FOSSIL_HEATING,
      value: [houseEnergies.FIOUL, houseEnergies.GAZ].includes(
        profile.heatingEnergy
      )
        ? profile.heatingInvoice === 0
          ? profile.heatingConsumption / (DAYS_IN_YEAR * profile.numberAdults)
          : profile.heatingConsumption === 0
          ? heatingConsumptionInvoiceCoeff /
            (DAYS_IN_YEAR * profile.numberAdults)
          : (heatingConsumptionInvoiceCoeff + profile.heatingConsumption) /
            2 /
            (DAYS_IN_YEAR * profile.numberAdults)
        : 0,
    },
    {
      name: "plane",
      carbonProductionPerKwh: carbonPerKwh.PLANE,
      value: (profile.planeDistance / 365) * transportCoeffs.PLANE,
    },
  ] as const;
  return energies.map((energie) => ({
    ...energie,
    carbonProduction: "fossil",
    type: "fossil",
  }));
}

function getRenewableEnergies(
  profile: any,
  heatingConsumptionInvoiceCoeff: number
): (ConsumptionDatum & {
  type: "renewable";
})[] {
  const whiteProductsCoeff =
    (profile.cookingKettle ? whiteProductsConstants.COOKING_KETTLE : 0) +
    profile.cookingPlateTime * whiteProductsConstants.COOKING_PLATE +
    profile.cookingOvenTime * whiteProductsConstants.COOKING_OVEN +
    0.396 +
    profile.cleaningWashingTime * whiteProductsConstants.CLEANING_WASHING +
    profile.cleaningDryerTime * whiteProductsConstants.CLEANING_DRYER +
    profile.cleaningDishwasherTime *
      whiteProductsConstants.CLEANING_DISHWASHER +
    profile.refrigeratorNumber * whiteProductsConstants.REFRIGERATOR +
    profile.freezerNumber * whiteProductsConstants.FREEZER;

  const showerBathCoeff =
    profile.showerBath === "Bains"
      ? 5
      : profile.showerNumber * getShowerTimeCoeff(profile.showerTime) * 2.8;

  const energies = [
    {
      name: "airConditionning",
      value: profile.airConditionning
        ? (profile.aCRoomNb * profile.aCDaysNb * 0.6 * 12) / DAYS_IN_YEAR
        : 0,
    },
    {
      name: "brownGoods",
      value: profile.numericEquipment
        ? numericEquipment.YES
        : numericEquipment.NO,
    },
    { name: "cleanCook", value: whiteProductsCoeff + showerBathCoeff },
    {
      name: "electricCar",
      value:
        profile.carEnergy === carEnergies.ELECTRICITE
          ? (profile.carDistanceAlone / DAYS_IN_YEAR +
              profile.carDistanceHoushold /
                (DAYS_IN_YEAR * (profile.numberAdults + profile.numberKids)) +
              profile.carDistanceCarsharing / DAYS_IN_YEAR) *
            transportCoeffs.ELECTRIC_CAR
          : 0,
    },
    {
      name: "light",
      value:
        profile.lightingSystem === lighting.AMPOULES_LED
          ? lightingConstants.LED
          : lightingConstants.OTHER,
    },
    {
      name: "noCarbonHeating",
      value: [houseEnergies.BOIS, houseEnergies.ELECTRICITE].includes(
        profile.heatingEnergy
      )
        ? (profile.heatingInvoice === 0
            ? profile.heatingConsumption
            : profile.heatingConsumption === 0
            ? heatingConsumptionInvoiceCoeff
            : (heatingConsumptionInvoiceCoeff + profile.heatingConsumption) /
              2) /
          (DAYS_IN_YEAR * profile.numberAdults)
        : 0,
    },
    {
      name: "train",
      value: (profile.trainDistance / DAYS_IN_YEAR) * transportCoeffs.TRAIN,
    },
  ] as const;
  return energies.map((energie) => ({
    ...energie,
    carbonProduction: "electric",
    type: "renewable",
  }));
}

function getMixteEnergies(
  profile: any
): (ConsumptionDatum & { type: "mixte" })[] {
  const energies = [
    {
      name: "food",
      value:
        (profile.eatingVegan ? 1.5 : 0) +
        (profile.eatingVegetables ? 1.5 : 0) +
        (profile.eatingDairies ? 1.5 : 0) +
        (profile.eatingEggs ? 1 : 0) +
        (profile.eatingMeat ? 4 : 0) +
        profile.eatingTinDrink * 0.6 +
        (profile.eatingZeroWaste ? 0 : 4) +
        profile.eatingCatNumber * 2 +
        profile.eatingDogNumber * 9 +
        (profile.eatingHorse ? 17 : 0) +
        2.9,
    },
  ] as const;
  return energies.map((energie) => ({
    ...energie,
    carbonProduction: "electric",
    type: "mixte",
  }));
}

function getGreyEnergies(
  profile: any
): (ConsumptionDatum & { type: "grey" })[] {
  const energies = [
    {
      name: "greyCar",
      carbonProductionPerKwh: carbonPerKwh.GREY_CAR,
      value:
        consumptionGrey.CAR *
        (profile.car ? 1 : 0) *
        (profile.carEnergy === carEnergies.ELECTRICITE ? 1.2 : 1) *
        getCarAgeCoeff(profile.carAge),
    },
    {
      name: "greyHouse",
      carbonProductionPerKwh: carbonPerKwh.GREY_HOUSE,
      value: consumptionGrey.HOUSE,
    },
    {
      name: "greyNumeric",
      carbonProductionPerKwh: carbonPerKwh.GREY_NUMERIC,
      value:
        consumptionGrey.NUMERIC_EQUIPMENT *
          (profile.numericEquipment ? 1.5 : 1) *
          1.5 +
        3 *
          (profile.numericWebTimeDay ? 1.15 : 1) *
          (profile.numericVideoTimeDay ? 1.15 : 1),
    },
    {
      name: "greyOther",
      carbonProductionPerKwh: carbonPerKwh.GREY_OTHER,
      value:
        consumptionGrey.OTHER *
        (1 -
          (profile.eatingLocal ? 0.15 : 0) -
          (profile.clothingQuantity ? 0 : 0.15)),
    },
    {
      name: "greyTransport",
      carbonProductionPerKwh: carbonPerKwh.GREY_TRANSPORT,
      value:
        consumptionGrey.TRANSPORT *
        (1 -
          (profile.eatingLocal ? 0.1 : 0) -
          (profile.clothingQuantity ? 0 : 0.1)),
    },
    {
      name: "servicePublic",
      carbonProductionPerKwh: carbonPerKwh.PUBLIC_SERVICE,
      value: consumptionGrey.PUBLIC_SERVICE,
    },
  ] as const;
  return energies.map((datum) => ({
    ...datum,
    carbonProduction: "fossil",
    type: "grey",
  }));
}

const getHeatingEneryCoeff = (energy: string) => {
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

const getShowerTimeCoeff = (time: string) => {
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

const getCarAgeCoeff = (carAge: string) => {
  if (carAge === carAges.MOINS_5) {
    return 3;
  } else if (carAge === carAges.CINQ_DIX) {
    return 0.75;
  } else if (carAge === carAges.DIX_QUINZE) {
    return 1.25;
  } else if (carAge === carAges.PLUS_15) {
    return 2;
  }
  throw new Error(`Invalid profile value for car age: ${carAge}`);
};

const getConsumptionFromProfile = (profile: any) => {
  const heatingConsumptionInvoiceCoeff =
    profile.heatingInvoice / getHeatingEneryCoeff(profile.heatingEnergy);

  return computeConsumption(profile, heatingConsumptionInvoiceCoeff);
};
