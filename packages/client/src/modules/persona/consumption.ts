import { deepFreeze } from "../../lib/array";

export { consumption };
export type { ConsumptionDatum, ConsumptionName, ConsumptionType };

interface ConsumptionDatum {
  name: ConsumptionName;
  type: ConsumptionType;
  value: number;
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

const consumption = deepFreeze([
  ...getFossilEnergies(),
  ...getGreyEnergies(),
  ...getMixteEnergies(),
  ...getRenewableEnergies(),
]) as readonly ConsumptionDatum[];

function getFossilEnergies(): (ConsumptionDatum & { type: "fossil" })[] {
  const energies = [
    { name: "fossilCar", value: 25.41 },
    { name: "fossilHeating", value: 27.4 },
    { name: "plane", value: 5.57 },
  ] as const;
  return energies.map((energie) => ({
    ...energie,
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
    type: "renewable",
  }));
}

function getMixteEnergies(): (ConsumptionDatum & { type: "mixte" })[] {
  const energies = [{ name: "food", value: 14.9 }] as const;
  return energies.map((energie) => ({
    ...energie,
    type: "mixte",
  }));
}

function getGreyEnergies(): (ConsumptionDatum & { type: "grey" })[] {
  const energies = [
    { name: "greyCar", value: 42 },
    { name: "greyHouse", value: 3 },
    { name: "greyNumeric", value: 10.72 },
    { name: "greyOther", value: 36 },
    { name: "greyTransport", value: 12 },
    { name: "servicePublic", value: 7.97 },
  ] as const;
  return energies.map((datum) => ({
    ...datum,
    type: "grey",
  }));
}
