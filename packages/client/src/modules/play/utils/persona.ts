import range from "lodash/range";
import sum from "lodash/sum";
import {
  IGameWithTeams,
  PlayerActions,
  TeamAction,
} from "../../../utils/types";
import { ConsumptionDatum } from "../../persona/consumption";
import { computeMaterials } from "../gameEngines/materialsEngine";
import { Persona } from "../../persona/persona";
import { MAX_NUMBER_STEPS } from "../constants";
import { computeConsumptionPoints } from "../gameEngines/consumptionPointsEngine";
import { PersoForm } from "../Personalization/models/form";
import {
  computeCarbonFootprint,
  computeCarbonProductionElectricMix,
} from "./carbonFootprint";
import { computeNewConsumptionData } from "./consumption";
import { computePlayerActionsStats } from "./playerActions";
import { computeBudgetPoints, computeCO2Points } from "./points";
import { computeNewProductionData, computeTeamActionStats } from "./production";

export { buildPersona };

function buildPersona(
  game: IGameWithTeams,
  personalization: PersoForm,
  basePersona: Persona,
  playerActions: PlayerActions[],
  teamActions: TeamAction[]
) {
  const personaBySteps = getResultsByStep(
    personalization,
    basePersona,
    playerActions,
    teamActions
  );

  const getPersonaAtStep = (step: number) => {
    const stepUsed =
      step > game.lastFinishedStep ? game.lastFinishedStep : step;
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
  personalization: PersoForm,
  basePersona: Persona,
  playerActions: PlayerActions[],
  teamActions: TeamAction[]
): Record<number, Persona> {
  return Object.fromEntries(
    range(0, MAX_NUMBER_STEPS + 1).map((step) => [
      step,
      computeResultsByStep(
        personalization,
        basePersona,
        step,
        playerActions,
        teamActions
      ),
    ])
  );
}

function computeResultsByStep(
  personalization: PersoForm,
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
  const budget = basePersona.budget - costPerDay;

  const teamPoints = sum(
    performedTeamActions.map(
      (teamAction: TeamAction) => computeTeamActionStats(teamAction).points
    )
  );

  const budgetPoints =
    step >= MAX_NUMBER_STEPS - 1 ? computeBudgetPoints(budget) : 0;
  const co2Points =
    step >= MAX_NUMBER_STEPS - 1
      ? computeCO2Points(basePersona.carbonFootprint)
      : 0;
  const points =
    computeConsumptionPoints(personalization, performedPlayerActions, step) +
    teamPoints +
    budgetPoints +
    co2Points;

  const performedActionsNames = performedPlayerActions.map(
    (playerAction: PlayerActions) => playerAction.action.name
  );

  const newConsumption = computeNewConsumptionData(
    performedActionsNames,
    personalization
  );

  const newProduction = computeNewProductionData(
    performedTeamActions,
    basePersona
  );

  const newMaterials = computeMaterials(newProduction);

  const { actionPointsUsedAtCurrentStep } = computePlayerActionsStats(
    step,
    playerActions
  );

  const carbonProductionElectricMix =
    computeCarbonProductionElectricMix(newProduction);
  const carbonFootprint = computeCarbonFootprint(
    carbonProductionElectricMix,
    newConsumption as ConsumptionDatum[]
  );

  return {
    budget,
    points,
    carbonFootprint,
    actionPoints: actionPointsUsedAtCurrentStep,
    consumption: newConsumption,
    production: newProduction,
    materials: newMaterials,
  };
}
