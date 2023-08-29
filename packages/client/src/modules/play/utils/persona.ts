import range from "lodash/range";
import sum from "lodash/sum";
import {
  Action,
  IGame,
  PlayerActions,
  ProductionAction,
  TeamAction,
} from "../../../utils/types";
import { ConsumptionDatum } from "../../persona/consumption";
import {
  computeMaterials,
  computeMetals,
} from "../gameEngines/resourcesEngine";
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
  game: IGame,
  personalization: PersoForm,
  initialPersona: Persona,
  playerActions: PlayerActions[],
  consumptionActionById: Record<number, Action>,
  teamActions: TeamAction[],
  productionActionById: Record<number, ProductionAction>
) {
  const personaBySteps = getResultsByStep(
    personalization,
    initialPersona,
    playerActions,
    consumptionActionById,
    teamActions,
    productionActionById
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
    initialPersona,
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
  consumptionActionById: Record<number, Action>,
  teamActions: TeamAction[],
  productionActionById: Record<number, ProductionAction>
): Record<number, Persona> {
  return Object.fromEntries(
    range(0, MAX_NUMBER_STEPS + 1).map((step) => [
      step,
      computeResultsByStep(
        personalization,
        basePersona,
        step,
        playerActions,
        consumptionActionById,
        teamActions,
        productionActionById
      ),
    ])
  );
}

function computeResultsByStep(
  personalization: PersoForm,
  basePersona: Persona,
  step: number,
  playerActions: PlayerActions[] = [],
  consumptionActionById: Record<number, Action>,
  teamActions: TeamAction[] = [],
  productionActionById: Record<number, ProductionAction>
): Persona {
  if (step === 0) {
    return basePersona;
  }

  const performedPlayerActions = playerActions.filter(
    (playerAction: PlayerActions) =>
      consumptionActionById[playerAction.actionId].step <= step &&
      playerAction.isPerformed === true
  );
  const performedTeamActions = teamActions.filter(
    (teamAction: TeamAction) =>
      productionActionById[teamAction.actionId].step <= step
  );

  const playerActionsCost = sum(
    performedPlayerActions.map(
      (playerAction: PlayerActions) =>
        consumptionActionById[playerAction.actionId].financialCost
    )
  );
  const teamActionsCost = sum(
    performedTeamActions.map(
      (teamAction: TeamAction) =>
        computeTeamActionStats(teamAction, productionActionById).cost
    )
  );
  const costPerDay = playerActionsCost + teamActionsCost;
  const budget = basePersona.budget - costPerDay;

  const teamPoints = sum(
    performedTeamActions.map(
      (teamAction: TeamAction) =>
        computeTeamActionStats(teamAction, productionActionById).points
    )
  );

  const budgetPoints =
    step >= MAX_NUMBER_STEPS - 1 ? computeBudgetPoints(budget) : 0;
  const co2Points =
    step >= MAX_NUMBER_STEPS - 1
      ? computeCO2Points(basePersona.carbonFootprint)
      : 0;
  const points =
    computeConsumptionPoints(
      personalization,
      performedPlayerActions,
      consumptionActionById,
      step
    ) +
    teamPoints +
    budgetPoints +
    co2Points;

  const performedActionsNames = performedPlayerActions.map(
    (playerAction: PlayerActions) =>
      consumptionActionById[playerAction.actionId].name
  );

  const newConsumption = computeNewConsumptionData(
    performedActionsNames,
    personalization
  );

  const newProduction = computeNewProductionData(
    performedTeamActions,
    productionActionById,
    basePersona
  );

  const newProductionDisplayed = newProduction.filter(
    (p) => (p.revealOnStep || 0) <= step
  );

  const newMaterials = computeMaterials(
    newProduction,
    teamActions,
    productionActionById
  );
  const newMaterialsDisplayed = computeMaterials(
    newProductionDisplayed,
    teamActions,
    productionActionById
  );
  const newMetals = computeMetals(
    newProduction,
    teamActions,
    productionActionById
  );
  const newMetalsDisplayed = computeMetals(
    newProductionDisplayed,
    teamActions,
    productionActionById
  );

  const { actionPointsUsedAtCurrentStep } = computePlayerActionsStats(
    step,
    playerActions,
    consumptionActionById
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
    productionDisplayed: newProductionDisplayed,
    materials: newMaterials,
    materialsDisplayed: newMaterialsDisplayed,
    metals: newMetals,
    metalsDisplayed: newMetalsDisplayed,
  };
}
