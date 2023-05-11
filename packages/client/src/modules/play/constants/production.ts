import { MaterialsType, ProductionTypes } from "../../../utils/types";

export { productionConstants, productionActionNames };

const productionConstants = {
  BIOMASS: {
    name: "biomass",
    electricMixCarbonProduction: 13,
    type: "biomass",
    steelPerUnit: 0,
    cementPerUnit: 0,
    glassPerUnit: 0,
  },
  GEOTHERMAL: {
    name: "geothermal",
    electricMixCarbonProduction: 38,
    type: "geology",
    steelPerUnit: 0,
    cementPerUnit: 0,
    glassPerUnit: 0,
  },
  HYDRAULIC: {
    name: "hydraulic",
    electricMixCarbonProduction: 10,
    type: "water",
    steelPerUnit: 0,
    cementPerUnit: 0,
    glassPerUnit: 0,
  },
  OFF_SHORE_WIND_TURBINE: {
    name: "offshoreWindTurbine",
    electricMixCarbonProduction: 9,
    type: "windOffshore",
    steelPerUnit: 126,
    cementPerUnit: 30,
    glassPerUnit: 7,
  },
  ON_SHORE_WIND_TURBINE: {
    name: "onshoreWindTurbine",
    electricMixCarbonProduction: 13,
    type: "windOnshore",
    steelPerUnit: 131,
    cementPerUnit: 50,
    glassPerUnit: 8,
  },
  PHOTOVOLTAIC_FARM: {
    name: "photovoltaicFarm",
    electricMixCarbonProduction: 32,
    type: "photovoltaic",
    steelPerUnit: 62,
    cementPerUnit: 8,
    glassPerUnit: 46,
  },
  PHOTOVOLTAIC_ROOF: {
    name: "photovoltaicRoof",
    electricMixCarbonProduction: 32,
    type: "photovoltaic",
    steelPerUnit: 62,
    cementPerUnit: 8,
    glassPerUnit: 46,
  },
  THERMAL_SOLAR: {
    name: "thermalSolar",
    electricMixCarbonProduction: 10,
    type: "photovoltaic",
    steelPerUnit: 0,
    cementPerUnit: 0,
    glassPerUnit: 0,
  },
  TIDAL: {
    name: "tidal",
    electricMixCarbonProduction: 9,
    type: "water",
    steelPerUnit: 0,
    cementPerUnit: 0,
    glassPerUnit: 0,
  },
  WAVE: {
    name: "wave",
    electricMixCarbonProduction: 9,
    type: "water",
    steelPerUnit: 0,
    cementPerUnit: 0,
    glassPerUnit: 0,
  },
  NUCLEAR: {
    name: "nuclear",
    electricMixCarbonProduction: 12,
    type: "nuclear",
    steelPerUnit: 61,
    cementPerUnit: 74,
    glassPerUnit: 0,
  },
} as const;

const productionActionNames = Object.values(productionConstants).map(
  (value) => value.name
);

export const materials: { [key: string]: MaterialsType } = {
  STEEL: "steel",
  CEMENT: "cement",
  GLASS: "glass",
};

export const productionTypes: { [key: string]: ProductionTypes } = {
  WIND_OFFSHORE: "windOffshore",
  WIND_ONSHORE: "windOnshore",
  WATER: "water",
  GEOLOGY: "geology",
  BIOMASS: "biomass",
  PHOTOVOLTAIC: "photovoltaic",
  NUCLEAR: "nuclear",
};
