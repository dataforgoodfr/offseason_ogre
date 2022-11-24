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
  personalization: PersoForm,
  intermediateValues: IntermediateValues
) => {
  return deepFreeze([
    ...getFossilEnergies(personalization, intermediateValues),
    ...getGreyEnergies(personalization),
    ...getMixteEnergies(personalization),
    ...getRenewableEnergies(personalization, intermediateValues),
  ]) as readonly ConsumptionDatum[];
};

function getFossilEnergies(
  personalization: PersoForm,
  intermediateValues: IntermediateValues
): (ConsumptionDatum & { type: "fossil" })[] {
  const energies = [
    {
      name: "fossilCar",
      carbonProductionPerKwh: carbonPerKwh.FOSSIL_CAR,
      value: getFossilCarConsumption(personalization),
    },
    {
      name: "fossilHeating",
      carbonProductionPerKwh: carbonPerKwh.FOSSIL_HEATING,
      value: getFossilHeatingConsumption(personalization, intermediateValues),
    },
    {
      name: "plane",
      carbonProductionPerKwh: carbonPerKwh.PLANE,
      value: getPlaneConsumption(personalization),
    },
  ] as const;
  return energies.map((energie) => ({
    ...energie,
    carbonProduction: "fossil",
    type: "fossil",
  }));
}

function getRenewableEnergies(
  personalization: PersoForm,
  intermediateValues: IntermediateValues
): (ConsumptionDatum & {
  type: "renewable";
})[] {
  const energies = [
    {
      name: "airConditionning",
      value: getAirConditionningConsumption(personalization),
    },
    {
      name: "brownGoods",
      value: getBrownGoodsConsumption(personalization, intermediateValues),
    },
    { name: "cleanCook", value: getCleanCookConsumption(intermediateValues) },
    {
      name: "electricCar",
      value: getElectricCarConsumption(personalization),
    },
    {
      name: "light",
      value: getLightConsumption(personalization),
    },
    {
      name: "noCarbonHeating",
      value: getNoCarbonHeatingConsumption(personalization, intermediateValues),
    },
    {
      name: "train",
      value: getTrainConsumption(personalization),
    },
  ] as const;
  return energies.map((energie) => ({
    ...energie,
    carbonProduction: "electric",
    type: "renewable",
  }));
}

function getMixteEnergies(
  personalization: PersoForm
): (ConsumptionDatum & { type: "mixte" })[] {
  const energies = [
    {
      name: "food",
      value: getFoodConsumption(personalization),
    },
  ] as const;
  return energies.map((energie) => ({
    ...energie,
    carbonProduction: "electric",
    type: "mixte",
  }));
}

function getGreyEnergies(
  personalization: PersoForm
): (ConsumptionDatum & { type: "grey" })[] {
  const energies = [
    {
      name: "greyCar",
      carbonProductionPerKwh: carbonPerKwh.GREY_CAR,
      value: getGreyCarConsumption(personalization),
    },
    {
      name: "greyHouse",
      carbonProductionPerKwh: carbonPerKwh.GREY_HOUSE,
      value: consumptionGrey.HOUSE,
    },
    {
      name: "greyNumeric",
      carbonProductionPerKwh: carbonPerKwh.GREY_NUMERIC,
      value: getGreyNumericConsumption(personalization),
    },
    {
      name: "greyOther",
      carbonProductionPerKwh: carbonPerKwh.GREY_OTHER,
      value: getGreyOther(personalization),
    },
    {
      name: "greyTransport",
      carbonProductionPerKwh: carbonPerKwh.GREY_TRANSPORT,
      value: getGreyTransport(personalization),
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
