import { Box, Grid } from "@mui/material";
import { Actions } from "./Actions";
import { TeamActions } from "./TeamActions";
import { ValidateActions } from "./Validation";
import { PlayerHeader } from "../PlayerPersona/PlayerHeader";
import { PlayerHeaderGrid } from "./PlayerHeaderGrid";
import { useCurrentStep } from "../context/playContext";

export { PlayerActionsPage, PlayerHeader };

function PlayerActionsPage() {
  const currentStep = useCurrentStep();

  if (!currentStep) {
    return null;
  }

  return currentStep.type === "production" ? (
    <TeamActionsLayout />
  ) : (
    <PlayerActionsLayout />
  );
}

function PlayerActionsLayout() {
  return (
    <Box>
      <Grid container direction="row" rowSpacing={4}>
        <PlayerHeaderGrid additionalActions={<ValidateActions />} />
        <Grid
          item
          xs={12}
          sm={9}
          sx={{
            pl: 1,
            pr: 1,
          }}
        >
          <Actions />
        </Grid>
      </Grid>
    </Box>
  );
}

function TeamActionsLayout() {
  return (
    <Box>
      <Grid container direction="row" rowSpacing={4}>
        <PlayerHeaderGrid />
        <Grid
          item
          xs={12}
          sm={9}
          sx={{
            pl: 1,
            pr: 1,
          }}
        >
          <TeamActions />
        </Grid>
      </Grid>
    </Box>
  );
}
