export const MAX_NUMBER_STEPS = 7;
export const MAX_ACTION_POINTS = 10;

export type GameStep = {
  id: string;
  label: string;
};
export const STEPS: GameStep[] = [
  { id: "consumption-1", label: "Choix conso 1" },
  { id: "production-1", label: "Choix prod 1" },
  { id: "consumption-2", label: "Choix conso 2" },
  { id: "production-2", label: "Choix prod 2" },
  { id: "consumption-3", label: "Choix conso 3" },
  { id: "production-3", label: "Choix prod 3" },
  { id: "production-4", label: "Choix prod 4" },
];
