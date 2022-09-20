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

export { StatsConsole };

function StatsConsole() {
  const { game } = usePlay();
  const teamsValues = useTeamValues();
  const theme = useTheme();

  const teamIdToTeamValues = Object.fromEntries(
    teamsValues.map((teamValues) => [teamValues.id, teamValues])
  );

  return (
    <Box>
      <Grid container justifyContent="space-between">
        <Grid item xs={11} sm={5.75}>
          <ConsumptionStats
            data={teamsValues.map((team, idx) => ({
              teamIdx: idx,
              stepToData: team.stepToConsumption,
              playerCount: team.playerCount,
            }))}
          />
        </Grid>
        <Grid item xs={11} sm={5.75}>
          <ProductionStats
            data={teamsValues.map((team, idx) => ({
              teamIdx: idx,
              stepToData: team.stepToProduction,
              playerCount: team.playerCount,
            }))}
          />
        </Grid>
      </Grid>

      <Grid container justifyContent="center">
        <Grid item sx={{ m: 1 }} xs={4} sm={3}>
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
        <Grid item sx={{ m: 1 }} xs={4} sm={3}>
          <PlayBox
            sx={{ m: 2, py: 1, px: 2 }}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography mb={1} variant="h5">
              <Icon sx={{ mr: 1 }} name="carbon-footprint" /> CO2 (kg/j)
            </Typography>
            {game.teams.map((team) => (
              <Box key={team.id} display="flex" gap={1} alignSelf="stretch">
                <Icon name="team" />
                <Typography>{team.name}</Typography>
                <Spacer />
                <Typography>
                  {formatCarbonFootprint(
                    teamIdToTeamValues[team.id].carbonFootprint || 0
                  )}{" "}
                  kg/j
                </Typography>
              </Box>
            ))}
          </PlayBox>
        </Grid>
        <Grid item sx={{ m: 1 }} xs={4} sm={3}>
          <PlayBox
            sx={{ m: 2, py: 1, px: 2 }}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography mb={1} variant="h5">
              <Icon sx={{ mr: 1 }} name="budget" /> Budget (€/j)
            </Typography>
            {game.teams.map((team) => (
              <Box key={team.id} display="flex" gap={1} alignSelf="stretch">
                <Icon name="team" />
                <Typography>{team.name}</Typography>
                <Spacer />
                <Typography>
                  {formatBudget(teamIdToTeamValues[team.id].budget)} €/j
                </Typography>
              </Box>
            ))}
          </PlayBox>
        </Grid>
      </Grid>
    </Box>
  );
}
