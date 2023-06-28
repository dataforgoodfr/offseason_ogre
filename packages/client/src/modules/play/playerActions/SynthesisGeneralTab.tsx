import { useMyTeam } from "../context/playContext";
import { PlayBox } from "../Components";
import { SynthesisBudget, SynthesisCarbon } from "../Components/Synthesis";

export { SynthesisGeneralTab };

function SynthesisGeneralTab() {
  const team = useMyTeam();

  return (
    <PlayBox display="flex" flexDirection="column" gap={4}>
      <SynthesisBudget team={team} />
      <SynthesisCarbon team={team} />
    </PlayBox>
  );
}
