export { STEPS, getStepIndexById };
export type { GameStep, GameStepId, GameStepType };

type GameStepType = "consumption" | "production";

type GameStep = {
  id: GameStepId;
  title: string;
  label: string;
  type: GameStepType;
  availableActionPoints?: number;
};

type GameStepId =
  | "consumption-1"
  | "consumption-2"
  | "initial-situation"
  | "final-situation"
  | "production-1"
  | "production-2"
  | "production-3";

const STEPS: readonly GameStep[] = [
  {
    id: "initial-situation",
    title: "Situation initiale",
    label: "Actions",
    availableActionPoints: 0,
    type: "consumption",
  },
  {
    id: "consumption-1",
    title: "Choix de consommation 1",
    label: "Choix conso 1",
    availableActionPoints: 12,
    type: "consumption",
  },
  {
    id: "production-1",
    title: "Choix de production 1",
    label: "Choix prod 1",
    type: "production",
  },
  {
    id: "consumption-2",
    title: "Choix de consommation 2",
    label: "Choix conso 2",
    availableActionPoints: 12,
    type: "consumption",
  },
  {
    id: "production-2",
    title: "Choix de production 2",
    label: "Choix prod 2",
    type: "production",
  },
  {
    id: "production-3",
    title: "Choix de production 3",
    label: "Choix prod 3",
    type: "production",
  },
  {
    id: "final-situation",
    title: "Situation finale",
    label: "Synthèse",
    availableActionPoints: 0,
    type: "consumption",
  },
] as const;

function getStepIndexById(id: GameStepId): number {
  return STEPS.findIndex((step) => step.id === id);
}
