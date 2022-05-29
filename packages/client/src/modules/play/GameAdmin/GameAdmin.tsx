import { Grid } from "@mui/material";
import GameStepper from "../../common/components/Stepper";
import { PlayBox } from "../Components";
import { PlayProvider, usePlay } from "../context/playContext";
import { PlayLayout } from "../PlayLayout";

export { GameAdmin };

function GameAdmin() {
  return (
    <PlayLayout title="Console Animateur">
      <PlayProvider>
        <GameAdminContent />
      </PlayProvider>
    </PlayLayout>
  );
}

function GameAdminContent() {
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
