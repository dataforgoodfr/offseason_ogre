import { Box } from "@mui/material";
import { IGame, ITeamWithPlayers } from "../../../../../utils/types";
import Launch from "./Launch";

export { Animation };

type IGameWithTeams = IGame & { teams: ITeamWithPlayers[] };

function Animation({ game }: { game: IGameWithTeams }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Launch game={game} />
    </Box>
  );
}
