export type { Action, PlayerActions };

interface Action {
  id: number;
  name: string;
  step: number;
  actionPointCost: number;
  financialCost: number;
}

interface PlayerActions {
  id: number;
  userId: number;
  gameId: number;
  actionId: number;
  action: Action;
  isPerformed: boolean;
}
