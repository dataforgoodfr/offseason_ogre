export { productionNames };

const productionNames = {
  BIOMASS: "biomass",
  GEOTHERMAL: "geothermal",
  HYDRAULIC: "hydraulic",
  OFF_SHORE_WIND_TURBINE: "offshoreWindTurbine",
  ON_SHORE_WIND_TURBINE: "onshoreWindTurbine",
  PHOTOVOLTAIC_FARM: "photovoltaicFarm",
  PHOTOVOLTAIC_ROOF: "photovoltaicRoof",
  THERMAL_SOLAR: "thermalSolar",
  TIDAL: "tidal",
  WAVE: "wave",
  NUCLEAR: "nuclear",
} as const;
