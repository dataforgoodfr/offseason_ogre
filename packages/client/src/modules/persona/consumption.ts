import { deepFreeze } from "../../lib/array";
import { carbonPerKwh } from "../play/constants/consumption";

export { consumption };
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

const consumption = deepFreeze([
  ...getFossilEnergies(),
  ...getGreyEnergies(),
  ...getMixteEnergies(),
  ...getRenewableEnergies(),
]) as readonly ConsumptionDatum[];

function getFossilEnergies(): (ConsumptionDatum & { type: "fossil" })[] {
  const energies = [
    {
      name: "fossilCar",
      carbonProductionPerKwh: carbonPerKwh.FOSSIL_CAR,
      value: 25.41,
    },
    {
      name: "fossilHeating",
      carbonProductionPerKwh: carbonPerKwh.FOSSIL_HEATING,
      value: 27.4,
    },
    { name: "plane", carbonProductionPerKwh: carbonPerKwh.PLANE, value: 5.57 },
  ] as const;
  return energies.map((energie) => ({
    ...energie,
    carbonProduction: "fossil",
    type: "fossil",
  }));
}

function getRenewableEnergies(): (ConsumptionDatum & {
  type: "renewable";
})[] {
  const energies = [
    { name: "airConditionning", value: 0 },
    { name: "brownGoods", value: 7.5 },
    { name: "cleanCook", value: 17.36 },
    { name: "electricCar", value: 0 },
    { name: "light", value: 4 },
    { name: "noCarbonHeating", value: 0 },
    { name: "train", value: 0.73 },
  ] as const;
  return energies.map((energie) => ({
    ...energie,
    carbonProduction: "electric",
    type: "renewable",
  }));
}

function getMixteEnergies(): (ConsumptionDatum & { type: "mixte" })[] {
  const energies = [{ name: "food", value: 14.9 }] as const;
  return energies.map((energie) => ({
    ...energie,
    carbonProduction: "electric",
    type: "mixte",
  }));
}

function getGreyEnergies(): (ConsumptionDatum & { type: "grey" })[] {
  const energies = [
    {
      name: "greyCar",
      carbonProductionPerKwh: carbonPerKwh.GREY_CAR,
      value: 42,
    },
    {
      name: "greyHouse",
      carbonProductionPerKwh: carbonPerKwh.GREY_HOUSE,
      value: 3,
    },
    {
      name: "greyNumeric",
      carbonProductionPerKwh: carbonPerKwh.GREY_NUMERIC,
      value: 10.72,
    },
    {
      name: "greyOther",
      carbonProductionPerKwh: carbonPerKwh.GREY_OTHER,
      value: 36,
    },
    {
      name: "greyTransport",
      carbonProductionPerKwh: carbonPerKwh.GREY_TRANSPORT,
      value: 12,
    },
    {
      name: "servicePublic",
      carbonProductionPerKwh: carbonPerKwh.PUBLIC_SERVICE,
      value: 7.97,
    },
  ] as const;
  return energies.map((datum) => ({
    ...datum,
    carbonProduction: "fossil",
    type: "grey",
  }));
}
