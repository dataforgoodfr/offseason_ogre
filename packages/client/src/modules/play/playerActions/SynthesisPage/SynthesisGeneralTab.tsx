import { PlayBox } from "../../Components";
import SynthesisRecapForPlayer from "../../Components/Synthesis/SynthesisRecapForPlayer";
import { useCurrentPlayer } from "../../context/hooks/player";

export { SynthesisGeneralTab };

function SynthesisGeneralTab() {
  const { team } = useCurrentPlayer();

  return (
    <PlayBox display="flex" flexDirection="column" gap={4}>
      <SynthesisRecapForPlayer team={team} />
    </PlayBox>
  );
}
