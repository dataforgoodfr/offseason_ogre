import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import GameStepper from "../../common/components/Stepper";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import GroupIcon from "@mui/icons-material/Group";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import WaterRoundedIcon from "@mui/icons-material/WaterRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";

import { PlayBox } from "../Components";
import { usePersonaByUserId, usePlay } from "../context/playContext";
import { useState } from "react";
import { ConsumptionStats, ProductionStats } from "./ProdStats";
import { sumAllValues } from "../../persona";
import { getLastCompletedStepPlayerValues } from "../utils/playerValues";
import { IGame, ITeamWithPlayers } from "../../../utils/types";
import { Persona } from "../../persona/persona";
import { roundValue } from "../../common/utils";
import { TeamConsoleLayout } from "./TeamConsoleLayout";

export { GameConsoleView };

function GameConsoleView() {
  return <GameConsoleContent />;
}

function GameConsoleContent() {
  const [selectedScreen, setSelectedScreen] = useState<string>("Teams");
  return (
    <>
      <Header
        selectedScreen={selectedScreen}
        setSelectedScreen={setSelectedScreen}
      />
      {selectedScreen === "Teams" ? <TeamConsoleLayout /> : null}
      {selectedScreen === "Mean Stats" ? <MeanStatsConsole /> : null}
    </>
  );
}

function MeanStatsConsole() {
  const { game } = usePlay();
  const teamsValues = useTeamValues();

  return (
    <Box>
      <Grid container justifyContent="space-between">
        <Grid item xs={11} sm={5.75}>
          <ConsumptionStats
            {...teamsValues.map((t) => {
              return {
                id: t.id,
                consumption: [
                  { step: 0, consumption: t.consumption[0] },
                  { step: 1, consumption: t.consumption[1] },
                ],
                playerCount: t.playerCount,
              };
            })}
          />
        </Grid>
        <Grid item xs={11} sm={5.75}>
          <ProductionStats
            {...teamsValues.map((t) => {
              return { id: t.id, production: t.production[0] };
            })}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent="center">
        <Grid item sx={{ m: 1 }} xs={4} sm={3}>
          <PlayBox sx={{ m: 2, p: 1 }}>
            <Typography sx={{ color: "#F9C74F", textAlign: "center" }}>
              {" "}
              Points <EmojiEventsIcon />{" "}
            </Typography>
            {game.teams.map((team) => {
              return (
                <Typography
                  key={team.id}
                  sx={{ textAlign: "center", fontSize: "0.7em" }}
                >
                  {" "}
                  <GroupsIcon />{" "}
                  {`${team.name}:  ${
                    teamsValues.find((t) => t.id === team.id)?.points
                  }`}
                </Typography>
              );
            })}
          </PlayBox>
        </Grid>
        <Grid item sx={{ m: 1 }} xs={4} sm={3}>
          <PlayBox sx={{ m: 2, p: 1 }}>
            <Typography sx={{ textAlign: "center" }}>
              {" "}
              CO2 (T/an) <WaterRoundedIcon />{" "}
            </Typography>
            {game.teams.map((team) => {
              return (
                <Typography
                  key={team.id}
                  sx={{ textAlign: "center", fontSize: "0.7em" }}
                >
                  {" "}
                  <GroupsIcon />{" "}
                  {`${team.name}:  ${roundValue(
                    teamsValues.find((t) => t.id === team.id)
                      ?.carbonFootprint || 0
                  )}T/an`}
                </Typography>
              );
            })}
          </PlayBox>
        </Grid>
        <Grid item sx={{ m: 1 }} xs={4} sm={3}>
          <PlayBox sx={{ m: 2, p: 1 }}>
            <Typography sx={{ textAlign: "center" }}>
              {" "}
              Budget (€/J) <PaidRoundedIcon />{" "}
            </Typography>
            {game.teams.map((team) => {
              return (
                <Typography
                  key={team.id}
                  sx={{ textAlign: "center", fontSize: "0.7em" }}
                >
                  {" "}
                  <GroupsIcon />{" "}
                  {`${team.name}:  ${
                    teamsValues.find((t) => t.id === team.id)?.budget
                  }€/J`}
                </Typography>
              );
            })}
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
  // TODO: fix stats screen.
  return game.teams.map((team) => {
    return {
      id: team.id,
      playerCount: team.players.length,
      points: team.players
        .map(
          ({ user }) =>
            getLastCompletedStepPlayerValues(game, personaByUserId[user.id])
              .points
        )
        .reduce((a, b) => a + b, 0),
      budget: team.players
        .map(
          ({ user }) =>
            getLastCompletedStepPlayerValues(game, personaByUserId[user.id])
              .budget
        )
        .reduce((a, b) => a + b, 0),
      carbonFootprint: team.players
        .map(
          ({ user }) =>
            getLastCompletedStepPlayerValues(game, personaByUserId[user.id])
              .carbonFootprint
        )
        .reduce((a, b) => a + b, 0),
      consumption: buildConsumption(team, personaByUserId, game),
      production: buildProduction(team, personaByUserId, game),
    };
  });
}

function buildConsumption(
  team: ITeamWithPlayers,
  personaByUserId: Record<number, Record<number, Persona>>,
  game: IGame
) {
  return [
    getConsumptionByStep(0, team, personaByUserId, game),
    getConsumptionByStep(1, team, personaByUserId, game),
  ];
}

function getConsumptionByStep(
  step: number,
  team: ITeamWithPlayers,
  personaByUserId: Record<number, Record<number, Persona>>,
  game: IGame
) {
  const lastFinishedStep = getFinishedStep(game, step);

  return team.players
    .map(({ user }) =>
      parseInt(
        sumAllValues(personaByUserId[user.id][lastFinishedStep].consumption)
      )
    )
    .reduce((a, b) => a + b, 0);
}

function buildProduction(
  team: ITeamWithPlayers,
  personaByUserId: Record<number, Record<number, Persona>>,
  game: IGame
) {
  return [getProductionByStep(0, team, personaByUserId, game)];
}

function getProductionByStep(
  step: number,
  team: ITeamWithPlayers,
  personaByUserId: Record<number, Record<number, Persona>>,
  game: IGame
) {
  const lastFinishedStep = getFinishedStep(game, step);

  return team.players
    .map(({ user }) =>
      parseInt(
        sumAllValues(personaByUserId[user.id][lastFinishedStep].production)
      )
    )
    .reduce((a, b) => a + b, 0);
}

function getFinishedStep(game: IGame, step: number) {
  return game.step === 0 ||
    game.step > step ||
    (game.step === step && !game.isStepActive)
    ? step
    : step - 1;
}

function Header(props: any) {
  const { selectedScreen, setSelectedScreen } = props;
  const { game, updateGame } = usePlay();
  const theme = useTheme();

  const nextStepNumber = game.step + 1;
  const currentStepNumber = game.step;

  const startStepLabel = `Lancer l'étape ${nextStepNumber}`;
  const stopStepLabel = `Terminer l'étape ${currentStepNumber}`;

  const startStep = () => {
    updateGame({ step: game.step + 1, isStepActive: true });
  };
  const stopStep = () => {
    updateGame({ isStepActive: false });
  };

  return (
    <PlayBox>
      <Grid container>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color={selectedScreen === "Mean Stats" ? "secondary" : "primary"}
            sx={{ border: `1px solid ${theme.palette.secondary.main}` }}
            onClick={() => setSelectedScreen("Mean Stats")}
          >
            <BarChartRoundedIcon sx={{ mr: 1 }} /> Statistiques
          </Button>
          <Button
            sx={{ mt: 1, border: `1px solid ${theme.palette.secondary.main}` }}
            variant="contained"
            color={selectedScreen === "Teams" ? "secondary" : "primary"}
            onClick={() => setSelectedScreen("Teams")}
          >
            <GroupIcon sx={{ mr: 1 }} /> Equipes
          </Button>
        </Grid>
        <Grid item xs={6}>
          <GameStepper step={game.step} typographyProps={{ variant: "h5" }} />
        </Grid>
        <Grid item sx={{ margin: "auto" }} xs={3}>
          <Button
            variant="contained"
            color={"secondary"}
            sx={{ border: `1px solid ${theme.palette.secondary.main}` }}
            onClick={game.isStepActive ? stopStep : startStep}
          >
            {game.isStepActive ? stopStepLabel : startStepLabel}
            <ArrowForwardIcon />
          </Button>
        </Grid>
      </Grid>
    </PlayBox>
  );
}
