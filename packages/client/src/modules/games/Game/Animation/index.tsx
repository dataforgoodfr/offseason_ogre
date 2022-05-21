import { Box } from "@mui/material";
import { IGame } from "../../../../utils/types";
import Launch from "./Launch";

export { Animation };

function Animation({ game }: { game: IGame }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Launch game={game} />
    </Box>
  );
}
