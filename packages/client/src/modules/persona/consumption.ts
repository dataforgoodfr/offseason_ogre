export { consumption };
export type { ConsumptionDatum, ConsumptionType };

interface ConsumptionDatum {
  name: string;
  type: ConsumptionType;
  value: number;
}
type ConsumptionType = "directFossile" | "directDecarbonized";

const consumption = [
  { name: "fossileCar", type: "directFossile", value: 25.41 },
  { name: "plane", type: "directFossile", value: 5.57 },
  { name: "fossileHeating", type: "directFossile", value: 27.4 },
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
