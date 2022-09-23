export { productionConstants, productionActionNames };

const productionConstants = {
  BIOMASS: {
    name: "biomass",
    electricMixCarbonProduction: 13,
  },
  GEOTHERMAL: {
    name: "geothermal",
    electricMixCarbonProduction: 38,
  },
  HYDRAULIC: {
    name: "hydraulic",
    electricMixCarbonProduction: 10,
  },
  OFF_SHORE_WIND_TURBINE: {
    name: "offshoreWindTurbine",
    electricMixCarbonProduction: 9,
  },
  ON_SHORE_WIND_TURBINE: {
    name: "onshoreWindTurbine",
    electricMixCarbonProduction: 13,
  },
  PHOTOVOLTAIC_FARM: {
    name: "photovoltaicFarm",
    electricMixCarbonProduction: 32,
  },
  PHOTOVOLTAIC_ROOF: {
    name: "photovoltaicRoof",
    electricMixCarbonProduction: 32,
  },
  THERMAL_SOLAR: {
    name: "thermalSolar",
    electricMixCarbonProduction: 10,
  },
  TIDAL: {
    name: "tidal",
    electricMixCarbonProduction: 9,
  },
  WAVE: {
    name: "wave",
    electricMixCarbonProduction: 9,
  },
  NUCLEAR: {
    name: "nuclear",
    electricMixCarbonProduction: 12,
  },
} as const;

const productionActionNames = Object.values(productionConstants).map(
  (value) => value.name
);
