export { productionConstants, productionActionNames };

const productionConstants = {
  BIOMASS: {
    name: "biomass",
    electricMixCarbonProduction: 13,
    concretePerUnit: 0.76,
    steelPerUnit: 0.31,
    cementPerUnit: 0,
    glassPerUnit: 0,
  },
  GEOTHERMAL: {
    name: "geothermal",
    electricMixCarbonProduction: 38,
    concretePerUnit: 0,
    steelPerUnit: 0,
    cementPerUnit: 0,
    glassPerUnit: 0,
  },
  HYDRAULIC: {
    name: "hydraulic",
    electricMixCarbonProduction: 10,
    concretePerUnit: 0,
    steelPerUnit: 0,
    cementPerUnit: 0,
    glassPerUnit: 0,
  },
  OFF_SHORE_WIND_TURBINE: {
    name: "offshoreWindTurbine",
    electricMixCarbonProduction: 9,
    concretePerUnit: 8,
    steelPerUnit: 1.8,
    cementPerUnit: 0,
    glassPerUnit: 0.092,
  },
  ON_SHORE_WIND_TURBINE: {
    name: "onshoreWindTurbine",
    electricMixCarbonProduction: 13,
    concretePerUnit: 8,
    steelPerUnit: 1.8,
    cementPerUnit: 0,
    glassPerUnit: 0.092,
  },
  PHOTOVOLTAIC_FARM: {
    name: "photovoltaicFarm",
    electricMixCarbonProduction: 32,
    concretePerUnit: 0.35,
    steelPerUnit: 7.9,
    cementPerUnit: 3.7,
    glassPerUnit: 2.7,
  },
  PHOTOVOLTAIC_ROOF: {
    name: "photovoltaicRoof",
    electricMixCarbonProduction: 32,
    concretePerUnit: 0.35,
    steelPerUnit: 7.9,
    cementPerUnit: 3.7,
    glassPerUnit: 2.7,
  },
  THERMAL_SOLAR: {
    name: "thermalSolar",
    electricMixCarbonProduction: 10,
    concretePerUnit: 0,
    steelPerUnit: 0,
    cementPerUnit: 0,
    glassPerUnit: 0,
  },
  TIDAL: {
    name: "tidal",
    electricMixCarbonProduction: 9,
    concretePerUnit: 0,
    steelPerUnit: 0,
    cementPerUnit: 0,
    glassPerUnit: 0,
  },
  WAVE: {
    name: "wave",
    electricMixCarbonProduction: 9,
    concretePerUnit: 0,
    steelPerUnit: 0,
    cementPerUnit: 0,
    glassPerUnit: 0,
  },
  NUCLEAR: {
    name: "nuclear",
    electricMixCarbonProduction: 12,
    concretePerUnit: 0.76,
    steelPerUnit: 0.16,
    cementPerUnit: 0,
    glassPerUnit: 0,
  },
} as const;

const productionActionNames = Object.values(productionConstants).map(
  (value) => value.name
);

export const materials = {
  CONCRETE: "concrete",
  STEEL: "steel",
  CEMENT: "cement",
  GLASS: "glass",
};
