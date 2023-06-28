import { Box } from "@mui/material";
import { ITeam } from "../../../../../utils/types";
import SynthesisCarbon from "../SynthesisCarbon";
import SynthesisBudget from "../SynthesisBudget";
import SynthesisProduction from "../SynthesisProduction";
import SynthesisConsumption from "../SynthesisConsumption";

export default SynthesisRecapForPlayer;

function SynthesisRecapForPlayer({ team }: { team: ITeam }) {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <SynthesisConsumption />
      <SynthesisProduction team={team} />
      <SynthesisBudget team={team} />
      <SynthesisCarbon team={team} />
    </Box>
  );
}
