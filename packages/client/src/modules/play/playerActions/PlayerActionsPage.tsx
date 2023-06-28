import { useTheme } from "@mui/material";
import { ValidateActions } from "./Validation";
import { useCurrentStep } from "../context/playContext";
import { PlayBox } from "../Components";
import { TeamActionsHeader } from "./TeamActionsHeader";
import { TeamActionsContent } from "./TeamActionsContent";
import { PlayerActionsContent } from "./PlayerActionsContent";
import { PlayerActionsHeader } from "./PlayerActionsHeader";
import { PlayerHeaderGrid } from "../PlayerPersona";
import { PlayerPageLayout } from "../PlayLayout";
import { SynthesisPage } from "./SynthesisPage";

export { PlayerActionsPage };

function PlayerActionsPage() {
  const currentStep = useCurrentStep();

  if (!currentStep) {
    return null;
  }

  if (currentStep.id === "final-situation") {
    return <SynthesisPage />;
  }

  return currentStep.type === "production" ? (
    <TeamActionsLayout />
  ) : (
    <PlayerActionsLayout />
  );
}

function PlayerActionsLayout() {
  return (
    <PlayerPageLayout
      header={<PlayerHeaderGrid additionalActions={<ValidateActions />} />}
      body={
        <PlayBox
          display="flex"
          flexDirection="column"
          gap={4}
          header={<PlayerActionsHeader />}
          headerSticky
        >
          <PlayerActionsContent />
        </PlayBox>
      }
    />
  );
}

function TeamActionsLayout() {
  const theme = useTheme();

  return (
    <PlayerPageLayout
      header={<PlayerHeaderGrid />}
      body={
        <PlayBox>
          <TeamActionsHeader />
          <TeamActionsContent style={{ marginTop: theme.spacing(4) }} />
        </PlayBox>
      }
    />
  );
}
