import { Box } from "@mui/material";
import { ITeam } from "../../../../../utils/types";
import SynthesisCarbon from "../SynthesisCarbon";
import SynthesisBudget from "../SynthesisBudget";
import SynthesisProduction from "../SynthesisProduction";

export default SynthesisRecapForTeacher;

function SynthesisRecapForTeacher({ team }: { team: ITeam }) {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <SynthesisProduction team={team} />
      <SynthesisBudget team={team} />
      <SynthesisCarbon team={team} />
    </Box>
  );
}
