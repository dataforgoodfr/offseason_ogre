import { mean } from "lodash";
import {
  formatBudget,
  formatCarbonFootprint,
  formatPoints,
} from "../../../../lib/formatter";
import { getDaysTo2050 } from "../../../../lib/time";
import { IGameWithTeams, ITeam } from "../../../../utils/types";
import { MAX_TEAMS_POINTS } from "../../constants";
import { synthesisConstants } from "../../playerActions/constants/synthesis";
import { isLargeGame, isSynthesisStep } from "../../utils/game";
import { t } from "i18next";

interface TeamIdToValues {
  [k: string]: {
    id: number;
    playerCount: number;
    points: number;
    budget: number;
    budgetSpent: number;
    carbonFootprint: number;
    carbonFootprintReduction: number;
    stepToConsumption: {
      [k: string]: number;
    };
    stepToProduction: {
      [k: string]: number;
    };
  };
}

function computeBudget(
  isSynthesisStep: boolean,
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
  isSynthesisStep: boolean,
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
  game: IGameWithTeams,
  teamIdToTeamValues: TeamIdToValues
) => {
  if (isLargeGame(game)) {
    return Object.values(teamIdToTeamValues)
      .sort((a, b) => b.points - a.points)
      .slice(0, MAX_TEAMS_POINTS)
      .map((team) => ({
        id: team.id,
        name: game.teams.find((t: ITeam) => team.id === t.id)?.name,
        value: formatPoints(teamIdToTeamValues[team.id].points),
      }));
  }
  return game.teams.map((team) => ({
    id: team.id,
    name: team.name,
    value: formatPoints(teamIdToTeamValues[team.id].points),
  }));
};

export const buildValuesBudget = (
  game: IGameWithTeams,
  teamIdToTeamValues: TeamIdToValues
) => {
  const isSynthesis = isSynthesisStep(game);
  if (isLargeGame(game)) {
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
          isSynthesis,
          Math.max(...budgets),
          Math.max(...budgetsSpent)
        ),
      },
      {
        id: 2,
        name: t("graph.common.mean"),
        value: computeBudget(isSynthesis, mean(budgets), mean(budgetsSpent)),
      },
      {
        id: 3,
        name: t("graph.common.min"),
        value: computeBudget(
          isSynthesis,
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
      isSynthesis,
      teamIdToTeamValues[team.id].budget,
      teamIdToTeamValues[team.id].budgetSpent
    ),
  }));
};

export const buildValuesCarbonFootprint = (
  game: IGameWithTeams,
  teamIdToTeamValues: TeamIdToValues
) => {
  const isSynthesis = isSynthesisStep(game);
  if (isLargeGame(game)) {
    const footprints = game.teams.map(
      (team) => teamIdToTeamValues[team.id].carbonFootprint || 0
    );
    return [
      {
        id: 1,
        name: t("graph.common.max"),
        value: computeCarbonFootprint(isSynthesis, Math.max(...footprints)),
      },
      {
        id: 2,
        name: t("graph.common.mean"),
        value: computeCarbonFootprint(isSynthesis, mean(footprints)),
      },
      {
        id: 3,
        name: t("graph.common.min"),
        value: computeCarbonFootprint(isSynthesis, Math.min(...footprints)),
      },
    ];
  }
  return game.teams.map((team) => ({
    id: team.id,
    name: team.name,
    value: computeCarbonFootprint(
      isSynthesis,
      teamIdToTeamValues[team.id].carbonFootprint || 0
    ),
  }));
};
