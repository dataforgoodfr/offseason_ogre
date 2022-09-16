import { ProductionActionType } from "../../utils/types";
import { productionNames } from "../play/constants";

export { production };
export type { ProductionDatum };

interface ProductionDatum {
  name: string;
  type: ProductionActionType;
  // Base production in kWh.
  value: number;
}

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
    { name: productionNames.hydraulic, value: 2.67 },
    { name: productionNames.offshoreWindTurbine, value: 0.4 },
    { name: productionNames.tidal, value: 0.02226 },
    { name: productionNames.wave, value: 0.000167 },
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
    { name: productionNames.biomass, value: 7.14 },
    { name: productionNames.onshoreWindTurbine, value: 2.08 },
    { name: productionNames.photovoltaicFarm, value: 0.31 },
    { name: productionNames.photovoltaicRoof, value: 0.25 },
    { name: productionNames.thermalSolar, value: 0.11 },
  ];
  return energies.map((energie) => ({
    ...energie,
    type: "terrestrial",
  }));
}
