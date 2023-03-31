import { PlayerHeaderGrid } from "../PlayerPersona";
import { StatsGraphs } from "./StatsGraphs";
import { PlayerPageLayout } from "../PlayLayout";

export { Stats };

function Stats() {
  return (
    <PlayerPageLayout header={<PlayerHeaderGrid />} body={<StatsGraphs />} />
  );
}
