import { Grid, Typography } from "@mui/material";
import GameStepper from "../../common/components/Stepper";
import { PlayBox } from "../Components";
import { PlayProvider, usePlay } from "../context/playContext";
import { PlayLayout } from "../PlayLayout";

export { GameAdmin };

function GameAdmin() {
  return (
    <PlayLayout title="Console Animateur">
      <PlayProvider>
        <Header />
        <Teams />
      </PlayProvider>
    </PlayLayout>
  );
}

function Header() {
  const { game } = usePlay();
  return (
    <PlayBox>
      <Grid container>
        <Grid item xs={3} />
        <Grid item xs={6}>
          <GameStepper step={game.step} typographyProps={{ variant: "h5" }} />
        </Grid>
        <Grid item xs={3} />
      </Grid>
    </PlayBox>
  );
}

function Teams() {
  const { game } = usePlay();
  return (
    <Grid container justifyContent="space-between" mt={4} xs={12}>
      {game.teams.map((team) => {
        return (
          <Grid item xs={2}>
            <PlayBox>
              <Typography textAlign="center" variant="h5">
                {team.name}
              </Typography>
            </PlayBox>
          </Grid>
        );
      })}
    </Grid>
  );
}
