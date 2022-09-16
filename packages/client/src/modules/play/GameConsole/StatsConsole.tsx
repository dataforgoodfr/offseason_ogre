import { Box, Grid, useTheme } from "@mui/material";
import range from "lodash/range";
import sum from "lodash/sum";
import { PlayBox } from "../Components";
import { usePersonaByUserId, usePlay } from "../context/playContext";
import { ConsumptionStats, ProductionStats } from "./ProdStats";
import { sumAllValues } from "../../persona";
import { IGame, ITeamWithPlayers } from "../../../utils/types";
import { Typography } from "../../common/components/Typography";
import { Icon } from "../../common/components/Icon";
import {
  formatBudget,
  formatCarbonFootprint,
  formatPoints,
} from "../../../lib/formatter";
import { Spacer } from "../../common/components/Spacer";
import { GameStepType, getCurrentStep, isStepOfType } from "../constants";
import { mean } from "../../../lib/math";

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
              <Icon sx={{ mr: 1 }} name="carbon-footprint" /> CO2 (T/an)
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
                  T/an
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
              <Icon sx={{ mr: 1 }} name="budget" /> Budget (€/J)
            </Typography>
            {game.teams.map((team) => (
              <Box key={team.id} display="flex" gap={1} alignSelf="stretch">
                <Icon name="team" />
                <Typography>{team.name}</Typography>
                <Spacer />
                <Typography>
                  {formatBudget(teamIdToTeamValues[team.id].budget)} €/J
                </Typography>
              </Box>
            ))}
          </PlayBox>
        </Grid>
      </Grid>
    </Box>
  );
}

function useTeamValues() {
  const { game } = usePlay();
  const userIds: number[] = [];
  game.teams.map((team) =>
    team.players.map(({ user }) => userIds.push(user?.id))
  );
  const personaByUserId = usePersonaByUserId(userIds);

  return game.teams.map((team) => ({
    id: team.id,
    playerCount: team.players.length,
    points: mean(
      team.players.map(
        ({ userId }) => personaByUserId[userId].currentPersona.points
      )
    ),
    budget: mean(
      team.players.map(
        ({ userId }) => personaByUserId[userId].currentPersona.budget
      )
    ),
    carbonFootprint: mean(
      team.players.map(
        ({ userId }) => personaByUserId[userId].currentPersona.carbonFootprint
      )
    ),
    stepToConsumption: buildStepToData(
      "consumption",
      game,
      team,
      personaByUserId
    ),
    stepToProduction: buildStepToData(
      "production",
      game,
      team,
      personaByUserId
    ),
  }));
}

function buildStepToData(
  dataType: GameStepType,
  game: IGame,
  team: ITeamWithPlayers,
  personaByUserId: ReturnType<typeof usePersonaByUserId>
) {
  return Object.fromEntries(
    range(0, getCurrentStep(game) + 1)
      .filter((step) => isStepOfType(step, dataType))
      .map((step: number) => [
        step,
        buildStepData(dataType, step, team, personaByUserId),
      ])
  );
}

function buildStepData(
  dataType: GameStepType,
  step: number,
  team: ITeamWithPlayers,
  personaByUserId: ReturnType<typeof usePersonaByUserId>
) {
  const scaleFactor = dataType === "consumption" ? team.players.length || 1 : 1;

  return (
    sum(
      team.players
        .map(
          ({ user }) =>
            personaByUserId[user.id].getPersonaAtStep(step)[dataType]
        )
        .map((data) =>
          parseInt(sumAllValues(data as { type: string; value: number }[]))
        )
    ) / scaleFactor
  );
}