import { mean } from "lodash";
import {
  formatBudget,
  formatCarbonFootprint,
  formatPoints,
} from "../../../../lib/formatter";
import { getDaysToEnergyShiftTargetYear } from "../../../../lib/time";
import { IEnrichedGame, ITeam } from "../../../../utils/types";
import { MAX_TEAMS_POINTS } from "../../constants";
import { synthesisConstants } from "../../playerActions/constants/synthesis";
import { I18nTranslateFunction } from "../../../translations";
import { TeamIdToValues } from "../../context/playContext";
import { Typography } from "@mui/material";
import { Icon } from "../../../common/components/Icon";

function computeBudget(
  isSynthesisStep: boolean = false,
  budget: number,
  budgetSpent: number
) {
  if (isSynthesisStep) {
    const budgetSpentTotalFrance =
      (budgetSpent *
        getDaysToEnergyShiftTargetYear() *
        synthesisConstants.FRANCE_POPULATION) /
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
  teams: ITeam[],
  teamIdToTeamValues: TeamIdToValues
) => {
  const teamValues = Object.values(teamIdToTeamValues);
  return teamValues
    .sort((a, b) => b.points - a.points)
    .slice(0, game.isLarge ? MAX_TEAMS_POINTS : teamValues.length)
    .map((team, index) => ({
      id: team.id,
      icon: getPointIcon(index + 1),
      name: teams.find((t: ITeam) => team.id === t.id)?.name || "",
      value: formatPoints(teamIdToTeamValues[team.id].points),
    }));
};

function getPointIcon(rank: number): JSX.Element {
  const ICON_SIZE = 24;

  if (rank === 1) {
    return <Icon name="rank-1st" width={ICON_SIZE} />;
  } else if (rank === 2) {
    return <Icon name="rank-2nd" width={ICON_SIZE} />;
  } else if (rank === 3) {
    return <Icon name="rank-3rd" width={ICON_SIZE} />;
  }

  return (
    <Typography
      sx={{ width: ICON_SIZE, display: "flex", justifyContent: "center" }}
    >
      {rank}
    </Typography>
  );
}

export const buildValuesBudget = (
  game: IEnrichedGame,
  teams: ITeam[],
  teamIdToTeamValues: TeamIdToValues,
  t: I18nTranslateFunction
) => {
  if (game.isLarge) {
    const budgets = teams.map((team) => teamIdToTeamValues[team.id].budget);
    const budgetsSpent = teams.map(
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
  return teams.map((team) => ({
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
  teams: ITeam[],
  teamIdToTeamValues: TeamIdToValues,
  t: I18nTranslateFunction
) => {
  if (game.isLarge) {
    const footprints = teams.map(
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
  return teams.map((team) => ({
    id: team.id,
    name: team.name,
    value: computeCarbonFootprint(
      game.isSynthesisStep,
      teamIdToTeamValues[team.id].carbonFootprint || 0
    ),
  }));
};
