import { sortBy } from "../../../lib/array";
import { GameStepId } from "./steps";

export { energies, getEnergy, productionNames };
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
  return energies
    .filter((energy) => (!!type ? energy.type === type : true))
    .filter((energy) => (!!stepId ? energy.stepId === stepId : true))
    .sort(sortBy("order", "asc"));
}
