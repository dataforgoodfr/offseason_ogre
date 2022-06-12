export { production };
export type { ProductionDatum, ProductionType };

interface ProductionDatum {
  name: string;
  type: ProductionType;
  value: number;
}
type ProductionType =
  | "nuclear"
  | "offshoreProduction"
  | "terrestrialProduction";

const production = [
  ...getNuclearEnergies(),
  ...getTerrestrialEnergies(),
] as ProductionDatum[];

function getNuclearEnergies(): (ProductionDatum & { type: "nuclear" })[] {
  const energies = [
    {
      name: "nuclear",
      value: 0,
    },
  ];
  return energies.map((energie) => ({
    ...energie,
    type: "nuclear",
  }));
}

function getTerrestrialEnergies(): (ProductionDatum & {
  type: "terrestrialProduction";
})[] {
  const energies = [
    { name: "biomass", value: 7.138 },
    {
      name: "onshoreWindTurbine",
      value: 2.084,
    },
    { name: "photovoltaicFarm", value: 0.307 },
    { name: "photovoltaicRoof", value: 0.251 },
    { name: "thermalSolar", value: 0.107 },
  ];
  return energies.map((energie) => ({
    ...energie,
    type: "terrestrialProduction",
  }));
}

// Productions:

// Hydro
// Hydroélectricité: 					productionHydropower = 2,667
// Eolien offshore: 					productionWindTurbineOffshore = 0,403
// Vagues: 						productionWave = 0
// Marées: 						productionTidal = 0,022
// Géothermie:						productionGeothermal = 0,005
