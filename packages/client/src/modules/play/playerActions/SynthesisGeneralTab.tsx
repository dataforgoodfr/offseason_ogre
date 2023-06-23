import { PlayBox } from "../Components";
import { SynthesisRecap } from "../Components/Synthesis";
import { useCurrentPlayer } from "../context/hooks/player";

export { SynthesisGeneralTab };

function SynthesisGeneralTab() {
  const { team } = useCurrentPlayer();

  return (
    <PlayBox display="flex" flexDirection="column" gap={4}>
      <SynthesisRecap team={team} />
    </PlayBox>
  );
}
