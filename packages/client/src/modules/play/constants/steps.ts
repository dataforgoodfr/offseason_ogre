import { ProductionActionType } from "../../../utils/types";

export {
  MAX_NUMBER_STEPS,
  MAX_ACTION_POINTS,
  STEPS,
  getStepId,
  getStepIndexById,
  getStepTypes,
  isStepOfType,
};
export type { GameStepType, GameStepId, GameStep };

const MAX_NUMBER_STEPS = 6;
const MAX_ACTION_POINTS = 10;

type GameStepType = "consumption" | "production";

type GameStepId =
  | "consumption-1"
  | "consumption-2"
  | "initial-situation"
  | "production-1"
  | "production-2"
  | "production-3"
  | "final-situation";

type GameStep = {
  id: GameStepId;
  type: GameStepType;
  availableActionPoints?: number;
  budgetAdvised?: number;
  energyType?: ProductionActionType;
};

const STEPS: readonly GameStep[] = [
  {
    id: "initial-situation",
    availableActionPoints: 0,
    type: "consumption",
  },
  {
    id: "consumption-1",
    availableActionPoints: 12,
    type: "consumption",
  },
  {
    id: "production-1",
    type: "production",
    energyType: "terrestrial",
    budgetAdvised: 4,
  },
  {
    id: "consumption-2",
    availableActionPoints: 12,
    type: "consumption",
  },
  {
    id: "production-2",
    type: "production",
    energyType: "offshore",
    budgetAdvised: 2,
  },
  {
    id: "production-3",
    type: "production",
    energyType: "nuclear",
  },
  {
    id: "final-situation",
    availableActionPoints: 0,
    type: "consumption",
  },
] as const;

function getStepId(step: number): GameStepId | undefined {
  return STEPS[step]?.id;
}

function getStepIndexById(id: GameStepId): number {
  return STEPS.findIndex((step) => step.id === id);
}

function isStepOfType(step: number, type: GameStepType) {
  return step === 0 || step === STEPS.length - 1 || STEPS[step]?.type === type;
}

function getStepTypes(step: number): GameStepType[] {
  return (["consumption", "production"] as const).filter((type) =>
    isStepOfType(step, type)
  );
}
