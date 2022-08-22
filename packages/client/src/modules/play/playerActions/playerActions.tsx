import { Box, Grid } from "@mui/material";
import { Actions } from "./Actions";
import { ValidateActions } from "./Validation";
import { PlayerHeader } from "../PlayerPersona/PlayerHeader";
import { usePlay } from "../context/playContext";
import { Stage, stages } from "../../stages";

export { PlayerActions, PlayerHeader };

function GetCurrentStageData(): Stage {
  const { game } = usePlay();
  const currentStage = stages.filter((stage) => stage.step === game.step)[0];
  return currentStage ?? stages.filter((stage) => stage.step === 1)[0];
}

function PlayerActions() {
  const currentStage = GetCurrentStageData();
  return (
    <Box>
      <Grid container direction="row">
        <Grid
          container
          item
          direction="column"
          xs={12}
          sm={3}
          sx={{
            pl: 1,
            pr: 1,
            justifyContent: "space-between",
          }}
        >
          <Grid item>
            <PlayerHeader />
          </Grid>
          <Grid
            item
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ValidateActions />
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sm={9}
          sx={{
            pl: 1,
            pr: 1,
          }}
        >
          <Actions currentStage={currentStage} />
        </Grid>
      </Grid>
    </Box>
  );
}
