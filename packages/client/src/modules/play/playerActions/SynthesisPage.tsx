import { Box } from "@mui/material";
import { useMyTeam } from "../context/playContext";
import { PlayBox } from "../Components";
import { SynthesisScenarioName } from "./SynthesisContent";
import { SynthesisBudget, SynthesisCarbon } from "../Components/Synthesis";
import { PlayerHeaderGrid } from "../PlayerPersona";
import { PlayerPageLayout } from "../PlayLayout";

export { SynthesisPage };

function SynthesisPage() {
  return <SynthesisLayout />;
}

function SynthesisLayout() {
  const team = useMyTeam();

  return (
    <PlayerPageLayout
      header={<PlayerHeaderGrid />}
      body={
        <Box display="flex" flexDirection="column" gap={2}>
          <PlayBox display="flex" flexDirection="column" gap={4}>
            <SynthesisScenarioName />
          </PlayBox>
          <PlayBox display="flex" flexDirection="column" gap={4}>
            <SynthesisBudget team={team} />
            <SynthesisCarbon team={team} />
          </PlayBox>
        </Box>
      }
    />
  );
}
