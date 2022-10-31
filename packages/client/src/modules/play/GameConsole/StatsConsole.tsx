import { Box, Grid, useTheme } from "@mui/material";
import { PlayBox } from "../Components";
import { usePlay, useTeamValues } from "../context/playContext";
import { ConsumptionStats, ProductionStats } from "./ProdStats";
import { Typography } from "../../common/components/Typography";
import { Icon } from "../../common/components/Icon";
import {
  formatBudget,
  formatCarbonFootprint,
  formatPoints,
} from "../../../lib/formatter";
import { Spacer } from "../../common/components/Spacer";
import { STEPS } from "../constants";
import { synthesisConstants } from "../playerActions/constants/synthesis";
import { getDaysTo2050 } from "../../../lib/time";

export { StatsConsole };

function StatsConsole() {
  const { game } = usePlay();
  const { teamValues } = useTeamValues();
  const theme = useTheme();

  const teamIdToTeamValues = Object.fromEntries(
    teamValues.map((value) => [value.id, value])
  );

  const isSynthesisStep = game.step === STEPS.length - 1;

  const smallScreenSize = isSynthesisStep ? 2.5 : 3;
  const budgetUnit = isSynthesisStep ? "Mrd€" : "€/j";
  const carbonFootprintUnit = isSynthesisStep ? "T/an" : "kg/j";

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

  return (
    <Box>
      <Grid container justifyContent="space-between">
        <Grid item xs={11} sm={5.75}>
          <ConsumptionStats
            data={teamValues.map((team, idx) => ({
              teamIdx: idx,
              stepToData: team.stepToConsumption,
              playerCount: team.playerCount,
            }))}
          />
        </Grid>
        <Grid item xs={11} sm={5.75}>
          <ProductionStats
            data={teamValues.map((team, idx) => ({
              teamIdx: idx,
              stepToData: team.stepToProduction,
              playerCount: team.playerCount,
            }))}
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
            {game.teams.map((team) => (
              <Box key={team.id} display="flex" gap={1} alignSelf="stretch">
                <Icon name="team" />
                <Typography>{team.name}</Typography>
                <Spacer />
                <Typography>
                  {formatPoints(teamIdToTeamValues[team.id].points)}
                </Typography>
              </Box>
            ))}
          </PlayBox>
        </Grid>
        {isSynthesisStep && (
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
            {game.teams.map((team) => (
              <Box key={team.id} display="flex" gap={1} alignSelf="stretch">
                <Icon name="team" />
                <Typography>{team.name}</Typography>
                <Spacer />
                <Typography>
                  {computeCarbonFootprint(
                    isSynthesisStep,
                    teamIdToTeamValues[team.id].carbonFootprint || 0
                  )}{" "}
                </Typography>
              </Box>
            ))}
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
            {game.teams.map((team) => (
              <Box key={team.id} display="flex" gap={1} alignSelf="stretch">
                <Icon name="team" />
                <Typography>{team.name}</Typography>
                <Spacer />
                <Typography>
                  {computeBudget(
                    isSynthesisStep,
                    teamIdToTeamValues[team.id].budget,
                    teamIdToTeamValues[team.id].budgetSpent
                  )}
                </Typography>
              </Box>
            ))}
          </PlayBox>
        </Grid>
      </Grid>
    </Box>
  );
}
