import { PlayerHeaderGrid } from "../PlayerPersona";
import { StatsGraphs } from "./StatsGraphs";
import { PlayerPageLayout } from "../PlayLayout";

export { PlayerStatisticsPage };

function PlayerStatisticsPage() {
  return (
    <PlayerPageLayout header={<PlayerHeaderGrid />} body={<StatsGraphs />} />
  );
}
