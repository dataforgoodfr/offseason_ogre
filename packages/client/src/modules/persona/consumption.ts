import { deepFreeze } from "../../lib/array";
import { consumptionGrey } from "./consumption/constants";
import { carbonPerKwh } from "../play/constants/consumption";
import {
  getAirConditionningConsumption,
  getBrownGoodsConsumption,
  getCleanCookConsumption,
  getElectricCarConsumption,
  getFoodConsumption,
  getFossilCarConsumption,
  getFossilHeatingConsumption,
  getGreyCarConsumption,
  getGreyNumericConsumption,
  getGreyOther,
  getGreyTransport,
  getLightConsumption,
  getNoCarbonHeatingConsumption,
  getPlaneConsumption,
  getTrainConsumption,
} from "./consumption/computing";
import {
  IntermediateValues,
  PersoForm,
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

const getConsumptionFromProfile = (
  profile: PersoForm,
  intermediateValues: IntermediateValues
) => {
  return deepFreeze([
    ...getFossilEnergies(profile, intermediateValues),
    ...getGreyEnergies(profile),
    ...getMixteEnergies(profile),
    ...getRenewableEnergies(profile, intermediateValues),
  ]) as readonly ConsumptionDatum[];
};

function getFossilEnergies(
  profile: PersoForm,
  intermediateValues: IntermediateValues
): (ConsumptionDatum & { type: "fossil" })[] {
  const energies = [
    {
      name: "fossilCar",
      carbonProductionPerKwh: carbonPerKwh.FOSSIL_CAR,
      value: getFossilCarConsumption(profile),
    },
    {
      name: "fossilHeating",
      carbonProductionPerKwh: carbonPerKwh.FOSSIL_HEATING,
      value: getFossilHeatingConsumption(profile, intermediateValues),
    },
    {
      name: "plane",
      carbonProductionPerKwh: carbonPerKwh.PLANE,
      value: getPlaneConsumption(profile),
    },
  ] as const;
  return energies.map((energie) => ({
    ...energie,
    carbonProduction: "fossil",
    type: "fossil",
  }));
}

function getRenewableEnergies(
  profile: PersoForm,
  intermediateValues: IntermediateValues
): (ConsumptionDatum & {
  type: "renewable";
})[] {
  const energies = [
    {
      name: "airConditionning",
      value: getAirConditionningConsumption(profile),
    },
    {
      name: "brownGoods",
      value: getBrownGoodsConsumption(profile, intermediateValues),
    },
    { name: "cleanCook", value: getCleanCookConsumption(intermediateValues) },
    {
      name: "electricCar",
      value: getElectricCarConsumption(profile),
    },
    {
      name: "light",
      value: getLightConsumption(profile),
    },
    {
      name: "noCarbonHeating",
      value: getNoCarbonHeatingConsumption(profile, intermediateValues),
    },
    {
      name: "train",
      value: getTrainConsumption(profile),
    },
  ] as const;
  return energies.map((energie) => ({
    ...energie,
    carbonProduction: "electric",
    type: "renewable",
  }));
}

function getMixteEnergies(
  profile: PersoForm
): (ConsumptionDatum & { type: "mixte" })[] {
  const energies = [
    {
      name: "food",
      value: getFoodConsumption(profile),
    },
  ] as const;
  return energies.map((energie) => ({
    ...energie,
    carbonProduction: "electric",
    type: "mixte",
  }));
}

function getGreyEnergies(
  profile: PersoForm
): (ConsumptionDatum & { type: "grey" })[] {
  const energies = [
    {
      name: "greyCar",
      carbonProductionPerKwh: carbonPerKwh.GREY_CAR,
      value: getGreyCarConsumption(profile),
    },
    {
      name: "greyHouse",
      carbonProductionPerKwh: carbonPerKwh.GREY_HOUSE,
      value: consumptionGrey.HOUSE,
    },
    {
      name: "greyNumeric",
      carbonProductionPerKwh: carbonPerKwh.GREY_NUMERIC,
      value: getGreyNumericConsumption(profile),
    },
    {
      name: "greyOther",
      carbonProductionPerKwh: carbonPerKwh.GREY_OTHER,
      value: getGreyOther(profile),
    },
    {
      name: "greyTransport",
      carbonProductionPerKwh: carbonPerKwh.GREY_TRANSPORT,
      value: getGreyTransport(profile),
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
