import {
  MaterialsType,
  MetalsType,
  ProductionTypes,
} from "../../../utils/types";

export { productionConstants, productionActionNames };

const productionConstants = {
  BIOMASS: {
    name: "biomass",
    electricMixCarbonProduction: 13,
    type: "biomass",
    materials: {
      steel: 0,
      cement: 0,
      glass: 0,
    },
    metals: {
      copper: 0,
      nickel: 0,
      manganese: 0,
      silicium: 0,
      other: 0,
    },
  },
  GEOTHERMAL: {
    name: "geothermal",
    electricMixCarbonProduction: 38,
    type: "geology",
    materials: {
      steel: 0,
      cement: 0,
      glass: 0,
    },
    metals: {
      copper: 0,
      nickel: 0,
      manganese: 0,
      silicium: 0,
      other: 0,
    },
  },
  HYDRAULIC: {
    name: "hydraulic",
    electricMixCarbonProduction: 10,
    type: "water",
    materials: {
      steel: 0,
      cement: 0,
      glass: 0,
    },
    metals: {
      copper: 0,
      nickel: 0,
      manganese: 0,
      silicium: 0,
      other: 0,
    },
  },
  OFF_SHORE_WIND_TURBINE: {
    name: "offshoreWindTurbine",
    electricMixCarbonProduction: 9,
    type: "windOffshore",
    materials: {
      steel: 126,
      cement: 30,
      glass: 7,
    },
    metals: {
      copper: 8,
      nickel: 0.3,
      manganese: 0.8,
      silicium: 0,
      other: 6.1,
    },
  },
  ON_SHORE_WIND_TURBINE: {
    name: "onshoreWindTurbine",
    electricMixCarbonProduction: 13,
    type: "windOnshore",
    materials: {
      steel: 131,
      cement: 50,
      glass: 8,
    },
    metals: {
      copper: 3.3,
      nickel: 0.5,
      manganese: 0.8,
      silicium: 0,
      other: 6.1,
    },
  },
  PHOTOVOLTAIC_FARM: {
    name: "photovoltaicFarm",
    electricMixCarbonProduction: 32,
    type: "photovoltaic",
    materials: {
      steel: 62,
      cement: 8,
      glass: 46,
    },
    metals: {
      copper: 2.9,
      nickel: 0,
      manganese: 0,
      silicium: 3.8,
      other: 0,
    },
  },
  PHOTOVOLTAIC_ROOF: {
    name: "photovoltaicRoof",
    electricMixCarbonProduction: 32,
    type: "photovoltaic",
    materials: {
      steel: 62,
      cement: 8,
      glass: 46,
    },
    metals: {
      copper: 2.9,
      nickel: 0,
      manganese: 0,
      silicium: 3.8,
      other: 0,
    },
  },
  THERMAL_SOLAR: {
    name: "thermalSolar",
    electricMixCarbonProduction: 10,
    type: "photovoltaic",
    materials: {
      steel: 0,
      cement: 0,
      glass: 0,
    },
    metals: {
      copper: 0,
      nickel: 0,
      manganese: 0,
      silicium: 0,
      other: 0,
    },
  },
  TIDAL: {
    name: "tidal",
    electricMixCarbonProduction: 9,
    type: "water",
    materials: {
      steel: 0,
      cement: 0,
      glass: 0,
    },
    metals: {
      copper: 0,
      nickel: 0,
      manganese: 0,
      silicium: 0,
      other: 0,
    },
  },
  WAVE: {
    name: "wave",
    electricMixCarbonProduction: 9,
    type: "water",
    materials: {
      steel: 0,
      cement: 0,
      glass: 0,
    },
    metals: {
      copper: 0,
      nickel: 0,
      manganese: 0,
      silicium: 0,
      other: 0,
    },
  },
  NUCLEAR: {
    name: "nuclear",
    electricMixCarbonProduction: 12,
    type: "nuclear",
    materials: {
      steel: 61,
      cement: 74,
      glass: 0,
    },
    metals: {
      copper: 1.5,
      nickel: 1.5,
      manganese: 0.2,
      silicium: 0,
      other: 2.3,
    },
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

export const metals: { [key: string]: MetalsType } = {
  COPPER: "copper",
  NICKEL: "nickel",
  MANGANESE: "manganese",
  SILICIUM: "silicium",
  OTHER: "other",
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
