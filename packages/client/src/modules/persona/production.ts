import {
  ProductionActionNames,
  ProductionActionType,
  ProductionCarbonType,
} from "../../utils/types";
import { productionConstants } from "../play/constants";

export { PRODUCTION };
export type { ProductionDatum };

interface ProductionDatum {
  name: ProductionActionNames;
  type: ProductionActionType;
  carbonType: ProductionCarbonType;
  // Base production in kWh.
  value: number;
  revealOnStep?: number;
}

// TODO: should be moved to ProductionAction model in database
const PRODUCTION: ProductionDatum[] = [
  {
    name: productionConstants.GEOTHERMAL.name,
    value: 0.0054,
    type: "offshore",
    carbonType: "decarbonated",
  },
  {
    name: productionConstants.HYDRAULIC.name,
    value: 2.67,
    type: "offshore",
    carbonType: "decarbonated",
  },
  {
    name: productionConstants.OFF_SHORE_WIND_TURBINE.name,
    value: 0.4,
    type: "offshore",
    carbonType: "decarbonated",
  },
  {
    name: productionConstants.TIDAL.name,
    value: 0.02226,
    type: "offshore",
    carbonType: "decarbonated",
  },
  {
    name: productionConstants.WAVE.name,
    value: 0.000167,
    type: "offshore",
    carbonType: "decarbonated",
  },
  {
    name: productionConstants.NUCLEAR.name,
    value: 0,
    type: "nuclear",
    carbonType: "decarbonated",
    revealOnStep: 5,
  },
  {
    name: productionConstants.BIOMASS.name,
    value: 7.14,
    type: "terrestrial",
    carbonType: "decarbonated",
  },
  {
    name: productionConstants.ON_SHORE_WIND_TURBINE.name,
    value: 2.08,
    type: "terrestrial",
    carbonType: "decarbonated",
  },
  {
    name: productionConstants.PHOTOVOLTAIC_FARM.name,
    value: 0.31,
    type: "terrestrial",
    carbonType: "decarbonated",
  },
  {
    name: productionConstants.PHOTOVOLTAIC_ROOF.name,
    value: 0.25,
    type: "terrestrial",
    carbonType: "decarbonated",
  },
  {
    name: productionConstants.THERMAL_SOLAR.name,
    value: 0.11,
    type: "terrestrial",
    carbonType: "decarbonated",
  },
];
