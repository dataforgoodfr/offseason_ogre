import { PlayerPageLayout } from "../PlayLayout";

import { Persona } from "./Persona";
import { PlayerHeaderGrid } from "./PlayerHeaderGrid";

export { PlayerPersona, PlayerHeaderGrid };

function PlayerPersona() {
  return <PlayerPageLayout header={<PlayerHeaderGrid />} body={<Persona />} />;
}
