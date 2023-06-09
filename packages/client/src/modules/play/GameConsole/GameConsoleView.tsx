import { Box, Button, Grid, useTheme } from "@mui/material";
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
import { Dialog } from "../../common/components/Dialog";
import { useTranslation } from "../../translations/useTranslation";

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
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { game, updateGame } = usePlay();
  const theme = useTheme();
  const { t } = useTranslation();

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
    updateGame({ step: game.step + 1 });
  };
  const stopStep = () => {
    if (game.step === STEPS.length - 1) {
      updateGame({
        lastFinishedStep: game.lastFinishedStep + 1,
        status: "finished",
      });
    } else {
      updateGame({ lastFinishedStep: game.lastFinishedStep + 1 });
    }
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
          {game.status !== "finished" && (
            <>
              <Button
                variant="contained"
                color={"secondary"}
                sx={{ border: `1px solid ${theme.palette.secondary.main}` }}
                onClick={() => setIsDialogOpen(true)}
              >
                {!game.isStepFinished ? stopStepLabel : startStepLabel}
                <ArrowForwardIcon />
              </Button>
              <Dialog
                open={isDialogOpen}
                handleClose={() => setIsDialogOpen(false)}
                content={
                  !game.isStepFinished
                    ? t(`dialog.step.end`, { stepNumber: currentStepNumber })
                    : t(`dialog.step.start`, { stepNumber: nextStepNumber })
                }
                actions={
                  <Box
                    display="flex"
                    flexGrow={1}
                    justifyContent="space-evenly"
                  >
                    <Button
                      color="primary"
                      type="submit"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      {t(`dialog.step.no`)}
                    </Button>
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={() => {
                        !game.isStepFinished ? stopStep() : startStep();
                        setIsDialogOpen(false);
                      }}
                    >
                      {t(`dialog.step.yes`)}
                    </Button>
                  </Box>
                }
              />
            </>
          )}
        </Grid>
      </Grid>
    </PlayBox>
  );
}
