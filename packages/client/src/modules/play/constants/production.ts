export { CURRENT_YEAR_COUNTRY_POWER_NEED_IN_GW, productionNames };

const productionNames = {
  biomass: "biomass",
  onshoreWindTurbine: "onshoreWindTurbine",
  photovoltaicFarm: "photovoltaicFarm",
  photovoltaicRoof: "photovoltaicRoof",
  thermalSolar: "thermalSolar",
} as const;

const CURRENT_YEAR_COUNTRY_POWER_NEED_IN_GW = 79.52;
