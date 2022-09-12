import { sortBy } from "../../../lib/array";
import { GameStepId } from "./steps";

export {
  CURRENT_YEAR_COUNTRY_POWER_NEED_IN_GW,
  energies,
  getEnergy,
  productionNames,
};
export type {
  ProductionEnergy,
  ProductionEnergyNames,
  ProductionEnergyType,
  ProductionEnergyUnit,
};

type ProductionEnergyType = "terrestrial";

type ProductionEnergy = {
  name: ProductionEnergyNames;
  label: string;
  type: ProductionEnergyType;
  order: number;
  stepId: GameStepId;
};

type ProductionEnergyNames =
  typeof productionNames[keyof typeof productionNames];

type ProductionEnergyUnit = "area" | "percentage";

const productionNames = {
  biomass: "biomass",
  onshoreWindTurbine: "onshoreWindTurbine",
  photovoltaicFarm: "photovoltaicFarm",
  photovoltaicRoof: "photovoltaicRoof",
  thermalSolar: "thermalSolar",
} as const;

const CURRENT_YEAR_COUNTRY_POWER_NEED_IN_GW = 79.52;

const energies: ProductionEnergy[] = [
  {
    name: productionNames.biomass,
    label: "Biomasse",
    type: "terrestrial",
    order: 2,
    stepId: "production-1",
  },
  {
    name: productionNames.onshoreWindTurbine,
    label: "Eolien terrestre",
    type: "terrestrial",
    order: 1,
    stepId: "production-1",
  },
  {
    name: productionNames.photovoltaicFarm,
    label: "Ferme photovoltaïque",
    type: "terrestrial",
    order: 5,
    stepId: "production-1",
  },
  {
    name: productionNames.photovoltaicRoof,
    label: "Photovoltaïque sur toiture",
    type: "terrestrial",
    order: 4,
    stepId: "production-1",
  },
  {
    name: productionNames.thermalSolar,
    label: "Solaire Thermique",
    type: "terrestrial",
    order: 3,
    stepId: "production-1",
  },
];

function getEnergy({
  type,
  stepId,
}: {
  type?: ProductionEnergyType;
  stepId?: GameStepId;
} = {}): ProductionEnergy[] {
  let energiesFiltered = energies;

  if (type) {
    energiesFiltered = energiesFiltered.filter(
      (energy) => energy.type === type
    );
  }
  if (stepId) {
    energiesFiltered = energiesFiltered.filter(
      (energy) => energy.stepId === stepId
    );
  }

  return energiesFiltered.sort(sortBy("order", "asc"));
}
