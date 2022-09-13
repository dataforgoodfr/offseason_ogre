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
  helpCardLink: string;
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
    helpCardLink:
      "https://drive.google.com/file/d/1uO9Y2oPLsDzs1Mjv1G1bSb8jSTTAynqL/view?usp=sharing",
  },
  {
    name: productionNames.onshoreWindTurbine,
    label: "Eolien terrestre",
    type: "terrestrial",
    order: 1,
    stepId: "production-1",
    helpCardLink:
      "https://drive.google.com/file/d/1gx_7fGbfk3dp1oF1DUg8bNwAv-_JG2NZ/view?usp=sharing",
  },
  {
    name: productionNames.photovoltaicFarm,
    label: "Ferme photovoltaïque",
    type: "terrestrial",
    order: 5,
    stepId: "production-1",
    helpCardLink:
      "https://drive.google.com/file/d/1buRId_oFMdx1NxutSUJB-6ih-JMG8niV/view?usp=sharing",
  },
  {
    name: productionNames.photovoltaicRoof,
    label: "Photovoltaïque sur toiture",
    type: "terrestrial",
    order: 4,
    stepId: "production-1",
    helpCardLink:
      "https://drive.google.com/file/d/1fuvP46JtmQmKLeY43Iv-W0szE1Rmrajh/view?usp=sharing",
  },
  {
    name: productionNames.thermalSolar,
    label: "Solaire Thermique",
    type: "terrestrial",
    order: 3,
    stepId: "production-1",
    helpCardLink:
      "https://drive.google.com/file/d/1Oj7bdAcLpdh97DDnepbtjPmWMWpG39Xn/view?usp=sharing",
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
