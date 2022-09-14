import { ProductionAction } from "../../productionActions/types";

export type { TeamActions };

interface TeamActions {
  id: number;
  teamId: number;
  actionId: number;
  action: ProductionAction;
  value: number;
  isTouched: boolean;
}
