export { production };
export type { ProductionDatum, ProductionType };

interface ProductionDatum {
  name: string;
  type: ProductionType;
  value: number;
}
type ProductionType = "hydroProduction" | "nuclear" | "terrestrialProduction";

const production = [
  ...getHydroEnergies(),
  ...getNuclearEnergies(),
  ...getTerrestrialEnergies(),
] as ProductionDatum[];

function getHydroEnergies(): (ProductionDatum & {
  type: "hydroProduction";
})[] {
  const energies = [
    { name: "geothermal", value: 0.005 },
    { name: "hydroPower", value: 2.667 },
    { name: "offshoreTurbine", value: 0.403 },
    { name: "tidal", value: 0.022 },
    { name: "wave", value: 0 },
  ];
  return energies.map((energie) => ({
    ...energie,
    type: "hydroProduction",
  }));
}

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
