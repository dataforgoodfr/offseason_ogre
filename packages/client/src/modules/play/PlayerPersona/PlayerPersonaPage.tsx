import { PlayerPageLayout } from "../PlayLayout";

import { Persona } from "./Persona";
import { PlayerHeaderGrid } from "./PlayerHeaderGrid";

export { PlayerPersonaPage, PlayerHeaderGrid };

function PlayerPersonaPage() {
  return <PlayerPageLayout header={<PlayerHeaderGrid />} body={<Persona />} />;
}
