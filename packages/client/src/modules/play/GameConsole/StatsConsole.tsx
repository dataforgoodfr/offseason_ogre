import { Box, Grid, useTheme } from "@mui/material";
import { PlayBox } from "../Components";
import { TeamIdToValues, usePlay, useTeamValues } from "../context/playContext";
import { ConsumptionStats, ProductionStats } from "./ProdStats";
import { Typography } from "../../common/components/Typography";
import { Icon } from "../../common/components/Icon";
import { Spacer } from "../../common/components/Spacer";
import {
  buildValuesBudget,
  buildValuesCarbonFootprint,
  buildValuesPoints,
} from "./utils/statsConsoleValues";
import { useTranslation } from "react-i18next";
import { IEnrichedGame } from "../../../utils/types";

export { StatsConsole };

export interface StatsData {
  teamIdx: number;
  stepToData: { [key: number]: number };
  playerCount: number;
}

function StatsConsole() {
  const { t } = useTranslation();
  const { game } = usePlay();
  const { teamValues } = useTeamValues();
  const theme = useTheme();

  const teamIdToTeamValues = Object.fromEntries(
    teamValues.map((value) => [value.id, value])
  );

  const smallScreenSize = game.isSynthesisStep ? 2.5 : 3;
  const budgetUnit = game.isSynthesisStep
    ? t("unit.budget.year")
    : t("unit.budget.day");
  const carbonFootprintUnit = game.isSynthesisStep
    ? t("unit.carbon.year")
    : t("unit.carbon.day");

  const consumptionData: StatsData[] = teamValues.map((team, idx) => ({
    teamIdx: idx,
    stepToData: team.stepToConsumption,
    playerCount: team.playerCount,
  }));

  const productionData: StatsData[] = teamValues.map((team, idx) => ({
    teamIdx: idx,
    stepToData: team.stepToProduction,
    playerCount: team.playerCount,
  }));

  const getMaxFromData = (data: StatsData[]) => {
    return Math.max(
      ...data.map(({ stepToData }) =>
        Math.max(...Object.values(stepToData), 0)
      ),
      0
    );
  };

  const statsMaxHeight =
    Math.ceil(
      Math.max(
        getMaxFromData(consumptionData),
        getMaxFromData(productionData)
      ) / 100
    ) * 100;

  return (
    <Box>
      <Grid container justifyContent="space-between">
        <Grid item xs={11} sm={5.75}>
          <ConsumptionStats
            statsMaxHeight={statsMaxHeight}
            data={consumptionData}
          />
        </Grid>
        <Grid item xs={11} sm={5.75}>
          <ProductionStats
            statsMaxHeight={statsMaxHeight}
            data={productionData}
          />
        </Grid>
      </Grid>

      <Grid container justifyContent="center">
        <Grid item sx={{ m: 1 }} xs={11} sm={smallScreenSize}>
          <PlayBox
            sx={{ m: 2, py: 1, px: 2 }}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography
              sx={{ color: theme.palette.secondary.main }}
              mb={1}
              variant="h5"
            >
              <Icon sx={{ mr: 1 }} name="trophy" /> Points
            </Typography>
            {displayPoints(game, teamIdToTeamValues)}
          </PlayBox>
        </Grid>
        {game.isSynthesisStep && !game.isLarge && (
          <Grid item sx={{ m: 1 }} xs={11} sm={3.5}>
            <PlayBox
              sx={{ m: 2, py: 1, px: 2 }}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Typography mb={1} variant="h5">
                Nom du scénario
              </Typography>
              {game.teams.map((team) => (
                <Box key={team.id} display="flex" gap={1} alignSelf="stretch">
                  <Icon name="team" />
                  <Typography>{team.name}</Typography>
                  <Typography sx={{ lineBreak: "anywhere" }}>
                    {team.scenarioName}
                  </Typography>
                </Box>
              ))}
            </PlayBox>
          </Grid>
        )}
        <Grid item sx={{ m: 1 }} xs={11} sm={smallScreenSize}>
          <PlayBox
            sx={{ m: 2, py: 1, px: 2 }}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography mb={1} variant="h5">
              <Icon sx={{ mr: 1 }} name="carbon-footprint" /> CO2 (
              {carbonFootprintUnit})
            </Typography>
            {displayCarbonFootprint(game, teamIdToTeamValues)}
          </PlayBox>
        </Grid>
        <Grid item sx={{ m: 1 }} xs={11} sm={smallScreenSize}>
          <PlayBox
            sx={{ m: 2, py: 1, px: 2 }}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography mb={1} variant="h5">
              <Icon sx={{ mr: 1 }} name="budget" /> Budget ({budgetUnit})
            </Typography>
            {displayBudget(game, teamIdToTeamValues)}
          </PlayBox>
        </Grid>
      </Grid>
    </Box>
  );
}

function SummaryCard({ valuesToDisplay }: { valuesToDisplay: any }) {
  return valuesToDisplay.map(
    (values: { id: number; name: string; value: string }) => (
      <Box key={values.id} display="flex" gap={1} alignSelf="stretch">
        <Icon name="team" />
        <Typography>{values.name}</Typography>
        <Spacer />
        <Typography>{values.value}</Typography>
      </Box>
    )
  );
}

function displayPoints(
  game: IEnrichedGame,
  teamIdToTeamValues: TeamIdToValues
) {
  const teamsToDisplay = buildValuesPoints(game, teamIdToTeamValues);
  return <SummaryCard valuesToDisplay={teamsToDisplay} />;
}

function displayCarbonFootprint(
  game: IEnrichedGame,
  teamIdToTeamValues: TeamIdToValues
) {
  const valuesCarbonFootprint = buildValuesCarbonFootprint(
    game,
    teamIdToTeamValues
  );
  return <SummaryCard valuesToDisplay={valuesCarbonFootprint} />;
}

function displayBudget(
  game: IEnrichedGame,
  teamIdToTeamValues: TeamIdToValues
) {
  const valuesBudget = buildValuesBudget(game, teamIdToTeamValues);
  return <SummaryCard valuesToDisplay={valuesBudget} />;
}
