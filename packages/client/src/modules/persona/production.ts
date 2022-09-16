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
    { name: productionNames.GEOTHERMAL, value: 0.0054 },
    { name: productionNames.HYDRAULIC, value: 2.67 },
    { name: productionNames.OFF_SHORE_WIND_TURBINE, value: 0.4 },
    { name: productionNames.TIDAL, value: 0.02226 },
    { name: productionNames.WAVE, value: 0.000167 },
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
    { name: productionNames.BIOMASS, value: 7.14 },
    { name: productionNames.ON_SHORE_WIND_TURBINE, value: 2.08 },
    { name: productionNames.PHOTOVOLTAIC_FARM, value: 0.31 },
    { name: productionNames.PHOTOVOLTAIC_ROOF, value: 0.25 },
    { name: productionNames.THERMAL_SOLAR, value: 0.11 },
  ];
  return energies.map((energie) => ({
    ...energie,
    type: "terrestrial",
  }));
}
