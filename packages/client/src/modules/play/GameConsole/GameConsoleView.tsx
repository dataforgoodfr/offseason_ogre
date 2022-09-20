import { Button, Grid, useTheme } from "@mui/material";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import GroupIcon from "@mui/icons-material/Group";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";

import GameStepper from "../../common/components/Stepper";
import { PlayBox } from "../Components";
import { usePlay } from "../context/playContext";
import { TeamConsoleLayout } from "./TeamConsoleLayout";
import { StatsConsole } from "./StatsConsole";
import { STEPS } from "../constants";

export { GameConsoleView };

function GameConsoleView() {
  const [selectedScreen, setSelectedScreen] = useState<string>("Teams");
  return (
    <>
      <Header
        selectedScreen={selectedScreen}
        setSelectedScreen={setSelectedScreen}
      />
      {selectedScreen === "Teams" ? <TeamConsoleLayout /> : null}
      {selectedScreen === "Mean Stats" ? <StatsConsole /> : null}
    </>
  );
}

function Header(props: any) {
  const { selectedScreen, setSelectedScreen } = props;
  const { game, updateGame } = usePlay();
  const theme = useTheme();

  const nextStepNumber = game.step + 1;
  const currentStepNumber = game.step;

  const startStepLabel =
    nextStepNumber === STEPS.length - 1
      ? "Lancer la synthèse"
      : `Lancer l'étape ${nextStepNumber}`;
  const stopStepLabel =
    currentStepNumber === STEPS.length - 1
      ? "Terminer la partie"
      : `Terminer l'étape ${currentStepNumber}`;

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
