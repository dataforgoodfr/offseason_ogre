export { production };
export type { ProductionDatum, ProductionType };

interface ProductionDatum {
  name: string;
  type: ProductionType;
  value: number;
}
type ProductionType = "nuclear";

const production = [
  {
    name: "nuclear",
    type: "nuclear",
    value: 0,
  },
] as ProductionDatum[];

// Productions:
// Terrestre
// Eolien terrestre: 					productionWindTurbineOnshore = 2,084
// Solaire thermique: 					productionThermalSolar = 0,107
// PV toiture: 						productionPhotovoltaicRoof = 0,251
// Ferme solaire: 					productionPhotovoltaicFarm = 0,307
// Biomasse: 						productionBiomass = 7,138

// Hydro
// Hydroélectricité: 					productionHydropower = 2,667
// Eolien offshore: 					productionWindTurbineOffshore = 0,403
// Vagues: 						productionWave = 0
// Marées: 						productionTidal = 0,022
// Géothermie:						productionGeothermal = 0,005
