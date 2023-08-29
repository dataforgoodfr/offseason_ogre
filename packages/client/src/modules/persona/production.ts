import {
  ProductionActionNames,
  ProductionActionType,
  ProductionCarbonType,
} from "../../utils/types";

export type { ProductionDatum };

interface ProductionDatum {
  name: ProductionActionNames;
  type: ProductionActionType;
  carbonType: ProductionCarbonType;
  // Base production in kWh.
  value: number;
  revealOnStep?: number;
}
