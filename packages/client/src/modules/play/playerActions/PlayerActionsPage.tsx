import { Box, Grid, useTheme } from "@mui/material";
import { ValidateActions } from "./Validation";
import { PlayerHeader } from "../PlayerPersona/PlayerHeader";
import { PlayerHeaderGrid } from "./PlayerHeaderGrid";
import {
  useCurrentStep,
  useMyTeam,
  useTeamValues,
} from "../context/playContext";
import { PlayBox } from "../Components";
import { TeamActionsHeader } from "./TeamActionsHeader";
import { TeamActionsContent } from "./TeamActionsContent";
import { SynthesisScenarioName } from "./SynthesisContent";
import { PlayerActionsContent } from "./PlayerActionsContent";
import { PlayerActionsHeader } from "./PlayerActionsHeader";
import { synthesisConstants } from "./constants/synthesis";
import { SynthesisBudget, SynthesisCarbon } from "../Components/Synthesis";

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
  const team = useMyTeam();
  const teamValues = useTeamValues();

  const teamBudget = teamValues.find((t) => t.id === team?.id)?.budget || 0;
  const carbonFootprintPersonal =
    (teamValues.find((t) => t.id === team?.id)?.carbonFootprint || 0) *
    synthesisConstants.DAYS_IN_YEAR *
    synthesisConstants.KG_TO_TON;

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
            <SynthesisBudget budget={teamBudget} />
            <SynthesisCarbon carbonFootprint={carbonFootprintPersonal} />
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
