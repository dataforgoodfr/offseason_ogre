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
] as ConsumptionDatum[];

function getFossilEnergy(): (ConsumptionDatum & { type: "fossilEnergy" })[] {
  return [
    { name: "fossilCar", type: "fossilEnergy", value: 25.41 },
    { name: "plane", type: "fossilEnergy", value: 5.57 },
    { name: "fossilHeating", type: "fossilEnergy", value: 27.4 },
  ];
}

function getRenewableEnergy(): (ConsumptionDatum & {
  type: "renewableEnergy";
})[] {
  return [
    { name: "electricCar", type: "renewableEnergy", value: 0 },
    { name: "train", type: "renewableEnergy", value: 0.73 },
    { name: "noCarbonHeating", type: "renewableEnergy", value: 0 },
    { name: "airConditionning", type: "renewableEnergy", value: 0 },
    { name: "cleanCook", type: "renewableEnergy", value: 17.36 },
    { name: "Light", type: "renewableEnergy", value: 4 },
    { name: "brownGoods", type: "renewableEnergy", value: 7.5 },
  ];
}

function getMixteEnergy(): (ConsumptionDatum & { type: "mixteEnergy" })[] {
  return [{ name: "food", type: "mixteEnergy", value: 14.9 }];
}
// Consommations:

// Energie directe mixte
// Se nourrir: 						consumptionFood = 14,9

// Energie indirecte
// EG construction: 					consumptionGreyHouse = 3
// EG numérique: 					consumptionGreyNumeric = 10,72
// EG fabrication voiture: 				consumptionGreyCar = 42
// EG fret: 						consumptionGreyTransport = 12
// EG autres: 						consumptionGreyOther = 36
// Service public: 					consumptionPublicService = 7,97
