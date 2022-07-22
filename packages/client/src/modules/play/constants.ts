export const MAX_NUMBER_STEPS = 7;
export const MAX_ACTION_POINTS = 10;

export type GameStepType = "consumption" | "production";

export type GameStep = {
  id: string;
  label: string;
  type: GameStepType;
  availableActionPoints?: number;
};

export const STEPS: GameStep[] = [
  {
    id: "initial",
    label: "Choix conso 1",
    availableActionPoints: 0,
    type: "consumption",
  },
  {
    id: "consumption-1",
    label: "Choix conso 1",
    availableActionPoints: 12,
    type: "consumption",
  },
  {
    id: "production-1",
    label: "Choix prod 1",
    type: "production",
  },
  {
    id: "consumption-2",
    label: "Choix conso 2",
    availableActionPoints: 12,
    type: "consumption",
  },
  {
    id: "production-2",
    label: "Choix prod 2",
    type: "production",
  },
  {
    id: "consumption-3",
    label: "Choix conso 3",
    availableActionPoints: 12,
    type: "consumption",
  },
  {
    id: "production-3",
    label: "Choix prod 3",
    type: "production",
  },
  {
    id: "production-4",
    label: "Choix prod 4",
    type: "production",
  },
];
