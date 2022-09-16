import { IGame, ProductionActionType } from "../../../utils/types";

export {
  MAX_NUMBER_STEPS,
  MAX_ACTION_POINTS,
  STEPS,
  getCurrentStep,
  getStepId,
  isStepOfType,
};
export type { GameStepType, GameStepId, GameStep };

const MAX_NUMBER_STEPS = 7;
const MAX_ACTION_POINTS = 10;

type GameStepType = "consumption" | "production";

type GameStepId =
  | "consumption-1"
  | "consumption-2"
  | "consumption-3"
  | "initial-situation"
  | "production-1"
  | "production-2"
  | "production-3"
  | "production-4";

type GameStep = {
  id: GameStepId;
  title: string;
  label: string;
  type: GameStepType;
  availableActionPoints?: number;
  budgetAdvised?: number;
  energyType?: ProductionActionType;
};

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
    title: "Choix de production 1 - Production terrestre",
    label: "Choix prod 1",
    type: "production",
    energyType: "terrestrial",
    budgetAdvised: 4,
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
    title: "Choix de production 2 - Production aquatique",
    label: "Choix prod 2",
    type: "production",
    energyType: "offshore",
    budgetAdvised: 4,
  },
  {
    id: "consumption-3",
    title: "Choix de consommation 3",
    label: "Choix conso 3",
    availableActionPoints: 12,
    type: "consumption",
  },
  {
    id: "production-3",
    title: "Choix de production 3",
    label: "Choix prod 3",
    type: "production",
    // TODO: adapt energy type.
    energyType: "terrestrial",
    // TODO: adapt advised budget.
    budgetAdvised: 4,
  },
  {
    id: "production-4",
    title: "Choix de production 4",
    label: "Choix prod 4",
    type: "production",
    // TODO: adapt energy type.
    energyType: "terrestrial",
    // TODO: adapt advised budget.
    budgetAdvised: 4,
  },
] as const;

function getCurrentStep(game: IGame) {
  return Math.max(game.isStepActive ? game.step - 1 : game.step, 0);
}

function getStepId(step: number): GameStepId | undefined {
  return STEPS[step]?.id;
}

function isStepOfType(step: number, type: GameStepType) {
  // Initial step is both considered a step of "consumption" and "production".
  // TODO: consider last step as both a step of "consumption" and "production".
  return step === 0 || STEPS[step]?.type === type;
}
