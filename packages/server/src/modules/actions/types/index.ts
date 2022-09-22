export type { Action, PlayerActions };

interface Action {
  id: number;
  description: string;
  step: number;
  helpCardLink: string;
  name: string;
  actionPointCost: number;
  financialCost: number;
  points: number;
}

interface PlayerActions {
  id: number;
  userId: number;
  gameId: number;
  actionId: number;
  action: Action;
  isPerformed: boolean;
}
