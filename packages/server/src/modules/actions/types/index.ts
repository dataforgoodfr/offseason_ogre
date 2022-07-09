import { Players } from "../../users/types";

export type { Action, PlayerActions };

interface Action {
  id: number;
  name: string;
  step: number;
  actionPointCost: number;
  financialCost: number;
}

interface PlayerActions {
  player: Players;
  action: Action[];
}
