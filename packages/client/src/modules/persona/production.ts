import { ProductionActionNames, ProductionActionType } from "../../utils/types";
import { productionConstants } from "../play/constants";

export { production };
export type { ProductionDatum };

interface ProductionDatum {
  name: ProductionActionNames;
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
    { name: productionConstants.GEOTHERMAL.name, value: 0.0054 },
    { name: productionConstants.HYDRAULIC.name, value: 2.67 },
    { name: productionConstants.OFF_SHORE_WIND_TURBINE.name, value: 0.4 },
    { name: productionConstants.TIDAL.name, value: 0.02226 },
    { name: productionConstants.WAVE.name, value: 0.000167 },
  ];
  return energies.map((energie) => ({
    ...energie,
    type: "offshore",
  }));
}

function getNuclearEnergies(): (ProductionDatum & { type: "nuclear" })[] {
  const energies = [
    {
      name: productionConstants.NUCLEAR.name,
      value: 0,
    },
  ];
  return energies.map((energie) => ({
    ...energie,
    type: "nuclear",
  }));
}

function getTerrestrialEnergies(): (ProductionDatum & {
  type: "terrestrial";
})[] {
  const energies = [
    { name: productionConstants.BIOMASS.name, value: 7.14 },
    { name: productionConstants.ON_SHORE_WIND_TURBINE.name, value: 2.08 },
    { name: productionConstants.PHOTOVOLTAIC_FARM.name, value: 0.31 },
    { name: productionConstants.PHOTOVOLTAIC_ROOF.name, value: 0.25 },
    { name: productionConstants.THERMAL_SOLAR.name, value: 0.11 },
  ];
  return energies.map((energie) => ({
    ...energie,
    type: "terrestrial",
  }));
}
