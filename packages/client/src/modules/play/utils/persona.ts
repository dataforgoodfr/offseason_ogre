import range from "lodash/range";
import sum from "lodash/sum";
import {
  IGameWithTeams,
  PlayerActions,
  TeamAction,
} from "../../../utils/types";
import { Persona } from "../../persona/persona";
import { MAX_NUMBER_STEPS } from "../constants";
import { computeNewConsumptionData } from "./consumption";
import { computePlayerActionsStats } from "./playerActions";
import { computeNewProductionData, computeTeamActionStats } from "./production";

export { buildPersona };

function buildPersona(
  game: IGameWithTeams,
  basePersona: Persona,
  playerActions: PlayerActions[],
  teamActions: TeamAction[]
) {
  const personaBySteps = getResultsByStep(
    basePersona,
    playerActions,
    teamActions
  );

  const getPersonaAtStep = (step: number) => {
    let stepUsed = step;
    if (stepUsed >= game.step) {
      stepUsed = game.step;
    }
    if (stepUsed === game.step && game.isStepActive) {
      stepUsed -= 1;
    }
    stepUsed = Math.max(stepUsed, 0);

    return personaBySteps[stepUsed];
  };

  const currentPersona = getPersonaAtStep(game.step);
  const latestPersona = personaBySteps[game.step];

  return {
    personaBySteps,
    /** Persona taking into account player's actions at latest validated step. */
    currentPersona,
    /** Persona taking into account latest player's actions, whether the step is active or not. */
    latestPersona,
    /** Persona taking into account player's actions at specified step. */
    getPersonaAtStep,
  };
}

function getResultsByStep(
  basePersona: Persona,
  playerActions: PlayerActions[],
  teamActions: TeamAction[]
): Record<number, Persona> {
  return Object.fromEntries(
    range(0, MAX_NUMBER_STEPS + 1).map((step) => [
      step,
      computeResultsByStep(basePersona, step, playerActions, teamActions),
    ])
  );
}

function computeResultsByStep(
  basePersona: Persona,
  step: number,
  playerActions: PlayerActions[] = [],
  teamActions: TeamAction[] = []
): Persona {
  if (step === 0) {
    return basePersona;
  }

  const performedPlayerActions = playerActions.filter(
    (playerAction: PlayerActions) =>
      playerAction.action.step <= step && playerAction.isPerformed === true
  );
  const performedTeamActions = teamActions.filter(
    (teamAction: TeamAction) => teamAction.action.step <= step
  );

  const playerActionsCost = sum(
    performedPlayerActions.map(
      (playerAction: PlayerActions) => playerAction.action.financialCost
    )
  );
  const teamActionsCost = sum(
    performedTeamActions.map(
      (teamAction: TeamAction) => computeTeamActionStats(teamAction).cost
    )
  );
  const costPerDay = playerActionsCost + teamActionsCost;

  const performedActionsNames = performedPlayerActions.map(
    (playerAction: PlayerActions) => playerAction.action.name
  );

  const newConsumption = computeNewConsumptionData(
    basePersona,
    performedActionsNames
  );

  const newProduction = computeNewProductionData(
    performedTeamActions,
    basePersona
  );

  const { actionPointsUsedAtCurrentStep } = computePlayerActionsStats(
    step,
    playerActions
  );

  return {
    budget: basePersona.budget - costPerDay,
    carbonFootprint: basePersona.carbonFootprint,
    points: actionPointsUsedAtCurrentStep,
    consumption: newConsumption,
    production: newProduction,
  };
}
