import range from "lodash/range";
import sum from "lodash/sum";
import {
  IGameWithTeams,
  PlayerActions,
  TeamAction,
} from "../../../utils/types";
import { ConsumptionDatum } from "../../persona/consumption";
import { persona, Persona } from "../../persona/persona";
import { MAX_NUMBER_STEPS } from "../constants";
import { computeConsumptionChoices } from "./consumptionStep";
import { computePlayerActionsStats } from "./playerActions";
import { computeNewProductionData, computeTeamActionStats } from "./production";

export { buildPersona };

function buildPersona(
  game: IGameWithTeams,
  playerActions: PlayerActions[],
  teamActions: TeamAction[]
) {
  const personaBySteps = getResultsByStep(playerActions, teamActions);

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
  playerActions: PlayerActions[],
  teamActions: TeamAction[]
): Record<number, Persona> {
  return Object.fromEntries(
    range(0, MAX_NUMBER_STEPS).map((step) => [
      step,
      computeResultsByStep(step, playerActions, teamActions),
    ])
  );
}

function computeResultsByStep(
  step: number,
  playerActions: PlayerActions[] = [],
  teamActions: TeamAction[] = []
): Persona {
  if (step === 0) {
    return persona;
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

  // TODO: Deep freeze `persona.consumption`.
  const newConsumption = JSON.parse(JSON.stringify(persona.consumption)).map(
    (consumption: ConsumptionDatum) => {
      return computeConsumptionChoices(consumption, performedActionsNames);
    }
  );

  const newProduction = computeNewProductionData(performedTeamActions, persona);

  const { actionPointsUsedAtCurrentStep } = computePlayerActionsStats(
    step,
    playerActions
  );

  return {
    budget: persona.budget - costPerDay,
    carbonFootprint: persona.carbonFootprint,
    points: actionPointsUsedAtCurrentStep,
    consumption: newConsumption,
    production: newProduction,
  };
}
