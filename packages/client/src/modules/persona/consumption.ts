export { consumption };
export type { ConsumptionDatum, ConsumptionType };

interface ConsumptionDatum {
  name: string;
  type: ConsumptionType;
  value: number;
}
type ConsumptionType = "directFossil" | "directDecarbonized";

const consumption = [
  { name: "fossilCar", type: "directFossil", value: 25.41 },
  { name: "plane", type: "directFossil", value: 5.57 },
  { name: "fossileHeating", type: "directFossil", value: 27.4 },
  { name: "electricCar", type: "directDecarbonized", value: 0 },
  { name: "train", type: "directDecarbonized", value: 0.73 },
  { name: "noCarbonHeating", type: "directDecarbonized", value: 0 },
  { name: "airConditionning", type: "directDecarbonized", value: 0 },
  { name: "cleanCook", type: "directDecarbonized", value: 17.36 },
  { name: "Light", type: "directDecarbonized", value: 4 },
  { name: "brownGoods", type: "directDecarbonized", value: 7.5 },
] as ConsumptionDatum[];

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
