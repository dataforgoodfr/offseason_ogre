import { mean } from "lodash";
import {
  formatBudget,
  formatCarbonFootprint,
  formatPoints,
} from "../../../../lib/formatter";
import { getDaysTo2050 } from "../../../../lib/time";
import { IEnrichedGame, ITeam } from "../../../../utils/types";
import { MAX_TEAMS_POINTS } from "../../constants";
import { synthesisConstants } from "../../playerActions/constants/synthesis";
import { I18nTranslateFunction } from "../../../translations";
import { TeamIdToValues } from "../../context/playContext";

function computeBudget(
  isSynthesisStep: boolean = false,
  budget: number,
  budgetSpent: number
) {
  if (isSynthesisStep) {
    const budgetSpentTotalFrance =
      (budgetSpent * getDaysTo2050() * synthesisConstants.FRANCE_POPULATION) /
      synthesisConstants.MILLIARD;

    return formatBudget(budgetSpentTotalFrance);
  }
  return formatBudget(budget);
}

function computeCarbonFootprint(
  isSynthesisStep: boolean = false,
  carbonFootprint: number
) {
  if (isSynthesisStep) {
    return formatCarbonFootprint(
      carbonFootprint *
        synthesisConstants.DAYS_IN_YEAR *
        synthesisConstants.KG_TO_TON
    );
  }
  return formatCarbonFootprint(carbonFootprint);
}

export const buildValuesPoints = (
  game: IEnrichedGame,
  teamIdToTeamValues: TeamIdToValues
) => {
  const teamValues = Object.values(teamIdToTeamValues);
  return teamValues
    .sort((a, b) => b.points - a.points)
    .slice(0, game.isLarge ? MAX_TEAMS_POINTS : teamValues.length)
    .map((team) => ({
      id: team.id,
      name: game.teams.find((t: ITeam) => team.id === t.id)?.name,
      value: formatPoints(teamIdToTeamValues[team.id].points),
    }));
};

export const buildValuesBudget = (
  game: IEnrichedGame,
  teamIdToTeamValues: TeamIdToValues,
  t: I18nTranslateFunction
) => {
  if (game.isLarge) {
    const budgets = game.teams.map(
      (team) => teamIdToTeamValues[team.id].budget
    );
    const budgetsSpent = game.teams.map(
      (team) => teamIdToTeamValues[team.id].budgetSpent
    );
    return [
      {
        id: 1,
        name: t("graph.common.max"),
        value: computeBudget(
          game.isSynthesisStep,
          Math.max(...budgets),
          Math.max(...budgetsSpent)
        ),
      },
      {
        id: 2,
        name: t("graph.common.mean"),
        value: computeBudget(
          game.isSynthesisStep,
          mean(budgets),
          mean(budgetsSpent)
        ),
      },
      {
        id: 3,
        name: t("graph.common.min"),
        value: computeBudget(
          game.isSynthesisStep,
          Math.min(...budgets),
          Math.min(...budgetsSpent)
        ),
      },
    ];
  }
  return game.teams.map((team) => ({
    id: team.id,
    name: team.name,
    value: computeBudget(
      game.isSynthesisStep,
      teamIdToTeamValues[team.id].budget,
      teamIdToTeamValues[team.id].budgetSpent
    ),
  }));
};

export const buildValuesCarbonFootprint = (
  game: IEnrichedGame,
  teamIdToTeamValues: TeamIdToValues,
  t: I18nTranslateFunction
) => {
  if (game.isLarge) {
    const footprints = game.teams.map(
      (team) => teamIdToTeamValues[team.id].carbonFootprint || 0
    );
    return [
      {
        id: 1,
        name: t("graph.common.max"),
        value: computeCarbonFootprint(
          game.isSynthesisStep,
          Math.max(...footprints)
        ),
      },
      {
        id: 2,
        name: t("graph.common.mean"),
        value: computeCarbonFootprint(game.isSynthesisStep, mean(footprints)),
      },
      {
        id: 3,
        name: t("graph.common.min"),
        value: computeCarbonFootprint(
          game.isSynthesisStep,
          Math.min(...footprints)
        ),
      },
    ];
  }
  return game.teams.map((team) => ({
    id: team.id,
    name: team.name,
    value: computeCarbonFootprint(
      game.isSynthesisStep,
      teamIdToTeamValues[team.id].carbonFootprint || 0
    ),
  }));
};
