import { Box, Grid, useTheme } from "@mui/material";
import { ValidateActions } from "./Validation";
import { PlayerHeader } from "../PlayerPersona/PlayerHeader";
import { PlayerHeaderGrid } from "./PlayerHeaderGrid";
import { useCurrentStep } from "../context/playContext";
import { PlayBox } from "../Components";
import { TeamActionsHeader } from "./TeamActionsHeader";
import { TeamActionsContent } from "./TeamActionsContent";
import {
  SynthesisScenarioName,
  SynthesisBudget,
  SynthesisCarbon,
} from "./SynthesisContent";
import { PlayerActionsContent } from "./PlayerActionsContent";
import { PlayerActionsHeader } from "./PlayerActionsHeader";

export { PlayerActionsPage, PlayerHeader };

function PlayerActionsPage() {
  const currentStep = useCurrentStep();

  if (!currentStep) {
    return null;
  }

  if (currentStep.id === "final-situation") {
    return <SynthesisLayout />;
  }

  return currentStep.type === "production" ? (
    <TeamActionsLayout />
  ) : (
    <PlayerActionsLayout />
  );
}

function SynthesisLayout() {
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
          <PlayBox display="flex" flexDirection="column" gap={4}>
            <SynthesisScenarioName />
            <SynthesisBudget />
            <SynthesisCarbon />
          </PlayBox>
        </Grid>
      </Grid>
    </Box>
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
          <PlayBox display="flex" flexDirection="column" gap={4}>
            <PlayerActionsHeader />
            <PlayerActionsContent />
          </PlayBox>
        </Grid>
      </Grid>
    </Box>
  );
}

function TeamActionsLayout() {
  const theme = useTheme();

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
          <PlayBox>
            <TeamActionsHeader />
            <TeamActionsContent style={{ marginTop: theme.spacing(4) }} />
          </PlayBox>
        </Grid>
      </Grid>
    </Box>
  );
}
