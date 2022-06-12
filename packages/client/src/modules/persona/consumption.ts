export { consumption };
export type { ConsumptionDatum, ConsumptionType };

interface ConsumptionDatum {
  name: string;
  type: ConsumptionType;
  value: number;
}
type ConsumptionType =
  | "fossilEnergy"
  | "renewableEnergy"
  | "mixteEnergy"
  | "greyEnergy";

const consumption = [
  ...getFossilEnergy(),
  ...getRenewableEnergy(),
  ...getMixteEnergy(),
  ...getGreyEnergy(),
] as ConsumptionDatum[];

function getFossilEnergy(): (ConsumptionDatum & { type: "fossilEnergy" })[] {
  const energies = [
    { name: "fossilCar", value: 25.41 },
    { name: "plane", value: 5.57 },
    { name: "fossilHeating", value: 27.4 },
  ];
  return energies.map((energie) => ({
    ...energie,
    type: "fossilEnergy",
  }));
}

function getRenewableEnergy(): (ConsumptionDatum & {
  type: "renewableEnergy";
})[] {
  const energies = [
    { name: "electricCar", value: 0 },
    { name: "train", value: 0.73 },
    { name: "noCarbonHeating", value: 0 },
    { name: "airConditionning", value: 0 },
    { name: "cleanCook", value: 17.36 },
    { name: "Light", value: 4 },
    { name: "brownGoods", value: 7.5 },
  ];
  return energies.map((energie) => ({
    ...energie,
    type: "renewableEnergy",
  }));
}

function getMixteEnergy(): (ConsumptionDatum & { type: "mixteEnergy" })[] {
  const energies = [{ name: "food", value: 14.9 }];
  return energies.map((energie) => ({
    ...energie,
    type: "mixteEnergy",
  }));
}

function getGreyEnergy(): (ConsumptionDatum & { type: "greyEnergy" })[] {
  const energies = [{ name: "greyHouse", value: 3 }];
  return energies.map((datum) => ({
    ...datum,
    type: "greyEnergy",
  }));
}
// Consommations:

// Energie indirecte
// EG construction: 					consumptionGreyHouse = 3
// EG numérique: 					consumptionGreyNumeric = 10,72
// EG fabrication voiture: 				consumptionGreyCar = 42
// EG fret: 						consumptionGreyTransport = 12
// EG autres: 						consumptionGreyOther = 36
// Service public: 					consumptionPublicService = 7,97
