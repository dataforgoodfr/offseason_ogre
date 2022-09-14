import { productionNames } from "../play/constants";

export { production };
export type { ProductionDatum, ProductionType };

interface ProductionDatum {
  name: string;
  type: ProductionType;
  value: number;
}
type ProductionType = "offshore" | "nuclear" | "terrestrial";

const production = [
  ...getHydroEnergies(),
  ...getNuclearEnergies(),
  ...getTerrestrialEnergies(),
] as ProductionDatum[];

function getHydroEnergies(): (ProductionDatum & {
  type: "offshore";
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
    type: "offshore",
  }));
}

function getNuclearEnergies(): (ProductionDatum & { type: "nuclear" })[] {
  return [];
  // TODO - Nuclear not in V0
  // const energies = [
  //   {
  //     name: "nuclear",
  //     value: 0,
  //   },
  // ];
  // return energies.map((energie) => ({
  //   ...energie,
  //   type: "nuclear",
  // }));
}

function getTerrestrialEnergies(): (ProductionDatum & {
  type: "terrestrial";
})[] {
  const energies = [
    { name: productionNames.biomass, value: 7.138 },
    { name: productionNames.onshoreWindTurbine, value: 2.084 },
    { name: productionNames.photovoltaicFarm, value: 0.307 },
    { name: productionNames.photovoltaicRoof, value: 0.251 },
    { name: productionNames.thermalSolar, value: 0.107 },
  ];
  return energies.map((energie) => ({
    ...energie,
    type: "terrestrial",
  }));
}
