import { productionActionNames } from "../constants";

export type {
  ProductionAction,
  ProductionActionNames,
  ProductionActionType,
  ProductionActionUnit,
};

type ProductionAction = ProductionActionArea | ProductionActionPercentage;

interface ProductionActionCommon {
  id: number;
  // TODO: type name when all production actions are listed.
  name: string;
  type: ProductionActionType;
  order: number;
  step: number;
  helpCardLink: string;
  min: number;
  max: number;
  credibilityThreshold: number;
  // TODO: see with Gregory for renaming (should be `productionPerKwh` instead)?
  powerNeededKWh: number;
  lcoe: number;
  currentYearPowerNeedGw: number;
  defaultTeamValue: number;
  isPlayable: boolean;
}

interface ProductionActionArea extends ProductionActionCommon {
  unit: "area";
  areaEnergy: number;
  totalEnergy: null;
}

interface ProductionActionPercentage extends ProductionActionCommon {
  unit: "percentage";
  areaEnergy: null;
  totalEnergy: number;
}

type ProductionActionNames =
  typeof productionActionNames[keyof typeof productionActionNames];
type ProductionActionType = "offshore" | "nuclear" | "terrestrial";
type ProductionActionUnit = "area" | "percentage";
